<?php

// /src/AppBundle/Controller/RestProfileController.php

namespace OP\UserBundle\Controller\Api;

use Pagerfanta\Pagerfanta,
    OP\UserBundle\Document\User,
    FOS\UserBundle\FOSUserEvents,
    FOS\UserBundle\Event\FormEvent,
    Pagerfanta\Adapter\ArrayAdapter,
    JMS\Serializer\SerializationContext,
    OP\UserBundle\Security\UserProvider,
    Nelmio\ApiDocBundle\Annotation as Doc,
    FOS\RestBundle\Controller\Annotations,
    Symfony\Component\HttpFoundation\Request,
    FOS\UserBundle\Event\GetResponseUserEvent,
    FOS\RestBundle\Controller\Annotations\Get,
    FOS\RestBundle\Controller\Annotations\Post,
    FOS\RestBundle\Controller\Annotations\View,
    FOS\RestBundle\Controller\FOSRestController,
    FOS\RestBundle\Routing\ClassResourceInterface,
    FOS\UserBundle\Event\FilterUserResponseEvent,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\MediaBundle\DocumentManager\PictureManager,
    Symfony\Component\Security\Core\User\UserInterface,
    GetStream\Stream\Clientption\AccessDeniedException,
    FOS\RestBundle\Controller\Annotations\RouteResource,
    OP\PostBundle\DocumentManager\PostManager,
    OP\UserBundle\DataTransformer\ObjectToArrayTransformer,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;

/**
 * @RouteResource("profile", pluralize=false)
 */
