<?php
namespace OP\MessageBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM,
    OP\MessageBundle\Model\Thread as BaseThread;

/**
 * @ODM\Document(
 *       db="opinion",
 *      collection="threads",
 * indexes={
 *          @ODM\index(keys={"createdAt"="desc"}),
 *          @ODM\index(keys={"lastMessageDate"="desc"}),
 *          @ODM\index(keys={"activeParticipants"="asc", "lastMessageDate"="desc"}),
 *          @ODM\index(keys={"activeRecipients"="asc", "lastMessageDate"="desc"}),
 *          @ODM\index(keys={"activeSenders"="desc", "lastMessageDate"="desc"}),
 *          @ODM\index(keys={"createdBy.$id"="asc"})
 *       },
 *         requireIndexes=true
 * )
 */
class Thread extends BaseThread
{
    /**
     * @var MongoId $id
     * @ODM\Id(strategy="AUTO")
     */
    protected $id;

    /**
     * @var $metadata
     *
     * @ODM\EmbedMany(targetDocument="OP\MessageBundle\Document\ThreadMetadata")
     */
    protected $metadata;

    /**
     * @ODM\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $createdBy;

    /**
    *
    * @ODM\ReferenceMany(targetDocument="OP\MessageBundle\Document\Message", mappedBy="thread", prime={"thread"})
    */
    public $messages;

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

    public function __construct() {
        parent::__construct();
    }
    
    /**
     * DENORMALIZATION
     *
     * All following methods are relative to denormalization
     */

    /**
     * Performs denormalization tricks
     */
    public function denormalize()
    {
        $this->doCreatedByAndAt();
        $this->doLastMessageDate();
        $this->doKeywords();
        $this->doSpam();
        $this->doMetadataLastMessageDates();
        $this->doEnsureActiveParticipantArrays();
    }

    /**
     * Ensures that the createdBy & createdAt properties are set
     */
    protected function doCreatedByAndAt()
    {
        if (null !== $this->getCreatedBy()) {
            return;
        }

        if (!$message = $this->getFirstMessage()) {
            return;
        }

        $this->setCreatedBy($message->getSender());
        $this->setCreatedAt($message->getCreatedAt());
    }

    /**
     * Ensures that the lastMessageDate property is up to date
     */
    protected function doLastMessageDate()
    {
        if (!$message = $this->getLastMessage()) {
            return;
        }

        $this->lastMessageDate = $message->getCreatedAt();
    }

    /**
     * Adds all messages contents to the keywords property
     */
    protected function doKeywords()
    {
        $keywords = $this->getSubject();

        foreach ($this->getMessages() as $message) {
            $body = $message->getBody();
            if('array' === gettype($body)) {
                $blocks = $body['blocks'];
                foreach ($blocks as $block) {
                    $keywords .= ' '.$block['text'];
                }
            } else {
                $keywords .= ' '.strip_tags($body);  //delete all html tag
            }
        }

        // we only need each word once
        $this->keywords = implode(' ', array_unique(str_word_count(mb_strtolower($keywords, 'UTF-8'), 1)));
    }

    /**
     * Denormalizes the value of isSpam to messages
     */
    protected function doSpam()
    {
        foreach ($this->getMessages() as $message) {
            $message->setIsSpam($this->getIsSpam());
        }
    }

    /**
     * Ensures that metadata last message dates are up to date
     *
     * Precondition: metadata exists for all thread participants
     */
    protected function doMetadataLastMessageDates()
    {
        foreach ($this->metadata as $meta) {
            foreach ($this->getMessages() as $message) {
                if ($meta->getParticipant()->getId() !== $message->getSender()->getId()) {
                    if (null === $meta->getLastMessageDate() || $meta->getLastMessageDate()->getTimestamp() < $message->getTimestamp()) {
                        $meta->setLastMessageDate($message->getCreatedAt());
                    }
                } else {
                    if (null === $meta->getLastParticipantMessageDate() || $meta->getLastParticipantMessageDate()->getTimestamp() < $message->getTimestamp()) {
                        $meta->setLastParticipantMessageDate($message->getCreatedAt());
                    }
                }
            }
        }
    }

