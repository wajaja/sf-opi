<?php

namespace OP\UserBundle\Controller;

use FOS\UserBundle\FOSUserEvents,
    JMS\Serializer\SerializerInterface,
    OP\MediaBundle\Document\Image,
    OP\UserBundle\Document\Address,
    OP\UserBundle\Form\AddressType,
    FOS\UserBundle\Event\FormEvent,
    OP\UserBundle\Security\UserProvider,
    OP\UserBundle\Repository\OpinionUserManager,
    FOS\UserBundle\Event\GetResponseUserEvent,
    OP\MessageBundle\DocumentManager\ThreadManager,
    OP\MessageBundle\DocumentManager\MessageManager,
    FOS\UserBundle\Event\FilterUserResponseEvent,
    OP\UserBundle\DocumentManager\InvitationManager,
    OP\SocialBundle\DocumentManager\NotificationManager,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Component\HttpFoundation\RedirectResponse,
    Symfony\Component\HttpFoundation\File\UploadedFile;


class SettingsController extends Controller
{

    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }

    /**
     * Show the user
     */
    public function indexAction(Request $request, ThreadManager $threadMan, MessageManager $msgMan, InvitationManager $invitMan, NotificationManager $notifMan, OpinionUserManager $userMan, SerializerInterface $serializer)
    {
        $tag      = $request->query->get('tag');
        $session  = $request->getSession();
        if($token = $session->get('access_token')) {

            if($tag === "") $tag = 'general';
            $user       = $this->_getUser();
            $referer    = $request->headers->get('referer');
            $tagValue   = $userMan->getSettingTag($tag, $user->getId());
            return $this->render('OPUserBundle:Profile:settings.html.twig', [
                // We pass an array as props
                'initialState' => [
                    'App'         => [
                        'sessionId'    => $session->getId()
                    ],
                    'User'  => [
                        'user' => $serializer->toArray($user),
                        'status'=> $user->getStatus(),
                        'setting' => [
                            $tag  => $serializer->toArray($tagValue),
                            'loadData' => false
                        ] 
                    ],
                    'Auth'         => [
                        'token'    => $token,
                        'data'      => $session->get('_authData')
                    ],
                    'Notification' => [
                        'nbAlerts'  => $notifMan->countAlerts($user),
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
                    ]
                ],
                'title'         => "settings",
                'description'   => "configuration", 
                'locale'        => $request->getLocale(),
            ]);
        } else {
            return $this->redirect($this->generateUrl('fos_user_security_login'));
        }
    }

    protected function loadInitialPosts(User $user) {
        // $postManager    = $this->get('op_post.post_manager');
        // $posts          = $postManager->loadPost($user, []);
        // $authors        = [];
        // $newsRefs       = [];
        // foreach ($posts as $p) {
        //     $authors[]  = $p['author'];
        //     $newsRefs[] = [
        //         'id'    => $p['id'],
        //         'type'  => $p['type']
        //     ];
        // }

        // return [
        //     'posts'     => $posts,
        //     'authors'   => $authors,
        //     'newsRefs'  => $newsRefs
        // ];
    }

    /**
     * Request reset user account: show account
     */
    public function accountAction()
    {
        return $this->render('FOSUserBundle:profile:account.html.twig');
    }
    
    /**
     * Edit user's name
     * @param Request $request
     * @return RedirectResponse
     * @throws AccessDeniedException
     */
    public function nameAction(Request $request)
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
//        $formFactory = $this->get('fos_user.profile.form.factory');

        $form =                             //$formFactory->createForm();
        $form->setData($user);

        $form->handleRequest($request);

        if ($form->isValid()) {
            /** @var $userManager \FOS\UserBundle\Model\UserManagerInterface */
            $userManager = $this->get('fos_user.user_manager');

            $event = new FormEvent($form, $request);
            $dispatcher->dispatch(FOSUserEvents::PROFILE_EDIT_SUCCESS, $event);

            $userManager->updateUser($user, false);

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
    
    /**
     * Set User's profile picture
     * @param Request $request
     * @return JsonResponse
     */
    public function profilepicAction(Request $request)
    {
        $picture = new Image();
        $response = new JsonResponse();
        $url = $this->generateUrl('op_social_homepage');
        if($request->getMethod()==='POST' && $request->isXmlHttpRequest()) {
            $data          = $request->request->all();
            $files         = $request->files;
            $cropped_data  = $data['cropped_data'];         //get encoded base64 data
            $image_id      = $data['image_id'];              //get encoded base64 data
            $img_datas     = strlen($image_id) == 24 ? [] : $this->createImage($picture, $files);
            
            //if image exist in database; update it
            if(strlen($image_id) == 24) {
                $image = $this->getImage($image_id);
                $crop_datas = $this->createCroppedImage($image, $cropped_data);
                $picture = $this->updatePicture($image, $crop_datas['path']);                
                return $response->setData(array('webPath' =>$picture->getWebPath(), 'url'=>$url));
            } 
            
            //create new image
            if($img_datas['success']){
                $crop_datas = $this->createCroppedImage($picture, $cropped_data);
                if($crop_datas['success']) {
                    $picture = $this->addNewPicture($picture, $img_datas['path'], $crop_datas['path']);
                    return $response->setData(array('webPath' =>$picture->getWebPath(), 'url' =>$url));
                } else {
                }                    
            }else{
                $response->setData(array('webPath' =>"", 'url' =>$url));
            }
//            $dispatcher->dispatch(FOSUserEvents::PROFILE_EDIT_COMPLETED, new FilterUserResponseEvent($user, $request, $response));
        }else{
            return new JsonResponse(array('ceci'=>'nothing'));
        }
    }
    
    /**
     * Set User's Cover picture
     * @param Request $request
     * @return JsonResponse
     */
    public function coverpicAction(Request $request)
    {
        $picture = new Image();
        $response = new JsonResponse();
        $url = $this->generateUrl('op_social_homepage');
        if($request->getMethod()==='POST' && $request->isXmlHttpRequest()) {
            $data          = $request->request->all();
            $files         = $request->files;
            $cropped_data  = $data['cropped_data'];         //get encoded base64 data
            $image_id      = $data['image_id'];              //get encoded base64 data
            $img_datas     = strlen($image_id) == 24 ? [] : $this->createImage($picture, $files);
            
            //if image exist in database; update it
            if(strlen($image_id) == 24) {
                $image = $this->getImage($image_id);
                $crop_datas = $this->createCroppedImage($image, $cropped_data);
                $picture = $this->updateCover($image, $crop_datas['path']);                
                return $response->setData(array('webPath' =>$picture->getWebPath(), 'url'=>$url));
            }            
            //create new image
            if($img_datas['success']){
                $crop_datas = $this->createCroppedImage($picture, $cropped_data);
                if($crop_datas['success']) {
                    $picture = $this->addNewCover($picture, $img_datas['path'], $crop_datas['path']);
                    return $response->setData(array('webPath' =>$picture->getWebPath(), 'url' =>$url));
                } else {
                }                    
            }else{
                $response->setData(array('webPath' =>"", 'url' =>$url));
            }
//            $dispatcher->dispatch(FOSUserEvents::PROFILE_EDIT_COMPLETED, new FilterUserResponseEvent($user, $request, $response));
        }else{
            return new JsonResponse(array('ceci'=>'nothing'));
        }
    }
    
    /**
     * Confirm User's adress 
     * @param Request $request
     * @return JsonResponse
     */
    public function confirmadressAction(Request $request){
        $user = $this->_getUser();
        $address = new Address();
        $aform = $this->createForm(AddressType::class, $address);
        $aform->handleRequest($request);

        if($aform->isValid()){
            // if($request->getMethod()==='POST'){}
            $address->setUserId($user);
            $dm = $this->dm;
            $dm->persist($address);
            $dm->flush();
            return $this->redirect($this->generateUrl('op_social_homepage'));
        }else{
            return new JsonResponse(array('confirm'=>'error'));
        }
    }

    public function _getUser()
    {
        return $this->user_provider->getHydratedUser();
    }
    
    /**
     * get image
     * @param String $id
     * @return Image
     */
    protected function getImage($id)
    {
        $image = $this->dm->getRepository('OPMediaBundle:Image')
                       ->findOneBy(array('id'=>$id));
                        
        return $image;
    }
    
//    $path = $request->getPathInfo();
//    $username = str_replace('/', '', $path);
}
