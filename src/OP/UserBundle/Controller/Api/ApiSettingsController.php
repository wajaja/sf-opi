<?php

namespace OP\UserBundle\Controller\Api;

use OP\MediaBundle\Document\Image,
    OP\UserBundle\Document\Address,
    OP\UserBundle\Form\AddressType,
    JMS\Serializer\SerializerInterface,
    OP\UserBundle\Security\UserProvider,
    FOS\RestBundle\Controller\Annotations,
    Symfony\Component\HttpFoundation\Request,
    FOS\RestBundle\Controller\FOSRestController,
    OP\UserBundle\Repository\OpinionUserManager,
    OP\UserBundle\DocumentManager\SettingManager,
    OP\MediaBundle\DocumentManager\PictureManager,
    FOS\RestBundle\Routing\ClassResourceInterface,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Component\HttpFoundation\RedirectResponse,
    FOS\RestBundle\Controller\Annotations\RouteResource,
    Symfony\Component\Security\Core\Exception\AccessDeniedException;


/**
 * @RouteResource("setting", pluralize=false)
 */
class ApiSettingsController extends FOSRestController implements ClassResourceInterface
{
    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }
    
    /**
     * @Annotations\Get("/setting/load/general")
     *
     * @return Integer
     */
    public function loadGeneralAction(Request $request, SerializerInterface $serializer, OpinionUserManager $u_man)
    {
        $response   = new JsonResponse();
        $user       = $this->_getUser();
        $data       = $u_man->getSettingTag('general', $user->getId());
        return $response->setData(
            array(
                'status'=> $user->getStatus(),
                'data' => $serializer->toArray($data)
            )
        );
    }

    /**
     * @Annotations\Get("/setting/load/adress")
     *
     * @return Integer
     */
    public function loadAdressAction(Request $request, SerializerInterface $serializer, OpinionUserManager $u_man)
    {
        $response   = new JsonResponse();
        $user       = $this->_getUser();
        
        $data       = $u_man->getSettingTag('adress', $user->getId());
        return $response->setData(array('data' => $serializer->toArray($data)));
    }

    /**
     * @Annotations\Get("/setting/load/security")
     *
     * @return Integer
     */
    public function loadSecurityAction(Request $request, SerializerInterface $serializer, OpinionUserManager $u_man)
    {
        $response   = new JsonResponse();
        $user       = $this->_getUser();
        
        $data       = $u_man->getSettingTag('security', $user->getId());
        return $response->setData(array('data' => $serializer->toArray($data)));
    }

    /**
     * @Annotations\Get("/setting/load/contact")
     *
     * @return Integer
     */
    public function loadContactAction(Request $request, SerializerInterface $serializer, OpinionUserManager $u_man)
    {
        $response   = new JsonResponse();
        $user       = $this->_getUser();
        
        $data       = $u_man->getSettingTag('contact', $user->getId());
        return $response->setData(array('data' => $serializer->toArray($data)));
    }

    /**
     * @Annotations\Get("/setting/load/notification")
     *
     * @return Integer
     */
    public function loadNoticationAction(Request $request, SerializerInterface $serializer, OpinionUserManager $u_man)
    {
        $response   = new JsonResponse();
        $user       = $this->_getUser();
        
        $data       = $u_man->getSettingTag('notification', $user->getId());
        return $response->setData(array('data' => $serializer->toArray($data)));
    }

    /**
     * @Annotations\Post("/setting/adress")
     *
     * @return Integer
     */
    public function adressAction(Request $request, SerializerInterface $serializer, SettingManager $set_man)
    {
        $redirected = false;
        $response   = new JsonResponse();
        $contentType = $request->headers->get('Content-Type');
        if('application/x-www-form-urlencoded' === $contentType) { 
            $redirected = true;
            // $form->handleRequest($request);
        } else {
            $data       = json_decode($request->getContent(), true);
            $request->request->replace(is_array($data) ? $data : array());
        }
        $adress = $set_man->setAddress($request);
        if(!$redirected) {
            return $response->setData(
                array(
                    'user' =>$serializer->toArray($this->_getUser()), 
                    'adress'=> $serializer->toArray($adress)
                )
            );
        } else {
            $url      = $this->generateUrl('op_user_setting');
            $response = new RedirectResponse($url);
        }

        return $response;
    }

    /**
     * @Annotations\Post("/setting/notification")
     *
     * @return Integer
     */
    public function notificationAction(Request $request, SerializerInterface $serializer, SettingManager $set_man)
    {
        $redirected = false;
        $response   = new JsonResponse();
        $contentType = $request->headers->get('Content-Type');
        if('application/x-www-form-urlencoded' === $contentType) { 
            $redirected = true;
            // $form->handleRequest($request);
        } else {
            $data       = json_decode($request->getContent(), true);
            $request->request->replace(is_array($data) ? $data : array());
        }
        $note = $set_man->setNotification($request);
        if(!$redirected) {
            return $response->setData(
                array(
                    'user' =>$serializer->toArray($this->_getUser()), 
                    'notification'=> $serializer->toArray($note)
                )
            );
        } else {
            $url      = $this->generateUrl('op_user_setting');
            $response = new RedirectResponse($url);
        }

        return $response;
    }

    /**
     * @Annotations\Post("/setting/contact")
     *
     * @return Integer
     */
    public function contactAction(Request $request, SerializerInterface $serializer, SettingManager $set_man)
    {
        $redirected = false;
        $response   = new JsonResponse();
        $contentType = $request->headers->get('Content-Type');
        if('application/x-www-form-urlencoded' === $contentType) { 
            $redirected = true;
            // $form->handleRequest($request);
        } else {
            $data       = json_decode($request->getContent(), true);
            $request->request->replace(is_array($data) ? $data : array());
        }
        $contact = $set_man->setContact($request);
        if(!$redirected) {
            return $response->setData(
                array(
                    'user' =>$serializer->toArray($this->_getUser()), 
                    'contact'=> $serializer->toArray($contact)
                )
            );
        } else {
            $url      = $this->generateUrl('op_user_setting');
            $response = new RedirectResponse($url);
        }

        return $response;
    }


    /**
     * @Annotations\Post("/setting/aboutme")
     *
     * @return Integer
     */
    public function aboutmeAction(Request $request, SerializerInterface $serializer, SettingManager $set_man)
    {
        $redirected = false;
        $response   = new JsonResponse();
        $contentType = $request->headers->get('Content-Type');
        if('application/x-www-form-urlencoded' === $contentType) { 
            $redirected = true;
            // $form->handleRequest($request);
        } else {
            $data       = json_decode($request->getContent(), true);
            $request->request->replace(is_array($data) ? $data : array());
        }
        $aboutme = $set_man->setAboutMe($request);
        if(!$redirected) {
            return $response->setData(
                array(
                    'user' =>$serializer->toArray($this->_getUser()), 
                    'aboutme'=> $serializer->toArray($aboutme)
                )
            );
        } else {
            $url      = $this->generateUrl('op_user_setting');
            $response = new RedirectResponse($url);
        }

        return $response;
    }

    /**
     * @Annotations\Post("/setting/status")
     *
     * @return Integer
     */
    public function statusAction(Request $request, SerializerInterface $serializer, OpinionUserManager $set_man)
    {
        $redirected = false;
        $response   = new JsonResponse();
        $contentType = $request->headers->get('Content-Type');
        if('application/x-www-form-urlencoded' === $contentType) { 
            $redirected = true;
            // $form->handleRequest($request);
        } else {
            $data       = json_decode($request->getContent(), true);
            $request->request->replace(is_array($data) ? $data : array());
        }
        $status = $set_man->setStatus($request);
        if(!$redirected) {
            return $response->setData(
                array(
                    'user' =>$serializer->toArray($this->_getUser()), 
                    'status'=> $status
                )
            );
        } else {
            $url      = $this->generateUrl('op_user_setting');
            $response = new RedirectResponse($url);
        }

        return $response;
    }

    /**
     * @Annotations\Post("/setting/lang")
     *
     * @return Integer
     */
    public function langAction(Request $request, SerializerInterface $serializer, SettingManager $set_man)
    {
        $redirected = false;
        $response   = new JsonResponse();
        $contentType = $request->headers->get('Content-Type');
        if('application/x-www-form-urlencoded' === $contentType) { 
            $redirected = true;
            // $form->handleRequest($request);
        } else {
            $data       = json_decode($request->getContent(), true);
            $request->request->replace(is_array($data) ? $data : array());
        }
        $lang = $set_man->setLang($request);
        if(!$redirected) {
            return $response->setData(
                array(
                    'user' =>$serializer->toArray($this->_getUser()), 
                    'lang'=> $lang
                )
            );
        } else {
            $url      = $this->generateUrl('op_user_setting');
            $response = new RedirectResponse($url);
        }

        return $response;
    }

    /**
     * @Annotations\Post("/setting/name")
     *
     * @return Integer
     */
    public function nameAction(Request $request, SerializerInterface $serializer, SettingManager $set_man)
    {
        $redirected = false;
        $response   = new JsonResponse();
        $contentType = $request->headers->get('Content-Type');
        if('application/x-www-form-urlencoded' === $contentType) { 
            $redirected = true;
            // $form->handleRequest($request);
        } else {
            $data       = json_decode($request->getContent(), true);
            $request->request->replace(is_array($data) ? $data : array());
        }
        $datas = $set_man->setName($request);
        if(!$redirected) {
            return $response->setData($datas); //['user'=>... & ('name' || 'errors')]
        } else {
            $url      = $this->generateUrl('op_user_setting');
            $response = new RedirectResponse($url);
        }

        return $response;
    }


