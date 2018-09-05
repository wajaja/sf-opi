<?php

namespace OP\MessageBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM,
	OP\MessageBundle\Model\ThreadMetadata as BaseThreadMetadata;

/**
 * @ODM\EmbeddedDocument
 */
class ThreadMetadata extends BaseThreadMetadata
{
    /**
     * @ODM\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $participant;

    /**
     * @var date $lastParticipantCallDate
     *
     * @ODM\Date
     */
    protected $lastParticipantCallDate;

    /**
     * @var date $lastAppellant
     * @ODM\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $lastAppellant;

    /**
     * Set lastParticipantCallDate
     *
     * @param date $lastParticipantCallDate
     * @return $this
     */
    public function setLastParticipantCallDate($lastParticipantCallDate)
    {
        $this->lastParticipantCallDate = $lastParticipantCallDate;
        return $this;
    }

    /**
     * Get lastParticipantCallDate
     *
     * @return date $lastParticipantCallDate
     */
    public function getLastParticipantCallDate()
    {
        return $this->lastParticipantCallDate;
    }

    /**
     * Set lastAppellant
     *
     * @param OP\UserBundle\Document\User $lastAppellant
     * @return $this
     */
    public function setLastAppellant(\OP\UserBundle\Document\User $lastAppellant)
    {
        $this->lastAppellant = $lastAppellant;
        return $this;
    }

    /**
     * Get lastAppellant
     *
     * @return OP\UserBundle\Document\User $lastAppellant
     */
    public function getLastAppellant()
    {
        return $this->lastAppellant;
    }
}
