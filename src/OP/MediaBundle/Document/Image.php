<?php

namespace OP\MediaBundle\Document;

use JMS\Serializer\Annotation\{ExclusionPolicy, Expose, Groups, VirtualProperty, Type};
use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM,
    Symfony\Component\HttpFoundation\File\UploadedFile,
    Doctrine\Common\Collections\ArrayCollection;

/**
 * OP\MediaBundle\Document\Image
 *
 *
 * @ODM\Document(
 *      db="opinion",
 *      collection="images",
 *     repositoryClass="OP\MediaBundle\Repository\ImageRepository"
 * )
 * @ODM\HasLifecycleCallbacks
 * @ExclusionPolicy("all") 
 */
class Image
{

    /**
     * @var MongoId $id
     *
     * @ODM\Id(strategy="AUTO")
     * @Expose
     * @Type("string")
     */
    protected $id;

    /**
     * @var string $path
     *
     * @ODM\Field(name="path", type="string")
     * @Expose
     * @Type("string")
     * @Groups({"Infos", "Default", "Detail", "Me"})
     */
    public $path;
    
    /**
     * @var string $path
     *
     * @ODM\Field(name="cropPath", type="string")
     * @Expose
     * @Type("string")
     * @Groups({"Infos", "Default", "Detail", "Me"})
     */
    public $cropPath;

    /**
     * @var integer $size
     *
     * @ODM\Field(name="size", type="integer")
     * @Expose
     * @Type("integer")
     */
    public $size;

    /**
     * @var date $createdAt
     *
     * @ODM\Field(name="createdAt", type="date")
     */
    protected $createdAt;

    /**
     * @var date $createdAt
     *
     * @ODM\Field(name="published", type="boolean")
     */
    protected $published;

    /**
     * @var timestamp $ts
     *
     * @ODM\Field(name="ts", type="timestamp")
     */
    protected $ts;

    /**
     * @var date $updateAt
     *
     * @ODM\Field(name="updateAt", type="date")
     */
    protected $updateAt;

    /**
     * @var string $name
     *
     * @ODM\Field(name="alt", type="string")
     */
    public $alt;

    /**
     * @var string $name
     *
     * @ODM\Field(name="directory", type="string")
     * @Expose
     * @Type("string")
     */
    public $directory;

    private $file;

    /**
     *
     * @ODM\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $author;

    /**
     *
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\Post")
     */
    protected $postId;

    /**
     * @ODM\ReferenceOne(targetDocument="OP\PostBundle\Document\Share")
     */
    protected $shareId;

     /**
     *
     * @ODM\ReferenceOne(targetDocument="OP\MessageBundle\Document\Message")
     */
    protected $messageId;

    /**
     *
     * @ODM\ReferenceOne(targetDocument="OP\MessageBundle\Document\Response")
     */
    protected $responseId;

    /**
    * @ODM\Collection
    */
    protected $likers_ids = array(); 

    /**
    * @ODM\Collection
    */
    protected $questioners_ids = array();
    
    /**
     * @ODM\Increment
     * @var type
     */
    protected $nbComments = 0;

    /**
     * @ODM\Increment
     * @var type
     */
    protected $nbQuestioners = 0;

    /**
     * @ODM\Increment
     */
    protected $nbLikers = 0;
    
    /**
     *
     * @ODM\ReferenceMany(targetDocument="OP\PostBundle\Document\Comment")
     */
    protected $comments;

    /**
     *
     * @ODM\ReferenceMany(targetDocument="OP\PostBundle\Document\Rate")
     */
    protected $rates;

    /**
     * @var  $notification
     *
     * @ODM\ReferenceOne(targetDocument="OP\SocialBundle\Document\Notification")
     */
    protected $notification;

    /**
     * @var  $notification
     *
     * @ODM\ReferenceOne(targetDocument="OP\SocialBundle\Document\Notification")
     */
    protected $commentNotification;

    /**
     * @var  $notification
     *
     * @ODM\ReferenceOne(targetDocument="OP\SocialBundle\Document\Notification")
     */
    protected $likeNotification;