//     /**
//      * Edit user's name
//      * @param Request $request
//      * @return RedirectResponse
//      * @throws AccessDeniedException
//      */
//     public function nameAction(Request $request)
//     {
//         $user = $this->_getUser();
//         if (!is_object($user) || !$user instanceof UserInterface) {
//             throw new AccessDeniedException('This user does not have access to this section.');
//         }

//         /** @var $dispatcher \Symfony\Component\EventDispatcher\EventDispatcherInterface */
//         $dispatcher = $this->get('event_dispatcher');

//         $event = new GetResponseUserEvent($user, $request);
//         $dispatcher->dispatch(FOSUserEvents::PROFILE_EDIT_INITIALIZE, $event);

//         if (null !== $event->getResponse()) {
//             return $event->getResponse();
//         }

//         /** @var $formFactory \FOS\UserBundle\Form\Factory\FactoryInterface */
// //        $formFactory = $this->get('fos_user.profile.form.factory');

//         $form =                             //$formFactory->createForm();
//         $form->setData($user);

//         $form->handleRequest($request);

//         if ($form->isValid()) {
//             /** @var $userManager \FOS\UserBundle\Model\UserManagerInterface */
//             $userManager = $this->get('fos_user.user_manager');

//             $event = new FormEvent($form, $request);
//             $dispatcher->dispatch(FOSUserEvents::PROFILE_EDIT_SUCCESS, $event);

