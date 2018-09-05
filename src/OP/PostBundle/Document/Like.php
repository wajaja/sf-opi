<?php

namespace OP\PostBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * OP\PostBundle\Document\Like
 *
 * @ODM\Document(
 *      db="opinion",
 *      collection="likes",
 *     repositoryClass="OP\PostBundle\Repository\LikeRepository",
 * indexes={
 *          @ODM\index(keys={"author.$id"="desc"}),
 *          @ODM\index(keys={"refValid"="asc"})
 *       },
 *         requireIndexes=true
 * )
 */
class Like
{
    /**
     * @var MongoId $id
     *
     * @ODM\Id(strategy="AUTO")
     */
    protected $id;
    
    /**
     * @ODM\Field(name="level", type="int")
     * 
     * @var level
     */
    protected $level;
    
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
     * @ODM\Field(name="rate", type="int")
     * 
     * @var rate
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
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\LeftComment")
     */
    protected $leftComment;

    /**
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\RightComment")
     */
    protected $rightComment;

    /**
     * @ODM\ReferenceOne(targetDocument="OP\MediaBundle\Document\Image")
     */
    protected $photo;
    
    /**
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\UnderComment")
     */
    protected $underComment;

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
     * Set level
     *
     * @param int $level
     * @return self
     */
    public function setLevel($level)
    {
        $this->level = $level;
        return $this;
    }

    /**
     * Get level
     *
     * @return int $level
     */
    public function getLevel()
    {
        return $this->level;
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
     * Set rate
     *
     * @param integer $rate
     * @return self
     */
    public function setRate($rate)
    {
        $this->rate = $rate;
        return $this;
    }

    /**
     * Get rate
     *
     * @return integer $rate
     */
    public function getRate()
    {
        return $this->rate;
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
     * Set photo
     *
     * @param OP\MediaBundle\Document\Image $photo
     * @return self
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

    /**
     * Set undercomment
     *
     * @param OP\PostBundle\Document\UnderComment $undercomment
     * @return self
     */
    public function setUndercomment(\OP\PostBundle\Document\UnderComment $undercomment)
    {
        $this->undercomment = $undercomment;
        return $this;
    }

    /**
     * Get undercomment
     *
     * @return OP\PostBundle\Document\UnderComment $undercomment
     */
    public function getUndercomment()
    {
        return $this->undercomment;
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
     * Set leftComment
     *
     * @param OP\PostBundle\Document\LeftComment $leftComment
     * @return self
     */
    public function setLeftComment(\OP\PostBundle\Document\LeftComment $leftComment)
    {
        $this->leftComment = $leftComment;
        return $this;
    }

    /**
     * Get leftComment
     *
     * @return OP\PostBundle\Document\LeftComment $leftComment
     */
    public function getLeftComment()
    {
        return $this->leftComment;
    }

    /**
     * Set rightComment
     *
     * @param OP\PostBundle\Document\RightComment $rightComment
     * @return self
     */
    public function setRightComment(\OP\PostBundle\Document\RightComment $rightComment)
    {
        $this->rightComment = $rightComment;
        return $this;
    }

    /**
     * Get rightComment
     *
     * @return OP\PostBundle\Document\RightComment $rightComment
     */
    public function getRightComment()
    {
        return $this->rightComment;
    }
}
