<?php

namespace OP\SocialBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;

/**
 * OP\SocialBundle\Document\NewSuggestion
 *
 * @ODM\Document
 * @ODM\ChangeTrackingPolicy("DEFERRED_IMPLICIT")
 */
class NewSuggestion
{
    /**
     * @var MongoId $id
     *
     * @ODM\Id(strategy="AUTO")
     */
    protected $id;

    /**
     * @var object_id $author
     *
     * @ODM\Field(name="author", type="object_id")
     */
    protected $author;

    /**
     * @var date $date
     *
     * @ODM\Field(name="date", type="date")
     */
    protected $date;

    /**
     * @var timestamp $ts
     *
     * @ODM\Field(name="ts", type="timestamp")
     */
    protected $ts;

    /**
     * @var string $url
     *
     * @ODM\Field(name="url", type="string")
     */
    protected $url;

    /**
     * @var string $body
     *
     * @ODM\Field(name="body", type="string")
     */
    protected $body;

    /**
     * @var object_id $participant
     *
     * @ODM\Field(name="participant", type="object_id")
     */
    protected $participant;

    /**
     * @var string $type
     *
     * @ODM\Field(name="type", type="string")
     */
    protected $type;


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
     * Set author
     *
     * @param object_id $author
     * @return self
     */
    public function setAuthor($author)
    {
        $this->author = $author;
        return $this;
    }

    /**
     * Get author
     *
     * @return object_id $author
     */
    public function getAuthor()
    {
        return $this->author;
    }

    /**
     * Set date
     *
     * @param date $date
     * @return self
     */
    public function setDate($date)
    {
        $this->date = $date;
        return $this;
    }

    /**
     * Get date
     *
     * @return date $date
     */
    public function getDate()
    {
        return $this->date;
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
     * Set body
     *
     * @param string $body
     * @return self
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
     * Set participant
     *
     * @param object_id $participant
     * @return self
     */
    public function setParticipant($participant)
    {
        $this->participant = $participant;
        return $this;
    }

    /**
     * Get participant
     *
     * @return object_id $participant
     */
    public function getParticipant()
    {
        return $this->participant;
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
}