//             $userManager->updateUser($user, false);

//             if (null === $response = $event->getResponse()) {
//                 $url = $this->generateUrl('fos_user_profile_show');
//                 $response = new RedirectResponse($url);
//             }

//             $dispatcher->dispatch(FOSUserEvents::PROFILE_EDIT_COMPLETED, new FilterUserResponseEvent($user, $request, $response));

//             return $response;
//         }

//         return $this->render('FOSUserBundle:Profile:edit.html.twig', array(
//             'form' => $form->createView()
//         ));
//     }
    
    /**
     * @Annotations\Post("/complete/pic")
     *
     * @return Integer
     */
    public function profilepicAction(Request $request, PictureManager $pMan)
    {
        $response   = new JsonResponse();
        $user       = $this->_getUser();
        if($request->getMethod()==='POST' && $request->getFormat('application/json')) {
            $data = $request->request->all();
        }

        $files         = $request->files;
        $cropped_data  = $data['croppedData'];         //get encoded base64 data
        
        //if image exist in database; update it
        if(isset($data['imageId'])) {
            $image      = $this->getImageById($data['imageId']);
            $crop_datas = $pMan->createCroppedImage($image, $cropped_data);
            $picture    = $pMan->updatePicture($user, $image, $crop_datas['path']);
            // $dispatcher->dispatch()
            return $response->setData(
                array('webPath' =>$picture->getWebPath())
            );
        } else {            
            if($picture  = $pMan->createNewImage($user, $files)) {
                if($_datas = $pMan->createCroppedImage($picture, $cropped_data)) {
                    $picture = $pMan->addNewPicture($user, $picture, $_datas['path']);
                    // $dispatcher->dispatch()
                    return $response->setData(
                        array('webPath' => $picture->getWebPath())
                    );
                } else {
                    $picture = $pMan->addNewPicture($user, $picture, null);
                    // $dispatcher->dispatch()
                    $response->setData(
                        array('webPath' => $picture->getWebPath())
                    );
                }                    
            } else {
                $response->setData(array('webPath' =>"bas"));
            }
        }
        // $dispatcher->dispatch(OPUserEvents::PROFILE_EDIT_COMPLETED, new FilterUserResponseEvent($user, $request, $response));
    }
    
     /**
     * @Annotations\Post("/complete/cover")
     *
     * @return Integer
     */
    public function coverpicAction(Request $request, PictureManager $picMan)
    {

        $picture    = new Image();
        $response   = new JsonResponse();
        if($request->getMethod()==='POST' && $request->getFormat('application/json')) {
            $data = json_decode($request->getContent(), true);
            $request->request->replace(is_array($data) ? $data : array());
        }

        $files         = $request->files;
        $cropped_data  = $data['croppedData'];         //get encoded base64 data
        
        //if image exist in database; update it
        if(isset($data['imageId'])) {
            $image      = $this->getImageById($data['imagId']);
            $crop_datas = $pMan->createCroppedImage($image, $cropped_data);
            $picture    = $pMan->updateCover($image, $crop_datas['path']);
            // $dispatcher->dispatch()
            return $response->setData(array('webPath' =>$picture->getWebPath()));
        } else {
            $img_datas  = $pMan->createNewImage($picture, $files);
            if(isset($img_datas['success']) && $img_datas['success']){
                $crop_datas = $pMan->createCroppedImage($picture, $cropped_data);
                if(isset($crop_datas['success']) && $crop_datas['success']) {
                    $picture = $picMan->addNewCover($picture, $img_datas['path'], $crop_datas['path']);
                    // $dispatcher->dispatch()
                    return $response->setData(array('webPath' => $picture->getCroppedPath()));
                } else {
                    $picture = $picMan->addNewCover($picture, $img_datas['path'], null);
                    // $dispatcher->dispatch()
                    $response->setData(array('webPath' => $picture->getWebPath()));
                }                    
            }else{
                $response->setData(array('webPath' =>""));
            }
        }
        // $dispatcher->dispatch(OPUserEvents::PROFILE_EDIT_COMPLETED, new FilterUserResponseEvent($user, $request, $response));
    }

     /**
     * @Annotations\Post("/complete/infos")
     *
     * @return Integer
     */
    public function infosAction(Request $request, SerializerInterface $serializer, SettingManager $settMan)
    {
        $response   = new JsonResponse();
        if('application/x-www-form-urlencoded' === $request->headers->get('Content-Type')) 
        { 
            // $form->handleRequest($request);
        } else {
            $data       = json_decode($request->getContent(), true);
            $request->request->replace(is_array($data) ? $data : array());
        }
            $data = $request->request->all();
            // return $response->setData(array('data' => $data));

        if ($request->request->has('aboutMe')) {
            // handle the first form
            $settMan->setAboutMe($request);
        }

        if ($request->request->has('adress')) {
            // handle the second form 
            $settMan->setAddress($request);
        }

        if ($request->request->has('contact')) {
            // handle the second form  
            $settMan->setContact($request);
        }
    }

    
    
    /**
     * Confirm User's address 
     * @param Request $request
     * @return JsonResponse
     */
    public function confirmaddressAction(Request $request){
        $user = $this->_getUser();
        $address = new Address();
        $aform = $this->createForm(AddressType::class, $address);
        $aform->handleRequest($request);

        if($aform->isValid()){
            // if($request->getMethod()==='POST'){}
            $address->setUserId($user);
            $dm = $this->getDocumentManager();
            $dm->persist($address);
            $dm->flush();
            return $this->redirect($this->generateUrl('op_social_homepage'));
        }else{
            return new JsonResponse(array('confirm'=>'error'));
        }
    }
    
    
    
    /**
     * get image
     * @param String $id
     * @return Image
     */
    protected function getImageById($id)
    {
        $image = $this->getDocumentManager()
                       ->getRepository('OPMediaBundle:Image')
                       ->findOneBy(array('id'=>$id));
                        
        return $image;
    }

    public function _getUser()
    {
        return $this->user_provider->getHydratedUser();
    }
    
//    $path = $request->getPathInfo();
//    $username = str_replace('/', '', $path);
    
    /**
     * Returns the DocumentManager
     *
     * @return DocumentManager
     */
    private function getDocumentManager()
    {
        return $this->dm;
    }
}
