<?php

namespace OP\MessageBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM,
    Symfony\Component\HttpFoundation\File\UploadedFile,
    Doctrine\Common\Collections\ArrayCollection;

/**
 * OP\MessageBundle\Document\Presponse
 *
 * @ODM\Document(
 *      db="opinion",
 *      collection="responses",
 *     repositoryClass="OP\MessageBundle\Repository\ResponseRepository",
 * indexes={
 *          @ODM\index(keys={"createdAt"="desc"}),
 *          @ODM\index(keys={"author.$id"="asc"}),
 *          @ODM\index(keys={"question.$id"="asc"}),
 *       },
 *         requireIndexes=true
 * )
 */
class Response
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
     * @var date $updateAt
     *
     * @ODM\Field(name="updateAt", type="date")
     */
    protected $updateAt;

    /**
     * @ODM\Field(name="unique", type="string")
     * 
     * @var unique
     */
    protected $unique;
    
    /**
     * @var string $documentValid
     *
     * @ODM\Field(name="documentValid", type="string")
     */
    protected $documentValid;
    
    /**
     * @ODM\ReferenceMany(targetDocument="OP\MediaBundle\Document\Image")
     */
    protected $images;
    
    /**
     * @ODM\ReferenceOne(targetDocument="OP\MessageBundle\Document\Question", inversedBy="responses")
     */
    protected $question;
    
    /**
     *
     * @ODM\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $author;
    
    public $file;

    /**
     * @var string $content
     *
     * @ODM\Field(name="content", type="raw")
     */
    protected $content;

    /**
     * 
     * @ODM\Field(name="images_ids", type="collection")
     */
    protected $images_ids = array();

    public function __construct() {
        $this->createdAt = new \DateTime(null, new \DateTimeZone("UTC"));
        $this->images = new ArrayCollection();
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

    public function setFile(UploadedFile $file)
    {
        $this->file = $file;
    }

    public function getFile()
    {
        if ($this->file == 0){

        }else{
            return $this->file;
        }
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
     * Set updateAt
     *
     * @param date $updateAt
     * @return self
     */
    public function setUpdateAt($updateAt)
    {
        $this->updateAt = $updateAt;
        return $this;
    }

    /**
     * Get updateAt
     *
     * @return date $updateAt
     */
    public function getUpdateAt()
    {
        return $this->updateAt;
    }

    /**
     * Set documentValid
     *
     * @param string $documentValid
     * @return self
     */
    public function setDocumentValid($documentValid)
    {
        $this->documentValid = $documentValid;
        return $this;
    }

    /**
     * Get documentValid
     *
     * @return string $documentValid
     */
    public function getDocumentValid()
    {
        return $this->documentValid;
    }

    /**
     * Add image
     *
     * @param OP\MediaBundle\Document\Image $image
     */
    public function addImage(\OP\MediaBundle\Document\Image $image)
    {
        $this->images[] = $image;
    }

    /**
     * Remove image
     *
     * @param OP\MediaBundle\Document\Image $image
     */
    public function removeImage(\OP\MediaBundle\Document\Image $image)
    {
        $this->images->removeElement($image);
    }

    /**
     * Get images
     *
     * @return \Doctrine\Common\Collections\Collection $images
     */
    public function getImages()
    {
        return $this->images;
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
     * Set questionId
     *
     * @param OP\MessageBundle\Document\Question $questionId
     * @return self
     */
    public function setQuestionId(\OP\MessageBundle\Document\Question $questionId)
    {
        $this->questionId = $questionId;
        return $this;
    }

    /**
     * Get questionId
     *
     * @return OP\MessageBundle\Document\Question $questionId
     */
    public function getQuestionId()
    {
        return $this->questionId;
    }

    /**
     * Set question
     *
     * @param OP\MessageBundle\Document\Question $question
     * @return self
     */
    public function setQuestion(\OP\MessageBundle\Document\Question $question)
    {
        $this->question = $question;
        return $this;
    }

    /**
     * Get question
     *
     * @return OP\MessageBundle\Document\Question $question
     */
    public function getQuestion()
    {
        return $this->question;
    }

    /**
     * Set imagesIds
     *
     * @param collection $imagesIds
     * @return $this
     */
    public function setImagesIds($imagesIds)
    {
        $this->images_ids = $imagesIds;
        return $this;
    }

    /**
     * Get imagesIds
     *
     * @return collection $imagesIds
     */
    public function getImagesIds()
    {
        return $this->images_ids;
    }

    /**
     * Set unique
     *
     * @param string $unique
     * @return $this
     */
    public function setUnique($unique)
    {
        $this->unique = $unique;
        return $this;
    }

    /**
     * Get unique
     *
     * @return string $unique
     */
    public function getUnique()
    {
        return $this->unique;
    }
}
