<?php

namespace OP\MessageBundle\Model;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * OP\MessageBundle\Model\ThreadMetadata
 */
abstract class ThreadMetadata
{
    /**
     * @var MongoId $id
     *
     * @MongoDB\Id(strategy="AUTO")
     */
    protected $id;

    /**
     * @var boolean $isDeleted
     *
     * @MongoDB\Boolean
     */
    protected $isDeleted = false;

    /**
     * @var date $lastParticipantMessageDate
     *
     * @MongoDB\Date
     */
    protected $lastParticipantMessageDate;

    /**
     * @var date $lastMessageDate
     *
     * @MongoDB\Date
     */
    protected $lastMessageDate;


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
     * Set participant
     *
     * @param OP\UserBundle\Document\User $participant
     * @return $this
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
     * Set isDeleted
     *
     * @param boolean $isDeleted
     * @return $this
     */
    public function setIsDeleted($isDeleted)
    {
        $this->isDeleted = $isDeleted;
        return $this;
    }

    /**
     * Get isDeleted
     *
     * @return boolean $isDeleted
     */
    public function getIsDeleted()
    {
        return $this->isDeleted;
    }

    /**
     * Set lastParticipantMessageDate
     *
     * @param date $lastParticipantMessageDate
     * @return $this
     */
    public function setLastParticipantMessageDate($lastParticipantMessageDate)
    {
        $this->lastParticipantMessageDate = $lastParticipantMessageDate;
        return $this;
    }

    /**
     * Get lastParticipantMessageDate
     *
     * @return date $lastParticipantMessageDate
     */
    public function getLastParticipantMessageDate()
    {
        return $this->lastParticipantMessageDate;
    }

    /**
     * Set lastMessageDate
     *
     * @param date $lastMessageDate
     * @return $this
     */
    public function setLastMessageDate($lastMessageDate)
    {
        $this->lastMessageDate = $lastMessageDate;
        return $this;
    }

    /**
     * Get lastMessageDate
     *
     * @return date $lastMessageDate
     */
    public function getLastMessageDate()
    {
        return $this->lastMessageDate;
    }
}