class ApiProfileController extends FOSRestController implements ClassResourceInterface
{

    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }
    
    /**
     * @Get("/users/{username}")
     *
     * @param type $username
     * Note: Could be refactored to make     of the User Resolver in Symfony 3.2 onwards
     * more at : http://symfony.com/blog/new-in-symfony-3-2-user-value-resolver-for-controllers
     */
    public function getUserAction(Request $request, $username, PictureManager $imageMan)
    {
        $user       = $this->_getUser(); 
        $serializer = $this->get('jms_serializer');
        $profile    = $this->get('fos_user.user_manager')->findUserByUsername($username);
        if(!is_object($profile)){
            throw $this->createNotFoundException();
        }
        $utcDate    = new \Datetime(null, new \DateTimeZone("UTC"));
        $postsData  = $this->loadInitialPosts($profile, 1, $utcDate);

        $context = new SerializationContext();
        $context->setSerializeNull(true);
        $groups = array('WithMutual', 'Profile');
        $context->setGroups($groups);
        return  new JsonResponse(['news'      => $postsData['posts'],
                                  'newsRefs'  => $postsData['newsRefs'],
                                  'user'      => $serializer->toArray($profile, $context),
                                  'photos'    => $imageMan->loadProfileImages($profile, [], 9) //user, initIds, limit
                                ]);

    }

    /**
    * @Get("/users/me/")
    * 
    * @View(serializerGroups={"Me"})
    */
    public function getMeAction(Request $request, ObjectToArrayTransformer $transformer){
        $session = $request->getSession();
        $this->forwardIfNotAuthenticated();

        $u = $this->_getUser();

        return $u;
            // array(
            //     "id"            => $u->getId(),
            //     "email"         => $u->getEmail(),
            //     "username"      => $u->getUsername(),
            //     "lastname"      => $u->getLastname(),
            //     "firstname"     => $u->getFirstname(),
            //     "last_login"    => $u->getLastLogin(),
            //     "profile_pic"   => $transformer->getProfilePic($u->getProfilePic()->getId())
            // );
    }

    /**
    * Update last user stream activity
    * @Post("/users/set_last_timeline_id/{id}")
    * 
    */
    public function setLastTimelineIdAction(Request $request, $id){
        $u = $this->_getUser();
        $u->setLastTimelineId($id);
        return new JsonResponse(true);
    }

    /**
     * @param Request       $request
     * @param UserInterface $user
     *
     * @ParamConverter("user", class="AppBundle:User")
     *
     * @return View|\Symfony\Component\Form\FormInterface
     */
    public function putAction(Request $request, UserInterface $user)
    {
        $user = $this->getUserAction($user);

        /** @var $dispatcher \Symfony\Component\EventDispatcher\EventDispatcherInterface */
        $dispatcher = $this->get('event_dispatcher');

        $event = new GetResponseUserEvent($user, $request);
        $dispatcher->dispatch(FOSUserEvents::PROFILE_EDIT_INITIALIZE, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }

        /** @var $formFactory \FOS\UserBundle\Form\Factory\FactoryInterface */
        $formFactory = $this->get('fos_user.profile.form.factory');

        $form = $formFactory->createForm(['csrf_protection' => false]);
        $form->setData($user);

        $form->submit($request->request->all());

        if (!$form->isValid()) {
            return $form;
        }

        /** @var $userManager \FOS\UserBundle\Model\UserManagerInterface */
        $userManager = $this->get('fos_user.user_manager');

        $event = new FormEvent($form, $request);
        $dispatcher->dispatch(FOSUserEvents::PROFILE_EDIT_SUCCESS, $event);

        $userManager->updateUser($user);

        // there was no override
        if (null === $response = $event->getResponse()) {
            return $this->routeRedirectView(
                'get_profile',
                ['user' => $user->getId()],
                Response::HTTP_NO_CONTENT
            );
        }

        // unsure if this is now needed / will work the same
        $dispatcher->dispatch(FOSUserEvents::PROFILE_EDIT_COMPLETED, new FilterUserResponseEvent($user, $request, $response));

        return $this->routeRedirectView(
            'get_profile',
            ['user' => $user->getId()],
            Response::HTTP_NO_CONTENT
        );
    }

    /**
     * @Get("/infos/load/{username}")
     *
     * @return Integer
     */
    public function loadInfosAction(Request $request, $username)
    {
        $response   = new JsonResponse();
        $user       = $this->_getUser();
        $serializer = $this->get('jms_serializer');
        $u_man      = $this->get('fos_user.user_manager');
        $data       = $u_man->loadInfos($username);
        return $response->setData(
            array(
                'status'=> $user->getStatus(),
                'adress' => $serializer->toArray($data['adress']), //TO DO::rename
                'contact' => $serializer->toArray($data['contact']),
                'aboutme' => $serializer->toArray($data['aboutme'])
            )
        );
    }

   /**
     * @Get("/photos/load/{username}")
     *
     * @return Integer
     */
    public function loadPhotosAction(Request $request, $username, PictureManager $imageMan)
    {
        $response   = new JsonResponse();
        $u_man      = $this->get('fos_user.user_manager');
        $serializer = $this->get('jms_serializer');
        $user       = $this->_getUser();
        $page       = $request->query->get('page') ? $request->query->get('page') : 1;
        $profile    = $u_man->findUserByUsername($username);
        // $data       = $u_man->loadPhotos($username);
        $photos     = $imageMan->loadPaginateUserImages($profile, $page, 20); //user,
        return $response->setData(array('photos' => $photos));
    }

    /**
     * @Get("/friends/load/{username}")
     *
     * @return Integer
     */
    public function loadFriendsAction(Request $request, $username, ObjectToArrayTransformer $transformer)
    {
        $response   = new JsonResponse();
        $friends    = [];
        $u_man      = $this->get('fos_user.user_manager');
        $serializer = $this->get('jms_serializer');
        $user       = $this->_getUser();
        $page       = $request->query->get('page') ? $request->query->get('page') : 1;
        $profile    = $u_man->findUserByUsername($username);
        $results    = $profile->getMyFriends()->toArray();
        //Warning: it will use the "==" comparison, not the strict comparison ("===")
        $results    = array_unique($results, SORT_REGULAR);
        //paginate
        $adapter = new ArrayAdapter($results);
        $pager   = new Pagerfanta($adapter);
        $pager->setMaxPerPage(20);
        $pager->setCurrentPage($page);

        foreach ($pager->getCurrentPageResults() as $u) {
            $context = new SerializationContext();
            $context->setSerializeNull(true);
            $groups = array('WithMutual', 'Detail');
            $context->setGroups($groups);
            $friends[] = $serializer->toArray($u, $context);
        }

        return $response->setData(array('friends' => $friends));
    }

    /**
     * @Get("/timeline/load/{username}")
     *
     * @return Integer
     */
    public function loadTimelineAction(Request $request, $username, PostManager $pMan)
    {
        $response = new JsonResponse();
        $query    = $request->query;
        $utc      = new \Datetime(null, new \DateTimeZone("UTC"));
        $u_man    = $this->get('fos_user.user_manager');
        $page     = $query->get('page') ? $query->get('page') : 1;
        $date     = $query->get('date') ? $query->get('date') : $utc;
        $profile  = $u_man->findUserByUsername($username);
        $results  = $this->loadTimelime($profile, $page, $date, $pMan);

        return $response->setData(array('posts' => $results));
    }

    protected function loadTimelime(User $user, $page=1, $date, $manager) {
        $authors  = $newsRefs = [];
        $posts          = $manager->loadTimelime($user, $page, $date);
        foreach ($posts as $p) {
            $authors[]  = $p['author'];
            $newsRefs[] = [
                'id'    => $p['id'],
                'type'  => $p['type']
            ];
        }

        return [
            'posts'     => $posts,
            'authors'   => $authors,
            'newsRefs'  => $newsRefs
        ];
    }



    public function _getUser()
    {
        return $this->user_provider->getHydratedUser();
    }

    protected function loadInitialPosts(User $user, $page, $date, $manager) {
        $timeline  = $manager->loadPost($user, $page, $date);
        $posts     = $timeline['posts'];
        $authors   = $newsRefs = [];
        foreach ($posts as $p) {
            $authors[]  = $p['author'];
            $newsRefs[] = [
                'id'    => $p['id'],
                'type'  => $p['type']
            ];
        }

        return [
            'posts'     => $posts,
            'authors'   => $authors,
            'newsRefs'  => $newsRefs,
            'lastStreamId' => $timeline['lastStreamId']
        ];
    }


    //return list of users from firebase
    public function fireUserList() {
        array_map(function (\Kreait\Firebase\Auth\UserRecord $user) {
            // ...

        }, iterator_to_array($users));
    }

    /**
     * Returns the DocumentManager
     *
     * @return DocumentManager
     */
    private function getDocumentManager()
    {
        return $this->dm;
    }

    /**
    * Shortcut to throw a AccessDeniedException($message) if the user is not authenticated
    * @param String $message The message to display (default:'warn.user.notAuthenticated')
    */
    protected function forwardIfNotAuthenticated($message='warn.user.notAuthenticated'){
        if (!is_object($this->_getUser())) {
            throw new AccessDeniedException($message);
        }
    }

    protected function getUploadRootDir()
    {
        return __DIR__.'/../../../../web/uploads/';
    }
}