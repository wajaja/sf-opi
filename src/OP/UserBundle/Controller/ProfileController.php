<?php

namespace OP\UserBundle\Controller;

use FOS\UserBundle\FOSUserEvents,
    FOS\UserBundle\Event\FormEvent,
    FOS\UserBundle\Model\UserInterface,
    OP\UserBundle\Document\User,
    OP\UserBundle\Security\UserProvider,
    Symfony\Component\HttpFoundation\Request,
    FOS\UserBundle\Event\GetResponseUserEvent,
    OP\UserBundle\Repository\OpinionUserManager,
    FOS\UserBundle\Event\FilterUserResponseEvent,
    OP\MediaBundle\DocumentManager\PictureManager,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\MessageBundle\DocumentManager\ThreadManager,
    OP\MessageBundle\DocumentManager\MessageManager,
    OP\PostBundle\DocumentManager\PostManager,
    JMS\Serializer\SerializerInterface,
    Symfony\Component\HttpFoundation\RedirectResponse,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Symfony\Component\HttpFoundation\StreamedResponse,
    OP\UserBundle\DocumentManager\InvitationManager,
    OP\SocialBundle\DocumentManager\NotificationManager,
    Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * Controller managing the user profile
 *
 * @author Christophe Coevoet <stof@notk.org>
 */
