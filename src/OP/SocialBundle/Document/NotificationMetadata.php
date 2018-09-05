<?php

namespace OP\SocialBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * Description of NotificationMetadata
 * @MongoDB\EmbeddedDocument
 */
class NotificationMetadata 
{    
    /**
     * @MongoDB\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $participant;

    /**
     *
     * @MongoDB\Boolean
     */
    protected $isRead = false;

    /**
     * @MongoDB\Integer
     */
    protected $nbUnreads = 0;
    
    public function __construct() {
        
    }

    /**
     * Set participant
     *
     * @param OP\UserBundle\Document\User $participant
     * @return self
     */
    public function setParticipant(\OP\UserBundle\Document\User $participant)
    {
        $this->participant = $participant;
        return $this;
    }

    /**
     * Get participant
     *
     * @return OP\UserBundle\Document\User $participant
     */
    public function getParticipant()
    {
        return $this->participant;
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
     * Set nbUnreads
     *
     * @param integer $nbUnreads
     * @return self
     */
    public function setNbUnreads($nbUnreads)
    {
        $this->nbUnreads = $nbUnreads;
        return $this;
    }

    /**
     * Get nbUnreads
     *
     * @return integer $nbUnreads
     */
    public function getNbUnreads()
    {
        return $this->nbUnreads;
    }
}
