<?php

namespace OP\SocialBundle\Model;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;
use OP\MessageBundle\Model\ParticipantInterface;

/**
 * Description of Notification
 * @author CEDRICK
 */
class Notification
{
    /**
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\Post")
     */
    protected $post;

	/**
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\Post")
     */
    protected $commentNotif;

	/**
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\Comment")
     */
    protected $clikeNotif;

	/**
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\Post")
     */
    protected $plikeNotif;

	/**
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\Comment")
     */
    protected $underCNotif;

	/**
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\RightComment")
     */
    protected $rlikeNotif;

	/**
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\Post")
     */
    protected $rightNotif;
    
    /**
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\LeftComment")
     */
    protected $lrateNotif;
    
    /**
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\RightComment")
     */
    protected $rrateNotif;
    
    /**
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\Post")
     */
    protected $prateNotif;

    /**
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\Post")
     */
    protected $leftNotif;

    /**
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\LeftComment")
     */
    protected $leftcomment;

    /**
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\Share")
     */
    protected $share;

    /**
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\Comment")
     */
    protected $comment;

    /**
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\UnderComment")
     */
    protected $undercomment;

    /**
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\Like")
     */
    protected $like;

    /**
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\Rate")
     */
    protected $rate;

    /**
     * @var type
     * @ODM\EmbedMany(targetDocument="OP\SocialBundle\Document\NotificationMetadata")
     */
    protected $metadata;

    /**
     * @ODM\ReferenceMany(targetDocument="OP\UserBundle\Document\User")
     */
    protected $participants = array();

    /**
     * @ODM\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $lastParticipant;

    /**
     * Get id
     * @return id $id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set post
     *
     * @param OP\PostBundle\Document\Post $post
     * @return self
     */
    public function setPost(\OP\PostBundle\Document\Post $post)
    {
        $this->post = $post;
        return $this;
    }

    /**
     * Get post
     *
     * @return OP\PostBundle\Document\Post $post
     */
    public function getPost()
    {
        return $this->post;
    }

    /**
     * Set leftcomment
     *
     * @param OP\PostBundle\Document\LeftComment $leftcomment
     * @return self
     */
    public function setLeftcomment(\OP\PostBundle\Document\LeftComment $leftcomment)
    {
        $this->leftcomment = $leftcomment;
        return $this;
    }

    /**
     * Get leftcomment
     *
     * @return OP\PostBundle\Document\LeftComment $leftcomment
     */
    public function getLeftcomment()
    {
        return $this->leftcomment;
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
     * Set comment
     *
     * @param OP\PostBundle\Document\Comment $comment
     * @return self
     */
    public function setComment(\OP\PostBundle\Document\Comment $comment)
    {
        $this->comment = $comment;
        return $this;
    }

    /**
     * Get comment
     *
     * @return OP\PostBundle\Document\Comment $comment
     */
    public function getComment()
    {
        return $this->comment;
    }

    /**
     * Set lastParticipantActivityDate
     *
     * @param date $lastParticipantActivityDate
     * @return self
     */
    public function setLastParticipantActivityDate($lastParticipantActivityDate)
    {
        $this->lastParticipantActivityDate = $lastParticipantActivityDate;
        return $this;
    }

    /**
     * Get lastParticipantActivityDate
     *
     * @return date $lastParticipantActivityDate
     */
    public function getLastParticipantActivityDate()
    {
        return $this->lastParticipantActivityDate;
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
     * Set type
     *
     * @param string $type
     * @return self
     */
    public function setType($type)
    {
        $this->type = $type;
        return $this;
    }

    /**
     * Get type
     *
     * @return string $type
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Set url
     *
     * @param string $url
     * @return self
     */
    public function setUrl($url)
    {
        $this->url = $url;
        return $this;
    }

    /**
     * Get url
     *
     * @return string $url
     */
    public function getUrl()
    {
        return $this->url;
    }

    /**
     * Set content
     *
     * @param string $content
     * @return self
     */
    public function setContent($content)
    {
        $this->content = $content;
        return $this;
    }

    /**
     * Get content
     *
     * @return string $content
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * Set contentId
     *
     * @param string $contentId
     * @return self
     */
    public function setContentId($contentId)
    {
        $this->contentId = $contentId;
        return $this;
    }

    /**
     * Get contentId
     *
     * @return string $contentId
     */
    public function getContentId()
    {
        return $this->contentId;
    }

    /**
     * Set ts
     *
     * @param timestamp $ts
     * @return self
     */
    public function setTs($ts)
    {
        $this->ts = $ts;
        return $this;
    }

    /**
     * Get ts
     *
     * @return timestamp $ts
     */
    public function getTs()
    {
        return $this->ts;
    }

    /**
     * Add metadata
     *
     * @param OP\SocialBundle\Document\NotificationMetadata $metadata
     */
    public function addMetadata(\OP\SocialBundle\Document\NotificationMetadata $metadata)
    {
        $this->metadata->add($metadata);
    }

    /**
     * Remove metadata
     *
     * @param OP\SocialBundle\Document\NotificationMetadata $metadata
     */
    public function removeMetadata(\OP\SocialBundle\Document\NotificationMetadata $metadata)
    {
        $this->metadata->removeElement($metadata);
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
     * Add participant
     *
     * @param OP\UserBundle\Document\User $participant
     */
    public function addParticipant(\OP\UserBundle\Document\User $participant)
    {
        $this->participants[] = $participant;
    }

    /**
     * Remove participant
     *
     * @param OP\UserBundle\Document\User $participant
     */
    public function removeParticipant(\OP\UserBundle\Document\User $participant)
    {
        $this->participants->removeElement($participant);
    }

    /**
     * Set undercomment
     *
     * @param OP\PostBundle\Document\UnderComment $undercomment
     * @return self
     */
    public function setUndercomment(\OP\PostBundle\Document\UnderComment $undercomment)
    {
        $this->undercomment = $undercomment;
        return $this;
    }

    /**
     * Get undercomment
     *
     * @return OP\PostBundle\Document\UnderComment $undercomment
     */
    public function getUndercomment()
    {
        return $this->undercomment;
    }

    /**
     * Set lastParticipant
     *
     * @param OP\UserBundle\Document\User $lastParticipant
     * @return self
     */
    public function setLastParticipant(\OP\UserBundle\Document\User $lastParticipant)
    {
        $this->lastParticipant = $lastParticipant;
        return $this;
    }

    /**
     * Get lastParticipant
     *
     * @return OP\UserBundle\Document\User $lastParticipant
     */
    public function getLastParticipant()
    {
        return $this->lastParticipant;
    }
}
