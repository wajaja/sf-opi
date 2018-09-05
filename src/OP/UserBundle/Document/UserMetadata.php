<?php

namespace OP\UserBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB,
    JMS\Serializer\Annotation\ExclusionPolicy,
    JMS\Serializer\Annotation\Expose,
    JMS\Serializer\Annotation\Groups,
    JMS\Serializer\Annotation\VirtualProperty,
    JMS\Serializer\Annotation\Type,
    Doctrine\Common\Collections\ArrayCollection;

/**
 * @MongoDB\EmbeddedDocument
 */
class UserMetadata
{
    /**
    *  @var \Datetime $lastMessageActivity
    *
    * @MongoDB\Field(name="lastMessageActivity", type="date")
    * @Expose
    */
    protected $lastMessageActivity;


    /**
     * Set lastMessageActivity
     *
     * @param date $lastMessageActivity
     * @return self
     */
    public function setLastMessageActivity(\Datetime $lastMessageActivity)
    {
        $this->lastMessageActivity = $lastMessageActivity;
        return $this;
    }

    /**
     * Get lastMessageActivity
     *
     * @return date $lastMessageActivity
     */
    public function getLastMessageActivity()
    {
        return $this->lastMessageActivity;
    }
}
