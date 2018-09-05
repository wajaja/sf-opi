<?php

namespace OP\MessageBundle\Model;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * @MongoDB\MappedSuperclass
 */
class Message implements MessageInterface
{
    /**
     * @var MongoId $id
     * @MongoDB\Id(strategy="AUTO")
     */
    protected $id;

    /**
     * @var boolean $isSpam
     * @MongoDB\Boolean
     */
    protected $isSpam = false;

    /**
     * @var collection $unreadForParticipants
     *
     * @MongoDB\Collection
     */
    protected $unreadForParticipants = array();

    /**
     * @var $sender
     *
     * @MongoDB\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $sender;

    /**
     * @var string $body
     *
     * @MongoDB\Field(name="body", type="raw")
     */
    protected $body;

    /**
     * @var date $createdAt
     *
     * @MongoDB\Field(name="createdAt", type="date")
     */
    protected $createdAt;

   /**
     * @MongoDB\EmbedMany(targetDocument="OP\MessageBundle\Document\MessageMetadata")
     */
    protected $metadata;

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\MediaBundle\Document\Video")
     */
    protected $videos = array();
    
    public function __construct(){
        $this->createdAt = new \DateTime(null, new \DateTimeZone("UTC"));
        $this->metadata = new ArrayCollection();
    }

    /**
     * @return id $id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set isSpam
     *
     * @param boolean $isSpam
     * @return $this
     */
    public function setIsSpam($isSpam)
    {
        $this->isSpam = $isSpam;
        return $this;
    }

    /**
     * Get isSpam
     *
     * @return boolean $isSpam
     */
    public function getIsSpam()
    {
        return $this->isSpam;
    }

    /**
    * @see OP\MessageBundle\Model\MessageInterface::setSender()
    */
   public function setSender(ParticipantInterface $sender)
   {
       $this->sender = $sender;
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
     * Set body
     *
     * @param string $body
     * @return $this
     */
    public function setBody($body)
    {
        $this->body = $body;
        return $this;
    }

    /**
     * Get body
     *
     * @return string $body
     */
    public function getBody()
    {
        return $this->body;
    }

    /**
     * Set createdAt
     *
     * @param date $createdAt
     * @return $this
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
     * @see OP\MessageBundle\Model\MessageInterface::setThread()
     */
    public function setThread(ThreadInterface $thread)
    {
        $this->thread = $thread;
    }

    /**
     * Get thread
     *
     * @return OP\MessageBundle\Document\Thread $thread
     */
    public function getThread()
    {
        return $this->thread;
    }

    /**
     * Gets the created at timestamp
     *
     * @return int
     */
    public function getTimestamp()
    {
        return $this->getCreatedAt()->getTimestamp();
    }

    /**
     * Adds MessageMetadata to the metadata collection.
     *
     * @param MessageMetadata $meta
     */
    public function addMetadata(MessageMetadata $meta)
    {
        $this->metadata->add($meta);
    }

    /**
     * Get the MessageMetadata for a participant.
     *
     * @param ParticipantInterface $participant
     * @return MessageMetadata
     */
    public function getMetadataForParticipant(ParticipantInterface $participant)
    {
        foreach ($this->metadata as $meta) {
            if ($meta->getParticipant()->getId() == $participant->getId()) {
                return $meta;
            }
        }
        return null;
    }

    /**
     * @see OP\MessageBundle\Model\ReadableInterface::isReadByParticipant()
     */
    public function isReadByParticipant(ParticipantInterface $participant)
    {
        if ($meta = $this->getMetadataForParticipant($participant)) {
            return $meta->getIsRead();
        }

        return false;
    }

    /**
     * @see OP\MessageBundle\Model\ReadableInterface::setIsReadByParticipant()
     */
    public function setIsReadByParticipant(ParticipantInterface $participant, $isRead)
    {
        if (!$meta = $this->getMetadataForParticipant($participant)) {
            throw new \InvalidArgumentException(sprintf('No metadata exists for participant with id "%s"', $participant->getId()));
        }
        $isReadAt = new \Datetime(null, new \DateTimeZone("UTC"));

        $meta->setIsRead($isRead);
        $meta->setIsReadAt($isReadAt);
    }

    /**
     * DENORMALIZATION
     * All following methods are relative to denormalization
     *
     * Performs denormalization tricks
     */
    public function denormalize()
    {
        $this->doSenderIsRead();
        $this->doEnsureUnreadForParticipantsArray();
    }

    /**
     * Ensures that the sender is considered to have read this message
     */
    protected function doSenderIsRead()
    {
        $this->setIsReadByParticipant($this->getSender(), true);
    }

    /**
     * Ensures that the unreadForParticipants array is updated.
     */
    protected function doEnsureUnreadForParticipantsArray()
    {
        $this->unreadForParticipants = array();

        if ($this->isSpam) {
            return;
        }

        foreach ($this->metadata as $metadata) {
            if (!$metadata->getIsRead()) {
                $this->unreadForParticipants[] = $metadata->getParticipant()->getId();
            }
        }
    }

    /**
     * Ensures that the unreadForParticipants array is updated.
     */
    protected function doEnsureUnreadForParticipant(ParticipantInterface $participant)
    {
        if ($this->isSpam) {
            return;
        }
        foreach ($this->metadata as $metadata) {
            if ($metadata->getIsRead()) {
                if($metadata->getParticipant()->getId() == $participant->getId()){
                    $metadata->setIsReadByParticipant($participant, false);
                    $this->unreadForParticipants[] = $metadata->getParticipant()->getId();
                }
            }
        }
    }
}
