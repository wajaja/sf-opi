<?php

namespace OP\PostBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * @MongoDB\EmbeddedDocument
 */
class PostMetadata
{
    /**
     * refer for others editors posts to sameone
     * @MongoDB\ReferenceMany(targetDocument="OP\PostBundle\Document\Post")
     * @var type 
     */
    protected $allies = [];

    /**
     * @var date $lastParticipantMessageDate
     *
     * @MongoDB\Field(name="lastActivityDate", type="date")
     */
    protected $lastActivityDate;

    
    public function __construct()
    {
        $this->allies = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    /**
     * Add ally
     *
     * @param OP\PostBundle\Document\Post $ally
     */
    public function addAlly(\OP\PostBundle\Document\Post $ally)
    {
        $this->allies[] = $ally;
    }

    /**
     * Remove ally
     *
     * @param OP\PostBundle\Document\Post $ally
     */
    public function removeAlly(\OP\PostBundle\Document\Post $ally)
    {
        $this->allies->removeElement($ally);
    }

    /**
     * Get allies
     *
     * @return \Doctrine\Common\Collections\Collection $allies
     */
    public function getAllies()
    {
        return $this->allies;
    }

    /**
     * Set lastActivityDate
     *
     * @param date $lastActivityDate
     * @return self
     */
    public function setLastActivityDate($lastActivityDate)
    {
        $this->lastActivityDate = $lastActivityDate;
        return $this;
    }

    /**
     * Get lastActivityDate
     *
     * @return date $lastActivityDate
     */
    public function getLastActivityDate()
    {
        return $this->lastActivityDate;
    }
}
