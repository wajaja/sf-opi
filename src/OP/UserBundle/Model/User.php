<?php

namespace OP\UserBundle\Model;

use FOS\UserBundle\Model\User as BaseUser,
    Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB,
    Symfony\Component\Validator\Constraints as Assert,
    Symfony\Component\HttpFoundation\Request,
    JMS\Serializer\Annotation\ExclusionPolicy,
    JMS\Serializer\Annotation\Expose,
    JMS\Serializer\Annotation\Groups,
    JMS\Serializer\Annotation\VirtualProperty,
    JMS\Serializer\Annotation\Type;

/**
 * @MongoDB\MappedSuperclass
 * @ExclusionPolicy("all")
 */
class User extends BaseUser
{
    /**
    * @MongoDB\EmbedOne(targetDocument="OP\UserBundle\Document\Address")
    * @Expose
    * @Groups({"Profile"})
    * @Type("OP\UserBundle\Document\Address")
    */
    protected $address;

    /**
    * @MongoDB\EmbedOne(targetDocument="OP\UserBundle\Document\Config")
    * @Expose
    * @Groups({"Me"})
    * @Type("OP\UserBundle\Document\Config")
    */
    protected $config;

    /**
    * @MongoDB\EmbedOne(targetDocument="OP\UserBundle\Document\Contact")
    * @Expose
    * @Groups({"Infos", "Profile"})
    * @Type("OP\UserBundle\Document\Contact")
    */
    protected $contact;

    /**
    * @MongoDB\ReferenceMany(targetDocument="OP\UserBundle\Document\Devices")
    */
    protected $devices;

    /**
    * @MongoDB\EmbedOne(targetDocument="OP\UserBundle\Document\AboutMe")
    * @Expose
    * @Groups({"Infos", "Profile"})
    * @Type("OP\UserBundle\Document\AboutMe")
    */
    protected $aboutMe;

    /**
    * @MongoDB\EmbedOne(targetDocument="OP\UserBundle\Document\Notification")
    * @Expose
    * @Groups({"Infos", "Profile"})
    * @Type("OP\UserBundle\Document\Notification")
    */
    protected $notification;

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\PostBundle\Document\Post")
     */
    protected $posts = array();

    /**
    * @MongoDB\ReferenceMany(targetDocument="OP\UserBundle\Document\User")
    */
    public $friendsWithMe;

    /**
    * @MongoDB\Field(name="friendsWithMeIds", type="collection")
    * 
    */
    public $friendsWithMeIds = array();

    /**
    * @MongoDB\ReferenceMany(targetDocument="OP\UserBundle\Document\User")
    * 
    */
    public $myFriends;

    /**
    * @MongoDB\Field(name="myFriendsIds", type="collection")
    * 
    * @Expose
    * @Type("array")
    * @Groups({"Detail", "Me", "Infos", "Profile", "Default"})
    */
    public $myFriendsIds = array();

    /**
    * @MongoDB\Field(name="requestsToUsersIds", type="collection")
    * 
    * @Expose
    * @Type("array")
    * @Groups({"Detail", "Me", "Infos", "Profile", "Default"})
    */
    public $requestsToUsersIds = array();

    /**
    * @MongoDB\Field(name="requestFromUsersIds", type="collection")
    * 
    * @Expose
    * @Type("array")
    * @Groups({"Detail", "Me", "Infos", "Profile", "Default"})
    */
    public $requestFromUsersIds = array();

    /**
    * @MongoDB\ReferenceMany(targetDocument="OP\UserBundle\Document\User")
    */
    public $myFolloweds;
    
    /**
    * @MongoDB\ReferenceMany(targetDocument="OP\UserBundle\Document\User")
    */
    public $followersWithMe;

    /**
    * @MongoDB\ReferenceMany(targetDocument="OP\UserBundle\Document\User")
    */
    public $myFollowers;
    
    /**
    * @MongoDB\ReferenceMany(targetDocument="OP\UserBundle\Document\User")
    */
    public $blockedsWithMe;

    /**
    * @MongoDB\Field(name="blockedsWithMeIds", type="collection")
    * @Expose
    * @Type("array")
    * @Groups({"Detail", "Profile", "Infos"})
    */
    public $blockedsWithMeIds = array();