    /**
     * @var
     *
     * @ODM\ReferenceOne(targetDocument="OP\SocialBundle\Document\Notification")
     */
    protected $shareNotification;

    /**
     * @var string $path
     *
     * @ODM\Field(name="webPath", type="string")
     * @Expose
     * @Type("string")
     * @Groups({"Infos", "Default", "Detail", "Me"})
     */
    protected $webPath;

        /**
    * @ODM\EmbedMany(targetDocument="OP\MediaBundle\Document\FriendTag")
    * @Expose
    * @Type("OP\MediaBundle\Document\FriendTag")
    */
    protected $friendTags;

    // *
    // * @ODM\EmbedMany(targetDocument="OP\MediaBundle\Document\EveryWhere")
    // * @Expose
    // * @Type("OP\MediaBundle\Document\EveryWhere")
    
    // protected $everyWheres;

    public function __construct(){
        $this->likes = new ArrayCollection();
        $this->rates = new ArrayCollection();
        $this->createdAt = new \Datetime(null, new \DateTimeZone("UTC"));
        //$this->datepubledAt = new \Datetime(null, new \DateTimeZone("UTC"));
    }
    
    /**
     * sets file
     * @param UploadedFile $file
     */
    public function setFile(UploadedFile $file)
    {
        $this->file = $file;
    }

    public function getFile()
    {
        return $this->file;
    }


    /**
    * @ODM\PrePersist
    * @ODM\PreUpdate
    */
    public function preUpload()
    {
//        foreach($this->files as $file){
            // Si jamais il n'y a pas de fichier (champ facultatif)
            if (null ===$this->file) {
                return;
            }

            // Le nom du fichier est son id, on doit juste stocker également son extension
            // Pour faire propre, on devrait renommer cet attribut en « extension », plutôt que « url »
            $this->path = md5(uniqid()).'.'.$this->file->guessExtension();
        //    $dir = $this->getGalleyImageUploadDir();
        //    $this->path = $dir.'/'.$this->getName();
            // Et on génère l'attribut alt de la balise <img>, à la valeur du nom du fichier sur le PC de l'internaute
            $this->size = $this->file->getSize();

    }

    /**
    * @ODM\PostPersist
    * @ODM\PostUpdate
    */
    public function upload()
    {
        // Si jamais il n'y a pas de fichier (champ facultatif)
        if (null === $this->file) {
            return;
        }
        // On déplace le fichier envoyé dans le répertoire de notre choix
        $this->file->move(
            $this->getUploadRootDir(),
            $this->getPath() );
    }

    /**
    * @ODM\PreRemove
    */
    public function preRemoveUpload()
    {
        // On sauvegarde temporairement le nom du fichier, car il dépend de l'id
    }

    /**
    * @ODM\PostRemove
    */
    public function removeUpload()
    {
        // En PostRemove, on n'a pas accès à l'id, on utilise notre nom sauvegardé
    }

    public function getUploadDir()
    {
        return $this->getDirectory();
    }

    public function getUploadRootDir()
    {
        return __DIR__.'/../../../../web/uploads/'. $this->getUploadDir();
    }
    
    public function getCroppedPath()
    {                                   
        return __DIR__.'/../../../../web/uploads/'
                    .$this->getDirectory().'/'
                    .$this->getCropPath();
    }

    public function getWebPath()
    {

        if(null !== $this->getCropPath()) {
            return 'http://opinion.com/uploads/'
                    .$this->getDirectory().'/'
                    .$this->getCropPath();

        } else if(null !== $this->getPath()) {
            return 'http://opinion.com/uploads/'
                    .$this->getDirectory().'/'
                    .$this->getPath();

        } else {
            return 'http://opinion.com/uploads/allery/9f321f2c493296fc60ca2e0eaf2d8270.png';
        }
    }

