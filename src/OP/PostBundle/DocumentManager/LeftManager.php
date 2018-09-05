<?php
namespace OP\PostBundle\DocumentManager;

use OP\MediaBundle\Document\Image,
    OP\PostBundle\Document\LeftComment,
    Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 */
class LeftManager extends AbstractManager
{
    /**
     * @param Comment $comment
     * @param Boolean $andFlush Whether to flush the changes (default true)
     */    
    public function saveComment(LeftComment $comment)
    {
        $this->request->getSession()->start();
        $postId = $this->request->get('postId');

        $post = $this->dm->getRepository('OPPostBundle:Post')->find($postId);

        if (!$post) return; //$response->setData(array('post'=>null));

        $contents   = $this->request->request->all();       
        $data       = json_decode($this->request->getContent(), true);        
        $content    =   !$this->request->getFormat('application/json') ? 
                            $contents['left']['content']: $data['content'];

        $comment->setPost($post);
        $comment->setContent($this->buildHTML($content));
        $comment->doKeywords($content);
        $comment->setPostValid($post->getId());  //set the value
        $comment->setOpinionOrder($post->getOpinionOrder());
        $comment->setOrder($post->getNbLeftComments() + 1);

        //add image(s) to post if exist
        $comment = $this->addXhrImage($comment, 'galleryleft');
        // $comment = $this->addImage($comment);

        $post->incrementLeftComments();
        $this->dm->persist($comment);
        $this->dm->flush();
    }

    private function addXhrImage(LeftComment $comment, $galleryDir){  
        $manager = $this->uploader->get($galleryDir);
        $session = $this->request->getSession();
        $files   = $manager->getFiles();
        $postId  = $this->request->get('postId');
        $imagesIds = [];
        //unsure the array of uploaded files in session
        //$uploadedFiles = ['CIMG3886.JPG'=>'74c9fcb21e05212032adbd56199a97ba.jpeg'];
        if($galleryDir === 'galleryleftedit') {
            $galleryDirId = 'galleryleftedit'.'_'.$comment->getId();

            if ($session->has($galleryDirId)) {
                $uploadedFiles = $session->get($galleryDirId);
                $imagesIds      = array_values((array)$session->get('_'.$galleryDirId));
                foreach ($uploadedFiles as $filename => $originalName) {
                    $files->files()->name($filename);
                }
            }
        }

        else if($galleryDir === 'galleryleft') {
            $uploadedFiles  = $session->get($galleryDir);
            $galleryDirId   = 'galleryleft'.'_'.$postId;

            if ($session->has($galleryDirId)) {
                $uploadedFiles = $session->get($galleryDirId);
                $imagesIds      = array_values((array)$session->get('_'.$galleryDirId));
                foreach ($uploadedFiles as $filename => $originalName) {
                    $files->files()->name($filename);
                }
            }
        }

        $files = $manager->uploadFiles(iterator_to_array($files));
        $comment->addImagesIds($imagesIds);
        $this->publishImages($imagesIds);      //set publish to true for each image
        $session->set('_'.$galleryDirId, []);  //remove images ids in database

        return $comment;
    }
    
    /**
     * add images_array to comment
     * @param Comment $comment
     * @return Comment
     */
    public function addImage(LeftComment $comment){
        $images_arr = $comment->getImages()->toArray();            
        $files = $comment->getFiles();
        foreach ($files as $file){
            if (($file instanceof UploadedFile) && ($file->getError() == 0)) {               
                $images_arr [] = $this->uploadImage($file);
            }else{
                $status = 'failed';  $message = 'File Error';
            }
        }
        $comment->setImages($images_arr);
        return $comment;
    }
    
    /**
     * 
     * @param type $file
     * @return Image
     */
    protected function uploadImage($file){
        $image = new Image();
        if (($file->getSize() < 200000000)) {     
            $name_array = explode('.', $file->getClientOriginalName());     //original name and explode the $originalName String
            $file_type = $name_array[sizeof($name_array) - 1];              //get extension of file by sizeof function
            $valid_filetypes = array('jpg', 'jpeg', 'bmp', 'png');          //declared the valid types

            if(in_array(strtolower($file_type), $valid_filetypes)){
                $image->setPath(md5(uniqid()).'.'.$file->guessExtension());
                $image->setSize($file->getSize());
                $image->setName($file->getClientOriginalName());
                $image->setDirectory('gallery');
                $file->move($image->getUploadRootDir(), $image->path);      //move file                                                             //add the file to comment
                unset($file);                                               //unset file
                return $image; 
            }else{
                $status = 'failed'; $message = 'Invalid File Type';
            }
        }else{
            $status = 'failed'; $message = 'Size exceeds limit';
        }
    }

    /**
     * 
     * @param Comment $comment
     * @return Comment
     */
    private function removeImage(RightComment $comment){
        $files_str = $this->request->query->get('removedFilenames');
        $files_arr = explode(',', $files_str);
        $images = $comment->getImages();
        foreach($images as $image) {
            if(in_array($image->getPath(), $files_arr)){
                $comment->removeImage($image);
            }            
        }    
        return $comment;
    }

    /**
     * This is not participant deletion but real deletion
     * @param Comment $comment the  to delete
     */
    public function deleteComment(LeftComment $comment)
    {
        $this->request->getSession()->start();
        $this->dm->remove($comment);
        $comment->getPost()->decrementLeftComments();
        $this->dm->flush();
    }

    /**
     * This is not participant deletion but real deletion
     * @param Comment $comment the  to delete
     */
    public function updateComment(LeftComment $comment)
    {
        $this->request->getSession()->start();

        $contents   = $this->request->request->all();       
        $data       = json_decode($this->request->getContent(), true);        
        $content    =   !$this->request->getFormat('application/json') ? 
                            $contents['left']['content']: $data['content'];

        // $comment->setPost($post);
        $comment->setContent($content);
        $refId = $comment->getPost()->getId();
        $comment->setPostValid($refId);  //set the value
        $comment = $this->addXhrImage($comment, 'galleryleftedit');
        $comment = $this->removeImage($comment);
        // $comment = $this->addImage($comment);
//        $comment->setUpdateAt(new \DateTime(null, new \DateTimeZone("UTC")));
        $this->dm->flush();
    }
}
