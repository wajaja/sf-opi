<?php
namespace OP\PostBundle\DocumentManager;

use OP\MediaBundle\Document\Image,
    OP\PostBundle\Document\UnderComment,
    Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 */
class UnderCommentManager extends AbstractManager
{

    /**
     * @param UnderComment $underComment
     * @param Boolean $andFlush Whether to flush the changes (default true)
     */    
    public function saveUnderComment(UnderComment $underComment)
    {
        $this->request->getSession()->start();

        $commentId    = $this->request->get('commentId');
        $comment      = $this->dm->getRepository('OPPostBundle:Comment')->find($commentId);
        if (!$comment) return; //$response->setData(array('post'=>null));

        $contents   = $this->request->request->all();       
        $data       = json_decode($this->request->getContent(), true);        
        $content    =   !$this->request->getFormat('application/json') ? 
                            $contents['undercomment']['content']: $data['content'];

        $underComment->setComment($comment);
        $underComment->setContent($this->buildHTML($content));
        $underComment->doKeywords($content);
        $underComment->setCommentValid($comment->getId());  //set the value

        //add image(s) to post if exist
        $undercomment = $this->addXhrImage($underComment, 'galleryundercomment');
        $underComment = $this->addImage($underComment);

        $comment->incrementUnders();
        $this->dm->persist($underComment);
        $this->dm->flush();
    }
    
    /**
     * @param \OP\PostBundle\DocumentManager\Comment $comment
     * @return \OP\PostBundle\DocumentManager\Comment
     */
    private function removeImage(UnderComment $comment){
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
    * Function addXhrImage 
    *@param UnderComment $underComment
    *@param String $galleryDir
    *
    */
    private function addXhrImage(UnderComment $comment, $galleryDir){  
        $manager = $this->uploader->get($galleryDir);
        $session = $this->request->getSession();
        $files   = $manager->getFiles();
        $imagesIds = [];
        $commentId = $this->request->get('commentId');
        //unsure the array of uploaded files in session
        //$uploadedFiles = ['CIMG3886.JPG'=>'74c9fcb21e05212032adbd56199a97ba.jpeg'];
        if($galleryDir === 'galleryundercommentedit') {
            $galleryDirId = 'galleryundercommentedit'.'_'.$comment->getId();
            if ($session->has($galleryDirId)) {
                $uploadedFiles = $session->get($galleryDirId);
                $imagesIds      = array_values((array)$session->get('_'.$galleryDirId));
                foreach ($uploadedFiles as $filename => $originalName) {
                    $files->files()->name($filename);
                }
            }
        }

        else if($galleryDir === 'galleryundercomment') {
            $uploadedFiles = $this->request->getSession()->get($galleryDir);
            $galleryDirId = 'galleryundercomment'.'_'.$commentId;
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
     * function to add image in image_array 
     * @param UnderComment $undercomment
     * @return UnderComment
     */
    public function addImage(UnderComment $undercomment){
        $images_arr = $undercomment->getImages()->toArray();            
        $originalFiles = $this->request->files;     //get the uploaded Files by the request
        foreach($originalFiles as $files){
            foreach ($files as $file){
                if (($file instanceof UploadedFile) && ($file->getError() == 0)) {               
                    $images_arr [] = $this->uploadImage($file);
                }else{
                    $status = 'failed';  $message = 'File Error';
                }
            }
            $undercomment->setImages($images_arr);
        }
        return $undercomment;
    }
    
    /**
     * for each file set the value image object
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
     * This is not participant deletion but real deletion
     * @param UnderComment $underComment the  to delete
     */
    public function deleteUnderComment(UnderComment $underComment)
    {
        $comment = $underComment->getComment();
        $comment->decrementUnders();
        $this->dm->remove($underComment);
        $this->dm->flush();
    }

    /**
     * This is not participant deletion but real deletion
     * @param UnderComment $underComment the  to delete
     */
    public function updateUnderComment(UnderComment $underComment)
    {
        $this->request->getSession()->start();

        $contents   = $this->request->request->all();       
        $data       = json_decode($this->request->getContent(), true);        
        $content    =   !$this->request->getFormat('application/json') ? 
                            $contents['undercomment']['content']: $data['content'];

        $underComment->setContent($content);
        $underComment->setCommentValid($underComment->getComment()->getId());  //set the value

        //add image(s) to post if exist
        $undercomment = $this->addXhrImage($underComment, 'galleryundercommentedit');

        $underComment = $this->removeImage($underComment);
        $underComment = $this->addImage($underComment);
        $this->dm->flush();
    }
}