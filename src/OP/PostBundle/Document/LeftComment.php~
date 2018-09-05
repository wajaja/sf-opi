<?php

namespace OP\PostBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB,
    Symfony\Component\Validator\Constraints as Assert,
    Doctrine\Common\Collections\ArrayCollection,
    Symfony\Component\HttpFoundation\File\File,
    OP\PostBundle\Model\LeftComment as BaseComment,
    OP\SocialBundle\SeveralClass\DateTransformer;

/**
 * @MongoDB\Document(
 *      db="opinion",
 *      collection="leftcomments",
 *      repositoryClass="OP\PostBundle\Repository\LeftCommentRepository")
 */
class LeftComment extends BaseComment
{
    /**
     * @MongoDB\Id(strategy="AUTO")
     */
    protected $id;

    /**
     * @MongoDB\Field(name="content", type="raw")
     * @Assert\NotBlank()
     *
     */
    protected $content;

    /**
     * @MongoDB\Field(name="createdAt", type="date")
     *
     */
    protected $createdAt;

    /**
     * @MongoDB\Field(name="updateAt", type="date")
     *
     * @Assert\DateTime()
     */
    protected $updateAt;

    /**
     * @MongoDB\Field(name="postValid", type="string")
     * @Assert\NotBlank()
     */
    protected $postValid;

    /**
     * @MongoDB\Field(name="opinionOrder", type="int")
     *
     */
    protected $opinionOrder;

    /**
     * @MongoDB\Field(name="type", type="string")
     *
     * @var type
     */
    protected $type = 'comment';

    /**
     * @MongoDB\Field(name="opinionTitle", type="string")
     * 
     * @var opinionTitle
     */
    protected $opinionTitle;

    /**
     * Name come from opinion author set
     * @MongoDB\Field(name="sideName", type="string")
     * @var sideName
     */
    protected $sideName = 'leftComment';    

    /**
     *
     * @MongoDB\Field(name="order", type="int")
     *
     * @var order
     */
    protected $order;

    /**
     * @var  $notification
     *
     * @MongoDB\ReferenceOne(targetDocument="OP\SocialBundle\Document\Notification", cascade={"remove"})
     */
    protected $LegalNotification;
    
    /**
     * remove image when _edit 
     * 
     * @MongoDB\Field(name="rmv_arr", type="string")
     *
     * @var type 
     */
    protected $rmv_arr;
    
    /**
     * @var timestamp $ts
     *
     * @MongoDB\Field(name="ts", type="timestamp")
     */
    protected $ts;

    public $file;

    /**
     * 
     * @MongoDB\Field(name="nbLegals", type="increment")
     *
     * @var nbLegals
     */
    protected $nbLegals = 0;

    /**
     * 
     * @MongoDB\Field(name="nbComments", type="increment")
     *
     * @var nbComments
     */
    protected $nbComments = 0;

    /**
     * 
     * @MongoDB\Field(name="legals_ids", type="collection")
     *
     * @var legals_ids
     */
    protected $legals_ids = array();
    
    /**
    * @var collection $maskersForUserIds
    * @MongoDB\Field(name="maskersForUserIds", type="collection")
    */
    protected $maskersForUserIds = array();
    
    /**
     * 
     * @MongoDB\Field(name="objectType", type="string")
     * 
     * @var type  
     */
    protected $objectType = 'leftcomment';

    /**
     * 
     * @MongoDB\Field(name="images_ids", type="collection")
     * 
     */
    protected $images_ids = array();
    
    /**
    * @var collection $favoritesForUserIds
    * @MongoDB\Field(name="favoritesForUserIds", type="collection")
    */
    protected $favoritesForUserIds = array();

    /**
    * @var string $keywords
    * @MongoDB\Field(name="keywords", type="string")
    */
    protected $keywords = '';

    public function __construct()
    {
        $this->createdAt = new \Datetime(null, new \DateTimeZone("UTC"));
        $this->files = new ArrayCollection();
        $this->images = new ArrayCollection();
        $this->rates = new ArrayCollection();
        $this->objectType = 'leftcomment';
    }

    public function addImagesIds($ids){
        foreach ($ids as $id) {
            $this->images_ids[] = $id;
        }
    }
    