    /**
    * @MongoDB\ReferenceMany(targetDocument="OP\UserBundle\Document\User")
    */
    public $blockeds;

   /**
    * @MongoDB\Field(name="blockedsIds", type="collection")
    * 
    */
    public $blockedsIds = array();

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\MediaBundle\Document\Image")
     */
    protected $images;

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\MediaBundle\Document\Video")
     */
    protected $videos;

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\MediaBundle\Document\MediaStreamRecorder")
     */
    protected $records;

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\MediaBundle\Document\Reaction")
     */
    protected $reactions;
    
     /**
     * @MongoDB\ReferenceMany(targetDocument="OP\MessageBundle\Document\Response")
     */
    protected $responses;

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\PostBundle\Document\RightComment")
     */
    protected $rightcomments;
    
    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\PostBundle\Document\LeftComment")
     */
    protected $leftcomments;

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\PostBundle\Document\Like")
     */
    protected $likes;

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\PostBundle\Document\Comment")
     */
    protected $comments;

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\PostBundle\Document\Rate")
     */
    protected $rates;

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\PostBundle\Document\Share")
     */
    protected $shares;

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\PostBundle\Document\UnderComment")
     */
    protected $undercomments;

    /**
    * @MongoDB\ReferenceMany(targetDocument="OP\MediaBundle\Document\Image")
    */
    protected $listProfilePics;
    
    /**
    * @MongoDB\ReferenceOne(targetDocument="OP\MediaBundle\Document\Image", cascade={"remove"},  nullable=true)
    * 
    * @Expose
    * @Groups({"Infos", "Default", "Detail", "Me", "Profile", "elastica", "WithMutual"})
    * @Type("OP\MediaBundle\Document\Image")
    */
    public $profilePic;
    
