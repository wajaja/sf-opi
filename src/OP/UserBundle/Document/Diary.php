<?php

namespace OP\UserBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;

/**
 * OP\UserBundle\Document\Diary
 *
 * @ODM\Document(
 *     repositoryClass="OP\UserBundle\Repository\DiaryRepository"
 * )
 * @ODM\ChangeTrackingPolicy("DEFERRED_IMPLICIT")
 */
class Diary
{
    /**
     * @var MongoId $id
     *
     * @ODM\Id(strategy="AUTO")
     */
    protected $id;

    /**
     * @var date $createdAt
     *
     * @ODM\Field(name="createdAt", type="date")
     */
    protected $createdAt;

    /**
     * @var date $meetAt
     *
     * @ODM\Field(name="meetAt", type="date")
     */
    protected $meetAt;

    /**
     * @var collection $description
     *
     * @ODM\Field(name="description", type="raw")
     */
    protected $description;

    /**
     * @var string $title
     *
     * @ODM\Field(name="title", type="string")
     */
    protected $title;

    /**
     * @var string $privacy
     *
     * @ODM\Field(name="privacy", type="string")
     */
    protected $privacy;

    /**
     * @var collection $subcriberIds
     *
     * @ODM\Field(name="subcriber_ids", type="collection")
     */
    protected $subcriber_ids = array();

    /**
     * @var boolean $started
     *
     * @ODM\Field(name="started", type="boolean")
     */
    protected $started;

    /**
     * @var object_id $createdBy
     *
     * @ODM\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     *
     */
    protected $createdBy;

    /**
     * @var boolean $isRead
     * @ODM\Boolean
     */
    protected $isRead = false;

    /**
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\Post")
     */
    protected $post;

    /**
     * @var integer $timezone_diff
     *
     * @ODM\Field(name="timezone_diff", type="integer")
     */
    protected $timezone_diff;


    public function __construct()
    {        
        $this->createdAt = new \DateTime(null, new \DateTimeZone("UTC"));
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
     * Set meetAt
     *
     * @param date $meetAt
     * @return self
     */
    public function setMeetAt($meetAt)
    {
        $this->meetAt = $meetAt;
        return $this;
    }

    /**
     * Get meetAt
     *
     * @return date $meetAt
     */
    public function getMeetAt()
    {
        return $this->meetAt;
    }

    /**
     * Set description
     *
     * @param raw $description
     * @return self
     */
    public function setDescription($description)
    {
        $this->description = $description;
        return $this;
    }

    /**
     * Get description
     *
     * @return raw $description
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set title
     *
     * @param string $title
     * @return self
     */
    public function setTitle($title)
    {
        $this->title = $title;
        return $this;
    }

    /**
     * Get title
     *
     * @return string $title
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set privacy
     *
     * @param string $privacy
     * @return self
     */
    public function setPrivacy($privacy)
    {
        $this->privacy = $privacy;
        return $this;
    }

    /**
     * Get privacy
     *
     * @return string $privacy
     */
    public function getPrivacy()
    {
        return $this->privacy;
    }

    /**
     * Set subcriberIds
     *
     * @param collection $subcriberIds
     * @return self
     */
    public function setSubcriberIds($subcriberIds)
    {
        $this->subcriber_ids = $subcriberIds;
        return $this;
    }

    /**
     * Get subcriberIds
     *
     * @return collection $subcriberIds
     */
    public function getSubcriberIds()
    {
        return $this->subcriber_ids;
    }

    /**
     * Set started
     *
     * @param boolean $started
     * @return self
     */
    public function setStarted($started)
    {
        $this->started = $started;
        return $this;
    }

    /**
     * Get started
     *
     * @return boolean $started
     */
    public function getStarted()
    {
        return $this->started;
    }

    /**
     * Set createdBy
     *
     * @param OP\UserBundle\Document\User $createdBy
     * @return self
     */
    public function setCreatedBy(\OP\UserBundle\Document\User $createdBy)
    {
        $this->createdBy = $createdBy;
        return $this;
    }

    /**
     * Get createdBy
     *
     * @return OP\UserBundle\Document\User $createdBy
     */
    public function getCreatedBy()
    {
        return $this->createdBy;
    }

    /**
     * Set timezoneDiff
     *
     * @param integer $timezoneDiff
     * @return self
     */
    public function setTimezoneDiff($timezoneDiff)
    {
        $this->timezone_diff = $timezoneDiff;
        return $this;
    }

    /**
     * Get timezoneDiff
     *
     * @return integer $timezoneDiff
     */
    public function getTimezoneDiff()
    {
        return $this->timezone_diff;
    }

    /**
     * Set isRead
     *
     * @param boolean $isRead
     * @return self
     */
    public function setIsRead($isRead)
    {
        $this->isRead = $isRead;
        return $this;
    }

    /**
     * Get isRead
     *
     * @return boolean $isRead
     */
    public function getIsRead()
    {
        return $this->isRead;
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
}