    /**
     * Set webPath
     *
     * @param string $webPath
     * @return $this
     */
    public function setWebPath($defaultPath = null)
    {
        if($defaultPath) {
            $this->webPath = $defaultPath;

        } else if(null !== $this->getCropPath()) {
            $this->webPath = 'http://opinion.com/uploads/'
                            .$this->getDirectory().'/'
                            .$this->getCropPath();

        } else if(null !== $this->getPath()) {
            $this->webPath = 'http://opinion.com/uploads/'
                            .$this->getDirectory().'/'
                            .$this->getPath();
        } else {
            $this->webPath = 'http://opinion.com/uploads/gallery/9f321f2c493296fc60ca2e0eaf2d8270.png';
        }
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

    /**
     * Set path
     *
     * @param string $path
     * @return self
     */
    public function setPath($path)
    {
        $this->path = $path;
        return $this;
    }

    /**
     * Get path
     *
     * @return string $path
     */
    public function getPath()
    {
        return $this->path;
    }

    /**
     * Set size
     *
     * @param integer $size
     * @return self
     */
    public function setSize($size)
    {
        $this->size = $size;
        return $this;
    }

    /**
     * Get size
     *
     * @return integer $size
     */
    public function getSize()
    {
        return $this->size;
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
     * incrementLikers
     */
    public function incrementComments()
    {
        $this->nbComments++;
    }

    /**
     * decrementLikers
     */
    public function decrementComments()
    {
        $this->nbComments--;
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
     * Get updateAt
     *
     * @return date $updateAt
     */
    public function getUpdateAt()
    {
        return $this->updateAt;
    }

    /**
     * Set alt
     *
     * @param string $alt
     * @return self
     */
    public function setAlt($alt)
    {
        $this->name = $alt;
        return $this;
    }

    /**
     * Get alt
     *
     * @return string $alt
     */
    public function getAlt()
    {
        return $this->alt;
    }

    /**
     * Set directory
     *
     * @param string $directory
     * @return self
     */
    public function setDirectory($directory)
    {
        $this->directory = $directory;
        return $this;
    }

    /**
     * Get directory
     *
     * @return string $directory
     */
    public function getDirectory()
    {
        return $this->directory;
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
     * Set ts
     *
     * @param timestamp $ts
     * @return self
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
     * Set postId
     *
     * @param OP\PostBundle\Document\Post $postId
     * @return self
     */
    public function setPostId(\OP\PostBundle\Document\Post $postId)
    {
        $this->postId = $postId;
        return $this;
    }

    /**
     * Get postId
     *
     * @return OP\PostBundle\Document\Post $postId
     */
    public function getPostId()
    {
        return $this->postId;
    }

    /**
     * Set messageId
     *
     * @param OP\MessageBundle\Document\Message $messageId
     * @return self
     */
    public function setMessageId(\OP\MessageBundle\Document\Message $messageId)
    {
        $this->messageId = $messageId;
        return $this;
    }

    /**
     * Get messageId
     *
     * @return OP\MessageBundle\Document\Message $messageId
     */
    public function getMessageId()
    {
        return $this->messageId;
    }

    /**
     * Add like
     *
     * @param OP\PostBundle\Document\Like $like
     */
    public function addLike(\OP\PostBundle\Document\Like $like)
    {
        $this->like[] = $like;
    }

    /**
     * Remove like
     *
     * @param OP\PostBundle\Document\Like $like
     */
    public function removeLike(\OP\PostBundle\Document\Like $like)
    {
        $this->like->removeElement($like);
    }

    /**
     * Get like
     *
     * @return \Doctrine\Common\Collections\Collection $like
     */
    public function getLike()
    {
        return $this->like;
    }

    /**
     * Add comment
     *
     * @param OP\MediaBundle\Document\Comment $comment
     */
    public function addComment(\OP\PostBundle\Document\Comment $comment)
    {
        $this->comments[] = $comment;
    }

    /**
     * Remove comment
     *
     * @param OP\MediaBundle\Document\Comment $comment
     */
    public function removeComment(\OP\PostBundle\Document\Comment $comment)
    {
        $this->comments->removeElement($comment);
    }

    /**
     * Get comments
     *
     * @return \Doctrine\Common\Collections\Collection $comments
     */
    public function getComments()
    {
        return $this->comments;
    }

    /**
     * Add rake
     *
     * @param OP\PostBundle\Document\Rate $rake
     */
    public function addRake(\OP\PostBundle\Document\Rate $rake)
    {
        $this->rakes[] = $rake;
    }

    /**
     * Remove rake
     *
     * @param OP\PostBundle\Document\Rate $rake
     */
    public function removeRake(\OP\PostBundle\Document\Rate $rake)
    {
        $this->rakes->removeElement($rake);
    }

    /**
     * Get rakes
     *
     * @return \Doctrine\Common\Collections\Collection $rakes
     */
    public function getRakes()
    {
        return $this->rakes;
    }

    /**
     * Set shareId
     *
     * @param OP\PostBundle\Document\Share $shareId
     * @return self
     */
    public function setShareId(\OP\PostBundle\Document\Share $shareId)
    {
        $this->shareId = $shareId;
        return $this;
    }

    /**
     * Get shareId
     *
     * @return OP\PostBundle\Document\Share $shareId
     */
    public function getShareId()
    {
        return $this->shareId;
    }

    /**
     * Set responseId
     *
     * @param OP\MessageBundle\Document\Response $responseId
     * @return self
     */
    public function setResponseId(\OP\MessageBundle\Document\Response $responseId)
    {
        $this->responseId = $responseId;
        return $this;
    }

    /**
     * Get responseId
     *
     * @return OP\MessageBundle\Document\Response $responseId
     */
    public function getResponseId()
    {
        return $this->responseId;
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
     * Add rate
     *
     * @param OP\PostBundle\Document\Rate $rate
     */
    public function addRate(\OP\PostBundle\Document\Rate $rate)
    {
        $this->rates[] = $rate;
    }

    /**
     * Remove rate
     *
     * @param OP\PostBundle\Document\Rate $rate
     */
    public function removeRate(\OP\PostBundle\Document\Rate $rate)
    {
        $this->rates->removeElement($rate);
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
     * Set cropPath
     *
     * @param string $cropPath
     * @return $this
     */
    public function setCropPath($cropPath)
    {
        $this->cropPath = $cropPath;
        return $this;
    }

    /**
     * Get cropPath
     *
     * @return string $cropPath
     */
    public function getCropPath()
    {
        return $this->cropPath;
    }

    /**
     * Add friendTag
     *
     * @param OP\MediaBundle\Document\FriendTag $friendTag
     */
    public function addFriendTag(\OP\MediaBundle\Document\FriendTag $friendTag)
    {
        $this->friendTags[] = $friendTag;
    }

    /**
     * Remove friendTag
     *
     * @param OP\MediaBundle\Document\FriendTag $friendTag
     */
    public function removeFriendTag(\OP\MediaBundle\Document\FriendTag $friendTag)
    {
        $this->friendTags->removeElement($friendTag);
    }

    /**
     * Get friendTags
     *
     * @return \Doctrine\Common\Collections\Collection $friendTags
     */
    public function getFriendTags()
    {
        return $this->friendTags;
    }

    /**
     * Add everyWhere
     *
     * @param OP\MediaBundle\Document\EveryWhere $everyWhere
     */
    public function addEveryWhere(\OP\MediaBundle\Document\EveryWhere $everyWhere)
    {
        $this->everyWheres[] = $everyWhere;
    }

    /**
     * Remove everyWhere
     *
     * @param OP\MediaBundle\Document\EveryWhere $everyWhere
     */
    public function removeEveryWhere(\OP\MediaBundle\Document\EveryWhere $everyWhere)
    {
        $this->everyWheres->removeElement($everyWhere);
    }

    /**
     * Get everyWheres
     *
     * @return \Doctrine\Common\Collections\Collection $everyWheres
     */
    public function getEveryWheres()
    {
        return $this->everyWheres;
    }

    /**
     * Set published
     *
     * @param boolean $published
     * @return $this
     */
    public function setPublished($published)
    {
        $this->published = $published;
        return $this;
    }

    /**
     * Get published
     *
     * @return boolean $published
     */
    public function getPublished()
    {
        return $this->published;
    }
}
