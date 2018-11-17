<?php
// src/OP/MessageBundle/Document/Thread.php

namespace OP\MessageBundle\Model;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB,
    OP\MessageBundle\Document\ThreadMetadata,
    Doctrine\Common\Collections\ArrayCollection,
    OP\MessageBundle\Model\ParticipantInterface;

/**
 * OP\MessageBundle\Document\Thread
 * @MongoDB\MappedSuperclass
 *
 */
abstract class Thread implements ThreadInterface
{
    /**
     * @MongoDB\Id
     */
    protected $id;

    /**
     * @var string $subject
     *
     * @MongoDB\Field(name="subject", type="string")
     */
    protected $subject;

    /**
     * @var boolean $isSpam
     *
     * @MongoDB\Field(name="isSpam", type="boolean")
     */
    protected $isSpam = false;

    /**
     * participant that create the thread
         * @var  ParticipantInterface
     * @MongoDB\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $createdBy;

    /**
     * @MongoDB\EmbedMany(targetDocument="OP\MessageBundle\Document\ThreadMetadata")
     *
     */
    protected $metadata;

    /**
     * @MongoDB\Date
     *
     */
    protected $createdAt;

    /**
    *
    * @MongoDB\ReferenceMany(targetDocument="OP\UserBundle\Document\User")
    */
    protected $participants;


     /**
    * @var date $lastMessageDate
    *
    * @MongoDB\Field(name="lastMessageDate", type="date")
    */
    protected $lastMessageDate;

    /**
    * @var collection $activeSenders
    * @MongoDB\Field(name="activeSenders", type="collection")
    */
    protected $activeSenders = array();

    /**
    * @var collection $activeParticipants
    * @MongoDB\Field(name="activeParticipants", type="collection")
    */
    protected $activeParticipants = array();

    /**
    * @var string $keywords
    * @MongoDB\Field(name="keywords", type="string")
    */
    protected $keywords = '';

    /**
    * @var collection $activeRecipients
    * @MongoDB\Field(name="activeRecipients", type="collection")
    */
    protected $activeRecipients = array();


    public function __construct() {
        $this->messages = new ArrayCollection();
        $this->metadata = new ArrayCollection();
        $this->participants = new ArrayCollection();
        $this->createdAt = new \Datetime(null, new \DateTimeZone("UTC"));
    }

