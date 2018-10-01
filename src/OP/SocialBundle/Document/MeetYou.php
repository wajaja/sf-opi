<?php

namespace OP\SocialBundle\Document;

use OP\UserBundle\Document\Group,
	Doctrine\Common\Collections\Collection,
    JMS\Serializer\Annotation\Type,
    JMS\Serializer\Annotation\Expose,
    JMS\Serializer\Annotation\Groups,
    JMS\Serializer\Annotation\ExclusionPolicy,
    JMS\Serializer\Annotation\VirtualProperty,
    Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB,
    Symfony\Component\Validator\Constraints as Assert,
    Doctrine\Common\Collections\ArrayCollection,
    OP\MessageBundle\Model\ParticipantInterface;

/**
 * @MongoDB\Document(
 *      db="opinion",
 *      collection="meetyous",
 *      repositoryClass="OP\PostBundle\Repository\MeetYouRepository",
 * indexes={
 *          @MongoDB\index(keys={"createdAt"="desc"}),
 *          @MongoDB\index(keys={"author.$id"="desc"}),
 *       },
 *         requireIndexes=true
 * )
 * @ExclusionPolicy("all") 
 */
class MeetYou extends Group
{

     /**
     * @Expose
     * @Type("string")
     * @MongoDB\Id
     */
    protected $id;

    /**
     * @MongoDB\Field(name="content", type="raw")
     * 
     * @var content
     */
    protected $content;

    /**
     * @MongoDB\Field(name="place", type="raw")
     * 
     * @var place
     */
    protected $place;


    /**
     * 
     * @var unique
     */
    protected $unique;

    /**
     * @MongoDB\Field(name="title", type="string")
     * 
     * @var title
     */
    protected $title;

    /**
     * @MongoDB\Field(name="type", type="string")
     * 
     * @var title
     */
    protected $type;

    /**
     * refer for others editors posts to sameone
     * @MongoDB\Field(name="nbSended", type="increment")
     * 
     * @var nbSended 
     */
    protected $nbSended = 0;

    /**
     * refer for others editors posts to sameone
     * @MongoDB\Field(name="nbValided", type="increment")
     * 
     * @var nbSended 
     */
    protected $nbValided = 0;

    /**
     * @MongoDB\Field(name="expireAt", type="date")
     * 
     * @var createdAt
     */
    protected $expireAt;

    /**
     * @MongoDB\Field(name="createdAt", type="date")
     * 
     * @var createdAt
     */
    protected $createdAt;

    /**
     * @var type Int
     *
     * @MongoDB\Field(name="scaleW", type="int")
     * 
     */
    protected $scaleW = 0;

    /**
     * @var type Int
     *
     * @MongoDB\Field(name="scaleH", type="int")
     * 
     */
    protected $scaleH = 0;

    /**
     * Set content
     *
     * @param raw $content
     * @return $this
     */
    public function setContent($content)
    {
        $this->content = $content;
        return $this;
    }

    /**
     * Get content
     *
     * @return raw $content
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * Set place
     *
     * @param raw $place
     * @return $this
     */
    public function setPlace($place)
    {
        $this->place = $place;
        return $this;
    }

    /**
     * Get place
     *
     * @return raw $place
     */
    public function getPlace()
    {
        return $this->place;
    }

    /**
     * Set title
     *
     * @param string $title
     * @return $this
     */
    public function setTitle($title)
    {
        $this->title = $title;
        return $this;
    }

    /**
     * Get title
     *
     * @return string $title
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set type
     *
     * @param string $type
     * @return $this
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
     * Set nbSended
     *
     * @param increment $nbSended
     * @return $this
     */
    public function setNbSended($nbSended)
    {
        $this->nbSended = $nbSended;
        return $this;
    }

    /**
     * Get nbSended
     *
     * @return increment $nbSended
     */
    public function getNbSended()
    {
        return $this->nbSended;
    }

    /**
     * Set nbValided
     *
     * @param increment $nbValided
     * @return $this
     */
    public function setNbValided($nbValided)
    {
        $this->nbValided = $nbValided;
        return $this;
    }

    /**
     * Get nbValided
     *
     * @return increment $nbValided
     */
    public function getNbValided()
    {
        return $this->nbValided;
    }

    /**
     * Set expireAt
     *
     * @param date $expireAt
     * @return $this
     */
    public function setExpireAt($expireAt)
    {
        $this->expireAt = $expireAt;
        return $this;
    }

    /**
     * Get expireAt
     *
     * @return date $expireAt
     */
    public function getExpireAt()
    {
        return $this->expireAt;
    }

    /**
     * Set scaleW
     *
     * @param int $scaleW
     * @return $this
     */
    public function setScaleW($scaleW)
    {
        $this->scaleW = $scaleW;
        return $this;
    }

    /**
     * Get scaleW
     *
     * @return int $scaleW
     */
    public function getScaleW()
    {
        return $this->scaleW;
    }

    /**
     * Set scaleH
     *
     * @param int $scaleH
     * @return $this
     */
    public function setScaleH($scaleH)
    {
        $this->scaleH = $scaleH;
        return $this;
    }

    /**
     * Get scaleH
     *
     * @return int $scaleH
     */
    public function getScaleH()
    {
        return $this->scaleH;
    }
}
