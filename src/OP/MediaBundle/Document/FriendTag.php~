<?php

namespace OP\MediaBundle\Document;

use JMS\Serializer\Annotation\Type,
    JMS\Serializer\Annotation\Expose,
    JMS\Serializer\Annotation\Groups,
    Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;

/**
 * OP\MediaBundle\Document\AboutMe
 *
 * @ODM\EmbeddedDocument
 * @ODM\Document(
 *     repositoryClass="OP\UserBundle\Repository\FriendTagRepository"
 * )
 * @ODM\ChangeTrackingPolicy("DEFERRED_IMPLICIT")
 */
class FriendTag
{

    /**
     * @var MongoId $id
     *
     * @ODM\Id(strategy="AUTO")
     * @Expose
     * @Type("string")
     * @Groups({"Detail", "Me", "Infos", "Profile", "Default"})
     */
    protected $id;

    /**
     * @var string $rectX
     *
     * @Expose
     * @Type("float")
     * @ODM\Field(name="rectX", type="float")
     */
    protected $rectX;

    /**
     * @var string $scale
     *
     * @Expose
     * @Type("float")
     * @ODM\Field(name="scale", type="float")
     */
    protected $scale;

    /**
     * @var string $rectY
     *
     * @Expose
     * @Type("float")
     * @ODM\Field(name="rectY", type="float")
     */
    protected $rectY;

    /**
     * @var string $rectWidth
     *
     * @Expose
     * @Type("float")
     * @ODM\Field(name="rectWidth", type="float")
     */
    protected $rectWidth;

    /**
     * @var string $rectHeight
     *
     * @Expose
     * @Type("float")
     * @ODM\Field(name="rectHeight", type="float")
     */
    protected $rectHeight;

    /**
     *
     * @ODM\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $user;

    /**
     * @var date $createdAt
     *
     * @ODM\Field(name="createdAt", type="date")
     */
    protected $createdAt;



    /**
     *
     * @ODM\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $createdBy;
    
    public function __construct(){
        $this->createdAt = new \Datetime(null, new \DateTimeZone("UTC"));
        //$this->datepubledAt = new \Datetime(null, new \DateTimeZone("UTC"));
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
     * Set rectX
     *
     * @param int $rectX
     * @return $this
     */
    public function setRectX($rectX)
    {
        $this->rectX = $rectX;
        return $this;
    }

    /**
     * Get rectX
     *
     * @return int $rectX
     */
    public function getRectX()
    {
        return $this->rectX;
    }

    /**
     * Set rectY
     *
     * @param int $rectY
     * @return $this
     */
    public function setRectY($rectY)
    {
        $this->rectY = $rectY;
        return $this;
    }

    /**
     * Get rectY
     *
     * @return int $rectY
     */
    public function getRectY()
    {
        return $this->rectY;
    }

    /**
     * Set rectWidth
     *
     * @param int $rectWidth
     * @return $this
     */
    public function setRectWidth($rectWidth)
    {
        $this->rectWidth = $rectWidth;
        return $this;
    }

    /**
     * Get rectWidth
     *
     * @return int $rectWidth
     */
    public function getRectWidth()
    {
        return $this->rectWidth;
    }

    /**
     * Set rectHeight
     *
     * @param int $rectHeight
     * @return $this
     */
    public function setRectHeight($rectHeight)
    {
        $this->rectHeight = $rectHeight;
        return $this;
    }

    /**
     * Get rectHeight
     *
     * @return int $rectHeight
     */
    public function getRectHeight()
    {
        return $this->rectHeight;
    }

    /**
     * Set user
     *
     * @param OP\UserBundle\Document\User $user
     * @return $this
     */
    public function setUser(\OP\UserBundle\Document\User $user)
    {
        $this->user = $user;
        return $this;
    }

    /**
     * Get user
     *
     * @return OP\UserBundle\Document\User $user
     */
    public function getUser()
    {
        return $this->user;
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
     * Set createdBy
     *
     * @param OP\UserBundle\Document\User $createdBy
     * @return $this
     */
    public function setCreatedBy(\OP\UserBundle\Document\User $createdBy)
    {
        $this->createdBy = $createdBy;
        return $this;
    }

    /**
     * Get createdBy
     *
     * @return OP\UserBundle\Document\User $createdBy
     */
    public function getCreatedBy()
    {
        return $this->createdBy;
    }

    /**
     * Set scale
     *
     * @param float $scale
     * @return $this
     */
    public function setScale($scale)
    {
        $this->scale = $scale;
        return $this;
    }

    /**
     * Get scale
     *
     * @return float $scale
     */
    public function getScale()
    {
        return $this->scale;
    }
}
