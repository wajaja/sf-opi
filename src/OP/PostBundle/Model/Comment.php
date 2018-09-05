<?php

namespace OP\PostBundle\Model;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;


/**
 * @MongoDB\MappedSuperclass
 */
class Comment
{
    /**
     * @MongoDB\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $author;

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\MediaBundle\Document\Image", cascade={"remove"})
     */
    protected $images;

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\PostBundle\Document\Like")
     */
    protected $likes;

    /**
     * @MongoDB\ReferenceOne(targetDocument="OP\PostBundle\Document\Post")
     */
    protected $post;

    /**
     * @MongoDB\ReferenceOne(targetDocument="OP\PostBundle\Document\LeftComment")
     */
    protected $leftComment;

    /**
     * @MongoDB\ReferenceOne(targetDocument="OP\PostBundle\Document\RightComment")
     */
    protected $rightComment;

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\PostBundle\Document\UnderComment", cascade={"remove"})
     */
    protected $underComments = array();

    /**
     * @var  $notification
     *
     * @MongoDB\ReferenceOne(targetDocument="OP\SocialBundle\Document\Notification", cascade={"remove"})
     */
    protected $notification;

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
     * Get id
     *
     * @return id $id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set content
     *
     * @param string $content
     * @return self
     */
    public function setContent($content)
    {
        $this->content = $content;
        return $this;
    }

    /**
     * Get content
     *
     * @return string $content
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * Set createdAt
     *
     * @param date $createdAt
     * @return self
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    /**
     * Get createdAt
     *
     * @return date $createdAt
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Set updateAt
     *
     * @param date $updateAt
     * @return self
     */
    public function setUpdateAt($updateAt)
    {
        $this->updateAt = $updateAt;
        return $this;
    }

    /**
     * Get updateAt
     *
     * @return date $updateAt
     */
    public function getUpdateAt()
    {
        return $this->updateAt;
    }

    /**
     * Set visible
     *
     * @param boolean $visible
     * @return self
     */
    public function setVisible($visible)
    {
        $this->visible = $visible;
        return $this;
    }

    /**
     * Get visible
     *
     * @return boolean $visible
     */
    public function getVisible()
    {
        return $this->visible;
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
     * Get nbLikers
     *
     * @return int $nbLikers
     */
    public function getNbLikers()
    {
        return $this->nbLikers;
    }

    /**
     * Add underComment
     *
     * @param OP\PostBundle\Document\UnderComment $underComment
     */
    public function addUnderComment(\OP\PostBundle\Document\UnderComment $underComment)
    {
        $this->underComments[] = $underComment;
        $this->incrementUnders();
    }

    /**
     * Remove underComment
     *
     * @param OP\PostBundle\Document\UnderComment $underComment
     */
    public function removeUnderComment(\OP\PostBundle\Document\UnderComment $underComment)
    {
        $this->underComments->removeElement($underComment);
        $this->decrementUnders();
    }

    /**
     * Get underComments
     *
     * @return \Doctrine\Common\Collections\Collection $underComments
     */
    public function getUnderComments()
    {
        return $this->underComments;
    }

    /**
     * Set postValid
     *
     * @param string $postVal
     * @return self
     */
    public function setPostValid($postValid)
    {
        $this->postValid = $postValid;
        return $this;
    }

    /**
     * Get postValid
     *
     * @return string $postValid
     */
    public function getPostValid()
    {
        return $this->postValid;
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
    * @param array Images
    */
    public function setImages(array $images)
    {
        $this->images = $images;
        return $this;
    }

    /**
     * Set ts
     *
     * @param timestamp $ts
     * @return $this
     */
    public function setTs($ts)
    {
        $this->ts = $ts;
        return $this;
    }

    /**
     * Get ts
     *
     * @return timestamp $ts
     */
    public function getTs()
    {
        return $this->ts;
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
