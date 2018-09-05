<?php

namespace OP\MediaBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;

/**
 * OP\MediaBundle\Document\Video
 *
 * @ODM\Document(
 *      db="opinion",
 *      collection="videos",
 *     repositoryClass="OP\MediaBundle\Repository\VideoRepository"
 * )
 * @ODM\ChangeTrackingPolicy("DEFERRED_IMPLICIT")
 */
class Video
{
    /**
     * @var MongoId $id
     *
     * @ODM\Id(strategy="AUTO")
     */
    protected $id;

    /**
     * @var string $path
     *
     * @ODM\Field(name="path", type="string")
     */
    protected $path;

    /**
     * @var int $size
     *
     * @ODM\Field(name="size", type="int")
     */
    protected $size;

    /**
     * @var string $directory
     *
     * @ODM\Field(name="directory", type="string")
     */
    protected $directory;
    
    /**
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\Post")
     */
    protected $postId;
    
    /**
     * @ODM\ReferenceOne(targetDocument="OP\MessageBundle\Document\Message")
     */
    protected $message;

    /**
     *
     * @ODM\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $author;

    /**
     * @var date $createdAt
     *
     * @ODM\Field(name="createdAt", type="date")
     */
    protected $createdAt;

    /**
     * @var string $name
     *
     * @ODM\Field(name="name", type="string")
     */
    protected $name;
    
     public function __construct()
    {
        $this->createdAt = new \Datetime(null, new \DateTimeZone("UTC"));
    }
    
    public function getUploadDir()
    {
    // On retourne le chemin relatif vers l'image pour un navigateur
    return 'uploads/gallery';
    }

    public function getUploadRootDir()
    {
    // On retourne le chemin relatif vers l'image pour notre code PHP
    return __DIR__.'/../../../../web/optube/uploads/videos/'.$this->getUploadDir();
    }

    public function getWebPath()
    {
        return $this->getUploadDir().'/'.$this->getPath();
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
     * Set path
     *
     * @param string $path
     * @return self
     */
    public function setPath($path)
    {
        $this->path = $path;
        return $this;
    }

    /**
     * Get path
     *
     * @return string $path
     */
    public function getPath()
    {
        return $this->path;
    }

    /**
     * Set size
     *
     * @param int $size
     * @return self
     */
    public function setSize($size)
    {
        $this->size = $size;
        return $this;
    }

    /**
     * Get size
     *
     * @return int $size
     */
    public function getSize()
    {
        return $this->size;
    }

    /**
     * Set directory
     *
     * @param string $directory
     * @return self
     */
    public function setDirectory($directory)
    {
        $this->directory = $directory;
        return $this;
    }

    /**
     * Get directory
     *
     * @return string $directory
     */
    public function getDirectory()
    {
        return $this->directory;
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
     * Set name
     *
     * @param string $name
     * @return self
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

    /**
     * Get name
     *
     * @return string $name
     */
    public function getName()
    {
        return $this->name;
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
     * Set messageId
     *
     * @param OP\MessageBundle\Document\Message $messageId
     * @return self
     */
    public function setMessageId(\OP\MessageBundle\Document\Message $messageId)
    {
        $this->messageId = $messageId;
        return $this;
    }

    /**
     * Get messageId
     *
     * @return OP\MessageBundle\Document\Message $messageId
     */
    public function getMessageId()
    {
        return $this->messageId;
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
     * Set message
     *
     * @param OP\MessageBundle\Document\Message $message
     * @return self
     */
    public function setMessage(\OP\MessageBundle\Document\Message $message)
    {
        $this->message = $message;
        return $this;
    }

    /**
     * Get message
     *
     * @return OP\MessageBundle\Document\Message $message
     */
    public function getMessage()
    {
        return $this->message;
    }
}