    public function __construct()
    {
        parent::__construct();
        $this->initSortSelect();
        $this->friendsWithMe = new \Doctrine\Common\Collections\ArrayCollection();
        $this->followersWithMe = new \Doctrine\Common\Collections\ArrayCollection();
        $this->listProfilePics = new \Doctrine\Common\Collections\ArrayCollection();
        // $this->profilePic  = new \OP\MediaBundle\Document\Image();
        // $this->posts = new \Doctrine\Common\Collections\ArrayCollection();  errorrrrr
        // $this->aboutMe = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    
    /**
     * Set profilePic
     *
     * @param OP\MediaBundle\Document\Picture $profilePic
     * @return self
     */
    public function setProfilePic(\OP\MediaBundle\Document\Image $profilePic)
    {
        $this->profilePic = $profilePic;
        return $this;
    }

    /**
    * removing user's profilePic
    * 
    */
    public function removeProfilePic() {
        $this->profilePic = null;
        return $this;
    }

     /**
    * removing user's profilePic
    * 
    */
    public function removeCoverPic() {
        $this->coverPic = null;
        return $this;
    }

    /**
     * Get profilePic
     *
     * @return OP\MediaBundle\Document\Picture $profilePic
     */
    public function getProfilePic()
    {
        if ($this->doesReferencedItemExist($this->profilePic) === false) {
            $this->profilePic = null;
        }

        return $this->profilePic;

        //if user has not profile pic return new empty Image Object
        //these empty object has some default webPath
        // return (null !== $this->profilePic) ? $this->profilePic : new \OP\MediaBundle\Document\Image();
    }

    /**
     * Add post
     *
     * @param OP\PostBundle\Document\Post $post
     */
    public function addPost(\OP\PostBundle\Document\Post $post)
    {
        $this->posts[] = $post;
    }

    /**
     * Remove post
     *
     * @param OP\PostBundle\Document\Post $post
     */
    public function removePost(\OP\PostBundle\Document\Post $post)
    {
        $this->posts->removeElement($post);
    }

    /**
     * Get posts
     *
     * @return \Doctrine\Common\Collections\Collection $posts
     */
    public function getPosts()
    {
        return $this->posts;
    }

    /**
     * Add record
     *
     * @param OP\MediaBundle\Document\MediaStreamRecorder $record
     */
    public function addRecord(\OP\MediaBundle\Document\MediaStreamRecorder $record)
    {
        $this->records[] = $record;
    }

    /**
     * Remove record
     *
     * @param OP\MediaBundle\Document\MediaStreamRecorder $record
     */
    public function removeRecord(\OP\MediaBundle\Document\MediaStreamRecorder $record)
    {
        $this->records->removeElement($record);
    }

    /**
     * Get records
     *
     * @return \Doctrine\Common\Collections\Collection $records
     */
    public function getRecords()
    {
        return $this->records;
    }

    /**
     * Add reaction
     *
     * @param OP\MediaBundle\Document\Reaction $reaction
     */
    public function addReaction(\OP\MediaBundle\Document\Reaction $reaction)
    {
        $this->reactions[] = $reaction;
    }

    /**
     * Remove reaction
     *
     * @param OP\MediaBundle\Document\Reaction $reaction
     */
    public function removeReaction(\OP\MediaBundle\Document\Reaction $reaction)
    {
        $this->reactions->removeElement($reaction);
    }

    /**
     * Get reactions
     *
     * @return \Doctrine\Common\Collections\Collection $reactions
     */
    public function getReactions()
    {
        return $this->reactions;
    }

    /**
     * Add rightcomment
     *
     * @param OP\PostBundle\Document\RightComment $rightcomment
     */
    public function addRightcomment(\OP\PostBundle\Document\RightComment $rightcomment)
    {
        $this->rightcomments[] = $rightcomment;
    }

    /**
     * Remove rightcomment
     *
     * @param OP\PostBundle\Document\RightComment $rightcomment
     */
    public function removeRightcomment(\OP\PostBundle\Document\RightComment $rightcomment)
    {
        $this->rightcomments->removeElement($rightcomment);
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
     * Add leftcomment
     *
     * @param OP\PostBundle\Document\LeftComment $leftcomment
     */
    public function addLeftcomment(\OP\PostBundle\Document\LeftComment $leftcomment)
    {
        $this->leftcomments[] = $leftcomment;
    }

    /**
     * Remove leftcomment
     *
     * @param OP\PostBundle\Document\LeftComment $leftcomment
     */
    public function removeLeftcomment(\OP\PostBundle\Document\LeftComment $leftcomment)
    {
        $this->leftcomments->removeElement($leftcomment);
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
     * Add clike
     *
     * @param OP\PostBundle\Document\Clike $like
     */
    public function addLike(\OP\PostBundle\Document\Like $like)
    {
        $this->clikes[] = $like;
    }

    /**
     * Remove clike
     *
     * @param OP\PostBundle\Document\Like $like
     */
    public function removeLike(\OP\PostBundle\Document\Like $like)
    {
        $this->clikes->removeElement($like);
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
     * Add comment
     *
     * @param OP\PostBundle\Document\Comment $comment
     */
    public function addComment(\OP\PostBundle\Document\Comment $comment)
    {
        $this->comments[] = $comment;
    }

    /**
     * Remove comment
     *
     * @param OP\PostBundle\Document\Comment $comment
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
     * Add undercomment
     *
     * @param OP\PostBundle\Document\UnderComment $undercomment
     */
    public function addUndercomment(\OP\PostBundle\Document\UnderComment $undercomment)
    {
        $this->undercomments[] = $undercomment;
    }

    /**
     * Remove undercomment
     *
     * @param OP\PostBundle\Document\UnderComment $undercomment
     */
    public function removeUndercomment(\OP\PostBundle\Document\UnderComment $undercomment)
    {
        $this->undercomments->removeElement($undercomment);
    }

    /**
     * Get undercomments
     *
     * @return \Doctrine\Common\Collections\Collection $undercomments
     */
    public function getUndercomments()
    {
        return $this->undercomments;
    }

    /**
     * Add listProfilePic
     *
     * @param OP\MediaBundle\Document\Picture $listProfilePic
     */
    public function addListProfilePic(\OP\MediaBundle\Document\Image $listProfilePic)
    {
        $this->listProfilePics[] = $listProfilePic;
    }

    /**
     * Remove listProfilePic
     *
     * @param OP\MediaBundle\Document\Picture $listProfilePic
     */
    public function removeListProfilePic(\OP\MediaBundle\Document\Image $listProfilePic)
    {
        $this->listProfilePics->removeElement($listProfilePic);
    }

    /**
     * Get listProfilePics
     *
     * @return \Doctrine\Common\Collections\Collection $listProfilePics
     */
    public function getListProfilePics()
    {
        return $this->listProfilePics;
    }
    
    /**
     * Add blocked
     *
     * @param OP\UserBundle\Document\User $user
     */
    public function addBlocked(\OP\UserBundle\Document\User $user)
    {
        $user->blockedsWithMe[] = $this;
        $user->blockedsWithMeIds[] = $this->getId();

        $this->blockeds[] = $user;
        $this->blockedsIds[] = $user->getId();
    }

    /**
     * Remove blocked
     *
     * @param OP\UserBundle\Document\User $user
     */
    public function removeBlocked(\OP\UserBundle\Document\User $user)
    {
        $id = $this->getId();
        $user->blockedsWithMe->removeElement($this);
        if(($key = array_search($id, $user->blockedsWithMeIds)) !== false)
                unset($user->blockedsWithMeIds[$key]);
        
        $this->blockeds->removeElement($user);
        if(($key = array_search($id, $this->blockedsIds)) !== false)
                unset($this->blockedsIds[$key]);
    }

    /**
     * Get blockeds
     *
     * @return \Doctrine\Common\Collections\Collection $blockeds
     */
    public function getBlockeds()
    {
        return $this->blockeds;
    }


    /*
    * ElasticSearch Stuff 
    * source OBTAO
    */
     // un tableau public pour être utilisé comme liste déroulante dans le formulaire
    public static $sortChoices = array(
        'lastActivity desc' => 'Publication date : new to old',
        'lastActivity asc' => 'Publication date : old to new',
    );

    // query string
    protected $querySearch;

    // query string
    protected $criteria;

    // définit le champ utilisé pour le tri par défaut
    protected $sort = 'lastActivity';

    // définit l'ordre de tri par défaut
    protected $direction = 'desc';

    // une proprité "virtuelle" pour ajouter un champ select
    protected $sortSelect;

    // le numéro de page par défault
    protected $page = 1;

    // le nombre d'items par page
    protected $perPage = 10;

    // autres getters et setters
    public function handleRequest(Request $request)
    {
        if('application/x-www-form-urlencoded' !== $request->headers->get('Content-Type')) {
            $this->setPage($request->query->get('page', 1));
            $this->setCriteria($request->query->get('criteria', 'all'));
            // $this->setDirection($request->query->get('direction', 'desc'));
            $this->setQuery(urldecode($request->query->get('q', '')));
        } else {
            $this->setPage($request->get('page', 1));
            $this->setCriteria($request->get('criteria', 'all'));
            // $this->setDirection($request->get('direction', 'desc'));
            $this->setQuery(urldecode($request->get('q', '')));
        }
    }

    public function getPage()
    {
        return $this->page;
    }


    public function setPage($page)
    {
        if ($page != null) {
            $this->page = $page;
        }

        return $this;
    }

    public function getQuery()
    {
        return $this->querySearch;
    }


    public function setQuery($q)
    {
        $this->querySearch = $q;

        return $this;
    }

    public function getCriteria()
    {
        return $this->criteria;
    }


    public function setCriteria($c)
    {
        $this->criteria = $c;

        return $this;
    }

    public function getPerPage()
    {
        return $this->perPage;
    }

    public function setPerPage($perPage=null)
    {
        if($perPage != null){
            $this->perPage = $perPage;
        }

        return $this;
    }

    public function setSortSelect($sortSelect)
    {
        if ($sortSelect != null) {
            $this->sortSelect =  $sortSelect;
        }
    }

    public function getSortSelect()
    {
        return $this->sort.' '.$this->direction;
    }

    public function initSortSelect()
    {
        $this->sortSelect = $this->sort.' '.$this->direction;
    }

    public function getSort()
    {
        return $this->sort;
    }

    public function setSort($sort)
    {
        if ($sort != null) {
            $this->sort = $sort;
            $this->initSortSelect();
        }

        return $this;
    }

    public function getDirection()
    {
        return $this->direction;
    }

    public function setDirection($direction)
    {
        if ($direction != null) {
            $this->direction = $direction;
            $this->initSortSelect();
        }

        return $this;
    }
}
