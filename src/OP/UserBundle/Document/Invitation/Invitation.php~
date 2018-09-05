<?php

namespace OP\UserBundle\Document\Invitation;

use Doctrine\Common\Proxy\Proxy,
    Doctrine\ODM\MongoDB\DocumentNotFoundException,
    Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * OP\UserBundle\Document\Invitation
 *
 * @MongoDB\Document(
 *      db="opinion",
 *      collection="invitations",
 *     repositoryClass="OP\UserBundle\Repository\InvitationRepository",
 * indexes={
 *          @MongoDB\index(keys={"sendingDate"="desc"}),
 *          @MongoDB\index(keys={"sender.$id"="asc"}),
 *          @MongoDB\index(keys={"receiver.$id"="desc"}),
 *          @MongoDB\index(keys={"metadata.isConformed"="asc"}),
 *          @MongoDB\index(keys={"metadata.isDeleted"="asc"}),
 *          @MongoDB\index(keys={"metadata.isMasked"="asc"}),
 *       },
 *         requireIndexes=true
 * )
 */
class Invitation
{
    /**
     * @var MongoId $id
     *
     * @MongoDB\Id(strategy="AUTO")
     */
    protected $id;

    /**
     * @var string $sender
     *
     * @MongoDB\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $sender;
    
    /**
     * @MongoDB\EmbedOne(targetDocument="OP\UserBundle\Document\Invitation\InvitationMetadata")
     */
    protected $metadata;

    /**
     * @var string $receiver
     *
     * @MongoDB\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $receiver;

    /**
     * @var date $sendingDate
     *
     * @MongoDB\Field(name="sendingDate", type="date")
     */
    protected $sendingDate;

    /**
     * @var date $confirmDate
     *
     * @MongoDB\Field(name="confirmDate", type="date")
     */
    protected $confirmDate;

    public function __construct(){
        $this->sendingDate = new \Datetime(null, new \DateTimeZone("UTC"));
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
     * Set sender
     *
     * @param OP\UserBundle\Document\User $sender
     * @return self
     */
    public function setSender(\OP\UserBundle\Document\User $sender)
    {
        $this->sender = $sender;
        return $this;
    }

    /**
     * Get sender
     *
     * @return OP\UserBundle\Document\User $sender
     */
    public function getSender()
    {
        return $this->sender;
    }

    /**
     * Set receiver
     *
     * @param OP\UserBundle\Document\User $receiver
     * @return self
     */
    public function setReceiver(\OP\UserBundle\Document\User $receiver)
    {
        $this->receiver = $receiver;
        return $this;
    }

    /**
     * Get receiver
     *
     * @return OP\UserBundle\Document\User $receiver
     */
    public function getReceiver()
    {
        return $this->receiver;
    }

    /**
     * Set sendingDate
     *
     * @param date $sendingDate
     * @return self
     */
    public function setSendingDate($sendingDate)
    {
        $this->sendingDate = $sendingDate;
        return $this;
    }

    /**
     * Get sendingDate
     *
     * @return date $sendingDate
     */
    public function getSendingDate()
    {
        return $this->sendingDate;
    }

    /**
     * Set confirmDate
     *
     * @param date $confirmDate
     * @return self
     */
    public function setConfirmDate($confirmDate)
    {
        $this->confirmDate = $confirmDate;
        return $this;
    }

    /**
     * Get getMetadata
     *
     * @return \OP\UserBundle\Ducoment\Invitation\InvitationMetadata $metadata
     */
    public function getMetadata()
    {
        return $this->metadata;
    }
    
    /**
     * Set metadata
     *
     * @param \OP\UserBundle\Document\Invitation\Invitation $meta
     * @return self
     */
    public function setMetadata(\OP\UserBundle\Document\Invitation\InvitationMetadata $meta)
    {
        $this->metadata = $meta;
        return $this;
    }

    /**
     * Get confirmDate
     *
     * @return date $confirmDate
     */
    public function getConfirmDate()
    {
        return $this->confirmDate;
    }
}