    /**
     * Ensures that active participant, recipient and sender arrays are updated.
     */
    protected function doEnsureActiveParticipantArrays()
    {
        $this->activeParticipants = array();
        $this->activeRecipients = array();
        $this->activeSenders = array();

        foreach ($this->getParticipants() as $participant) {
            if ($this->isDeletedByParticipant($participant)) {
                continue;
            }

            $participantIsActiveRecipient = $participantIsActiveSender = false;

            foreach ($this->getMessages() as $message) {
                if ($message->getSender()->getId() === $participant->getId()) {
                    $participantIsActiveSender = true;
                } elseif (!$this->getIsSpam()) {
                    $participantIsActiveRecipient = true;
                }

                if ($participantIsActiveRecipient && $participantIsActiveSender) {
                    break;
                }
            }

            if ($participantIsActiveSender) {
                $this->activeSenders[] = $participant->getId();
            }

            if ($participantIsActiveRecipient) {
                $this->activeRecipients[] = $participant->getId();
            }

            if ($participantIsActiveSender || $participantIsActiveRecipient) {
                $this->activeParticipants[] = $participant->getId();
            }
        }
    }

    /**
     * Remove message
     *
     * @param OP\MessageBundle\Document\Message $message
     */
    public function removeMessage(\OP\MessageBundle\Document\Message $message)
    {
        $this->messages->removeElement($message);
    }

    /**
     * Add metadatum
     *
     * @param OP\MessageBundle\Document\ThreadMetadata $metadatum
     */
    public function addMetadatum(\OP\MessageBundle\Document\ThreadMetadata $metadatum)
    {
        $this->metadata[] = $metadatum;
    }

    /**
     * Remove metadatum
     *
     * @param OP\MessageBundle\Document\ThreadMetadata $metadatum
     */
    public function removeMetadatum(\OP\MessageBundle\Document\ThreadMetadata $metadatum)
    {
        $this->metadata->removeElement($metadatum);
    }

    /**
     * Get metadata
     *
     * @return \Doctrine\Common\Collections\Collection $metadata
     */
    public function getMetadata()
    {
        return $this->metadata;
    }

    /**
     * Set lastMessageDate
     *
     * @param date $lastMessageDate
     * @return self
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

    /**
     * Set activeSenders
     *
     * @param collection $activeSenders
     * @return self
     */
    public function setActiveSenders($activeSenders)
    {
        $this->activeSenders = $activeSenders;
        return $this;
    }

    /**
     * Get activeSenders
     *
     * @return collection $activeSenders
     */
    public function getActiveSenders()
    {
        return $this->activeSenders;
    }

    /**
     * Set activeParticipants
     *
     * @param collection $activeParticipants
     * @return self
     */
    public function setActiveParticipants($activeParticipants)
    {
        $this->activeParticipants = $activeParticipants;
        return $this;
    }

    /**
     * Get activeParticipants
     *
     * @return collection $activeParticipants
     */
    public function getActiveParticipants()
    {
        return $this->activeParticipants;
    }

    /**
     * Set keywords
     *
     * @param string $keywords
     * @return self
     */
    public function setKeywords($keywords)
    {
        $this->keywords = $keywords;
        return $this;
    }

    /**
     * Get keywords
     *
     * @return string $keywords
     */
    public function getKeywords()
    {
        return $this->keywords;
    }

    /**
     * Set activeRecipients
     *
     * @param collection $activeRecipients
     * @return self
     */
    public function setActiveRecipients($activeRecipients)
    {
        $this->activeRecipients = $activeRecipients;
        return $this;
    }

    /**
     * Get activeRecipients
     *
     * @return collection $activeRecipients
     */
    public function getActiveRecipients()
    {
        return $this->activeRecipients;
    }

    /**
     * Remove metadata
     *
     * @param OP\MessageBundle\Document\ThreadMetadata $metadata
     */
    public function removeMetadata(\OP\MessageBundle\Document\ThreadMetadata $metadata)
    {
        $this->metadata->removeElement($metadata);
    }

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