class ProfileController extends Controller
{

    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }

    
    /**
     * Show the user
     */
    public function showAction(Request $request, PictureManager $imageMan, MessageManager $msgMan, ThreadManager $threadMan, PostManager $pMan, InvitationManager $invitMan, SerializerInterface $serializer, OpinionUserManager $userMan, NotificationManager $notiMan)
    {

        $session    = $request->getSession();
        if($token = $session->get('access_token')) {
            $user       = $this->_getUser();
            $referer    = $request->headers->get('referer');
            $username   = str_replace('/', '', $request->getPathInfo());
            $profile    = $userMan->findUserByUsername($username);
            $utcDate    = new \Datetime(null, new \DateTimeZone("UTC"));
            // $postsData  = $this->loadInitialPosts($profile, 1, $utcDate);
            
            // if (!is_object($profile) || !$profile instanceof UserInterface) {
            //     throw new AccessDeniedException('This user does not have access to this section.');
            // }

            $firstname = $profile ? $profile->getFirstname() : 'User Not Found';

            return $this->render('OPUserBundle:Profile:profile.html.twig', [
                // We pass an array as props
                'initialState' => [
                    'App'         => [
                        'sessionId'    => $session->getId()
                    ],
                    'User'        => [
                        'user'      => $serializer->toArray($user)
                    ],
                    'Auth'         => [
                        'token'    => $token,
                        'data'      => $session->get('_authData')
                    ],
                    'Profiles' => [
                        'users'   => [
                            $username => [
                                'user'    => $profile ? $serializer->toArray($profile) : null,
                                'newsRefs'=> [], //$postsData['newsRefs'],
                                'photos'  => $profile ? $imageMan->loadProfileImages($profile, [], 9) : [] //user, initIds, limit
                            ]
                        ]
                    ],
                    'Notification' => [
                        'nbAlerts'  => $notiMan->countAlerts($user),
                    ],
                    'Invitation'   => [
                        'nbAlerts'  =>  $invitMan->countAlerts($user),
                    ],
                    'Message'      => [
                        'nbAlerts'  =>  $msgMan->countAlerts($user),
                        'threadsIds' => $threadMan->findParticipantInboxThreadsIds($user)
                    ],
                    'Users'        => [
                        'defaults'  => $invitMan->loadDefaultUsers($user, []),
                        'onlines'   => []
                    ],
                    // 'NewsFeed'     => [
                    //     'news'      => $postsData['posts']
                    // ],
                    // 'Stream'         => [
                    //     'lastStreamId'=> $postsData['lastStreamId'],
                    // ],
                    'Invitation'    => [],
                ],
                'title'         => "{$firstname}",
                'description'   => $this->getProfileDescription($profile), 
                'locale'        => $request->getLocale(),
            ]);
            
        } else {
            return $this->redirect($this->generateUrl('fos_user_security_login'));
        }
    }

    protected function loadInitialPosts(User $user, $page, $date, $manager) {
        $timeline  = $manager->loadPost($user, $page, $date);
        $posts     = $timeline['posts'];
        $authors   = $newsRefs = [];
        foreach ($posts as $p) {
            $authors[]  = $p['author'];
            $newsRefs[] = [
                'id' => $p['id'],
                'type' => $p['type']
            ];
        }

        return [
            'posts' => $posts,
            'authors' => $authors,
            'newsRefs'  => $newsRefs,
            'lastStreamId' => $timeline['lastStreamId']
        ];
    }

    /**
    */
    public function getUserInfosAction(Request $request, OpinionUserManager $um)
    {

        $infos = [];
        $str_path = explode('/', $request->getPathInfo());
        $username = $str_path[1];

        $userInfos = $um->simpleUserByUsername($username);

        $infos = [];
        $user = $um->simpleUserByUsername($username);

        $infos ['username'] = $user['username'];
        $infos ['email']    = $user['email'];
        $infos ['gender']   = $user['gender'];
        if(isset($user['contacts'])){
            foreach ($user['contacts'] as $key => $value) {
                $infos[$key] = $value;
            }
        }
        if(isset($user['about'])){
            foreach ($user['contacts'] as $key => $value) {
                $infos[$key] = $value;
            }
        }
        $response = new JsonResponse();
        return $response->setData(array('infos'=>$infos));
    }
    
    protected function userInfo($username, $um)
    {
        $infos = [];
        $user = $um->simpleUserByUsername($username);
        $infos ['username'] = $user['username'];
        $infos ['email']    = $user['email'];
        $infos ['gender']   = $user['gender'];
        if(isset($user['contacts'])){
            foreach ($user['contacts'] as $key => $value) {
                $infos[$key] = $value;
            }
        }  
        return $infos;
    }

    protected function othersInfo($username, $um)
    {
        $infos = [];
        $user = $um->simpleUserByUsername($username);
        if(isset($user['address'])){
            foreach ($user['address'] as $key => $value) {
                if($key == "firstCell" || $key == "")
                $infos[$key] = $value;
            }
        }        
        return $infos;
    }

    public function getCoverImageAction()
    {
        $user = $this->_getUser();
        $coverPath = $user->getCoverPic() ? '\/opinion/' . $user->getCoverPic()->getWebPath()
                                      : '';
        $coverId = $user->getCoverPic() ? $user->getCoverPic()->getId() : '';
        $response = new JsonResponse();

        return $response->setData(array('webPath'=>$coverPath, 'imageId'=>$coverId));
    }

    public function getProfileImageAction()
    {
        $user = $this->_getUser();
        $picPath = $user->getProfilePic() ? '\/opinion/' . $user->getProfilePic()->getWebPath()
                                      : '';
        $picId = $user->getProfilePic() ? $user->getProfilePic()->getId() : '';
        $response = new JsonResponse();

        return $response->setData(array('webPath'=>$picPath, 'imageId'=>$picId));
    }

    public function getImagesAction()
    {
        $img_construct = $this->get('op_media.image_constructor');
        $userId = $this->_getUser()->getId();
        $images = $this->dm->getRepository('OPMediaBundle:Image')
                       ->findTenImagesForUserId($userId);

        $response = new JsonResponse();
        return $response->setData(array('images'=>$img_construct->imagesToArray($images)));
    }


    /**
     * Show the user
     */
    public function showAjaxAction($username)
    {
        $s_user = $this->get('fos_user.user_manager')->findUserByUsername($username);

        if (!is_object($s_user) || !$s_user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }
        $user = $this->_getUser();
        if (!is_object($user) || !$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        if ($s_user == $user){

            return new JsonResponse(array('message'=>'c\'est lui'));
        }else{
            return new JsonResponse(array('message'=>'ce n\'est lui'));
        }

    }

    /**
     * Edit the user
     */
    public function editAction(Request $request)
    {
        $user = $this->_getUser();
        if (!is_object($user) || !$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        /** @var $dispatcher \Symfony\Component\EventDispatcher\EventDispatcherInterface */
        $dispatcher = $this->get('event_dispatcher');

        $event = new GetResponseUserEvent($user, $request);
        $dispatcher->dispatch(FOSUserEvents::PROFILE_EDIT_INITIALIZE, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }

        /** @var $formFactory \FOS\UserBundle\Form\Factory\FactoryInterface */
        $formFactory = $this->get('fos_user.profile.form.factory');

        $form = $formFactory->createForm();
        $form->setData($user);

        $form->handleRequest($request);

        if ($form->isValid()) {
            /** @var $userManager \FOS\UserBundle\Model\UserManagerInterface */
            $userManager = $this->get('fos_user.user_manager');

            $event = new FormEvent($form, $request);
            $dispatcher->dispatch(FOSUserEvents::PROFILE_EDIT_SUCCESS, $event);

            $userManager->updateUser($user);

            if (null === $response = $event->getResponse()) {
                $url = $this->generateUrl('fos_user_profile_show');
                $response = new RedirectResponse($url);
            }

            $dispatcher->dispatch(FOSUserEvents::PROFILE_EDIT_COMPLETED, new FilterUserResponseEvent($user, $request, $response));

            return $response;
        }

        return $this->render('FOSUserBundle:Profile:edit.html.twig', array(
            'form' => $form->createView()
        ));
    }

    public function userOnlinesAction($userId){
        // $s_users = $this->get('fos_user.user_manager')->findBy(array('userId'=$userId));

        foreach ($s_users as $user) {
            if (!is_object($s_user) || !$s_user instanceof UserInterface) {
                throw new AccessDeniedException('This user does not have access to this section.');
            }else{

            }
        }


        $user = $this->_getUser();
        if (!is_object($user) || !$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        if ($s_user == $user){

            return new JsonResponse(array('message'=>'c\'est lui'));
        }else{
            return new JsonResponse(array('message'=>'ce n\'est lui'));
        }
    }

   protected function getFollowers($username, $uProvider, $um)
    {
        return $uProvider->getFollowers($uProvider->getFollowerIds($um->simpleUserByUsername($username)), 0, 8);
    }

    protected function getFolloweds($username, $uProvider, $um)
    {
        return $uProvider->getFolloweds($uProvider->getFollowedIds($um->simpleUserByUsername($username)), 0, 8);
    }

    protected function getFriends($username, $uProvider, $um)
    {
        return $uProvider->getFriends($uProvider->getFriendIds($um->simpleUserByUsername($username)), 0, 8);
    }
    
    protected function returnImages($userId)
    {   
        $img_construct = $this->get('op_media.image_constructor');
        $images = $this->dm->getRepository('OPMediaBundle:Image')
                       ->findTenImagesForUserId($userId);
        return $img_construct->imagesToArray($images);
    }

    public function _getUser()
    {
        return $this->user_provider->getHydratedUser();
    }

    protected function getProfileDescription($profile) {
        return 'The MDN Learning Area aims to provide complete beginners to the Web with all they need to know to get started with developing web sites and applications.';
    }
}
