<?php
namespace OP\PostBundle\Model;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Doctrine\Common\Collections\ArrayCollection;


/**
 * @MongoDB\MappedSuperclass
 */
class UnderComment
{

    /**
     * @MongoDB\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $author;

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\PostBundle\Document\Like")
     */
    protected $likes = array();

    /**
     * @MongoDB\ReferenceOne(targetDocument="OP\PostBundle\Document\Comment")
     */
    protected $comment;

    /**
     * @MongoDB\Field(name="commentValid", type="string")
     */
    protected $commentValid;

    /**
     * @var  $notification
     *
     * @MongoDB\ReferenceOne(targetDocument="OP\SocialBundle\Document\Notification")
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
     * Set commentValid
     *
     * @param string $commentValid
     * @return self
     */
    public function setCommentValid($commentValid)
    {
        $this->commentValid = $commentValid;
        return $this;
    }

    /**
     * Get commentValid
     *
     * @return string $commentValid
     */
    public function getCommentValid()
    {
        return $this->commentValid;
    }

    /**
     * Get commentId
     *
     * @return OP\PostBundle\Document\Comment $commentId
     */
    public function getComment()
    {
        return $this->comment;
    }

    /**
     * incrementLikers
     */
    public function incrementLikers()
    {
        $this->nbLikers++;
    }

    /**
     * decrementLikers
     */
    public function decrementLikers()
    {
        $this->nbLikers--;
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
    * @param array Images
    */
    public function setImages(array $images)
    {
        $this->images = $images;
        return $this;
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
}
