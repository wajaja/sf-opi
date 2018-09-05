<?php

namespace OP\UserBundle\Controller\Mobile;

use FOS\UserBundle\FOSUserEvents,
    OP\MediaBundle\Document\Image,
    OP\UserBundle\Document\Address,
    OP\UserBundle\Form\AddressType,
    FOS\UserBundle\Event\FormEvent,
    JMS\Serializer\SerializerInterface,
    OP\UserBundle\DocumentManager\SettingManager,
    FOS\UserBundle\Event\GetResponseUserEvent,
    FOS\UserBundle\Event\FilterUserResponseEvent,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Component\HttpFoundation\RedirectResponse,
    Symfony\Component\HttpFoundation\File\UploadedFile;


class SettingsController extends Controller
{
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
    
    /**
     * Add New Cover
     * @param Image $picture
     * @param String $path
     * @param String $crop_path
     * @return Image
     */
    protected function addNewCover(Image $picture, $path, $crop_path)
    {
        $user = $this->_getUser();
        $picture->setPath($path);
        $picture->setCroPpath($crop_path);
        $picture->setAuthor($user);
        $dm = $this->get('doctrine_mongodb.public')->getManager();
        $dm->persist($picture);
        $user->setCoverPic($picture); 
        $this->get('fos_user.user_manager')->updateUser($user, false);  //update user collection in db
        $dm->flush();
        return $picture;
    }
    
    /**
     * Update Cover picture
     * @param Image $picture
     * @param String $crop_path
     * @return Image
     */
    protected function updateCover(Image $picture, $crop_path)
    {
        $user = $this->_getUser();
        $date = new \Datetime();
        $picture->setCroPpath($crop_path);
        $picture->setAuthor($user);
        $picture->setUpdateAt($date);
        $dm = $this->dm;
        $user->setCoverPic($picture);
        $this->get('fos_user.user_manager')->updateUser($user, false);  //update user collection in db
        $dm->flush();
        return $picture;
    }
    
    /**
     * Update an exist image
     * @param Image $picture
     * @param String $crop_path
     * @return Image
     */
    protected function updatePicture(Image $picture, $crop_path)
    {
        $user = $this->_getUser();
        $date = new \Datetime();
        $picture->setCroPpath($crop_path);
        $picture->setAuthor($user);
        $picture->setUpdateAt($date);
        $dm = $this->dm;
        $user->setProfilePic($picture);
        $user->addListProfilePic($picture); 
        $this->get('fos_user.user_manager')->updateUser($user, false);  //update user collection in db
        $dm->flush();
        return $picture;
    }
    
    /**
     * Create new Picture
     * @param Image $picture
     * @param String $img_path
     * @param String $crop_path
     * @return Image
     */
    protected function addNewPicture(Image $picture, $img_path, $crop_path)
    {
        $user = $this->_getUser();
        $picture->setPath($img_path);
        $picture->setCroPpath($crop_path);
        $picture->setAuthor($user);
        $dm = $this->get('doctrine_mongodb.public')->getManager();
        $dm->persist($picture);
        $user->setProfilePic($picture);
        $user->addListProfilePic($picture); 
        $this->get('fos_user.user_manager')->updateUser($user, false);  //update user collection in db
        $dm->flush();
        return $picture;
    }
    
    /**
     * Create an cropped for image
     * @param Image $picture
     * @param String $cropped_data
     * @return string
     */
    protected function createCroppedImage(Image $picture, $cropped_data)
    {
        $datas = [];
        if (!defined ('UPLOAD_DIR')) { //UPLOAD_DIR constant isn't defined define one
            define('UPLOAD_DIR', $picture->getUploadDir());
        }        
        $img                = str_replace('data:image/png;base64,', '', $cropped_data);
        $img                = str_replace('', '+', $img);
        $data               = base64_decode($img);                   //decode data
        $path               = md5(uniqid()).'.'.'jpg';               //path to store in data
        $file               = UPLOAD_DIR.'/'.$path;
        $datas['success']   = file_put_contents($file, $data);
        $datas['path']      = $path;
        return $datas;
    }
    
    /**
     * Create new image
     * @param Image $picture
     * @param String $files
     * @return string
     */
    protected function createImage(Image $picture, $files)
    {
        $datas = [];
        define('UPLOAD_DIR', $picture->getUploadDir());
        foreach($files as $file){
            if (($file instanceof UploadedFile) && ($file->getError() == '0') && ($file->getSize() < 2000000000) ) {
                    $originalName = $file->getClientOriginalName();         //original name
                    $name_array = explode('.', $originalName);              //explode the $originalName String
                    $file_type = $name_array[sizeof($name_array) - 1];      //get extension of file by sizeof function
                    $valid_filetypes = array('jpg', 'jpeg', 'bmp', 'png');  //declared the valid types

                    if (in_array(strtolower($file_type), $valid_filetypes)){
                        $path = md5(uniqid()).'.'.$file->guessExtension();
                        $file->move(UPLOAD_DIR, $path);  //move file
                        $datas['success']   = true;
                        $datas['path']      = $path;
                        unset($file);                                               //unset file
                    }else{
                      $status = 'failed'; $message = 'Invalid File Type';
                    }
            }else{
                $status = 'failed';  $message = 'File Error';
            }
        }
        return $datas;
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
