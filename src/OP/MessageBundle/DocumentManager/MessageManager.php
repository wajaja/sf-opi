<?php

namespace OP\MessageBundle\DocumentManager;

use OP\MessageBundle\Model\{ ParticipantInterface};
use OP\MediaBundle\Document\Image,
    Doctrine\ODM\MongoDB\DocumentManager,
    OP\UserBundle\Security\UserProvider,
    Symfony\Component\HttpFoundation\RequestStack,
    Symfony\Component\HttpFoundation\File\UploadedFile,
    OP\MessageBundle\DataTransformer\ObjectToArrayTransformer,
    OP\MessageBundle\ModelManager\MessageManager as BaseMessageManager;

/**
 * Default MongoDB MessageManager.
 */
class MessageManager extends BaseMessageManager
{
    protected $dm, $repository, $class, $metaClass, $uploader,
              $request, $orphan_video, $userProvider, $transformer;


    /**
     * Constructor.
     *
     * @param DocumentManager $dm
     * @param string          $class
     * @param string          $metaClass
     */
    public function __construct(DocumentManager $dm, $class, $metaClass, $uploader, 
                                $orphan_video, UserProvider $userProvider, RequestStack $request, ObjectToArrayTransformer $transformer)
    {
        $this->dm           = $dm;
        $this->repository   = $dm->getRepository($class);
        $this->class        = $dm->getClassMetadata($class)->name;
        $this->metaClass    = $dm->getClassMetadata($metaClass)->name;
        $this->uploader     = $uploader;
        $this->orphan_video = $orphan_video;
        $this->userProvider = $userProvider;
        $this->request      = $request->getCurrentRequest();
        $this->transformer    = $transformer;
    }

    protected function publishImages($imagesIds){
        $repo = $this ->dm->getRepository('OP\MediaBundle\Document\Image');

        foreach ($imagesIds as $id) {
            $image = $repo->findOneBy(array('id' => $id));
            if($image)
                $image->setPublished(true);
        }
    }

    /**
     * Tells how many unread, non-spam, messages this participant has
     *
     * @param ParticipantInterface $participant
     * @return int the number of unread messages
     */
    public function getLastMessage($threadId)
    {
        return $this->repository->createQueryBuilder()
            ->field('thread.$id')->equals(new \MongoId($threadId))
            ->sort('createdAt', 'desc')
            ->limit(1)
            ->getQuery()
            ->execute();
    }

    /**
    * Function getXhrImagesIds
    * Move the uploaded file
    * return Array Doctrine Ids
    */
    public function getXhrImagesIds($galleryId){  
        $manager = $this->uploader->get('gallerymessage');
        $files   = $manager->getFiles();
        $session = $this->request->getSession();
        $uploadedFiles = $session->get($galleryId);
        //list of persisted images ids
        $imagesIds = array_values((array)$session->get('_'.$galleryId)); 
        
        if (is_array($uploadedFiles) || is_object($uploadedFiles)) {
            foreach ($uploadedFiles as $filename => $originalName) {
                $files->files()->name($filename);
            }
        }

        foreach($files as $file){            
            unset($file);
        }
        $files = $manager->uploadFiles(iterator_to_array($files));
        $this->publishImages($imagesIds);      //set publish to true for each image
        $session->set('_'.$galleryId, []);  //remove images ids in session
        return $imagesIds;
    }

    public function getXhrDocsIds($galleryId){  
        $manager = $this->uploader->get('gallerymsgdoc');
        $files   = $manager->getFiles();
        $session = $this->request->getSession();
        $uploadedFiles = $session->get($galleryId);
        $docIds = $session->get('_'.$galleryId); //list of persisted images ids

        if (is_array($uploadedFiles) || is_object($uploadedFiles)) {
            foreach ($uploadedFiles as $originalName => $filename) {
                $files->files()->name($filename);
            }
        }

        foreach($files as $file){            
            unset($file);
        }
        $files = $manager->uploadFiles(iterator_to_array($files));

        $session->set('_'.$galleryId, []);  //remove images ids in database
        return gettype($docIds) === 'array' ? $docIds : [];
    }
    
    private function addXhrVideo(Post $post){
        $all            = $this->request->request->all();
        $uploadedFiles  = $this->orphan_video->getPostFiles();           
        
        $data = json_decode($this->request->getContent(), true);
        
        $videoName      =   !$this->request->getFormat('application/json') ? 
                            $all['post']['videoName']: $data['videoName'];

        $valid_filetypes = array('wav', 'webm', 'ogg', 'mp4'); 
        foreach($uploadedFiles as $uploadedFile){
            $name_array = explode('.', $uploadedFile->getFilename());                                 
            $file_type  = $name_array[sizeof($name_array) - 1];

            if (in_array(strtolower($file_type), $valid_filetypes)){
                $video = new Video();
                $video->setName($videoName)
                      ->setSize($uploadedFile->getSize())
                      ->setPath($uploadedFile->getFilename())
                      ->setAuthor($this->getAuthenticatedUser());

                $this->dm->persist($video);
                $post->addVideo($video);
                unset($uploadedFile);
            }
        }
        $uploadedFiles = $this->orphan_video->uploadFiles('post');
    }
    
    private function addImage(Post $post){    
        $images_arr = $post->getImages()->toArray();
        $files = $post->getFiles();     //get the uploaded Files by the request        
        foreach($files as $file){                
            if (($file instanceof UploadedFile) && ($file->getError() == 0)) { 
                $images_arr [] = $this->uploadImage($file, $galleryDir);
            }else{
                $status = 'failed';  $message = 'File Error';
            }
        }
        $post->setImages($images_arr); 
        return $post;
    }
    
     protected function uploadImage($file, $galleryDir){
        $image = new Image();
        if (($file->getSize() < 200000000)) {     
            $name_array = explode('.', $file->getClientOriginalName());     //original name and explode the $originalName String
            $file_type = $name_array[sizeof($name_array) - 1];              //get extension of file by sizeof function
            $valid_filetypes = array('jpg', 'jpeg', 'bmp', 'png');          //declared the valid types
            if(in_array(strtolower($file_type), $valid_filetypes)){
                $image->setPath(md5(uniqid()).'.'.$file->guessExtension());
                $image->setSize($file->getSize());
                //$image->setName($file->getClientOriginalName());
                $image->setDirectory($galleryDir);
                $file->move($image->getPostUploadRootDir(), $image->path);
                unset($file);
                return $image; 
            }else{
                $status = 'failed'; $message = 'Invalid File Type';
            }
        }else{
            $status = 'failed'; $message = 'Size exceeds limit';
        }
    }
    
    private function removeImage(Post $post, $galleryDir){
        $files_str = $this->request->query->get('removedFilenames');
        $files_arr = explode(',', $files_str);
        $images = $post->getImages();
        foreach($images as $image) {
            if(in_array($image->getPath(), $files_arr)){
                $post->removeImage($image);
            }            
        }    
        return $post;
    }

    /**
     * Returns the fully qualified comment thread class name
     *
     * @return string
     */
    public function getClass()
    {
        return $this->class;
    }

    /**
     * Creates a new MessageMetadata instance
     *
     * @return MessageMetadata
     */
    protected function createMessageMetadata()
    {
        return new $this->metaClass();
    }



    /**
     * Gets the current authenticated user
     * @see::OPMEssageBundle participantprovider
     * @return ParticipantInterface
     */
    protected function getAuthenticatedUser()
    {
        return $this->userProvider->getHydratedUser();
    }
}
