<?php
namespace OP\PostBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\ArrayCollection;
use OP\PostBundle\Model\UnderComment as BaseUnderComment;
use Symfony\Component\HttpFoundation\File\File;
use OP\SocialBundle\SeveralClass\DateTransformer;

/**
 * @MongoDB\Document(
 *      db="opinion",
 *      collection="undercomments",
 *      repositoryClass="OP\PostBundle\Repository\UnderCommentRepository")
 */
class UnderComment extends BaseUnderComment
{
    /**
     * @MongoDB\Id
     */
    protected $id;
    
    /**
     * Remove image when _edit 
     * @MongoDB\Field(name="rmv_arr", type="string")
     * 
     * @var type 
     */
    protected $rmv_arr;

    /**
     * @MongoDB\Field(name="content", type="raw")
     *
     * @Assert\NotBlank()
     */
    protected $content;
    
    /**
     * @MongoDB\Field(name="updateAt", type="date")
     * 
     * @var type 
     */
    protected $updatedAt;

    /**
     * @MongoDB\Field(name="createdAt", type="date")
     * 
     */
    protected $createdAt;

    /**
     * @MongoDB\Field(name="unique", type="string")
     * 
     * @var unique
     */
    protected $unique; 

    public $file;
    
    /**
    * @var collection $maskersForUserIds
    * @MongoDB\Field(name="maskersForUserIds", type="collection")
    */
    protected $maskersForUserIds = array();
    
    /**
    * @var collection $favoritesForUserIds
    * @MongoDB\Field(name="favoritesForUserIds", type="collection")
    */
    protected $favoritesForUserIds = array();

    /**
     * @var timestamp $ts
     *
     * @MongoDB\Field(name="ts", type="timestamp")
     */
    protected $ts;

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\MediaBundle\Document\Image")
     */
    protected $images;
    
    /**
     * @MongoDB\Field(name="nbLikers", type="increment")
     * 
     */
    protected $nbLikers = 0;

    /**
     * @MongoDB\Field(name="objectType", type="string")
     * 
     * @var type 
     *  
     */
    protected $objectType = 'undercomment';
    
    /**
     * @MongoDB\Field(name="total_rate", type="increment")
     * 
     */
    protected $total_rate = 0;

    /**
     * @MongoDB\Field(name="likers_ids", type="collection")
     * 
     */
    protected $likers_ids = array();

    /**
     * @var  $notification
     *
     * @MongoDB\ReferenceOne(targetDocument="OP\SocialBundle\Document\Notification", cascade={"remove"})
     */
    protected $likeNotification;

    /**
     * 
     * @MongoDB\Field(name="images_ids", type="collection")
     * 
     */
    protected $images_ids = array();

    /**
    * @var string $keywords
    * @MongoDB\Field(name="keywords", type="string")
    */
    protected $keywords = '';

    public function __construct(){
        $this->createdAt    = new \Datetime(null, new \DateTimeZone("UTC"));
        $this->images       = new ArrayCollection();
    }

    public function addImagesIds($ids){
        foreach ($ids as $id) {
            $this->images_ids[] = $id;
        }
    }
    
     /**
     * 
     * @return boolean
     */
    public function isUpdated(){
        if(!$this->getUpdatedAt()){
            return false;
        }
        return true;
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
     * Set notification
     *
     * @param OP\SocialBundle\Document\Notification $notification
     * @return self
     */
    public function setNotification(\OP\SocialBundle\Document\Notification $notification)
    {
        $this->notification = $notification;
        return $this;
    }

    /**
     * Get notification
     *
     * @return OP\SocialBundle\Document\Notification $notification
     */
    public function getNotification()
    {
        return $this->notification;
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
     * Set totalRate
     *
     * @param int $totalRate
     * @return self
     */
    public function setTotalRate($totalRate)
    {
        $this->total_rate = $totalRate;
        return $this;
    }

     /**
     * check ...
     * @return boolean
     */
    public function is_liker($id){
        foreach ($this->likers_ids as $liker_id){
            if($liker_id == $id){
                return true;
            }        
        }
        return false;
    }

    /**
     * Get totalRate
     *
     * @return int $totalRate
     */
    public function getTotalRate()
    {
        return $this->total_rate;
    }

    public function doLikersIds($liker_id, $how)
    {
        if($how === 'push') {
            $this->likers_ids []= $liker_id;
        } else {
            if(($key = array_search($liker_id, $this->likers_ids)) !== false) {
                unset($this->likers_ids[$key]);
            }
        }
    }

    /**
     * Set likersIds
     *
     * @param collection $likersIds
     * @return self
     */
    public function setLikersIds($likersIds)
    {
        $this->likers_ids = $likersIds;
        return $this;
    }

    /**
     * Get likersIds
     *
     * @return collection $likersIds
     */
    public function getLikersIds()
    {
        return $this->likers_ids;
    }

    /**
     * Set updatedAt
     *
     * @param date $updatedAt
     * @return self
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
     * Add like
     *
     * @param OP\PostBundle\Document\Like $like
     */
    public function addLike(\OP\PostBundle\Document\Like $like)
    {
        $this->likes[] = $like;
        $this->incrementLikers();
    }

    /**
     * Remove like
     *
     * @param OP\PostBundle\Document\Like $like
     */
    public function removeLike(\OP\PostBundle\Document\Like $like)
    {
        $this->likes->removeElement($like);
        $this->decrementLikers();
    }

    /**
     * Get likes
     *
     * @return \Doctrine\Common\Collections\Collection $likes
     */
    public function getLikes()
    {
        return $this->likes;
    }

    /**
     * Set nbLikers
     *
     * @param increment $nbLikers
     * @return self
     */
    public function setNbLikers($nbLikers)
    {
        $this->nbLikers = $nbLikers;
        return $this;
    }

    /**
     * Set likeNotification
     *
     * @param OP\SocialBundle\Document\Notification $likeNotification
     * @return self
     */
    public function setLikeNotification(\OP\SocialBundle\Document\Notification $likeNotification)
    {
        $this->likeNotification = $likeNotification;
        return $this;
    }

    /**
     * Get likeNotification
     *
     * @return OP\SocialBundle\Document\Notification $likeNotification
     */
    public function getLikeNotification()
    {
        return $this->likeNotification;
    }

    /**
     * Set comment
     *
     * @param OP\PostBundle\Document\Comment $comment
     * @return $this
     */
    public function setComment(\OP\PostBundle\Document\Comment $comment)
    {
        $this->comment = $comment;
        return $this;
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
