<?php

namespace OP\PostBundle\Model;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * @MongoDB\MappedSuperclass
 */
class LeftComment
{
    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\MediaBundle\Document\Image", cascade={"remove"})
     */
    protected $images;

    /**
     * @MongoDB\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $author;

    /**
     * @MongoDB\ReferenceOne(targetDocument="OP\PostBundle\Document\Post")
     */
    protected $post;
    
    /**
     * @var  $notification
     *
     * @MongoDB\ReferenceOne(targetDocument="OP\SocialBundle\Document\Notification", cascade={"remove"})
     */
    protected $notification;

    /**
     * @var  $notification
     *
     * @MongoDB\ReferenceOne(targetDocument="OP\SocialBundle\Document\Notification", cascade={"remove"})
     */
    protected $commentNotification;

    /**
     * Adds all messages contents to the keywords property
     */
    public function doKeywords($body)
    {
        $keywords = '';
        if('array' === gettype($body)) {
            $blocks = $body['blocks'];
            foreach ($blocks as $block) {
                $keywords .= ' '.$block['text'];
            }
        } else {
            $keywords .= ' '.strip_tags($body);  //delete all html tag
        }

        // we only need each word once
        $this->keywords = implode(' ', array_unique(str_word_count(mb_strtolower($keywords, 'UTF-8'), 1)));
    }
    
    /**
     * Set author
     *
     * @param OP\UserBundle\Document\User $author
     * @return self
     */
    public function setAuthor(\OP\UserBundle\Document\User $author)
    {
        $this->author = $author;
        return $this;
    }

    /**
     * Get author
     *
     * @return OP\UserBundle\Document\User $author
     */
    public function getAuthor()
    {
        return $this->author;
    }
    
        /**
     * Add image
     *
     * @param OP\MediaBundle\Document\Image $image
     */
    public function addImage(\OP\MediaBundle\Document\Image $image)
    {
        $this->images[] = $image;
    }

    /**
     * Remove image
     *
     * @param OP\MediaBundle\Document\Image $image
     */
    public function removeImage(\OP\MediaBundle\Document\Image $image)
    {
        $this->images->removeElement($image);
    }

    /**
     * Get images
     *
     * @return \Doctrine\Common\Collections\Collection $images
     */
    public function getImages()
    {
        return $this->images;
    }
    
        /**
     * Set notification
     *
     * @param OP\SocialBundle\Document\Notification $notification
     * @return self
     */
    public function setNotification(\OP\SocialBundle\Document\Notification $notification)
    {
        $this->notification = $notification;
        return $this;
    }

    /**
     * Get notification
     *
     * @return OP\SocialBundle\Document\Notification $notification
     */
    public function getNotification()
    {
        return $this->notification;
    }
    
}
