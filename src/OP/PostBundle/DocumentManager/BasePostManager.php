<?php
namespace OP\PostBundle\DocumentManager;

use OP\PostBundle\Document\Post,
    OP\MediaBundle\Document\Image,
    OP\MediaBundle\Document\Video,
    Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 */
class BasePostManager extends AbstractManager
{
    /**
     * @param Post $post
     * @param Boolean $andFlush Whether to flush the changes (default true)
     */
    public function savePost(Post $post, $galleryDir)
    {
        $req    = $this->request;
        $all    = $req->request->all();       
        $data    = json_decode($req->getContent(), true);        
        $content = $all['post']['content'] ?? $data['content'];
        $place   = $all['post']['place'] ?? $data['place'];

        $cardId = $req->get('cardId');  //meetYou card design

        if($cardId && strlen($cardId) === 24) {
            $post->setCardId($cardId);
            $this->dm->persist($post);
            $this->dm->flush();
            return;
        } else {
            $post->setContent($this->buildHTML($content));
            $post->setPlace($place);
            $post->doKeywords($content);
        }

        $this->dm->persist($post);

        if(null !== $req->get('refer')){
            $post   = $this->setReference($post, $req); // for allies
        } else {
            //todo more control before image processing
            $post   = $this->addXhrImage($post, $galleryDir);
            $this->addXhrVideo($post);          //add video if exist
        }

        $this->dm->flush();
    }

    protected function setReference($post, $req) {
        $refer      = $req->get('refer');
        $postId     = $req->get('postId');
        $refPost    = $this->dm->getRepository('OPPostBundle:Post')->find($postId);
        if (!$refPost) return;
            
        $post->setIsMainPost(false);
        $post->setMainAllie($refPost);

        if($refer === 'opinion') {
            $nbAllies = $refPost->getNbAllies() ?? 0;
            $post->setOpinionOrder($nbAllies + 1);
            $refPost->setNbAllies($nbAllies + 1);
            $refPost->setNbAllies($nbAllies + 1);
            $refPost->doAlliesIds($post->getId(), 'push');
        }
        
        return $this->addXhrImagesAllie($refPost, $post, 'galleryaddpost');
    }

    protected function addXhrImagesAllie($refPost, $post, $galleryDir) {
        $manager = $this->uploader->get($galleryDir);
        $files   = $manager->getFiles();
        $session = $this->request->getSession();
        $imagesIds = [];
        $galleryDirId = 'galleryaddpost';

        if($galleryDir === 'galleryaddpost') {
            $galleryDirId = 'galleryaddpost'.'_'.$refPost->getId();
            if ($session->has($galleryDirId)) {
                $uploadedFiles = $session->get($galleryDirId);
                if (is_array($uploadedFiles) || is_object($uploadedFiles)) {
                    foreach ($uploadedFiles as $originalName => $filename) {
                        $files->files()->name($filename);
                    }
                }
            }
        } else if($galleryDir === 'galleryaddpost') {
            $galleryDirId = 'gallerypostedit'.'_'.$post->getId();
            if ($session->has($galleryDirId)) {
                $uploadedFiles = $session->get($galleryDirId);
                if (is_array($uploadedFiles) || is_object($uploadedFiles)) {
                    foreach ($uploadedFiles as $originalName => $filename) {
                        $files->files()->name($filename);
                    }
                }
            }
        }

        foreach($files as $file){
            unset($file);
        }
        $files = $manager->uploadFiles(iterator_to_array($files));
        $post->addImagesIds($imagesIds);
        $session->set('_'.$galleryDirId, []);  //remove images ids in database

        return $post;
    }

    private function addXhrImage(Post $post, $galleryDir){  
        $manager = $this->uploader->get($galleryDir);
        $files   = $manager->getFiles();
        $session = $this->request->getSession();
        $galleryDirId = 'gallerypost';
        $imagesIds = [];

        if($galleryDir === 'gallerypostedit') {
            $galleryDirId = 'gallerypostedit'.'_'.$post->getId();
            if ($session->has($galleryDirId)) {
                $uploadedFiles = $session->get($galleryDirId);
                $imagesIds = array_values((array)$session->get('_'.$galleryDirId));
                if (is_array($uploadedFiles) || is_object($uploadedFiles)) {
                    foreach ($uploadedFiles as $filename => $originalName) {
                        $files->files()->name($filename);
                    }
                }
            }
        }

        else if($galleryDir === 'gallerypost') {
            $galleryDirId = 'gallerypost'.'_'.$post->getUnique();  //
            $uploadedFiles = $session->get($galleryDirId);
            //list of persisted images ids
            $imagesIds = array_values((array)$session->get('_'.$galleryDirId)); 
            if (is_array($uploadedFiles) || is_object($uploadedFiles)) {
                foreach ($uploadedFiles as $filename => $originalName) {
                    $files->files()->name($filename);
                }
            }
        } 

        foreach($files as $file){            
            unset($file);
        }
        $files = $manager->uploadFiles(iterator_to_array($files));
        $post->addImagesIds($imagesIds);        //add images references to post
        $this->publishImages($imagesIds);      //set publish to true for each image
        $session->set('_'.$galleryDirId, []);  //remove images ids in session
        return $post;
    }
    
    private function addXhrVideo(Post $post){
        $all            = $this->request->request->all();
        $uploadedFiles  = $this->orphan_video->getPostFiles();           
        
        $data = json_decode($this->request->getContent(), true);
        
        $videoName      =   $all['post']['videoName'] ?? $data['videoName'];

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
     * This is not participant deletion but real deletion
     * @param Post $post the  to delete
     */
    public function deletePost(Post $post)
    {
        $this->dm->remove($post);
        $this->dm->flush();
    }

    /**
     * This is not participant deletion but real deletion
     * @param Post $post the  to delete
     */
    public function updatePost(Post $post, $galleryDir)
    {
        $this->request->getSession()->start();
        $contents   = $this->request->request->all();       
        $data       = json_decode($this->request->getContent(), true);        
        $content    =   !$this->request->getFormat('application/json') ? 
                            $contents['post']['content']: $data['content'];

        $post->setContent($content);

        $post = $this->addXhrImage($post, 'gallerypostedit');    
        $post = $this->removeImage($post, 'gallerypostedit');
        $post = $this->addImage($post, 'gallerypostedit');
         
        $this->dm->flush($post);
    }
}