    public function updatedAtTrans(){
        $date_trans = new DateTransformer();
        return $this->isUpdated() ? 
               $date_trans->timestampTransform($this->getUpdateAt()->getTimestamp()) 
               : null;
    }
    
    public function createdAtTrans(){
        $date_trans = new DateTransformer();
        return $date_trans->timestampTransform($this->getCreatedAt()->getTimestamp());
    }

     /**
     * 
     * @return boolean
     */
    public function isUpdated(){
        if(!$this->getUpdateAt()){
            return false;
        }
        return true;
    }
    
    /**
    *
    * @param string $id
    * @return self
    */
    public function setId($id){
        $this->id = $id;
        return $this;
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

    public function setFile(File $file)
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
     */
    public function incrementComments()
    {
        $this->nbComments++;
    }

    /**
     * incrementLikers
     */
    public function decrementComments()
    {
        $this->nbComments--;
    }

    /**
     * 
     */
    public function incrementLegals()
    {
        $this->nbLegals++;
    }

     /**
     * 
     */
    public function decrementLegals()
    {
        $this->nbLegals--;
    }

    /**
     * Get nbLlikers
     *
     * @return int $nbLlikers
     */
    public function getNbLlikers()
    {
        return $this->nbLlikers;
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
     * Set maskersForUserIds
     *
     * @param collection $maskersForUserIds
     * @return self
     */
    public function setMaskersForUserIds($maskersForUserIds)
    {
        $this->maskersForUserIds = $maskersForUserIds;
        return $this;
    }

    /**
     * Ensures that active participant, recipient and sender arrays are updated.
     */
    public function doLegalsIds($legal_id, $how)
    {
        if($how === 'push') {
            $this->legals_ids []= $legal_id;
        } else {
            if(($key = array_search($legal_id, $this->legals_ids)) !== false) {
                unset($this->legals_ids[$key]);
            }
        }
    }

    /**
     * Get maskersForUserIds
     *
     * @return collection $maskersForUserIds
     */
    public function getMaskersForUserIds()
    {
        return $this->maskersForUserIds;
    }

    /**
     * Set favoritesForUserIds
     *
     * @param collection $favoritesForUserIds
     * @return self
     */
    public function setFavoritesForUserIds($favoritesForUserIds)
    {
        $this->favoritesForUserIds = $favoritesForUserIds;
        return $this;
    }

    /**
     * Get favoritesForUserIds
     *
     * @return collection $favoritesForUserIds
     */
    public function getFavoritesForUserIds()
    {
        return $this->favoritesForUserIds;
    }
    
    /**
     * Ensures that .
     */
    public function doFavoritesForUserIds($user_id)
    {
        $this->favoritesForUserIds []= $user_id;
    }
    
    /**
     * check ...
     * @return boolean
     */
    public function is_favoritesForUser($id){
        foreach ($this->favoritesForUserIds as $user_id){
            if($user_id === $id){
                return true;
            }        
        }
        return false;
    }
    
    /**
     * Ensures that .
     */
    public function doMaskersForUserIds($user_id)
    {
        $this->maskersForUserIds []= $user_id;
    }
    
    /**
     * check ...
     * @return boolean
     */
    public function is_maskersForUser($id){
        foreach ($this->maskersForUserIds as $user_id){
            if($user_id === $id){
                return true;
            }        
        }
        return false;
    }

    /**
     * Set objectType
     *
     * @param string $objectType
     * @return self
     */
    public function setObjectType($objectType)
    {
        $this->objectType = $objectType;
        return $this;
    }

    /**
     * Get objectType
     *
     * @return string $objectType
     */
    public function getObjectType()
    {
        return $this->objectType;
    }

    /**
     * Set postValid
     *
     * @param string $postValid
     * @return self
     */
    public function setPostValid($postValid)
    {
        $this->postValid = $postValid;
        return $this;
    }

    /**
     * Get postValid
     *
     * @return string $postValid
     */
    public function getPostValid()
    {
        return $this->postValid;
    }

    /**
     * Set legalNotification
     *
     * @param OP\SocialBundle\Document\Notification $legalNotification
     * @return self
     */
    public function setLegalNotification(\OP\SocialBundle\Document\Notification $legalNotification)
    {
        $this->LegalNotification = $legalNotification;
        return $this;
    }

    /**
     * Get legalNotification
     *
     * @return OP\SocialBundle\Document\Notification $legalNotification
     */
    public function getLegalNotification()
    {
        return $this->LegalNotification;
    }

    /**
     * Set rmvArr
     *
     * @param string $rmvArr
     * @return self
     */
    public function setRmvArr($rmvArr)
    {
        $this->rmv_arr = $rmvArr;
        return $this;
    }

    /**
     * Get rmvArr
     *
     * @return string $rmvArr
     */
    public function getRmvArr()
    {
        return $this->rmv_arr;
    }

    /**
     * Set nbLegals
     *
     * @param increment $nbLegals
     * @return self
     */
    public function setNbLegals($nbLegals)
    {
        $this->nbLegals = $nbLegals;
        return $this;
    }

    /**
     * Get nbLegals
     *
     * @return increment $nbLegals
     */
    public function getNbLegals()
    {
        return $this->nbLegals;
    }

    /**
     * Set legalsIds
     *
     * @param collection $legalsIds
     * @return self
     */
    public function setLegalsIds($legalsIds)
    {
        $this->legals_ids = $legalsIds;
        return $this;
    }

    /**
     * Get legalsIds
     *
     * @return collection $legalsIds
     */
    public function getLegalsIds()
    {
        return $this->legals_ids;
    }

    /**
     * check ...
     * @return boolean
     */
    public function is_legal($id){
        foreach ($this->legals_ids as $legal_id){
            if($legal_id == $id){
                return true;
            }        
        }
        return false;
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
     * Set commentNotification
     *
     * @param OP\SocialBundle\Document\Notification $commentNotification
     * @return self
     */
    public function setCommentNotification(\OP\SocialBundle\Document\Notification $commentNotification)
    {
        $this->commentNotification = $commentNotification;
        return $this;
    }

    /**
     * Get commentNotification
     *
     * @return OP\SocialBundle\Document\Notification $commentNotification
     */
    public function getCommentNotification()
    {
        return $this->commentNotification;
    }

    /**
     * Set opinionOrder
     *
     * @param int $opinionOrder
     * @return self
     */
    public function setOpinionOrder($opinionOrder)
    {
        $this->opinionOrder = $opinionOrder;
        return $this;
    }

    /**
     * Get opinionOrder
     *
     * @return int $opinionOrder
     */
    public function getOpinionOrder()
    {
        return $this->opinionOrder;
    }

    /**
     * Set order
     *
     * @param int $order
     * @return self
     */
    public function setOrder($order)
    {
        $this->order = $order;
        return $this;
    }

    /**
     * Get order
     *
     * @return int $order
     */
    public function getOrder()
    {
        return $this->order;
    }

    /**
     * Set nbComments
     *
     * @param increment $nbComments
     * @return self
     */
    public function setNbComments($nbComments)
    {
        $this->nbComments = $nbComments;
        return $this;
    }

    /**
     * Get nbComments
     *
     * @return increment $nbComments
     */
    public function getNbComments()
    {
        return $this->nbComments;
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
     * Set sideName
     *
     * @param string $sideName
     * @return self
     */
    public function setSideName($sideName)
    {
        $this->sideName = $sideName;
        return $this;
    }

    /**
     * Get sideName
     *
     * @return string $sideName
     */
    public function getSideName()
    {
        return $this->sideName;
    }

    /**
     * Set opinionTitle
     *
     * @param string $opinionTitle
     * @return self
     */
    public function setOpinionTitle($opinionTitle)
    {
        $this->opinionTitle = $opinionTitle;
        return $this;
    }

    /**
     * Get opinionTitle
     *
     * @return string $opinionTitle
     */
    public function getOpinionTitle()
    {
        return $this->opinionTitle;
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
     * Set keywords
     *
     * @param string $keywords
     * @return $this
     */
    public function setKeywords($keywords)
    {
        $this->keywords = $keywords;
        return $this;
    }

    /**
     * Get keywords
     *
     * @return string $keywords
     */
    public function getKeywords()
    {
        return $this->keywords;
    }
}
