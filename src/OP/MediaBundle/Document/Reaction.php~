<?php

namespace OP\MediaBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;

/**
 * OP\MediaBundle\Document\Reaction
 *
 * @ODM\Document(
 *      db="opinion",
 *      collection="reactions",
 *     repositoryClass="OP\MediaBundle\Repository\ReactionRepository"
 * )
 * @ODM\ChangeTrackingPolicy("DEFERRED_IMPLICIT")
 */
class Reaction
{
    /**
     * @var MongoId $id
     *
     * @ODM\Id(strategy="AUTO")
     */
    protected $id;

    /**
     * @var date $createdAt
     *
     * @ODM\Field(name="createdAt", type="date")
     */
    protected $createdAt;

    /**
     * @var string $path
     *
     * @ODM\Field(name="path", type="string")
     */
    protected $path;

    /**
     * @var string $alt
     *
     * @ODM\Field(name="alt", type="string")
     */
    protected $alt;

    /**
     * @var timestamp $ts
     *
     * @ODM\Field(name="ts", type="timestamp")
     */
    protected $ts;
    /**
     *
     * @ODM\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $author;

    /**
     *
     * @ODM\ReferenceOne(targetDocument="OP\MediaBundle\Document\MediaStreamRecorder")
     */
    protected $record;


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
     * Set createdAt
     *
     * @param date $createdAt
     * @return self
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
     * Set path
     *
     * @param string $path
     * @return self
     */
    public function setPath($path)
    {
        $this->path = $path;
        return $this;
    }

    /**
     * Get path
     *
     * @return string $path
     */
    public function getPath()
    {
        return $this->path;
    }

    /**
     * Set alt
     *
     * @param string $alt
     * @return self
     */
    public function setAlt($alt)
    {
        $this->alt = $alt;
        return $this;
    }

    /**
     * Get alt
     *
     * @return string $alt
     */
    public function getAlt()
    {
        return $this->alt;
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
     * Set recordId
     *
     * @param OP\MediaBundle\Document\MediaStreamRecorder $recordId
     * @return self
     */
    public function setRecordId(\OP\MediaBundle\Document\MediaStreamRecorder $recordId)
    {
        $this->recordId = $recordId;
        return $this;
    }

    /**
     * Get recordId
     *
     * @return OP\MediaBundle\Document\MediaStreamRecorder $recordId
     */
    public function getRecordId()
    {
        return $this->recordId;
    }

    /**
     * Set ts
     *
     * @param timestamp $ts
     * @return $this
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
     * Set record
     *
     * @param OP\MediaBundle\Document\MediaStreamRecorder $record
     * @return self
     */
    public function setRecord(\OP\MediaBundle\Document\MediaStreamRecorder $record)
    {
        $this->record = $record;
        return $this;
    }

    /**
     * Get record
     *
     * @return OP\MediaBundle\Document\MediaStreamRecorder $record
     */
    public function getRecord()
    {
        return $this->record;
    }
}
