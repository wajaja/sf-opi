<?php
namespace OP\SocialBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;
use Doctrine\Common\Collections\ArrayCollection;
use OP\MessageBundle\Model\ParticipantInterface;
use OP\SocialBundle\Model\Notification as BaseNotification;

/**
 * @ODM\Document(
 *      db="opinion",
 *      collection="notifications",
 *     repositoryClass="OP\SocialBundle\Repository\NotificationRepository",
 * indexes={
 *          @ODM\index(keys={"lastParticipantActivityDate"="desc"}),
 *          @ODM\index(keys={"metadata.participant.$id"="asc"}),
 *          @ODM\index(keys={"opinion.$id"="asc"}),
 *          @ODM\index(keys={"post.$id"="asc"}),
 *          @ODM\index(keys={"comment.$id"="asc"}),
 *          @ODM\index(keys={"leftcomment.$id"="asc"}),
 *          @ODM\index(keys={"rightcomment.$id"="asc"}),
 *          @ODM\index(keys={"share.$id"="asc"}),
 *       },
 *         requireIndexes=true
 * )
 * @ODM\ChangeTrackingPolicy("DEFERRED_IMPLICIT")
 */
class Notification extends BaseNotification
{
    /**
     * @var MongoId $id
     * @ODM\Id(strategy="AUTO")
     */
    protected $id;


    /**
     * @ODM\Field(name="message", type="string")
     *
     */
    protected $message;

    /**
     * Value may be [ postCreated, allieCreated, ]
     * @ODM\Field(name="lastActivityType", type="string")
     * 
     */
    protected $lastActivityType = 'postCreated';
    
    /**
     * @var date $lastParticipantActivityDate
     * @ODM\Field(name="lastParticipantActivityDate", type="date")
     */
    protected $lastParticipantActivityDate;

    /**
     * @var boolean $isRead
     *
     * @ODM\Field(name="unreadForParticipants", type="collection")
     */
    protected $unreadForParticipants = array();

    /**
     * @var author
     * @ODM\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $author;

    /**
     * @var author
     * @ODM\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $lastParticipant;


    /**
     * @var string $url
     * @ODM\Field(name="url", type="string")
     */
    protected $url;

    /**
     * @var object $sender
     * @ODM\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $sender;

   /**
     * @var string $url
     * @ODM\Field(name="refer", type="string")
     */
    protected $refer;

    /**
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\RightComment")
     */
    protected $rightcomment;

    /**
     * @var timestamp $ts
     * @ODM\Field(name="ts", type="timestamp")
     */
    protected $ts;

    public function __construct(){
        $this->lastParticipantActivityDate = new \DateTime(null, new \DateTimeZone("UTC"));
        $this->ts = $this->lastParticipantActivityDate->getTimestamp();
        $this->participants = new ArrayCollection();
        $this->metadata = new ArrayCollection();

    }

    /**
     * Get participants
     * @return \Doctrine\Common\Collections\Collection $participants
     */
    public function getParticipants()
    {
        return $this->participants;
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

        $meta->setIsRead($isRead);
    }

    /**
     * @see OP\MessageBundle\Model\ReadableInterface::setNbUnreadsByParticipant
     */
    public function setNbUnreadsByParticipant(ParticipantInterface $participant, $unreaded)
    {
        if (!$meta = $this->getMetadataForParticipant($participant)) {
            throw new \InvalidArgumentException(sprintf('No metadata exists for participant with id "%s"', $participant->getId()));
        }
        if(!$unreaded)
            $meta->setNbUnreads($unreaded);
        else 
            $meta->setNbUnreads($meta->getNbUnreads($unreaded) + 1);
    }    

    /**
     * Set author
     *
     * @param OP\UserBundle\Document\User $author
     * @return self
     */
    public function setAuthor(\OP\UserBundle\Document\User $author)
    {
        $this->author = $author;
        return $this;
    }

    /**
     * Get author
     *
     * @return OP\UserBundle\Document\User $author
     */
    public function getAuthor()
    {
        return $this->author;
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
        foreach ($this->metadata as $metadata) {
            if (!$metadata->getIsRead()) {
                $this->unreadForParticipants[] = $metadata->getParticipant()->getId();
            }
        }
    }
    
