<?php

namespace OP\PostBundle\Document;

use OP\PostBundle\Model\Post as BasePost,
    Doctrine\Common\Collections\Collection,
    JMS\Serializer\Annotation\Type,
    JMS\Serializer\Annotation\Expose,
    JMS\Serializer\Annotation\Groups,
    JMS\Serializer\Annotation\ExclusionPolicy,
    JMS\Serializer\Annotation\VirtualProperty,
    Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB,
    Symfony\Component\Validator\Constraints as Assert,
    Doctrine\Common\Collections\ArrayCollection,
    Symfony\Component\HttpFoundation\File\UploadedFile,
    OP\SocialBundle\SeveralClass\DateTransformer,
    OP\MessageBundle\Model\ParticipantInterface;

/**
 * @MongoDB\Document(
 *      db="opinion",
 *      collection="posts",
 *      repositoryClass="OP\PostBundle\Repository\PostRepository",
 * indexes={
 *          @MongoDB\index(keys={"createdAt"="desc"}),
 *          @MongoDB\index(keys={"author.$id"="desc"}),
 *          @MongoDB\index(keys={"ts"="asc"}),
 *       },
 *         requireIndexes=true
 * )
 * @ExclusionPolicy("all") 
 */
class Post extends BasePost
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
     * @MongoDB\Field(name="opinionOrder", type="int")
     * 
     * @var opinionOrder
     */
    protected $opinionOrder;

    /**
     * @MongoDB\Field(name="createdAt", type="date")
     * 
     * @var createdAt
     */
    protected $createdAt;

    /**
     * @MongoDB\Field(name="updateAt", type="date")
     * 
     * @var updateAt
     */
    protected $updateAt;
    
    /**
     * @MongoDB\Field(name="type", type="string")
     * 
     * @var type 
     */
    protected $type;
    
    /**
     * @MongoDB\Field(name="editorTexts", type="string")
     * 
     * 
     * @var type 
     */
    protected $editorTexts;
    
     /**
     * 
     * @MongoDB\Field(name="leftEditorTexts", type="string")
     * 
     * @var leftEditorTexts
     */
    protected $leftEditorTexts;

     /**
     * 
     * @MongoDB\Field(name="rightEditorTexts", type="string")
     * 
     * @var rightEditorTexts
     */
    protected $rightEditorTexts;

    /**
     * 
     * @MongoDB\Field(name="subcribes", type="collection")
     * 
     * @var subcribes
     */
    protected $subcribers = array();

    /**
     * 
     * @MongoDB\Field(name="videoName", type="string")
     * 
     * @var videoName 
     */
    protected $videoName;

    /**
     * @MongoDB\EmbedMany(targetDocument="OP\PostBundle\Document\PostMetadata")
     */
    protected $metadata;
    
    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\UserBundle\Document\User")
     */
    protected $editors;

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\UserBundle\Document\User")
     */
    protected $leftEditors;

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\UserBundle\Document\User")
     */
    protected $rightEditors;
     
    /**
     * refer for others editors posts to sameone
     * @MongoDB\Field(name="nbAllies", type="increment")
     * 
     * @var nbAllies 
     */
    protected $nbAllies = 0;

    /**
    * the main post where the allies get their reference
    *
    * @MongoDB\ReferenceOne(targetDocument="OP\PostBundle\Document\Post")
    * @var Post $post
    */
    protected $mainAllie;

    /**
    *
    * @MongoDB\Boolean
    * @var Post $post
    */
    protected $isMainPost;

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\UserBundle\Document\User")
     * @var type 
     */
    protected $contributors = [];

    /**
     * 
     * @MongoDB\Field(name="visible", type="boolean")
     * 
     * @var visible
     */
    protected $visible = true;

    /**
     * 
     * @MongoDB\Field(name="timelineId", type="object_id")
     * 
     * @var timelineId
     */
    protected $timelineId;

    /**
     * 
     * @MongoDB\Field(name="cardId", type="object_id")
     * 
     * @var cardId
     */
    protected $cardId;

    /**
     * $timelineType (user || group)
     * @MongoDB\Field(name="timelineType", type="string")
     * 
     * @var timelineType
     */
    protected $timelineType;

    /**
     * @var timestamp $publishedAt
     *
     * @MongoDB\Field(name="publishedAt", type="date")
     */
    protected $publishedAt;

    /**
     * The user who receives the message
     * 
     * @MongoDB\Field(name="recipients", type="string")
     * 
     * @var recipients
     */
    protected $recipients;
    
    /**
     * @var type Int
     *
     * @MongoDB\Field(name="gapMinutes", type="int")
     * 
     */
    protected $gapMinutes = 0;

    /**
     * @var type Int
     * 
     * @MongoDB\Field(name="gapHours", type="int")
     * 
     */
    protected $gapHours = 0;

    /**
     * @var type Int
     * 
     * @MongoDB\Field(name="gapDays", type="int")
     * 
     */
    protected $gapDays = 0;
    
    /**
     * 
     * @MongoDB\Field(name="confidence", type="string")
     * 
     */
    protected  $confidence;

    /**
     * 
     * @MongoDB\Field(name="nbPlikers", type="increment")
     * 
     */
    protected $nbPlikers = 0;

    /**
     * 
     * @MongoDB\Field(name="nbQuestioners", type="increment")
     * 
     */
    protected $nbQuestioners = 0;

    /**
     * 
     * @MongoDB\Field(name="total_rate", type="increment")
     * 
     */
    protected $total_rate = 0;

    /**
     * 
     * @MongoDB\Field(name="likers_ids", type="collection")
     * 
     */
    protected $likers_ids = array();

    /**
     * 
     * @MongoDB\Field(name="targetMap", type="collection")
     * where post will be visible?
     * [lat, long]
     */
    protected $targetMap = array();

    /**
     * 
     * @MongoDB\Field(name="questioners_ids", type="collection")
     * 
     */
    protected $questioners_ids = array();

    /**
     * 
     * @MongoDB\Field(name="images_ids", type="collection")
     * 
     */
    protected $images_ids = array();

    /**
     * 
     * @MongoDB\Field(name="allie_ids", type="collection")
     * 
     */
    protected $allie_ids = array();
    
    /**
     * @var type 
     * remove image when post_edit 
     * @MongoDB\Field(name="rmv_arr", type="string")
     * 
     */
    protected $rmv_arr;
    
    /**
     * 
     * @MongoDB\Field(name="nbComments", type="increment")
     * 
     * @var type
     */
    protected $nbComments = 0;

    /**
     * 
     * @MongoDB\Field(name="nbLeftcomments", type="increment")
     * 
     * @var type
     */
    protected $nbLeftcomments = 0;

    /**
     * 
     * @MongoDB\Field(name="nbRightcomments", type="increment")
     * 
     * @var type
     */
    protected $nbRightcomments = 0;

    /**
     * 
     * @MongoDB\Field(name="nbShares", type="increment")
     * 
     * @var type
     */
    protected $nbShares = 0;
    
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
     * 
     * @MongoDB\Field(name="objectType", type="string")
     * 
     * @var type 
     *  
     */
    protected $objectType = 'post';

    /**
     * 
     * @MongoDB\Field(name="leftSideName", type="string")
     * 
     * @var type 
     */
    protected $leftSideName = 'LeftComment';

    /**
     * 
     * @MongoDB\Field(name="rightSideName", type="string")
     * 
     * @var type 
     */
    protected $rightSideName = 'RightComment';

    /**
    * @var UploadedFile[]
    */
    protected $files = array();
    
    /**
     * @MongoDB\Field(name="emotion", type="int")
     * 
     */
    protected $emotion;

    /**
    * @var string $keywords
    * @MongoDB\Field(name="keywords", type="string")
    */
    protected $keywords = '';

    public function __construct()
    {        
        $this->createdAt    = new \DateTime(null, new \DateTimeZone("UTC"));
        $this->comments     = new ArrayCollection();
        $this->plikes       = new ArrayCollection();
        $this->shares       = new ArrayCollection();
        $this->editors      = new ArrayCollection();
        $this->rightEditors = new ArrayCollection();
        $this->leftEditors  = new ArrayCollection();
        $this->participants = new ArrayCollection();
        $this->pictures     = new ArrayCollection();
        $this->images       = new ArrayCollection();
    }

    public function addImagesIds($ids){
        foreach ($ids as $id) {
            $this->images_ids[] = $id;
        }
    }
    
    public function updatedAtTrans() {
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
            if(($key = array_search($liker_id, $this->likers_ids)) !== false)
                unset($this->likers_ids[$key]);
        }
    }

    public function doAlliesIds($allie_id, $how)
    {
        if($how === 'push') {
            $this->allie_ids []= $allie_id;
        } else {
            if(($key = array_search($allie_id, $this->allie_ids)) !== false)
                unset($this->allie_ids[$key]);
        }
    }

    public function doSubscriber($subcriber_id, $how)
    {
        if($how === 'push') {
            $this->subcribers []= $subcriber_id;
        } else {
            if(($key = array_search($subcriber_id, $this->subcribers)) !== false) {
                unset($this->subcribers[$key]);
            }
        }
    }
    
    public function doQuestionersIds($id, $how)
    {
        if($how === 'push') {
            $this->questioners_ids []= $id;
        } else {
            if(($key = array_search($id, $this->questioners_ids)) !== false) {
                unset($this->questioners_ids[$key]);
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
            if($liker_id === $id){
                return true;
            }
        }
        return false;
    }

    /**
     * check ...
     * @return boolean
     */
    public function is_questioner($id){
        foreach ($this->questioners_ids as $questioner_id){
            if($questioner_id === $id){
                return true;
            }
        }
        return false;
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
     * Add question
     *
     * @param OP\MessageBundle\Document\Question $question
     */
    public function addQuestion(\OP\MessageBundle\Document\Question $question)
    {
        $this->questions[] = $question;
    }

    /**
     * Remove question
     *
     * @param OP\MessageBundle\Document\Question $question
     */
    public function removeQuestion(\OP\MessageBundle\Document\Question $question)
    {
        $this->questions->removeElement($question);
    }

    /**
     * Get questions
     *
     * @return \Doctrine\Common\Collections\Collection $questions
     */
    public function getQuestions()
    {
        return $this->questions;
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
     * Add ally
     *
     * @param OP\PostBundle\Document\Post $ally
     */
    public function addAlly(\OP\PostBundle\Document\Post $ally)
    {
        $this->allies[] = $ally;
    }

    /**
     * Remove ally
     *
     * @param OP\PostBundle\Document\Post $ally
     */
    public function removeAlly(\OP\PostBundle\Document\Post $ally)
    {
        $this->allies->removeElement($ally);
    }

    /**
     * Get allies
     *
     * @return \Doctrine\Common\Collections\Collection $allies
     */
    public function getAllies()
    {
        return $this->allies;
    }

    /**
     * Add contributor
     *
     * @param OP\UserBundle\Document\User $contributor
     */
    public function addContributor(\OP\UserBundle\Document\User $contributor)
    {
        $this->contributors[] = $contributor;
    }

    /**
     * Remove contributor
     *
     * @param OP\UserBundle\Document\User $contributor
     */
    public function removeContributor(\OP\UserBundle\Document\User $contributor)
    {
        $this->contributors->removeElement($contributor);
    }

    /**
     * Get contributors
     *
     * @return \Doctrine\Common\Collections\Collection $contributors
     */
    public function getContributors()
    {
        return $this->contributors;
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
        foreach ($this->maskersForUserIds as $user_id) {
            if($user_id === $id) {
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
     */
    public function incrementLeftcomments()
    {
        $this->nbLeftcomments++;
    }

    /**
     * incrementLikers
     */
    public function decrementLeftComments()
    {
        $this->nbLeftcomments--;
    }

    /**
     */
    public function incrementRightcomments()
    {
        $this->nbRightcomments++;
    }

    /**
     * incrementLikers
     */
    public function decrementRightComments()
    {
        $this->nbRightcomments--;
    }

    /**
     */
    public function incrementLikers()
    {
        $this->nbPlikers++;
    }

    /**
     * incrementLikers
     */
    public function decrementLikers()
    {
        $this->nbPlikers--;
    }

    /**
     */
    public function incrementQuestioners()
    {
        $this->nbQuestioners++;
    }

    /**
     * incrementLikers
     */
    public function decrementQuestioners()
    {
        $this->nbQuestioners--;
    }

    /**
     */
    public function incrementShares()
    {
        $this->nbShares++;
    }

    /**
     * incrementLikers
     */
    public function decrementShares()
    {
        $this->nbShares--;
    }

    /**
     * Get nbComment
     *
     * @return int $nbComment
     */
    public function getNbComment()
    {
        return $this->nbComment;
    }

    /**
     * Add editor
     *
     * @param OP\UserBundle\Document\User $editor
     */
    public function addEditor(\OP\UserBundle\Document\User $editor)
    {
        $this->editors[] = $editor;
    }

    /**
     * Remove editor
     *
     * @param OP\UserBundle\Document\User $editor
     */
    public function removeEditor(\OP\UserBundle\Document\User $editor)
    {
        $this->editors->removeElement($editor);
    }

    /**
     * Get editors
     *
     * @return \Doctrine\Common\Collections\Collection $editors
     */
    public function getEditors()
    {
        return $this->editors;
    }

    /**
     * Set gapMinutes
     *
     * @param int $gapMinutes
     * @return self
     */
    public function setGapMinutes($gapMinutes)
    {
        $this->gapMinutes = $gapMinutes;
        return $this;
    }

    /**
     * Get gapMinutes
     *
     * @return int $gapMinutes
     */
    public function getGapMinutes()
    {
        return $this->gapMinutes;
    }

    /**
     * Set gapHours
     *
     * @param int $gapHours
     * @return self
     */
    public function setGapHours($gapHours)
    {
        $this->gapHours = $gapHours;
        return $this;
    }

    /**
     * Get gapHours
     *
     * @return int $gapHours
     */
    public function getGapHours()
    {
        return $this->gapHours;
    }

    /**
     * Set gapDays
     *
     * @param int $gapDays
     * @return self
     */
    public function setGapDays($gapDays)
    {
        $this->gapDays = $gapDays;
        return $this;
    }

    /**
     * Get gapDays
     *
     * @return int $gapDays
     */
    public function getGapDays()
    {
        return $this->gapDays;
    }

    /**
     * Set confidence
     *
     * @param string $confidence
     * @return self
     */
    public function setConfidence($confidence)
    {
        $this->confidence = $confidence;
        return $this;
    }

    /**
     * Get confidence
     *
     * @return string $confidence
     */
    public function getConfidence()
    {
        return $this->confidence;
    }
    
     /**
     * @param  
     * @return NewThreadMessageBuilder
     */
    public function addEditors(Collection $editorTexts)
    {
        //add the collection of recipient instance of participantInterface
        foreach ($editorTexts as $editorText) {
            $this->addEditor($editorText);
        }
        return $this;
    }
    
    /**
     * @param  
     * @return NewThreadMessageBuilder
     */
    public function addParticipants(Collection $participants)
    {
        //add the collection of recipient instance of participantInterface
        foreach ($participants as $participant) {
            $this->addParticipant($participant);
        }
        return $this;
    }

    /**
     * Adds single editorText to collection
     *
     * @param ParticipantInterface $editorText
     *
     * @return null
     */
    public function addEditorText(ParticipantInterface $editorText)
    {
        $this->addEditor($editorText);

        return $this;
    }

    /**
     * Set videoName
     *
     * @param string $videoName
     * @return self
     */
    public function setVideoName($videoName)
    {
        $this->videoName = $videoName;
        return $this;
    }

    /**
     * Get videoName
     *
     * @return string $videoName
     */
    public function getVideoName()
    {
        return $this->videoName;
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
     * Adds single editorText to collection
     *
     * @param ParticipantInterface $editorText
     *
     * @return null
     */
    public function addLeftEditorText(ParticipantInterface $editorText)
    {
        $this->addLeftEditor($editorText);

        return $this;
    }

    /**
     * Add leftEditor
     *
     * @param OP\UserBundle\Document\User $leftEditor
     */
    public function addLeftEditor(\OP\UserBundle\Document\User $leftEditor)
    {
        $this->leftEditors[] = $leftEditor;
    }

    /**
     * @param 
     * @return post
     */
    public function addLeftEditors(Collection $leftEditorTexts)
    {
        //add the collection of recipient instance of participantInterface
        foreach ($leftEditorTexts as $leftEditorText) {
            $this->addLeftEditor($leftEditorText);
        }
        return $this;
    }

    /**
     * Remove leftEditor
     *
     * @param OP\UserBundle\Document\User $leftEditor
     */
    public function removeLeftEditor(\OP\UserBundle\Document\User $leftEditor)
    {
        $this->leftEditors->removeElement($leftEditor);
    }

    /**
     * Get leftEditors
     *
     * @return \Doctrine\Common\Collections\Collection $leftEditors
     */
    public function getLeftEditors()
    {
        return $this->leftEditors;
    }

    /**
     * Add rightEditor
     *
     * @param OP\UserBundle\Document\User $rightEditor
     */
    public function addRightEditor(\OP\UserBundle\Document\User $rightEditor)
    {
        $this->rightEditors[] = $rightEditor;
    }

    /**
     * Remove rightEditor
     *
     * @param OP\UserBundle\Document\User $rightEditor
     */
    public function removeRightEditor(\OP\UserBundle\Document\User $rightEditor)
    {
        $this->rightEditors->removeElement($rightEditor);
    }

    /**
     * @param  
     * @return post
     */
    public function addRightEditors(Collection $rightEditorTexts)
    {
        //add the collection of recipient instance of participantInterface
        foreach ($rightEditorTexts as $rightEditorText) {
            $this->addRightEditor($rightEditorText);
        }
        return $this;
    }

    /**
     * Get rightEditors
     *
     * @return \Doctrine\Common\Collections\Collection $rightEditors
     */
    public function getRightEditors()
    {
        return $this->rightEditors;
    }

    /**
     * Set nbPlikers
     *
     * @param int $nbPlikers
     * @return self
     */
    public function setNbPlikers($nbPlikers)
    {
        $this->nbPlikers = $nbPlikers;
        return $this;
    }

    /**
     * Get nbPlikers
     *
     * @return int $nbPlikers
     */
    public function getNbPlikers()
    {
        return $this->nbPlikers;
    }

    /**
     * Set emotion
     *
     * @param int $emotion
     * @return self
     */
    public function setEmotion($emotion)
    {
        $this->emotion = $emotion;
        return $this;
    }

    /**
     * Get emotion
     *
     * @return int $emotion
     */
    public function getEmotion()
    {
        return $this->emotion;
    }

    /**
     * Add leftcomment
     *
     * @param OP\PostBundle\Document\LeftComment $leftcomment
     */
    public function addLeftcomment(\OP\PostBundle\Document\LeftComment $leftcomment)
    {
        $this->leftcomments[] = $leftcomment;
        $this->incrementLeftcomments();
    }

    /**
     * Remove leftcomment
     *
     * @param OP\PostBundle\Document\LeftComment $leftcomment
     */
    public function removeLeftcomment(\OP\PostBundle\Document\LeftComment $leftcomment)
    {
        $this->leftcomments->removeElement($leftcomment);
        $this->decrementLeftcomments();
    }

    /**
     * Get leftcomments
     *
     * @return \Doctrine\Common\Collections\Collection $leftcomments
     */
    public function getLeftcomments()
    {
        return $this->leftcomments;
    }

    /**
     * Add rightcomment
     *
     * @param OP\PostBundle\Document\RightComment $rightcomment
     */
    public function addRightcomment(\OP\PostBundle\Document\RightComment $rightcomment)
    {
        $this->rightcomments[] = $rightcomment;
        $this->incrementRightcomments();
    }

    /**
     * Remove rightcomment
     *
     * @param OP\PostBundle\Document\RightComment $rightcomment
     */
    public function removeRightcomment(\OP\PostBundle\Document\RightComment $rightcomment)
    {
        $this->rightcomments->removeElement($rightcomment);
        $this->decrementRightcomments();
    }

    /**
     * Get rightcomments
     *
     * @return \Doctrine\Common\Collections\Collection $rightcomments
     */
    public function getRightcomments()
    {
        return $this->rightcomments;
    }

    /**
     * Add rate
     *
     * @param OP\PostBundle\Document\Rate $rate
     */
    public function addRate(\OP\PostBundle\Document\Rate $rate)
    {
        $this->rates[] = $rate;
        $this->incrementRates();
    }

    /**
     * Remove rate
     *
     * @param OP\PostBundle\Document\Rate $rate
     */
    public function removeRate(\OP\PostBundle\Document\Rate $rate)
    {
        $this->rates->removeElement($rate);
        $this->decrementRate();
    }

    /**
     * Get rates
     *
     * @return \Doctrine\Common\Collections\Collection $rates
     */
    public function getRates()
    {
        return $this->rates;
    }

    /**
     * Add share
     *
     * @param OP\PostBundle\Document\Share $share
     */
    public function addShare(\OP\PostBundle\Document\Share $share)
    {
        $this->shares[] = $share;
        $this->incrementShares();
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
     * Set shareNotification
     *
     * @param OP\SocialBundle\Document\Notification $shareNotification
     * @return self
     */
    public function setShareNotification(\OP\SocialBundle\Document\Notification $shareNotification)
    {
        $this->shareNotification = $shareNotification;
        return $this;
    }

    /**
     * Get shareNotification
     *
     * @return OP\SocialBundle\Document\Notification $shareNotification
     */
    public function getShareNotification()
    {
        return $this->shareNotification;
    }

    /**
     * Set rightNotification
     *
     * @param OP\SocialBundle\Document\Notification $rightNotification
     * @return self
     */
    public function setRightNotification(\OP\SocialBundle\Document\Notification $rightNotification)
    {
        $this->rightNotification = $rightNotification;
        return $this;
    }

    /**
     * Get rightNotification
     *
     * @return OP\SocialBundle\Document\Notification $rightNotification
     */
    public function getRightNotification()
    {
        return $this->rightNotification;
    }

    /**
     * Set leftNotification
     *
     * @param OP\SocialBundle\Document\Notification $leftNotification
     * @return self
     */
    public function setLeftNotification(\OP\SocialBundle\Document\Notification $leftNotification)
    {
        $this->leftNotification = $leftNotification;
        return $this;
    }

    /**
     * Get leftNotification
     *
     * @return OP\SocialBundle\Document\Notification $leftNotification
     */
    public function getLeftNotification()
    {
        return $this->leftNotification;
    }

    /**
     * Set rateNotification
     *
     * @param OP\SocialBundle\Document\Notification $rateNotification
     * @return self
     */
    public function setRateNotification(\OP\SocialBundle\Document\Notification $rateNotification)
    {
        $this->rateNotification = $rateNotification;
        return $this;
    }

    /**
     * Get rateNotification
     *
     * @return OP\SocialBundle\Document\Notification $rateNotification
     */
    public function getRateNotification()
    {
        return $this->rateNotification;
    }

    /**
     * Set recipients
     *
     * @param string $recipients
     * @return self
     */
    public function setRecipients($recipients)
    {
        $this->recipients = $recipients;
        return $this;
    }

    /**
     * Get recipients
     *
     * @return string $recipients
     */
    public function getRecipients()
    {
        return $this->recipients;
    }

    /**
     * Set editorTexts
     *
     * @param string $editorTexts
     * @return self
     */
    public function setEditorTexts($editorTexts)
    {
        $this->editorTexts = $editorTexts;
        return $this;
    }

    /**
     * Get editorTexts
     *
     * @return string $editorTexts
     */
    public function getEditorTexts()
    {
        return $this->editorTexts;
    }

    /**
     * Set unique
     *
     * @param string $unique
     * @return self
     */
    public function setUnique($str)
    {
        $this->unique = $str;
        return $this;
    }

    /**
     * Get editorTexts
     *
     * @return string $editorTexts
     */
    public function getUnique()
    {
        return $this->unique;
    }

    /**
     * Set leftEditorTexts
     *
     * @param string $leftEditorTexts
     * @return self
     */
    public function setLeftEditorTexts($leftEditorTexts)
    {
        $this->leftEditorTexts = $leftEditorTexts;
        return $this;
    }

    /**
     * Get leftEditorTexts
     *
     * @return string $leftEditorTexts
     */
    public function getLeftEditorTexts()
    {
        return $this->leftEditorTexts;
    }

    /**
     * Set rightEditorTexts
     *
     * @param string $rightEditorTexts
     * @return self
     */
    public function setRightEditorTexts($rightEditorTexts)
    {
        $this->rightEditorTexts = $rightEditorTexts;
        return $this;
    }

    /**
     * Get rightEditorTexts
     *
     * @return string $rightEditorTexts
     */
    public function getRightEditorTexts()
    {
        return $this->rightEditorTexts;
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
     * Set nbLeftcomments
     *
     * @param increment $nbLeftcomments
     * @return self
     */
    public function setNbLeftcomments($nbLeftcomments)
    {
        $this->nbLeftcomments = $nbLeftcomments;
        return $this;
    }

    /**
     * Get nbLeftcomments
     *
     * @return increment $nbLeftcomments
     */
    public function getNbLeftcomments()
    {
        return $this->nbLeftcomments;
    }

    /**
     * Set nbRightcomments
     *
     * @param increment $nbRightcomments
     * @return self
     */
    public function setNbRightcomments($nbRightcomments)
    {
        $this->nbRightcomments = $nbRightcomments;
        return $this;
    }

    /**
     * Get nbRightcomments
     *
     * @return increment $nbRightcomments
     */
    public function getNbRightcomments()
    {
        return $this->nbRightcomments;
    }

    /**
     * Set nbShares
     *
     * @param increment $nbShares
     * @return self
     */
    public function setNbShares($nbShares)
    {
        $this->nbShares = $nbShares;
        return $this;
    }

    /**
     * Get nbShares
     *
     * @return increment $nbShares
     */
    public function getNbShares()
    {
        return $this->nbShares;
    }

    /**
     * Set nbQuestioners
     *
     * @param increment $nbQuestioners
     * @return self
     */
    public function setNbQuestioners($nbQuestioners)
    {
        $this->nbQuestioners = $nbQuestioners;
        return $this;
    }

    /**
     * Get nbQuestioners
     *
     * @return increment $nbQuestioners
     */
    public function getNbQuestioners()
    {
        return $this->nbQuestioners;
    }

    /**
     * Set questionersIds
     *
     * @param collection $questionersIds
     * @return self
     */
    public function setQuestionersIds($questionersIds)
    {
        $this->questioners_ids = $questionersIds;
        return $this;
    }

    /**
     * Get questionersIds
     *
     * @return collection $questionersIds
     */
    public function getQuestionersIds()
    {
        return $this->questioners_ids;
    }

    /**
     * Set sIds
     *
     * @param collection $sIds
     * @return self
     */
    public function setSIds($sIds)
    {
        $this->s_ids = $sIds;
        return $this;
    }

    /**
     * Get sIds
     *
     * @return collection $sIds
     */
    public function getSIds()
    {
        return $this->s_ids;
    }

    /**
     * Set subcribers
     *
     * @param collection $subcribers
     * @return self
     */
    public function setSubcribers($subcribers)
    {
        $this->subcribers = $subcribers;
        return $this;
    }

    /**
     * Get subcribers
     *
     * @return collection $subcribers
     */
    public function getSubcribers()
    {
        return $this->subcribers;
    }

    /**
     * Add metadatum
     *
     * @param OP\PostBundle\Document\PostMetadata $metadatum
     */
    public function addMetadatum(\OP\PostBundle\Document\PostMetadata $metadatum)
    {
        $this->metadata[] = $metadatum;
    }

    /**
     * Remove metadatum
     *
     * @param OP\PostBundle\Document\PostMetadata $metadatum
     */
    public function removeMetadatum(\OP\PostBundle\Document\PostMetadata $metadatum)
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
     * Set nbAllies
     *
     * @param increment $nbAllies
     * @return self
     */
    public function setNbAllies($nbAllies)
    {
        $this->nbAllies = $nbAllies;
        return $this;
    }

    /**
     * Get nbAllies
     *
     * @return increment $nbAllies
     */
    public function getNbAllies()
    {
        return $this->nbAllies;
    }

    /**
     * Set allieIds
     *
     * @param collection $allieIds
     * @return self
     */
    public function setAllieIds($allieIds)
    {
        $this->allie_ids = $allieIds;
        return $this;
    }

    /**
     * Get allieIds
     *
     * @return collection $allieIds
     */
    public function getAllieIds()
    {
        return $this->allie_ids;
    }

    /**
     * Set leftSideName
     *
     * @param string $leftSideName
     * @return self
     */
    public function setLeftSideName($leftSideName)
    {
        $this->leftSideName = $leftSideName;
        return $this;
    }

    /**
     * Get leftSideName
     *
     * @return string $leftSideName
     */
    public function getLeftSideName()
    {
        return $this->leftSideName;
    }

    /**
     * Set rightSideName
     *
     * @param string $rightSideName
     * @return self
     */
    public function setRightSideName($rightSideName)
    {
        $this->rightSideName = $rightSideName;
        return $this;
    }

    /**
     * Get rightSideName
     *
     * @return string $rightSideName
     */
    public function getRightSideName()
    {
        return $this->rightSideName;
    }

    /**
     * Set timelineId
     *
     * @param object_id $timelineId
     * @return $this
     */
    public function setTimelineId($timelineId)
    {
        $this->timelineId = $timelineId;
        return $this;
    }

    /**
     * Get timelineId
     *
     * @return object_id $timelineId
     */
    public function getTimelineId()
    {
        return $this->timelineId;
    }

    /**
     * Set cardId
     *
     * @param object_id $cardId
     * @return $this
     */
    public function setCardId($cardId)
    {
        $this->cardId = $cardId;
        return $this;
    }

    /**
     * Get cardId
     *
     * @return object_id $cardId
     */
    public function getCardId()
    {
        return $this->cardId;
    }

    /**
     * Set timelineType
     *
     * @param string $timelineType
     * @return $this
     */
    public function setTimelineType($timelineType)
    {
        $this->timelineType = $timelineType;
        return $this;
    }

    /**
     * Get timelineType
     *
     * @return string $timelineType
     */
    public function getTimelineType()
    {
        return $this->timelineType;
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
     * Add metadata
     *
     * @param OP\PostBundle\Document\PostMetadata $metadata
     */
    public function addMetadata(\OP\PostBundle\Document\PostMetadata $metadata)
    {
        $this->metadata[] = $metadata;
    }

    /**
     * Remove metadata
     *
     * @param OP\PostBundle\Document\PostMetadata $metadata
     */
    public function removeMetadata(\OP\PostBundle\Document\PostMetadata $metadata)
    {
        $this->metadata->removeElement($metadata);
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
     * Set targetMap
     *
     * @param collection $targetMap
     * @return $this
     */
    public function setTargetMap($targetMap)
    {
        $this->targetMap = $targetMap;
        return $this;
    }

    /**
     * Get targetMap
     *
     * @return collection $targetMap
     */
    public function getTargetMap()
    {
        return $this->targetMap;
    }
}