    /**
     * @return id $id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @see OP\MessageBundle\Model\ThreadInterface::setCreatedAt()
     */
    public function setCreatedAt(\DateTime $createdAt)
    {
        $this->createdAt = $createdAt;
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
     * @see OP\MessageBundle\Model\ThreadInterface::getCreatedBy()
     */
    public function getCreatedBy()
    {
        return $this->createdBy;
    }

    /**
     * @see OP\MessageBundle\Model\ThreadInterface::setCreatedBy()
     */
    public function setCreatedBy(ParticipantInterface $participant)
    {
        $this->createdBy = $participant;
    }

    /**
     * Set subject
     * @param string $subject
     * @return $this
     */
    public function setSubject($subject)
    {
        $this->subject = $subject;
        return $this;
    }

    /**
     * Get subject
     * @return string $subject
     */
    public function getSubject()
    {
        return $this->subject;
    }

    /**
    * @see OP\MessageBundle\Model\ThreadInterface::addMessage()
    */
   public function addMessage(MessageInterface $message)
   {
       $this->messages->add($message);
   }

   /**
  * Adds a participant to the thread
  * If it already exists, nothing is done.
  *
  * @param ParticipantInterface $participant
  * @return null
  */
 public function addParticipant(ParticipantInterface $participant)
 {
     if (!$this->isParticipant($participant)) {
         $this->participants->add($participant);
     }
 }

 /**
  * Tells if the user participates to the conversation
  *
  * @param ParticipantInterface $participant
  * @return boolean
  */
 public function isParticipant(ParticipantInterface $participant)
 {
     return $this->participants->contains($participant);
 }

 /**
  * Gets the users participating in this conversation
  *
  * @return array of ParticipantInterface
  */
 public function getParticipants()
 {
     return $this->participants->toArray();
 }

 /**
  * Remove participant
  * @param OP\UserBundle\Document\User $participant
  */
 public function removeParticipant(\OP\UserBundle\Document\User $participant)
 {
     $this->participants->removeElement($participant);
 }

   /**
    * @see OP\MessageBundle\Model\ThreadInterface::getMessages()
    */
   public function getMessages()
   {
       return $this->messages;
   }

   /**
    * Get isSpam
    * @return boolean $isSpam
    */
   public function getIsSpam()
   {
       return $this->isSpam;
   }

   /**
    * @see OP\MessageBundle\Model\ThreadInterface::getFirstMessage()
    */
   public function getFirstMessage()
   {
       return $this->getMessages()->first();
   }

   /**
    * @see OP\MessageBundle\Model\ThreadInterface::getLastMessage()
    */
   public function getLastMessage()
   {
       return $this->getMessages()->last();
   }

   /**
    * @see OP\MessageBundle\Model\ThreadInterface::isDeletedByParticipant()
    */
   public function isDeletedByParticipant(ParticipantInterface $participant)
   {
       if ($meta = $this->getMetadataForParticipant($participant)) {
           return $meta->getIsDeleted();
       }

       return false;
   }

   /**
    * @see OP\MessageBundle\Model\ThreadInterface::setIsDeletedByParticipant()
    */
   public function setIsDeletedByParticipant(ParticipantInterface $participant, $isDeleted)
   {
       if (!$meta = $this->getMetadataForParticipant($participant)) {
           throw new \InvalidArgumentException(sprintf('No metadata exists for participant with id "%s"', $participant->getId()));
       }

       $meta->setIsDeleted($isDeleted);

       if ($isDeleted) {
           // also mark all thread messages as read
           foreach ($this->getMessages() as $message) {
               $message->setIsReadByParticipant($participant, true);
           }
       }
   }

   /**
    * @see OP\MessageBundle\Model\ThreadInterface::setIsDeleted()
    */
   public function setIsDeleted($isDeleted)
   {
       foreach($this->getParticipants() as $participant) {
           $this->setIsDeletedByParticipant($participant, $isDeleted);
       }
   }

   /**
    * @see OP\MessageBundle\Model\ReadableInterface::isReadByParticipant()
    */
   public function isReadByParticipant(ParticipantInterface $participant)
   {
       foreach ($this->getMessages() as $message) {
           if (!$message->isReadByParticipant($participant)) {
               return false;
           }
       }

       return true;
   }

   /**
    * @see OP\MessageBundle\Model\ReadableInterface::setIsReadByParticipant()
    */
   public function setIsReadByParticipant(ParticipantInterface $participant, $isRead)
   {
        foreach ($this->getMessages() as $message) {
           $message->setIsReadByParticipant($participant, $isRead);
        }

        //set last readed thread for user
       
        //then call update user 
   }

   /**
    * @see OP\MessageBundle\Model\ReadableInterface::setIsReadByParticipant()
    */
   public function setIsUnReadByParticipant(ParticipantInterface $participant, $isRead)
   {
       foreach ($this->getMessages() as $message) {
           $message->setIsReadByParticipant($participant, $isRead);
       }
   }

   /**
    * Adds ThreadMetadata to the metadata collection.
    *
    * @param ThreadMetadata $meta
    */
   public function addMetadata(ThreadMetadata $meta)
   {
       $this->metadata->add($meta);
   }

   /**
    * Gets the ThreadMetadata for a participant.
    *
    * @param ParticipantInterface $participant
    * @return ThreadMetadata
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
    * @see OP\MessageBundle\Model\ThreadInterface::getOtherParticipants()
    */
   public function getOtherParticipants(ParticipantInterface $participant)
   {
       $otherParticipants = $this->getParticipants();

       $key = array_search($participant, $otherParticipants, true);

       if (false !== $key) {
           unset($otherParticipants[$key]);
       }

       // we want to reset the array indexes
       return array_values($otherParticipants);
   }


    /**
     * @param boolean $isSpam
     * @return $this
     */
    public function setIsSpam($isSpam)
    {
        $this->isSpam = $isSpam;
        return $this;
    }
}
