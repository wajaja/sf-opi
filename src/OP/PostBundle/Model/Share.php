<?php
namespace OP\PostBundle\Model;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM,
    Symfony\Component\Validator\Constraints as Assert,
    Symfony\Component\HttpFoundation\File\File,
    Doctrine\Common\Collections\ArrayCollection;

/**
 * OP\PostBundle\Document\Pshare
 * @ODM\MappedSuperclass
 */
class Share
{
     /**
     * @var MongoId $id
     *
     * @ODM\Id(strategy="AUTO")
     */
    protected $id;

    /**
     * postId
     *
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\Post")
     */
    protected $post;

    /**
     * @var timestamp $ts
     *
     * @ODM\Field(name="ts", type="timestamp")
     */
    protected $ts;

    /**
     * userId
     *
     * @ODM\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $author;

    /**
     * @ODM\ReferenceMany(targetDocument="OP\MediaBundle\Document\Image")
     */
    protected $images;
    
    /**
     * @var  $notification
     *
     * @ODM\ReferenceOne(targetDocument="OP\SocialBundle\Document\Notification")
     */
    protected $notification;

   /**
     * @ODM\Field(name="content", type="raw")
     * @Assert\NotBlank()
     */
    protected $content;

    /**
     * @ODM\Field(name="createdAt", type="date")
     * 
     */
    protected $createdAt;

    /*
     *
     */
    public $file;

    /**
     * @ODM\Field(name="postValid", type="string")
     *
     */
    protected $postValid;

    /**
     * @ODM\Field(name="updateAt", type="date")
     *
     * @Assert\DateTime()
     */
    protected $updateAt;

    /**
     * @ODM\Field(name="status", type="boolean")
     * 
     */
    protected $status = false;

    public function __construct() {
        $this->createdAt    = nnew \DateTime(null, new \DateTimeZone("UTC"));
        $this->datepubledAt = new \DateTime(null, new \DateTimeZone("UTC"));
        $this->images       = new ArrayCollection();
    }

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
     * Set postId
     *
     * @param OP\PostBundle\Document\Post $postId
     * @return self
     */
    public function setPostId(\OP\PostBundle\Document\Post $postId)
    {
        $this->postId = $postId;
        return $this;
    }

    /**
     * Get postId
     *
     * @return OP\PostBundle\Document\Post $postId
     */
    public function getPostId()
    {
        return $this->postId;
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
     * Set
     */
    public function setFile(File $file)
    {
        $this->file = $file;
        return $this;
    }

    /**
     * Get file
     */
    public function getFile()
    {
        return $this->file;
    }

    /**
     * Set postValid
     *
     * @param string $postValid
     * @return $this
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
}
