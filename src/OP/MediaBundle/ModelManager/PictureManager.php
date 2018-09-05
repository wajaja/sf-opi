<?php

namespace OP\MediaBundle\ModelManager;

use FOS\UserBundle\FOSUserEvents,
    OP\UserBundle\Document\User,
    OP\UserBundle\Document\Group,
    OP\MediaBundle\Document\Image,
    FOS\UserBundle\Event\FormEvent,
    OP\MediaBundle\Document\FriendTag,
    OP\MediaBundle\Document\EveryWhere,
    Doctrine\ODM\MongoDB\DocumentManager as Manager,
    Symfony\Component\HttpFoundation\Request,
    FOS\UserBundle\Event\GetResponseUserEvent,
    FOS\RestBundle\Controller\FOSRestController,
    FOS\UserBundle\Event\FilterUserResponseEvent,
    FOS\RestBundle\Routing\ClassResourceInterface,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Component\HttpFoundation\File\UploadedFile,
    Symfony\Component\Security\Core\Exception\AccessDeniedException,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;

/**
* 
*/
abstract class PictureManager
{

	/**
     * Add New Cover
     * @param Image $picture
     * @param String $path
     * @param String $crop_path
     * @return Image
     */
    public function addNewCover(User $user, Image $picture, $crop_path)
    {
        if($crop_path) 
            $picture->setCropPath($crop_path);
        $picture->setWebPath(null);
        $picture->setAuthor($user);
        $this->dm->persist($picture);
        $user->setCoverPic($picture);
        $this->user_manager->updateUser($user, false);
        $this->dm->flush();
        return $picture;
    }
    
    /**
     * Update Cover picture
     * @param Image $picture
     * @param String $crop_path
     * @return Image
     */
    public function updateCover(User $user, Image $picture, $crop_path)
    {
        $date   = new \Datetime();
        $picture->setCropPath($crop_path);
        $picture->setWebPath(null);
        $picture->setUpdateAt($date);
        $this->dm->persist($picture);
        $user->setCoverPic($picture);
        $this->user_manager->updateUser($user, false);
        $this->dm->flush();
        return $picture;
    }
    
    /**
     * Update an exist image
     * @param Image $picture
     * @param String $crop_path
     * @return Image
     */
    public function updatePicture(User $user, Image $picture, $crop_path)
    {
        $date   = new \Datetime();
        $picture->setCropPath($crop_path);
        $picture->setWebPath(null);
        $picture->setUpdateAt($date);
        $user->setProfilePic($picture);
        $user->addListProfilePic($picture); 
        $this->user_manager->updateUser($user, false); 
        $this->dm->flush();
        return $picture;
    }

    /**
     * Update an exist image
     * @param Image $picture
     * @param String $crop_path
     * @return Image
     */
    public function addFriendTag(User $user, Image $picture, $data)
    {
        $tag = $this->setFriendTag($data);
        $this->dm->persist($tag);
        $picture->addFriendTag($tag);
        $this->dm->flush();
        return $tag;
    }

    public function setFriendTag($data, $user) {
        $tag   = new FriendTag();
        $tag->setRectX($data['rect']['x']);
        $tag->setRectY($data['rect']['y']);
        $tag->setScale($data['clientScale']);
        $tag->setRectWidth($data['rect']['width']);
        $tag->setRectHeight($data['rect']['height']);
        $tag->setUser($this->findUserByUsername($data['username']));
        $tag->setCreatedBy($user);

        return $tag;
    }

    protected function findUserByUsername($username) {
        $um = $this->user_manager;
        return $um->findUserByUsername($username); 
    }
    
    /**
     * Create new Picture
     * @param Image $picture
     * @param String $img_path
     * @param String $crop_path
     * @return Image
     */
    public function addNewPicture(User $user, Image $picture, $crop_path)
    {
        if($crop_path) 
        	$picture->setCropPath($crop_path);
        $picture->setWebPath(null);
        $user->setProfilePic($picture);
        $user->addListProfilePic($picture);
        $this->dm->persist($picture);
        $this->user_manager->updateUser($user, false);  //update user collection in db
        $this->dm->flush();
        return $picture;
    }

    /**
     * Create new Picture
     * @param Image $picture
     * @param String $img_path
     * @param String $crop_path
     * @return Image
     */
    public function flushPicture($picture, User $user, $path)
    {
        $picture->setPath($path);
        $picture->setWebPath(null);
        $picture->setAuthor($user);
        $this->dm->persist($picture);
        $this->dm->flush();

        return $picture;
    }
    
    /**
     * Create an cropped for image
     * @param Image $picture
     * @param String $cropped_data
     * @return string
     */
    public function createCroppedImage(Image $pic, $cropped_data)
    {
        define('UPLOAD_DIR_CROP', $pic->getUploadRootDir());   
        $img    = str_replace('data:image/jpeg;base64,', '', $cropped_data);
        $img    = str_replace('', '+', $img);
        $data   = base64_decode($img);
        $path   = md5(uniqid()).'.'.'jpeg';
        $file   = UPLOAD_DIR_CROP.'/'.$path;
        return [
            'success'  => file_put_contents($file, $data),
            'path'     => $path
        ];
    }
    
    /**
     * Create new image
     * @param Image $picture
     * @param String $files
     * @return string
     */
    public function createNewImage(User $user, $files)
    {
    	$picture = new Image();
    	$picture->setDirectory('gallery');
        define('UPLOAD_DIR_PATH', $picture->getUploadRootDir());
        foreach($files as $file) {
            if (($file instanceof UploadedFile) && ($file->getError() == '0') && ($file->getSize() < 2000000000) ) {
                    $originalName 	 = $file->getClientOriginalName();
                    $name_array 	 = explode('.', $originalName);
                    $file_type 		 = $name_array[sizeof($name_array) - 1];
                    $valid_filetypes = array('jpg', 'jpeg', 'bmp', 'png');

                    if (in_array(strtolower($file_type), $valid_filetypes)) {
                        $path 		 = md5(uniqid()).'.'.$file->guessExtension();
                        $file->move(UPLOAD_DIR_PATH, $path);  //move file
                        unset($file);
                        return $this->flushPicture($picture, $user, $path);
                    } else {
                      	return [
	                      	'status' => 'failed',
	                      	'message' => 'Invalid File Type'
                      	];
                    }
            } else {
            	return [
                	'status' => 'failed',
                	'message' => 'File Error'
            	];
            }
        }
        return [
        	'status' => 'failed',
        	'message' => 'No File Error'
    	];
    }

    public function provideDefaultProfile(User $user) {
        $repo  = $this->dm->getRepository('OPMediaBundle:Image');
        //TODO
        if(strtolower($user->getGender()) === 'male')
            $id = 'some value';
        else
            $id = 'other value';

        $image = $repo->findOneBy(array('id'=> '5a4162d5d8d25a18e40028d1'));

        return $image;
    }

    public function provideDefaultAvatar(Group $group) {
        $repo  = $this->dm->getRepository('OPMediaBundle:Image');

        $image = $repo->findOneBy(array('id'=> '5a4162d5d8d25a18e40028d1'));

        return $image;
    }
}