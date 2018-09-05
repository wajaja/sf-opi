<?php
namespace OP\PostBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\HttpFoundation\File\File;
use OP\PostBundle\Model\Share as BaseShare;
use OP\SocialBundle\SeveralClass\DateTransformer;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * @MongoDB\Document(
 *      db="opinion",
 *      collection="shares",
 *     repositoryClass="OP\PostBundle\Repository\ShareRepository",
 * indexes={
 *          @MongoDB\index(keys={"createdAt"="desc"}),
 *          @MongoDB\index(keys={"author.$id"="desc"}),
 *       },
 *         requireIndexes=true
 * )
 * @MongoDB\ChangeTrackingPolicy("DEFERRED_IMPLICIT")
 */
class Share extends BaseShare
{
    /**
     * postId
     *
     * @MongoDB\ReferenceOne(targetDocument="OP\PostBundle\Document\Post")
     */
    protected $post;

    /**
     * userId
     *
     * @MongoDB\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $author;

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\MediaBundle\Document\Image")
     */
    protected $images;
    
    /**
     * @var  $notification
     *
     * @MongoDB\ReferenceOne(targetDocument="OP\SocialBundle\Document\Notification", cascade={"remove"})
     */
    protected $notification;
    
    /**
     * Remove image when _edit 
     * @MongoDB\Field(name="rmv_arr", type="string")
     * 
     * @var type 
     */
    protected $rmv_arr;

    /**
     * @MongoDB\Field(name="nbLikers", type="increment")
     * 
     */
    protected $nbLikers = 0;
    
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
     * @var  $notification
     *
     * @MongoDB\ReferenceOne(targetDocument="OP\SocialBundle\Document\Notification")
     */
    protected $CommentNotification;

    /**
     * @MongoDB\ReferenceOne(targetDocument="OP\MediaBundle\Document\Image")
     */
    protected $photo;
    
    /** 
     * @MongoDB\Field(name="objectType", type="string")
     * 
     * @var type  
     */
    protected $objectType;

    /**
     * 
     * @MongoDB\Field(name="images_ids", type="collection")
     * 
     */
    protected $images_ids = array();

    public function __construct() {
        $this->createdAt    = new \Datetime(null, new \DateTimeZone("UTC"));
        $this->datepubledAt = new \DateTime();
        $this->images       = new ArrayCollection();
        $this->objectType   = 'share';
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

    /**
     * Set commentNotification
     *
     * @param OP\SocialBundle\Document\Notification $commentNotification
     * @return self
     */
    public function setCommentNotification(\OP\SocialBundle\Document\Notification $commentNotification)
    {
        $this->CommentNotification = $commentNotification;
        return $this;
    }

    /**
     * Get commentNotification
     *
     * @return OP\SocialBundle\Document\Notification $commentNotification
     */
    public function getCommentNotification()
    {
        return $this->CommentNotification;
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
     * Ensures that active participant, recipient and sender arrays are updated.
     */
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
     * Get nbLikers
     *
     * @return increment $nbLikers
     */
    public function getNbLikers()
    {
        return $this->nbLikers;
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
}
