<?php

namespace OP\MessageBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB,
    OP\MessageBundle\Model\Message as BaseMessage,
    Symfony\Component\HttpFoundation\File\UploadedFile,
    Doctrine\Common\Collections\ArrayCollection;

/**
 *  @MongoDB\Document(
 *      db="opinion",
 *      collection="messages",
 *     repositoryClass="OP\MessageBundle\Repository\MessageRepository",
 * indexes={
 *          @MongoDB\index(keys={"createdAt"="desc"}),
 *          @MongoDB\index(keys={"sender.$id"="asc"}),
 *          @MongoDB\index(keys={"unreadForParticipants"="asc"}),
 *          @MongoDB\index(keys={"thread.$id"="asc", "metadata.participant.$id"="asc"}),
 *       },
 *         requireIndexes=true
 * )
 */
class Message extends BaseMessage
{
    /**
     * @MongoDB\Id(strategy="AUTO")
     */
    protected $id;

    /**
     * @MongoDB\Field(name="unique", type="string")
     * 
     * @var unique
     */
    protected $unique;

    /**
     * @MongoDB\EmbedMany(targetDocument="OP\MessageBundle\Document\MessageMetadata")
     */
    protected $metadata;

    /**
     * @MongoDB\ReferenceOne(targetDocument="OP\MessageBundle\Document\Thread", inversedBy="messages")
     */
    protected $thread;

    /**
     * @MongoDB\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $sender;
    
    /**
     * @MongoDB\EmbedMany(targetDocument="OP\MediaBundle\Document\Document")
     */
    protected $documents;

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\MediaBundle\Document\Image")
     */
    protected $images;

    /**
     * 
     * @MongoDB\Field(name="images_ids", type="collection")
     */
    protected $images_ids = array();

    /**
     * 
     * @MongoDB\Field(name="documents_ids", type="collection")
     */
    protected $documents_idss = array();

    public function __construct() {
        parent::__construct();
        $this->documents = new ArrayCollection();
        $this->images    = new ArrayCollection();
    }

    public function addImagesIds($ids){
        foreach ($ids as $id) {
            $this->images_ids[] = $id;
        }
    }

    public function addDocumentsIds($ids){
        foreach ($ids as $id) {
            $this->documents_ids[] = $id;
        }
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
     * Add document
     *
     * @param OP\MediaBundle\Document\Document $document
     */
    public function addDocument(\OP\MediaBundle\Document\Document $document)
    {
        $this->documents[] = $document;
    }

    /**
     * Remove document
     *
     * @param OP\MediaBundle\Document\Document $document
     */
    public function removeDocument(\OP\MediaBundle\Document\Document $document)
    {
        $this->documents->removeElement($document);
    }

    /**
     * Get documents
     *
     * @return \Doctrine\Common\Collections\Collection $documents
     */
    public function getDocuments()
    {
        return $this->documents;
    }


    /**
     * Add metadatum
     *
     * @param OP\MessageBundle\Document\MessageMetadata $metadatum
     */
    public function addMetadatum(\OP\MessageBundle\Document\MessageMetadata $metadatum)
    {
        $this->metadata[] = $metadatum;
    }

    /**
     * Remove metadatum
     *
     * @param OP\MessageBundle\Document\MessageMetadata $metadatum
     */
    public function removeMetadatum(\OP\MessageBundle\Document\MessageMetadata $metadatum)
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
     * Add video
     *
     * @param OP\MediaBundle\Document\Video $video
     */
    public function addVideo(\OP\MediaBundle\Document\Video $video)
    {
        $this->videos[] = $video;
    }

    /**
     * Remove video
     *
     * @param OP\MediaBundle\Document\Video $video
     */
    public function removeVideo(\OP\MediaBundle\Document\Video $video)
    {
        $this->videos->removeElement($video);
    }

    /**
     * Get videos
     *
     * @return \Doctrine\Common\Collections\Collection $videos
     */
    public function getVideos()
    {
        return $this->videos;
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

    /**
     * Remove metadata
     *
     * @param OP\MessageBundle\Document\MessageMetadata $metadata
     */
    public function removeMetadata(\OP\MessageBundle\Document\MessageMetadata $metadata)
    {
        $this->metadata->removeElement($metadata);
    }

    /**
     * Set documentsIdss
     *
     * @param collection $documentsIdss
     * @return $this
     */
    public function setDocumentsIdss($documentsIdss)
    {
        $this->documents_idss = $documentsIdss;
        return $this;
    }

    /**
     * Get documentsIdss
     *
     * @return collection $documentsIdss
     */
    public function getDocumentsIdss()
    {
        return $this->documents_idss;
    }
}
