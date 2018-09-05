<?php

namespace OP\MessageBundle\Model;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * OP\MessageBundle\Model\MessageMetadata
 */
abstract class MessageMetadata
{
    /**
     *
     * @MongoDB\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $participant;

    /**
     *
     * @MongoDB\Boolean
     */
    protected $isRead = false;

    /**
     * @var disReadAte $isReadAt
     *
     * @MongoDB\Field(name="isReadAt", type="date")
     */
    protected $isReadAt;


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
     * Set isRead
     *
     * @param boolean $isRead
     * @return $this
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
     * Set isReadAt
     *
     * @param disReadAte $isReadAt
     * @return $this
     */
    public function setIsReadAt($isReadAt)
    {
        $this->isReadAt = $isReadAt;
        return $this;
    }

    /**
     * Get isReadAt
     *
     * @return disReadAte $isReadAt
     */
    public function getIsReadAt()
    {
        return $this->isReadAt;
    }
}
