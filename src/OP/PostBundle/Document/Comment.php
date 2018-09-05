<?php
// OP/OpinionBundle/Documents/Opinion.php

namespace OP\PostBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB,
    Symfony\Component\Validator\Constraints as Assert,
    Doctrine\Common\Collections\ArrayCollection,
    OP\PostBundle\Model\Comment as BaseComment,
    Symfony\Component\HttpFoundation\File\UploadedFile,
    OP\SocialBundle\SeveralClass\DateTransformer;

/**
 * @MongoDB\Document(
 *      db="opinion",
 *      collection="comments",
 *      repositoryClass="OP\PostBundle\Repository\CommentRepository",
 * indexes={
 *          @MongoDB\index(keys={"createdAt"="desc"}),
 *          @MongoDB\index(keys={"author.id"="desc"}),
 *          @MongoDB\index(keys={"post.id"="asc"}),
 *       },
 *         requireIndexes=true
 * )
 */
class Comment extends BaseComment
{
    /**
     * @MongoDB\Id(strategy="AUTO")
     */
    protected $id;

    /**
     * @MongoDB\Field(name="content", type="raw")
     * @Assert\NotBlank()
     */
    protected $content;

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

    /**
     * @MongoDB\Field(name="updateAt", type="date")
     *
     * @Assert\DateTime()
     */
    protected $updateAt;

    /**
     * @MongoDB\Field(name="visible", type="boolean")
     */
    protected $visible = true;

    /**
    * @var ArrayCollection
    */
    private $uploadedFiles;

    /**
     * @MongoDB\Field(name="postValid", type="string")
     * @Assert\NotBlank()
     */
    protected $postValid;

    /**
     *
     * @MongoDB\Field(name="type", type="string")
     */
    protected $type = 'comment';

    /**
     * @MongoDB\ReferenceOne(targetDocument="OP\MediaBundle\Document\Image", cascade={"remove"})
     */
    protected $photo;

    /**
     * @MongoDB\Field(name="photoValid", type="string")
     * @Assert\NotBlank()
     */
    protected $photoValid;
    
    /**
     * @MongoDB\Field(name="rmv_arr", type="string")
     * @var type 
     * remove image when _edit 
     */
    protected $rmv_arr;

    /**
     * @var timestamp $ts
     *
     * @MongoDB\Field(name="ts", type="timestamp")
     */
    protected $ts;
    
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
     * @var
     *
     * @MongoDB\ReferenceOne(targetDocument="OP\SocialBundle\Document\Notification", cascade={"remove"})
     */
    protected $underCnotification;

    /**
    * @var likeNotification
    *
    * @MongoDB\ReferenceOne(targetDocument="OP\SocialBundle\Document\Notification", cascade={"remove"})
    */
    public $likeNotification;

    /**
    * @var UploadedFile[]
    */
    protected $files = array();

    /**
     * @MongoDB\Field(name="nbLikers", type="increment")
     */
    protected $nbLikers = 0;

    /**
     * @MongoDB\Field(name="total_rate", type="increment")
     */
    protected $total_rate = 0;
    
    /**
     * @MongoDB\Field(name="objectType", type="string")
     * @var type   
     */
    protected $objectType = 'comment';

    /**
     * @MongoDB\Field(name="likers_ids", type="collection")
     * 
     */
    protected $likers_ids = array();
    
    /**
     * @MongoDB\Field(name="nbUnders", type="increment")
     * 
     * @var type
     */
    protected $nbUnders = 0;

    /**
    * @var string $keywords
    * @MongoDB\Field(name="keywords", type="string")
    */
    protected $keywords = '';

    /**
     * 
     * @MongoDB\Field(name="images_ids", type="collection")
     * 
     */
    protected $images_ids = array();

    public function __construct()
    {
        $this->createdAt = new \Datetime(null, new \DateTimeZone("UTC"));
        $this->images = new ArrayCollection();
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
    * @param UploadedFile[] $files
    */
    public function setFiles(array $files)
    {
        $this->files = $files;
        return $this;
    }
    /**
    * @return UploadedFile[]
    */
    public function getFiles()
    {
        return $this->files;
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
     * @param type $id
     * @return \OP\PostBundle\Document\Comment
     */
    public function setId($id){
        $this->id = $id;
        return $this;
    }
    /**
     * Set underCnotification
     *
     * @param OP\SocialBundle\Document\Notification $underCnotification
     * @return self
     */
    public function setUnderCnotification(\OP\SocialBundle\Document\Notification $underCnotification)
    {
        $this->underCnotification = $underCnotification;
        return $this;
    }

    /**
     * Get underCnotification
     *
     * @return OP\SocialBundle\Document\Notification $underCnotification
     */
    public function getUnderCnotification()
    {
        return $this->underCnotification;
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
     * incrementLikers
     */
    public function incrementLikers()
    {
        $this->nbLikers++;
    }

    /**
     * decrementLikers
     */
    public function decrementLikers()
    {
        $this->nbLikers--;
    }

    /**
     * incrementLikers
     */
    public function incrementUnders()
    {
        $this->nbUnders++;
    }

    /**
     * decrementLikers
     */
    public function decrementUnders()
    {
        $this->nbUnders--;
    }


    /**
     * Get nbUnder
     *
     * @return int $nbUnders
     */
    public function getNbUnders()
    {
        return $this->nbUnders;
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
     * Set nbUnder
     *
     * @param increment $nbUnder
     * @return self
     */
    public function setNbUnder($nbUnder)
    {
        $this->nbUnder = $nbUnder;
        return $this;
    }

    /**
     * Set nbUnders
     *
     * @param increment $nbUnders
     * @return self
     */
    public function setNbUnders($nbUnders)
    {
        $this->nbUnders = $nbUnders;
        return $this;
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
     * Set photoValid
     *
     * @param string $photoValid
     * @return self
     */
    public function setPhotoValid($photoValid)
    {
        $this->photoValid = $photoValid;
        return $this;
    }

    /**
     * Get photoValid
     *
     * @return string $photoValid
     */
    public function getPhotoValid()
    {
        return $this->photoValid;
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
     * Set totalRate
     *
     * @param increment $totalRate
     * @return self
     */
    public function setTotalRate($totalRate)
    {
        $this->total_rate = $totalRate;
        return $this;
    }

    /**
     * Get totalRate
     *
     * @return increment $totalRate
     */
    public function getTotalRate()
    {
        return $this->total_rate;
    }

    /**
     * Set leftComment
     *
     * @param OP\PostBundle\Document\LeftComment $leftComment
     * @return self
     */
    public function setLeftComment(\OP\PostBundle\Document\LeftComment $leftComment)
    {
        $this->leftComment = $leftComment;
        return $this;
    }

    /**
     * Get leftComment
     *
     * @return OP\PostBundle\Document\LeftComment $leftComment
     */
    public function getLeftComment()
    {
        return $this->leftComment;
    }

    /**
     * Set rightComment
     *
     * @param OP\PostBundle\Document\RightComment $rightComment
     * @return self
     */
    public function setRightComment(\OP\PostBundle\Document\RightComment $rightComment)
    {
        $this->rightComment = $rightComment;
        return $this;
    }

    /**
     * Get rightComment
     *
     * @return OP\PostBundle\Document\RightComment $rightComment
     */
    public function getRightComment()
    {
        return $this->rightComment;
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
