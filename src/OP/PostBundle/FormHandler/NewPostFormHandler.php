<?php
namespace OP\PostBundle\FormHandler;

use OP\PostBundle\Document\Post;

class NewPostFormHandler extends AbstractPostFormHandler
{
    /**
     * Composes a opinion from the form data
     *
     * @param AbstractPost $post
     * @return PostInterface the composed opinion ready to be sent
     * @throws InvalidArgumentException if the opinion is not a NewThreadPost
     */
    public function composePost(Post $post, $update)
    {
        if (!$post instanceof Post) {
            throw new \InvalidArgumentException(sprintf('Post must be a NewThreadPost instance, "%s" given', get_class($post)));
        }
        if($update) return $this->composeUpdatePost($post);

        if($post->getIsMainPost()) {
            $gap = $this->handleGapTime($post);
        } else {
            $gap = new \DateTime(null, new \DateTimeZone("UTC"));
        }
        
        $doc = $this->composer->newPost()
            ->setPublishedAt($gap)
            ->setType($post->getType())
            ->setUnique($post->getUnique())
            ->setConfidence($post->getConfidence())
            ->setAuthor($this->getAuthentificatedUser())
            ->setTimelineId($post->getTimelineId())
            ->setTimelineType($post->getTimelineType())
            ->addParticipants($this->userTransformer->reverseTransform($post->getRecipients()));                

        if($post->getType() === "opinion" && $post->getIsMainPost()) {
            $doc->setOpinionOrder(0)
                ->setIsMainPost(true)
                ->addLeftEditors($this->userTransformer->reverseTransform($post->getLeftEditorTexts()))
                ->addRightEditors($this->userTransformer->reverseTransform($post->getRightEditorTexts()));
        }        

        if("post" === $post->getType() && $post->getIsMainPost()) {
            $doc->setIsMainPost(true)
                ->addEditors($this->userTransformer->reverseTransform($post->getEditorTexts()))
                ;        
        }
        return $doc;
    }

    protected function handleGapTime(Post $post)
    {
        $days = 0;
        $hours = $post->getGapHours();
        $minutes = $post->getGapMinutes();
        $gapTimes = 'P'.$days.'DT'.$hours.'H'.$minutes.'M';
        
        $date = new \Datetime(null, new \DateTimeZone("UTC"));
        $date->format('Y-M-d H:m:s');
        $gap = $date->add(new \DateInterval($gapTimes));

        return $gap;
    }
 
    protected function composeUpdatePost(Post $post)
    {
        $document = $post
            ->setObjectType('post')
            ->setType($post->getType())
            ->setRmvArr($post->getRmvArr())
            ->setConfidence($post->getConfidence())
            ->setAuthor($this->getAuthentificatedUser())            
            ->setUpdateAt(new \DateTime(null, new \DateTimeZone("UTC")));
        
        return $document;
    }

    /**
     * Composes a undercomment from the form data
     *
     * @param Undercomment $undercomment
     */
    public function composeUnderComment(\OP\PostBundle\Document\UnderComment $undercomment, $update)
    {
        if (!$undercomment instanceof \OP\PostBundle\Document\UnderComment) {
            throw new \InvalidArgumentException(sprintf('Post must be a NewThreadPost instance, "%s" given', get_class($opinion)));
        }
        if($update){
            $document =  $undercomment
                        ->setRmvArr($undercomment->getRmvArr())
                        ->setUpdatedAt(new \DateTime(null, new \DateTimeZone("UTC")))
                        ->setAuthor($this->getAuthentificatedUser());
            return $document;
        }
        
        $document =  $this->composer->newUnderComment()
                        ->setAuthor($this->getAuthentificatedUser());
        return $document;
    }

