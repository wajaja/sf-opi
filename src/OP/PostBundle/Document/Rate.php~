<?php

namespace OP\PostBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * OP\PostBundle\Document\Plike
 *
 * @ODM\Document(
 *      db="opinion",
 *      collection="rates",
 *     repositoryClass="OP\PostBundle\Repository\RateRepository",
 * indexes={
 *          @ODM\index(keys={"post.$id"="desc"}),
 *          @ODM\index(keys={"author.$id"="desc"}),
 *          @ODM\index(keys={"refValid"="asc"}),
 *       },
 *         requireIndexes=true
 * )
 */
class Rate
{
    /**
     * @var MongoId $id
     *
     * @ODM\Id(strategy="AUTO")
     */
    protected $id;
    
    /**
     * 
     * @ODM\Field(name="refValid", type="string")
     * 
     * @Assert\NotBlank()
     */
    protected $refValid;

    /**
     * 
     * @ODM\Field(name="type", type="string")
     * 
     * @Assert\NotBlank()
     */
    protected $type;
    
    /**
     * 
     * @ODM\Field(name="rate", type="int")
     * 
     */
    protected $rate;
    
    /**
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\Post")
     */
    protected $post;
    
    /**
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\Comment")
     */
    protected $comment;

    /**
     * @ODM\ReferenceOne(targetDocument="OP\MediaBundle\Document\Image")
     */
    protected $photo;
    
    /**
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\RightComment")
     */
    protected $rightComment;
    
    /**
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\LeftComment")
     */
    protected $leftComment;

    /**
     * @ODM\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $author;
    
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
     * Set rate
     *
     * @param boolean $rate
     */
    public function setRate($rate)
    {
        $this->rate = $rate;
        return $this;
    }

    /**
     * Get rate
     *
     * @return boolean $rate
     */
    public function getRate()
    {
        return $this->rate;
    }

    /**
     * Set status
     *
     * @param boolean $status
     * @return self
     */
    public function setStatus($status)
    {
        $this->status = $status;
        return $this;
    }

    /**
     * Get status
     *
     * @return boolean $status
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Set imageId
     *
     * @param OP\MediaBundle\Image $imageId
     * @return self
     */
    public function setImageId(\OP\MediaBundle\Document\Image $imageId)
    {
        $this->imageId = $imageId;
        return $this;
    }

    /**
     * Get imageId
     *
     * @return OP\MediaBundle\Image $imageId
     */
    public function getImageId()
    {
        return $this->imageId;
    }

    /**
     * Set post
     *
     * @param OP\PostBundle\Document\Post $post
     * @return self
     */
    public function setPost(\OP\PostBundle\Document\Post $post)
    {
        $this->post = $post;
        return $this;
    }

    /**
     * Get post
     *
     * @return OP\PostBundle\Document\Post $post
     */
    public function getPost()
    {
        return $this->post;
    }

    /**
     * Set comment
     *
     * @param OP\PostBundle\Document\Comment $comment
     * @return self
     */
    public function setComment(\OP\PostBundle\Document\Comment $comment)
    {
        $this->comment = $comment;
        return $this;
    }

    /**
     * Get comment
     *
     * @return OP\PostBundle\Document\Comment $comment
     */
    public function getComment()
    {
        return $this->comment;
    }

    /**
     * Set image
     *
     * @param OP\MediaBundle\Document\Image $image
     * @return self
     */
    public function setImage(\OP\MediaBundle\Document\Image $image)
    {
        $this->image = $image;
        return $this;
    }

    /**
     * Get image
     *
     * @return OP\MediaBundle\Document\Image $image
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * Set rightcomment
     *
     * @param OP\PostBundle\Document\RightComment $rightcomment
     * @return self
     */
    public function setRightcomment(\OP\PostBundle\Document\RightComment $rightcomment)
    {
        $this->rightcomment = $rightcomment;
        return $this;
    }

    /**
     * Get rightcomment
     *
     * @return OP\PostBundle\Document\RightComment $rightcomment
     */
    public function getRightcomment()
    {
        return $this->rightcomment;
    }

    /**
     * Set leftcomment
     *
     * @param OP\PostBundle\Document\LeftComment $leftcomment
     * @return self
     */
    public function setLeftcomment(\OP\PostBundle\Document\LeftComment $leftcomment)
    {
        $this->leftcomment = $leftcomment;
        return $this;
    }

    /**
     * Get leftcomment
     *
     * @return OP\PostBundle\Document\LeftComment $leftcomment
     */
    public function getLeftcomment()
    {
        return $this->leftcomment;
    }

    /**
     * Set refValid
     *
     * @param string $refValid
     * @return self
     */
    public function setRefValid($refValid)
    {
        $this->refValid = $refValid;
        return $this;
    }

    /**
     * Get refValid
     *
     * @return string $refValid
     */
    public function getRefValid()
    {
        return $this->refValid;
    }

    /**
     * Set type
     *
     * @param string $type
     * @return self
     */
    public function setType($type)
    {
        $this->type = $type;
        return $this;
    }

    /**
     * Get type
     *
     * @return string $type
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Set photo
     *
     * @param OP\MediaBundle\Document\Image $photo
     * @return $this
     */
    public function setPhoto(\OP\MediaBundle\Document\Image $photo)
    {
        $this->photo = $photo;
        return $this;
    }

    /**
     * Get photo
     *
     * @return OP\MediaBundle\Document\Image $photo
     */
    public function getPhoto()
    {
        return $this->photo;
    }
}
