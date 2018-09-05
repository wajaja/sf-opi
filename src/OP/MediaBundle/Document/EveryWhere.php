<?php

namespace OP\MediaBundle\Document;

use JMS\Serializer\Annotation\{Type, Expose, Groups, ExclusionPolicy};
use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;

/**
 * OP\MediaBundle\Document\AboutMe
 *
 * @ODM\Document(
 *      db="opinion",
 *      collection="everywheres",
 *      repositoryClass="OP\MediaBundle\Repository\EveryWhereRepository"
 * )
 * @ODM\HasLifecycleCallbacks
 * @ExclusionPolicy("all")
 */
class EveryWhere
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
     * @Type("int")
     * @ODM\Field(name="rectX", type="int")
     */
    protected $rectX;

    /**
     * @var string $rectY
     *
     * @Expose
     * @Type("int")
     * @ODM\Field(name="rectY", type="int")
     */
    protected $rectY;

    /**
     * @var string $rectWidth
     *
     * @Expose
     * @Type("int")
     * @ODM\Field(name="rectWidth", type="int")
     */
    protected $rectWidth;

    /**
     * @var string $rectHeight
     *
     * @Expose
     * @Type("int")
     * @ODM\Field(name="rectHeight", type="int")
     */
    protected $rectHeight;

    /**
     * @var string $rectHeight
     *
     * @Expose
     * @Type("string")
     * @ODM\Field(name="charCode", type="string")
     */
    protected $charCode;

    /**
     * @var date $createdAt
     * @Expose
     * @ODM\Field(name="createdAt", type="date")
     */
    protected $createdAt;

    /**
     * @var date $updatedAt
     * @Expose
     * @ODM\Field(name="updatedAt", type="date")
     */
    protected $updatedAt;

    /**
     * @var string $scale
     *
     * @Expose
     * @Type("float")
     * @ODM\Field(name="scaleX", type="float")
     */
    protected $scaleX;

    /**
     * @var string $scale
     *
     * @Expose
     * @Type("float")
     * @ODM\Field(name="scaleY", type="float")
     */
    protected $scaleY;

    /**
     * @Expose
     * @ODM\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     * @Groups({"Default"})
     */
    protected $createdBy;

    /**
     * @ODM\ReferenceOne(targetDocument="OP\MediaBundle\Document\Image")
     */
    protected $photo;

     /**
     * @Expose
     * @ODM\Field(name="photoId", type="string")
     */
    protected $photoId;
    
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
     * Set charCode
     *
     * @param string $charCode
     * @return $this
     */
    public function setCharCode($charCode)
    {
        $this->charCode = $charCode;
        return $this;
    }

    /**
     * Get charCode
     *
     * @return string $charCode
     */
    public function getCharCode()
    {
        return $this->charCode;
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
     * Set scaleX
     *
     * @param float $scaleX
     * @return $this
     */
    public function setScaleX($scaleX)
    {
        $this->scaleX = $scaleX;
        return $this;
    }

    /**
     * Get scaleX
     *
     * @return float $scaleX
     */
    public function getScaleX()
    {
        return $this->scaleX;
    }

    /**
     * Set scaleY
     *
     * @param float $scaleY
     * @return $this
     */
    public function setScaleY($scaleY)
    {
        $this->scaleY = $scaleY;
        return $this;
    }

    /**
     * Get scaleY
     *
     * @return float $scaleY
     */
    public function getScaleY()
    {
        return $this->scaleY;
    }

    /**
     * Set photo
     *
     * @param OP\MediaBundle\Document\Image $photo
     * @return $this
     */
    public function setPhoto(\OP\MediaBundle\Document\Image $photo)
    {
        $this->photo = $photo;
        return $this;
    }

    /**
     * Get photo
     *
     * @return OP\MediaBundle\Document\Image $photo
     */
    public function getPhoto()
    {
        return $this->photo;
    }

    /**
     * Set updatedAt
     *
     * @param date $updatedAt
     * @return $this
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }

    /**
     * Get updatedAt
     *
     * @return date $updatedAt
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    /**
     * Set photoId
     *
     * @param string $photoId
     * @return $this
     */
    public function setPhotoId($photoId)
    {
        $this->photoId = $photoId;
        return $this;
    }

    /**
     * Get photoId
     *
     * @return string $photoId
     */
    public function getPhotoId()
    {
        return $this->photoId;
    }
}
