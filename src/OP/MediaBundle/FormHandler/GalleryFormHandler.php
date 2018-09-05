<?php
namespace OP\MediaBundle\FormHandler;

class GalleryFormHandler extends AbstractGalleryFormHandler
{
    /**
     * Composes a opinion from the form data
     *
     * @param AbstractPost $post
     * @return PostInterface the composed opinion ready to be sent
     * @throws InvalidArgumentException if the opinion is not a NewThreadPost
     */
    public function composePost(\OP\PostBundle\Document\Post $post, $update)
    {
        if (!$post instanceof \OP\PostBundle\Document\Post) {
            throw new \InvalidArgumentException(sprintf('Post must be a NewThreadPost instance, "%s" given', get_class($post)));
        }
        if($update){
            $document = $post
                        ->setType($post->getTitle())
                        ->setTitle($post->getTitle()== null ?'': $post->getTitle())
                        ->setUpdateAt(new \DateTime())
                        ->setAuthor($this->getAuthentificatedUser());
        return $document;
        }        
            $document =  $this->composer->newPost()
                        ->setType($post->getTitle())
                        ->setCreatedAt(new \DateTime())
                        ->setTitle($post->getTitle()== null ?'': $post->getTitle())
                        ->setAuthor($this->getAuthentificatedUser());
        return $document;
    }

}
