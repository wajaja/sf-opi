<?php

namespace OP\MessageBundle\Document;

use Doctrine\Common\Collections\ArrayCollection,
    Doctrine\ODM\MongoDB\Mapping\Annotations as ODM,
    OP\MessageBundle\Model\ParticipantInterface;

/**
 * OP\MessageBundle\Document\Pquestion
 *
 * @ODM\Document(
 *      db="opinion",
 *      collection="questions",
 *     repositoryClass="OP\MessageBundle\Repository\QuestionRepository",
 * indexes={
 *          @ODM\index(keys={"createdAt"="desc"}),
 *          @ODM\index(keys={"createdBy.$id"="asc"})
 *       },
 *         requireIndexes=true
 * )
 */
class Question
{
    /**
     * @var MongoId $id
     *
     * @ODM\Id(strategy="AUTO")
     */
    protected $id;

    /**
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\Post")
     */
    protected $post;
    
    /**
     * @ODM\ReferenceMany(targetDocument="OP\UserBundle\Document\User")
     */
    protected $participants;
    
    /**
     * @ODM\ReferenceMany(targetDocument="OP\MessageBundle\Document\Response",  mappedBy="question")
     *
     */
    protected $responses;
    
     /**
     * @ODM\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $createdBy;
    
    /**
    * @var date $lastResponseDate
    *
    * @ODM\Field(name="lastResponseDate", type="date")
    */
    protected $lastResponseDate;
    
    /**
    * @var date $createdAt
    *
    * @ODM\Field(name="createdAt", type="date")
    */
    protected $createdAt;

    /**
     * @ODM\ReferenceOne(targetDocument="OP\MediaBundle\Document\Image")
     */
    protected $photo;

    public function __construct(){
        $this->createdAt = new \Datetime(null, new \DateTimeZone("UTC"));
        $this->participants = new ArrayCollection();
        $this->responses = new ArrayCollection();
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
    * Adds a participant to the thread
    * If it already exists, nothing is done.
    *
    * @param ParticipantInterface $participant
    * @return null
    */
    public function addParticipant(ParticipantInterface $participant)
    {
       if (!$this->isParticipant($participant)) {
           $this->participants->add($participant);
       }
    }

    /**
    * Tells if the user participates to the conversation
    *
    * @param ParticipantInterface $participant
    * @return boolean
    */
    public function isParticipant(ParticipantInterface $participant)
    {
       return $this->participants->contains($participant);
    }

    /**
    * Gets the users participating in this conversation
    *
    * @return array of ParticipantInterface
    */
    public function getParticipants()
    {
       return $this->participants->toArray();
    }

    /**
    * Remove participant
    * @param OP\UserBundle\Document\User $participant
    */
    public function removeParticipant(\OP\UserBundle\Document\User $participant)
    {
       $this->participants->removeElement($participant);
    }

    /**
     * Set createdBy
     *
     * @param OP\UserBundle\Document\User $createdBy
     * @return self
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
     * Set lastResponseDate
     *
     * @param date $lastResponseDate
     * @return self
     */
    public function setLastResponseDate($lastResponseDate)
    {
        $this->lastResponseDate = $lastResponseDate;
        return $this;
    }

    /**
     * Get lastResponseDate
     *
     * @return date $lastResponseDate
     */
    public function getLastResponseDate()
    {
        return $this->lastResponseDate;
    }

    /**
     * Add response
     *
     * @param OP\MessageBundle\Document\Response $response
     */
    public function addResponse(\OP\MessageBundle\Document\Response $response)
    {
        $this->responses[] = $response;
    }

    /**
     * Remove response
     *
     * @param OP\MessageBundle\Document\Response $response
     */
    public function removeResponse(\OP\MessageBundle\Document\Response $response)
    {
        $this->responses->removeElement($response);
    }

    /**
     * Get responses
     *
     * @return \Doctrine\Common\Collections\Collection $responses
     */
    public function getResponses()
    {
        return $this->responses;
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
     * Set photo
     *
     * @param OP\MediaBundle\Document\Image $photo
     * @return self
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
}
