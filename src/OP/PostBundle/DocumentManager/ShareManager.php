<?php
namespace OP\PostBundle\DocumentManager;

use OP\PostBundle\Document\Share,
    OP\MediaBundle\Document\Image;

/**
 */
class ShareManager extends AbstractManager
{    
    /**
     * @param Share $pshare
     * @param Boolean $andFlush Whether to flush the changes (default true)
     */
    public function saveShare(Share $share)
    {
        $this->request->getSession()->start();

        $postId = $this->request->get('postId');
        $refer  = $this->request->get('refer');
        if($refer === 'photo') {
            $post = $this->dm->getRepository('OPMediaBundle:Image')->find($postId);
        } else {
            $post = $this->dm->getRepository('OPPostBundle:Post')->find($postId);
        }
        if (!$post) return; //$response->setData(array('post'=>null));

        $contents   = $this->request->request->all();       
        $data       = json_decode($this->request->getContent(), true);        
        $content    = $contents['share']['content'] ?? $data['content'];

        $refer === 'post' ? $share->setPost($post) : $share->setPhoto($post);
        
        $share->setContent($content);
        $share->setPostValid($post->getId());
        //add image(s) to post if exist
        // $share = $this->addXhrImage($share, 'galleryshare');
        // $share = $this->addImage($share);

        $this->dm->persist($share);
        $this->dm->flush();
    }

    public function addImage(Share $pshare){
        $image = $this->image;
        $manager = $this->uploader->get('gallerypshare');
        $uploadedFiles = $manager->getFiles();
        foreach($uploadedFiles as $uploadedFile){
            $image->setPath($uploadedFile->getFilename());
            $image->setSize($uploadedFile->getSize());
            $image->setDirectory('gallerypost');
            $image->setName($uploadedFile->getFilename());
            $pshare->addImage($image);
        }
        $uploadedFiles = $manager->uploadFiles();

        return $pshare;
    }

    /**
     * This is not participant deletion but real deletion
     * @param Share $pshare the  to delete
     */
    public function deleteShare(Share $pshare)
    {
        $this->dm->remove($pshare);
        $this->dm->flush();
    }

    /**
     * This is not participant deletion but real deletion
     * @param Post $post the  to delete
     */
    public function updateShare(Share $share)
    {
        $this->request->getSession()->start();
        $contents   = $this->request->request->all();       
        $data       = json_decode($this->request->getContent(), true);        
        $content    = $contents['share']['content'] ?? $data['content'];

        $share->setContent($content);
        $share->setUpdateAt(new \DateTime(null, new \DateTimeZone("UTC")));
        $this->dm->flush();
    }
}