    /**
     * Ensures that the unreadForParticipants array is updated.
     */
    public function doEnsureUnreadForOthersParticipant(ParticipantInterface $participant)
    {
        foreach ($this->metadata as $metadata) {
            if ($metadata->getIsRead()) {
                if($metadata->getParticipant()->getId() !== $participant->getId()){
                    $unreaded =  $metadata->getNbUnreads();
                    $metadata->setIsRead(false);
                    $metadata->setNbUnreads(($unreaded + 1));
                    $this->unreadForParticipants[] = $metadata->getParticipant()->getId();
                } else {
                    $metadata->setNbUnreads(0);
                }
            }
        }
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
     * Set unreadForParticipants
     *
     * @param collection $unreadForParticipants
     * @return self
     */
    public function setUnreadForParticipants($unreadForParticipants)
    {
        $this->unreadForParticipants = $unreadForParticipants;
        return $this;
    }

    /**
     * Get unreadForParticipants
     *
     * @return collection $unreadForParticipants
     */
    public function getUnreadForParticipants()
    {
        return $this->unreadForParticipants;
    }
    
    /**
     * Set plike
     *
     * @param OP\PostBundle\Document\Like $plike
     * @return self
     */
    public function setPlike(\OP\PostBundle\Document\Like $plike)
    {
        $this->plike = $plike;
        return $this;
    }

    /**
     * Get plike
     *
     * @return OP\PostBundle\Document\Like $plike
     */
    public function getPlike()
    {
        return $this->plike;
    }

    /**
     * Set ulike
     *
     * @param OP\PostBundle\Document\Like $ulike
     * @return self
     */
    public function setUlike(\OP\PostBundle\Document\Like $ulike)
    {
        $this->ulike = $ulike;
        return $this;
    }

    /**
     * Get ulike
     *
     * @return OP\PostBundle\Document\Ulike $ulike
     */
    public function getUlike()
    {
        return $this->ulike;
    }

    /**
     * Add metadatum
     *
     * @param OP\SocialBundle\Document\NotificationMetadata $metadatum
     */
    public function addMetadatum(\OP\SocialBundle\Document\NotificationMetadata $metadatum)
    {
        $this->metadata[] = $metadatum;
    }

    /**
     * Remove metadatum
     *
     * @param OP\SocialBundle\Document\NotificationMetadata $metadatum
     */
    public function removeMetadatum(\OP\SocialBundle\Document\NotificationMetadata $metadatum)
    {
        $this->metadata->removeElement($metadatum);
    }

    /**
     * Set commentNotif
     *
     * @param OP\PostBundle\Document\Post $commentNotif
     * @return self
     */
    public function setCommentNotif(\OP\PostBundle\Document\Post $commentNotif)
    {
        $this->commentNotif = $commentNotif;
        return $this;
    }

    /**
     * Get commentNotif
     *
     * @return OP\PostBundle\Document\Post $commentNotif
     */
    public function getCommentNotif()
    {
        return $this->commentNotif;
    }

    /**
     * Set clikeNotif
     *
     * @param OP\PostBundle\Document\Comment $clikeNotif
     * @return self
     */
    public function setClikeNotif(\OP\PostBundle\Document\Comment $clikeNotif)
    {
        $this->clikeNotif = $clikeNotif;
        return $this;
    }

    /**
     * Get clikeNotif
     *
     * @return OP\PostBundle\Document\Comment $clikeNotif
     */
    public function getClikeNotif()
    {
        return $this->clikeNotif;
    }

    /**
     * Set plikeNotif
     *
     * @param OP\PostBundle\Document\Post $plikeNotif
     * @return self
     */
    public function setPlikeNotif(\OP\PostBundle\Document\Post $plikeNotif)
    {
        $this->plikeNotif = $plikeNotif;
        return $this;
    }

    /**
     * Get plikeNotif
     *
     * @return OP\PostBundle\Document\Post $plikeNotif
     */
    public function getPlikeNotif()
    {
        return $this->plikeNotif;
    }

    /**
     * Set underCNotif
     *
     * @param OP\PostBundle\Document\Comment $underCNotif
     * @return self
     */
    public function setUnderCNotif(\OP\PostBundle\Document\Comment $underCNotif)
    {
        $this->underCNotif = $underCNotif;
        return $this;
    }

    /**
     * Get underCNotif
     *
     * @return OP\PostBundle\Document\Comment $underCNotif
     */
    public function getUnderCNotif()
    {
        return $this->underCNotif;
    }

    /**
     * Set rightNotif
     *
     * @param OP\PostBundle\Document\Opinion $rightNotif
     * @return self
     */
    public function setRightNotif(\OP\PostBundle\Document\Post $rightNotif)
    {
        $this->rightNotif = $rightNotif;
        return $this;
    }

    /**
     * Get rightNotif
     *
     * @return OP\PostBundle\Document\Opinion $rightNotif
     */
    public function getRightNotif()
    {
        return $this->rightNotif;
    }

    /**
     * Set leftNotif
     *
     * @param OP\PostBundle\Document\Opinion $leftNotif
     * @return self
     */
    public function setLeftNotif(\OP\PostBundle\Document\Post $leftNotif)
    {
        $this->leftNotif = $leftNotif;
        return $this;
    }

    /**
     * Get leftNotif
     *
     * @return OP\PostBundle\Document\Opinion $leftNotif
     */
    public function getLeftNotif()
    {
        return $this->leftNotif;
    }

    /**
     * Set lrateNotif
     *
     * @param OP\PostBundle\Document\LeftComment $lrateNotif
     * @return self
     */
    public function setLrateNotif(\OP\PostBundle\Document\LeftComment $lrateNotif)
    {
        $this->lrateNotif = $lrateNotif;
        return $this;
    }

    /**
     * Get lrateNotif
     *
     * @return OP\PostBundle\Document\LeftComment $lrateNotif
     */
    public function getLrateNotif()
    {
        return $this->lrateNotif;
    }

    /**
     * Set rrateNotif
     *
     * @param OP\PostBundle\Document\RightComment $rrateNotif
     * @return self
     */
    public function setRrateNotif(\OP\PostBundle\Document\RightComment $rrateNotif)
    {
        $this->rrateNotif = $rrateNotif;
        return $this;
    }

    /**
     * Get rrateNotif
     *
     * @return OP\PostBundle\Document\RightComment $rrateNotif
     */
    public function getRrateNotif()
    {
        return $this->rrateNotif;
    }

    /**
     * Set prateNotif
     *
     * @param OP\PostBundle\Document\Post $prateNotif
     * @return self
     */
    public function setPrateNotif(\OP\PostBundle\Document\Post $prateNotif)
    {
        $this->prateNotif = $prateNotif;
        return $this;
    }

    /**
     * Get prateNotif
     *
     * @return OP\PostBundle\Document\Post $prateNotif
     */
    public function getPrateNotif()
    {
        return $this->prateNotif;
    }

    /**
     * Set share
     *
     * @param OP\PostBundle\Document\Share $share
     * @return self
     */
    public function setShare(\OP\PostBundle\Document\Share $share)
    {
        $this->share = $share;
        return $this;
    }

    /**
     * Get share
     *
     * @return OP\PostBundle\Document\Share $share
     */
    public function getShare()
    {
        return $this->share;
    }

    /**
     * Set like
     *
     * @param OP\PostBundle\Document\Like $like
     * @return self
     */
    public function setLike(\OP\PostBundle\Document\Like $like)
    {
        $this->like = $like;
        return $this;
    }

    /**
     * Get like
     *
     * @return OP\PostBundle\Document\Like $like
     */
    public function getLike()
    {
        return $this->like;
    }

    /**
     * Set rate
     *
     * @param OP\PostBundle\Document\Rate $rate
     * @return self
     */
    public function setRate(\OP\PostBundle\Document\Rate $rate)
    {
        $this->rate = $rate;
        return $this;
    }

    /**
     * Get rate
     *
     * @return OP\PostBundle\Document\Rate $rate
     */
    public function getRate()
    {
        return $this->rate;
    }

    /**
     * Set rightcomment
     *
     * @param OP\PostBundle\Document\RightComment $rightcomment
     * @return self
     */
    public function setRightcomment(\OP\PostBundle\Document\RightComment $rightcomment)
    {
        $this->rightcomment = $rightcomment;
        return $this;
    }

    /**
     * Get rightcomment
     *
     * @return OP\PostBundle\Document\RightComment $rightcomment
     */
    public function getRightcomment()
    {
        return $this->rightcomment;
    }

    /**
     * Set refer
     *
     * @param string $refer
     * @return self
     */
    public function setRefer($refer)
    {
        $this->refer = $refer;
        return $this;
    }

    /**
     * Get refer
     *
     * @return string $refer
     */
    public function getRefer()
    {
        return $this->refer;
    }

    /**
     * Set message
     *
     * @param string $message
     * @return self
     */
    public function setMessage($message)
    {
        $this->message = $message;
        return $this;
    }

    /**
     * Get message
     *
     * @return string $message
     */
    public function getMessage()
    {
        return $this->message;
    }

    /**
     * Set rlikeNotif
     *
     * @param OP\PostBundle\Document\RightComment $rlikeNotif
     * @return self
     */
    public function setRlikeNotif(\OP\PostBundle\Document\RightComment $rlikeNotif)
    {
        $this->rlikeNotif = $rlikeNotif;
        return $this;
    }

    /**
     * Get rlikeNotif
     *
     * @return OP\PostBundle\Document\RightComment $rlikeNotif
     */
    public function getRlikeNotif()
    {
        return $this->rlikeNotif;
    }

    /**
     * Set lastActivityType
     *
     * @param string $lastActivityType
     * @return self
     */
    public function setLastActivityType($lastActivityType)
    {
        $this->lastActivityType = $lastActivityType;
        return $this;
    }

    /**
     * Get lastActivityType
     *
     * @return string $lastActivityType
     */
    public function getLastActivityType()
    {
        return $this->lastActivityType;
    }
}