    /**
     * Composes a comment from the form data
     * @param AbstractComment
     */
    public function composeComment(\OP\PostBundle\Document\Comment $comment, $update)
    {
        if (!$comment instanceof \OP\PostBundle\Document\Comment) {
            throw new \InvalidArgumentException(sprintf('Post must be a NewThreadPost instance, "%s" given', get_class($comment)));
        }
        if($update){
            $document =  $comment
                        ->setFiles($comment->getFiles())
                        ->setRmvArr($comment->getRmvArr())
                        ->setUnique($comment->getUnique())
                        ->setUpdateAt(new \DateTime(null, new \DateTimeZone("UTC")))
                        ->setAuthor($this->getAuthentificatedUser())
                        ;
            return $document;
        }
        
                        // echo $dd;
        $document =  $this->composer->newComment()
                        ->setFiles($comment->getFiles())
                        ->setAuthor($this->getAuthentificatedUser());      
        return $document;
    }

    /**
     * Composes a comment from the form data
     * @param AbstractComment
     */
    public function composeLeft(\OP\PostBundle\Document\LeftComment $comment, $update)
    {
        if (!$comment instanceof \OP\PostBundle\Document\LeftComment) {
            throw new \InvalidArgumentException(sprintf('Post must be a NewThreadPost instance, "%s" given', get_class($comment)));
        }
        if($update){
            $document =  $comment
                        ->setRmvArr($comment->getRmvArr())
                        ->setUpdateAt(new \DateTime(null, new \DateTimeZone("UTC")))
                        ->setAuthor($this->getAuthentificatedUser())
                        ;
            return $document;
        }
        
        $document =  $this->composer->newLeftComment()
                        ->setAuthor($this->getAuthentificatedUser());      
        return $document;
    }

     /**
     * Composes a comment from the form data
     * @param AbstractComment
     */
    public function composeRight(\OP\PostBundle\Document\RightComment $comment, $update)
    {
        if (!$comment instanceof \OP\PostBundle\Document\RightComment) {
            throw new \InvalidArgumentException(sprintf('Post must be a NewThreadPost instance, "%s" given', get_class($comment)));
        }
        if($update){
            $document =  $comment
                        ->setRmvArr($comment->getRmvArr())
                        ->setUpdateAt(new \DateTime(null, new \DateTimeZone("UTC")))
                        ->setAuthor($this->getAuthentificatedUser())
                        ;
            return $document;
        }
        
        $document =  $this->composer->newRightComment()
                        ->setAuthor($this->getAuthentificatedUser());      
        return $document;
    }

    /**
     * Composes a comment from the form data
     * @param Abstractplike
     */
    public function composeShare(\OP\PostBundle\Document\Share $share, $update)
    {
        if (!$share instanceof \OP\PostBundle\Document\Share) {
            throw new \InvalidArgumentException(sprintf('Post must be a NewThreadPost instance, "%s" given', get_class($opinion)));
        }
        if($update){
             $document =  $share
                        ->setUpdateAt(new \DateTime(null, new \DateTimeZone("UTC")))
                        ->setAuthor($this->getAuthentificatedUser());
            return $document;
        }
        $document =  $this->composer->newShare()
                        ->setAuthor($this->getAuthentificatedUser());
        return $document;
    }

    /**
     * Composes a comment from the form data
     * @param Abstractplike
     */
    public function composeLike(\OP\PostBundle\Document\Like $like, $update)
    {
        if (!$like instanceof \OP\PostBundle\Document\Like) {
            throw new \InvalidArgumentException(sprintf('Post must be a NewThreadPost instance, "%s" given', get_class($like)));
        }
        
        if($update){
            $document = $like;
        }else{            
            $document =  $this->composer->newLike()
                        ->setAuthor($this->getAuthentificatedUser());
        }
        
        return $document;
    }

    /**
     * Composes a comment from the form data
     * @param Abstractplike
     */
    public function composeRate(\OP\PostBundle\Document\Rate $rate, $update)
    {
        if (!$rate instanceof \OP\PostBundle\Document\Rate) {
            throw new \InvalidArgumentException(sprintf('Post must be a NewThreadPost instance, "%s" given', get_class($rate)));
        }
        
        if($update){
            $document = $rate;
        }else{            
            $document =  $this->composer->newRate()
                        ->setRefValid($rate->getRefValid())
                        ->setRate($rate->getRate())
                        ->setAuthor($this->getAuthentificatedUser());
        }        
        return $document;
    }
}
