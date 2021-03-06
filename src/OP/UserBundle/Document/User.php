<?php

namespace OP\UserBundle\Document;

use OP\UserBundle\Model\User as BaseUser,
    JMS\Serializer\Annotation\Type,
    JMS\Serializer\Annotation\Expose,
    JMS\Serializer\Annotation\Groups,
    JMS\Serializer\Annotation\ExclusionPolicy,
    JMS\Serializer\Annotation\VirtualProperty,
    Doctrine\Common\Proxy\Proxy,
    Doctrine\ODM\MongoDB\DocumentNotFoundException,
    Doctrine\Common\Collections\ArrayCollection,
    Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB,
    Symfony\Component\Validator\Constraints as Assert,
    OP\MessageBundle\Model\ParticipantInterface;

/**
 * @MongoDB\Document(
 *      db="opinion",
 *      collection="users",
 * indexes={ 
 *          @MongoDB\index(keys={"username"="desc"}, options={"unique"=true}),
 *          @MongoDB\index(keys={"email"="desc"}, options={"unique"=true}),
 *       },
 *         requireIndexes=true
 * )
 *
 * @ExclusionPolicy("all") 
 */
class User extends BaseUser implements ParticipantInterface //, ObjectManagerAware
{
    /**
     * @MongoDB\Id(strategy="auto")
     * @Expose
     * @Type("string")
     * @Groups({"Detail", "Me", "Infos", "Profile", "Default", "elastica"})
     */
    protected $id;

    /**
    * @MongoDB\Field(name="firstname", type="string")
    * 
    *
    * @Assert\NotNull()
    * @Assert\Length(min=1)
    * @Assert\Length(max=20)
    * @Expose
    * @Type("string")
    * @Groups({"Detail", "Me", "Infos", "Profile", "Default", "elastica", "WithMutual"})
    */
    protected $firstname;

    /**
    * @MongoDB\Field(name="nickname", type="string")
    * 
    *
    * @Expose
    * @Type("string")
    * @Groups({"Detail", "Me", "Infos", "Profile", "Default", "elastica", "WithMutual"})
    */
    protected $nickname;

   /**
    * @MongoDB\Field(name="lastname", type="string")
    * 
    *
    * @Assert\NotNull()
    * @Assert\Length(min=1)
    * @Assert\Length(max=20)
    * @Expose
    * @Type("string")
    * @Groups({"Detail", "Me", "Infos", "Profile", "Default", "elastica", "WithMutual"})
    */
    protected $lastname;

    /**
    * @MongoDB\Field(name="locale", type="string")
    * locale user's language
    *
    * @Groups({"Profile", "Me"})
    * @Assert\Length(
    *     min=3,
    *     max="255",
    *     minMessage="The name is too short.",
    *     maxMessage="The name is too long.",
    *     groups={"Registration", "Profile"}
    * )
    * @Expose
    * @Type("string")
    * @Groups({"Detail", "Me", "Infos", "Profile", "Default"})
    */
    protected $locale;

    /**
    * @MongoDB\Field(name="name", type="string")
    * @Assert\Blank()
    * @Assert\Length(
    *     min=3,
    *     max="255")
    * @Expose
    * @Groups({"Infos"})
    * @Groups({"Detail", "Me", "Infos", "Profile", "Default"})
    * @Type("string")
    */
    protected $name;

    /**
    * @MongoDB\Field(name="status", type="raw")
    */
    protected $status;

    /**
    * @MongoDB\Field(name="countryInfos", type="raw")
    *
    * @Expose
    * @Groups({"Infos", "Detail", "Me", "Profile"})
    * @Type("string")
    */
    protected $countryInfos;

    /**
    *  @var \Datetime $lastActivity
    *
    * @MongoDB\Field(name="lastActivity", type="date")
    * @Expose
    * @Groups({"Detail", "Infos", "Default"})
    * @Type("DateTime<'Y-m-d H:i:s', 'UTC'>")
    */
    protected $lastActivity;

    /**
    *  @var \Integer $timing
    *
    * @MongoDB\Field(name="timing", type="int")
    * @Expose
    * @Groups({"Detail", "Infos", "Default", "Profile"})
    * @Type("integer")
    */
    protected $timing;

    /**
    * @MongoDB\Field(name="lastMessageView", type="date")
    * @Expose
    * @Groups({"Me"})
    * @Type("DateTime<'Y-m-d H:i:s', 'UTC'>")
    */
    protected $lastMessageView;

    /**
    * @MongoDB\Field(name="lastThreadActivity", type="string")
    * 
    * A mongoId string
    * @Expose
    * @Type("string")
    * @Groups({"Me"})
    */
    protected $lastThreadActivity;

    /**
     *
     * @MongoDB\Field(name="lastInvitationView", type="date")
     */
    protected $lastInvitationView;

    /**
     *
     * @MongoDB\Field(name="lastNotificationView", type="date")
     */
    protected $lastNotificationView;

    /**
     * @MongoDB\EmbedOne(targetDocument="OP\UserBundle\Document\UserMetadata")
     */
    protected $metadata;

    /**
     * @MongoDB\Field(name="signal", type="string")
     * @Expose
     * @Groups({"Me", "Profile"})
     * @Type("string")
     */
    protected $signal;

    /**
     * @MongoDB\Field(name="birthdate", type="date")
     * @Assert\DateTime()
     * @Expose
     * @Groups({"Profile", "Me"})
     * @Type("DateTime<'Y-m-d H:i:s', 'UTC'>")
     */
    protected $birthdate;

    /**
     * @MongoDB\Field(name="gender", type="string")
     * @Expose
     * @Type("string")
     * @Groups({"Detail", "Me", "Infos", "Profile", "Default", "elastica", "WithMutual"})
     */
    protected $gender;
    
    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\UserBundle\Document\Invitation\Invitation")
     */
    protected $invitations;

    /**
    * @MongoDB\Field(name="signInDate", type="date")
    * @Expose
    * @Groups({"Profile", "Me"})
    * @Type("DateTime<'Y-m-d H:i:s', 'UTC'>")
    */
    protected $signInDate;

    /**
    * @MongoDB\ReferenceOne(targetDocument="OP\MediaBundle\Document\Image", cascade={"remove"}, nullable=true)
    * 
    * Embed One target Path to user Profile
    * @Expose
    * @Groups({"Detail", "Me", "Profile", "elastica", "WithMutual"})
    * @Type("OP\MediaBundle\Document\Image")
    */
    protected $coverPic;

    /**
    * @MongoDB\Field(name="clientIp", type="string")
    * @Expose
    * @Groups({"Profile", "Me", "default"})
    * @Type("string")
    */
    protected $clientIp;

    /**
     * Embed One target Path to user Profiles
     * @MongoDB\ReferenceMany(targetDocument="OP\UserBundle\Document\Group")
     */
    protected $groups;

    /**
    * getStream ActivityId
    * @MongoDB\Field(name="lastTimelineId", type="string")
    * @Expose
    * @Groups({"Profile", "Me", "default"})
    * @Type("string")
    */
    protected $lastTimelineId;
    
    
    public function __construct()
    {
        parent::__construct();
        $this->myFriends    = [];
        $this->myFollowers  = [];
        $this->blockeds     = [];
        $this->signInDate   = new \Datetime(null, new \DateTimeZone("UTC"));
        $this->invitations  = new ArrayCollection();
        $this->metadata     = new UserMetadata();
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
     * Set firstname
     *
     * @param string $firstname
     * @return self
     */
    public function setFirstname($firstname)
    {
        $this->firstname = $firstname;
        return $this;
    }

    /**
     * Get firstname
     *
     * @return string $firstname
     */
    public function getFirstname()
    {
        return $this->firstname;
    }

    /**
     * Set lastname
     *
     * @param string $lastname
     * @return self
     */
    public function setLastname($lastname)
    {
        $this->lastname = $lastname;
        return $this;
    }

    /**
     * Get lastname
     *
     * @return string $lastname
     */
    public function getLastname()
    {
        return $this->lastname;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return self
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

    /**
     * Get name
     *
     * @return string $name
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set signal
     *
     * @param string $signal
     * @return self
     */
    public function setSignal($signal)
    {
        $this->signal = $signal;
        return $this;
    }

    /**
     * Get signal
     *
     * @return string $signal
     */
    public function getSignal()
    {
        return $this->signal;
    }

   

    /**
     * Set birthdate
     *
     * @param date $birthdate
     * @return $this
     */
    public function setBirthdate($birthdate)
    {
        $this->birthdate = $birthdate;
        return $this;
    }

    /**
     * Get birthdate
     *
     * @return date $birthdate
     */
    public function getBirthdate()
    {
        return $this->birthdate;
    }

    /**
     * Set gender
     *
     * @param string $gender
     * @return $this
     */
    public function setGender($gender)
    {
        $this->gender = $gender;
        return $this;
    }

    /**
     * Get gender
     *
     * @return string $gender
     */
    public function getGender()
    {
        return $this->gender;
    }

    /**
     * Set signInDate
     *
     * @param date $signInDate
     * @return $this
     */
    public function setSignInDate($signInDate)
    {
        $this->signInDate = $signInDate;
        return $this;
    }

    /**
     * Get signInDate
     *
     * @return date $signInDate
     */
    public function getSignInDate()
    {
        return $this->signInDate;
    }

    public function doesReferencedItemExist($reference)
    {
        try {
            if ($reference instanceof Proxy) {
                $reference->__load();
            } elseif ($reference === null) {
                return false;
            }
        } catch (DocumentNotFoundException $e) {
            return false;
        }
        return true;
    }

    /**
     * @return Bool Whether the user is active or not
     */
    public function isActiveNow()
    {
        // Delay during wich the user will be considered as still active
        $delay = new \DateTime('2 minutes ago');

        return ( $this->getLastActivity() > $delay );
    }

    /**
     * Set lastActivity
     *
     * @param Datetime $lastActivity
     * @return $this
     */
    public function setLastActivity(\Datetime $lastActivity)
    {
        $this->lastActivity = $lastActivity;
        return $this;
    }

    /**
     * Get lastActivity
     *
     * @return Datetime $lastActivity
     */
    public function getLastActivity()
    {
        return $this->lastActivity;
    }

    /**
     * Add friendsWithMe
     *
     * @param OP\UserBundle\Document\User $user
     */
    public function addFriend(\OP\UserBundle\Document\User $user)
    {
        if((array_search($this->getId(), $user->friendsWithMeIds)) === false) {
            $user->friendsWithMe[] = $this;
            $user->friendsWithMeIds[] = $this->getId();
        }
        
        if((array_search($user->getId(), $this->myFriendsIds)) === false) {
            $this->myFriends[] = $user;
            $this->myFriendsIds[] = $user->getId();
        }
    }

    /**
     * Remove friend
     *
     * @param OP\UserBundle\Document\User $user
     */
    public function removeFriend(\OP\UserBundle\Document\User $user)
    {
        $user->friendsWithMe->removeElement($this);
        if(($key= array_search($this->getId(), $user->friendsWithMeIds)) !== false)
                unset($user->friendsWithMeIds[$key]);
        
        $this->myFriends->removeElement($user);
        if(($key = array_search($user->getId(), $this->myFriendsIds)) !== false)
                unset($this->myFriendsIds[$key]);
    }

    /**
     * Add followersWithMe
     *
     * @param OP\UserBundle\Document\User $user
     */
    public function addFollower(\OP\UserBundle\Document\User $user)
    {
        if((array_search($this, $user->followersWithMe->getValues())) === false) {
            $user->followersWithMe[] = $this;
            $this->myFollowers[] = $user;
        }
    }

    /**
     * Remove followersWithMe
     *
     * @param OP\UserBundle\Document\User $user
     */
    public function removeFollower(\OP\UserBundle\Document\User $user)
    {
        if((array_search($this, $user->followersWithMe->getValues())) !== false) {
            $user->followersWithMe->removeElement($this);
            $this->myFollowers->removeElement($user);
        }
    }

    /**
     * Get myFollowers
     *
     * @return \Doctrine\Common\Collections\Collection $myFollowers
     */
    public function getMyFollowers()
    {
        return $this->myFollowers;
    }
    
    /**
     * Add invitation
     *
     * @param OP\UserBundle\Document\Invitation\Invitation $invitation
     */
    public function addInvitation(\OP\UserBundle\Document\Invitation\Invitation $invitation)
    {
        $invitation->setSender($this);
        
        $this->invitations[] = $invitation;
    }

    /**
     * Remove invitation
     *
     * @param OP\UserBundle\Document\Invitation\Invitation $invitation
     */
    public function removeInvitation(\OP\UserBundle\Document\Invitation\Invitation $invitation)
    {
        $this->invitations->removeElement($invitation);
    }

    /**
     * Get invitations
     *
     * @return \Doctrine\Common\Collections\Collection $invitations
     */
    public function getInvitations()
    {
        return $this->invitations;
    }


    /**
     * Add friendsWithMe
     *
     * @param OP\UserBundle\Document\User $friendsWithMe
     */
    public function addFriendsWithMe(\OP\UserBundle\Document\User $friendsWithMe)
    {
        $this->friendsWithMe[] = $friendsWithMe;
    }

    /**
     * Remove friendsWithMe
     *
     * @param OP\UserBundle\Document\User $friendsWithMe
     */
    public function removeFriendsWithMe(\OP\UserBundle\Document\User $friendsWithMe)
    {
        $this->friendsWithMe->removeElement($friendsWithMe);
    }

    /**
     * Get friendsWithMe
     *
     * @return \Doctrine\Common\Collections\Collection $friendsWithMe
     */
    public function getFriendsWithMe()
    {
        return $this->friendsWithMe;
    }

    /**
     * Add myFriend
     *
     * @param OP\UserBundle\Document\User $myFriend
     */
    public function addMyFriend(\OP\UserBundle\Document\User $myFriend)
    {
        $this->myFriends[] = $myFriend;
    }

    /**
     * Remove myFriend
     *
     * @param OP\UserBundle\Document\User $myFriend
     */
    public function removeMyFriend(\OP\UserBundle\Document\User $myFriend)
    {
        $this->myFriends->removeElement($myFriend);
    }

    /**
     * Get myFriends
     *
     * @return \Doctrine\Common\Collections\Collection $myFriends
     */
    public function getMyFriends()
    {
        return $this->myFriends;
    }

    /**
     * Add followersWithMe
     *
     * @param OP\UserBundle\Document\User $followersWithMe
     */
    public function addFollowersWithMe(\OP\UserBundle\Document\User $followersWithMe)
    {
        $this->followersWithMe[] = $followersWithMe;
    }

    /**
     * Remove followersWithMe
     *
     * @param OP\UserBundle\Document\User $followersWithMe
     */
    public function removeFollowersWithMe(\OP\UserBundle\Document\User $followersWithMe)
    {
        $this->followersWithMe->removeElement($followersWithMe);
    }

    /**
     * Get followersWithMe
     *
     * @return \Doctrine\Common\Collections\Collection $followersWithMe
     */
    public function getFollowersWithMe()
    {
        return $this->followersWithMe;
    }

    /**
     * Add myFollower
     *
     * @param OP\UserBundle\Document\User $myFollower
     */
    public function addMyFollower(\OP\UserBundle\Document\User $myFollower)
    {
        $this->myFollowers[] = $myFollower;
    }

    /**
     * Remove myFollower
     *
     * @param OP\UserBundle\Document\User $myFollower
     */
    public function removeMyFollower(\OP\UserBundle\Document\User $myFollower)
    {
        $this->myFollowers->removeElement($myFollower);
    }

    /**
     * Add blockedsWithMe
     *
     * @param OP\UserBundle\Document\User $blockedsWithMe
     */
    public function addBlockedsWithMe(\OP\UserBundle\Document\User $blockedsWithMe)
    {
        $this->blockedsWithMe[] = $blockedsWithMe;
    }

    /**
     * Remove blockedsWithMe
     *
     * @param OP\UserBundle\Document\User $blockedsWithMe
     */
    public function removeBlockedsWithMe(\OP\UserBundle\Document\User $blockedsWithMe)
    {
        $this->blockedsWithMe->removeElement($blockedsWithMe);
    }

    /**
     * Get blockedsWithMe
     *
     * @return \Doctrine\Common\Collections\Collection $blockedsWithMe
     */
    public function getBlockedsWithMe()
    {
        return $this->blockedsWithMe;
    }

    /**
     * Add response
     *
     * @param OP\MessageBundle\Document\Response $response
     */
    public function addResponse(\OP\MessageBundle\Document\Response $response)
    {
        $this->pResponses[] = $response;
    }

    /**
     * Remove response
     *
     * @param OP\MessageBundle\Document\Response $response
     */
    public function removeResponse(\OP\MessageBundle\Document\Response $response)
    {
        $this->pResponses->removeElement($response);
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
     * Add share
     *
     * @param OP\PostBundle\Document\Share $share
     */
    public function addShare(\OP\PostBundle\Document\Share $share)
    {
        $this->shares[] = $share;
    }

    /**
     * Remove share
     *
     * @param OP\PostBundle\Document\Share $share
     */
    public function removeShare(\OP\PostBundle\Document\Share $share)
    {
        $this->shares->removeElement($share);
    }

    /**
     * Get shares
     *
     * @return \Doctrine\Common\Collections\Collection $shares
     */
    public function getShares()
    {
        return $this->shares;
    }

    /**
     * Set coverPic
     *
     * @param OP\MediaBundle\Document\Image $coverPic
     * @return self
     */
    public function setCoverPic(\OP\MediaBundle\Document\Image $coverPic)
    {
        $this->coverPic = $coverPic;
        return $this;
    }

    /**
     * Get coverPic
     *
     * @return OP\MediaBundle\Document\Image $coverPic
     */
    public function getCoverPic()
    {
        if ($this->doesReferencedItemExist($this->coverPic) === false) {
            $this->coverPic = null;
        }
        return $this->coverPic;
        // return (null !== $this->coverPic) ? $this->coverPic : new \OP\MediaBundle\Document\Image();
    }

    /**
     * Add myFollowed
     *
     * @param OP\UserBundle\Document\User $myFollowed
     */
    public function addMyFollowed(\OP\UserBundle\Document\User $myFollowed)
    {
        $this->myFolloweds[] = $myFollowed;
    }

    /**
     * Remove myFollowed
     *
     * @param OP\UserBundle\Document\User $myFollowed
     */
    public function removeMyFollowed(\OP\UserBundle\Document\User $myFollowed)
    {
        $this->myFolloweds->removeElement($myFollowed);
    }

    /**
     * Get myFolloweds
     *
     * @return \Doctrine\Common\Collections\Collection $myFolloweds
     */
    public function getMyFolloweds()
    {
        return $this->myFolloweds;
    }

    /**
     * Set address
     *
     * @param OP\UserBundle\Document\Address $address
     * @return self
     */
    public function setAddress(\OP\UserBundle\Document\Address $address)
    {
        $this->address = $address;
        return $this;
    }

    /**
     * Get address
     *
     * @return OP\UserBundle\Document\Address $address
     */
    public function getAddress()
    {
        return $this->address;
    }

    /**
     * Set aboutMe
     *
     * @param OP\UserBundle\Document\AboutMe $aboutMe
     * @return self
     */
    public function setAboutMe(\OP\UserBundle\Document\AboutMe $aboutMe)
    {
        $this->aboutMe = $aboutMe;
        return $this;
    }

    /**
     * Get aboutMe
     *
     * @return OP\UserBundle\Document\AboutMe $aboutMe
     */
    public function getAboutMe()
    {
        return $this->aboutMe;
    }

    /**
     * Set status
     *
     * @param string $status
     * @return self
     */
    public function setStatus($status)
    {
        $this->status = $status;
        return $this;
    }

    /**
     * Get status
     *
     * @return string $status
     */
    public function getStatus()
    {
        return $this->status;
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
     * Set metadata
     *
     * @param OP\UserBundle\Document\UserMetadata $metadata
     * @return self
     */
    public function setMetadata(\OP\UserBundle\Document\UserMetadata $metadata)
    {
        $this->metadata = $metadata;
        return $this;
    }

    /**
     * Get metadata
     *
     * @return OP\UserBundle\Document\UserMetadata $metadata
     */
    public function getMetadata()
    {
        if(gettype($this->metadata) != 'object') {
            $this->metadata = new ArrayCollection();
        }
        return $this->metadata;
    }

    /**
     * Set lastMessageView
     *
     * @param date $lastMessageView
     * @return self
     */
    public function setLastMessageView($lastMessageView)
    {
        $this->lastMessageView = $lastMessageView;
        return $this;
    }

    /**
     * Get lastMessageView
     *
     * @return date $lastMessageView
     */
    public function getLastMessageView()
    {
        return $this->lastMessageView;
    }

    /**
     * Set lastInvitationView
     *
     * @param date $lastInvitationView
     * @return self
     */
    public function setLastInvitationView($lastInvitationView)
    {
        $this->lastInvitationView = $lastInvitationView;
        return $this;
    }

    /**
     * Get lastInvitationView
     *
     * @return date $lastInvitationView
     */
    public function getLastInvitationView()
    {
        return $this->lastInvitationView;
    }

    /**
     * Set lastNotificationView
     *
     * @param date $lastNotificationView
     * @return self
     */
    public function setLastNotificationView($lastNotificationView)
    {
        $this->lastNotificationView = $lastNotificationView;
        return $this;
    }

    /**
     * Get lastNotificationView
     *
     * @return date $lastNotificationView
     */
    public function getLastNotificationView()
    {
        return $this->lastNotificationView;
    }

    /**
     * Set friendsWithMeIds
     *
     * @param collection $friendsWithMeIds
     * @return self
     */
    public function setFriendsWithMeIds($friendsWithMeIds)
    {
        $this->friendsWithMeIds = $friendsWithMeIds;
        return $this;
    }

    /**
     * Get friendsWithMeIds
     *
     * @return collection $friendsWithMeIds
     */
    public function getFriendsWithMeIds()
    {
        return $this->friendsWithMeIds;
    }

    /**
     * Set myFriendsIds
     *
     * @param collection $myFriendsIds
     * @return self
     */
    public function setMyFriendsIds($myFriendsIds)
    {
        $this->myFriendsIds = $myFriendsIds;
        return $this;
    }

    /**
     * Get myFriendsIds
     *
     * @return collection $myFriendsIds
     */
    public function getMyFriendsIds()
    {
        return $this->myFriendsIds;
    }

    /**
     * Set blockedsWithMeIds
     *
     * @param collection $blockedsWithMeIds
     * @return self
     */
    public function setBlockedsWithMeIds($blockedsWithMeIds)
    {
        $this->blockedsWithMeIds = $blockedsWithMeIds;
        return $this;
    }

    /**
     * Get blockedsWithMeIds
     *
     * @return collection $blockedsWithMeIds
     */
    public function getBlockedsWithMeIds()
    {
        return $this->blockedsWithMeIds;
    }

    /**
     * Set blockedsIds
     *
     * @param collection $blockedsIds
     * @return self
     */
    public function setBlockedsIds($blockedsIds)
    {
        $this->blockedsIds = $blockedsIds;
        return $this;
    }

    /**
     * Get blockedsIds
     *
     * @return collection $blockedsIds
     */
    public function getBlockedsIds()
    {
        return $this->blockedsIds;
    }

    /**
     * Set locale
     *
     * @param string $locale
     * @return self
     */
    public function setLocale($locale)
    {
        $this->locale = $locale;
        return $this;
    }

    /**
     * Get locale
     *
     * @return string $locale
     */
    public function getLocale()
    {
        return $this->locale;
    }

    /**
     * Set contact
     *
     * @param OP\UserBundle\Document\Contact $contact
     * @return $this
     */
    public function setContact(\OP\UserBundle\Document\Contact $contact)
    {
        $this->contact = $contact;
        return $this;
    }

    /**
     * Get contact
     *
     * @return OP\UserBundle\Document\Contact $contact
     */
    public function getContact()
    {
        return $this->contact;
    }

    /**
     * Set clientIp
     *
     * @param string $clientIp
     * @return $this
     */
    public function setClientIp($clientIp)
    {
        $this->clientIp = $clientIp;
        return $this;
    }

    /**
     * Get clientIp
     *
     * @return string $clientIp
     */
    public function getClientIp()
    {
        return $this->clientIp;
    }

    /**
     * Set requestsToUsersIds
     *
     * @param collection $requestsToUsersIds
     * @return $this
     */
    public function setRequestsToUsersIds($requestsToUsersIds)
    {
        $this->requestsToUsersIds = $requestsToUsersIds;
        return $this;
    }

    /**
     * Get requestsToUsersIds
     *
     * @return collection $requestsToUsersIds
     */
    public function getRequestsToUsersIds()
    {
        return $this->requestsToUsersIds;
    }

    /**
     * Add requested user Id
     */
    public function addRequestToUserId($id)
    {
        if((array_search($id, $this->requestsToUsersIds)) === false) {
            $this->requestsToUsersIds[] = $id;
        }
    }

    /**
     * Add requested user Id
     */
    public function removeRequestToUserId($id)
    {
        if(($key = array_search($id, $this->requestsToUsersIds)) !== false) {
            unset($this->requestsToUsersIds[$key]);
        }
    }

    /**
     * Set requestFromUsersIds
     *
     * @param collection $requestFromUsersIds
     * @return $this
     */
    public function setRequestFromUsersIds($requestFromUsersIds)
    {
        $this->requestFromUsersIds = $requestFromUsersIds;
        return $this;
    }

    /**
     * Get requestFromUsersIds
     *
     * @return collection $requestFromUsersIds
     */
    public function getRequestFromUsersIds()
    {
        return $this->requestFromUsersIds;
    }

    /**
     * Add requested user Id
     */
    public function addRequestFromUserId($id)
    {
        if((array_search($id, $this->requestFromUsersIds)) === false) {
            $this->requestFromUsersIds[] = $id;
        }
    }

    /**
     * Add requested user Id
     */
    public function removeRequestFromUserId($id)
    {
        if(($key = array_search($id, $this->requestsFromUsersIds)) !== false) {
            unset($this->requestsFromUsersIds[$key]);
        }
    }

    /**
     * Set lastThreadActivity
     *
     * @param string $lastThreadActivity
     * @return $this
     */
    public function setLastThreadActivity($lastThreadActivity)
    {
        $this->lastThreadActivity = $lastThreadActivity;
        return $this;
    }

    /**
     * Get lastThreadActivity
     *
     * @return string $lastThreadActivity
     */
    public function getLastThreadActivity()
    {
        return $this->lastThreadActivity;
    }

    /**
     * Set nickname
     *
     * @param string $nickname
     * @return $this
     */
    public function setNickname($nickname)
    {
        $this->nickname = $nickname;
        return $this;
    }

    /**
     * Get nickname
     *
     * @return string $nickname
     */
    public function getNickname()
    {
        return $this->nickname;
    }

    /**
     * Set countryInfos
     *
     * @param raw $countryInfos
     * @return $this
     */
    public function setCountryInfos($countryInfos)
    {
        $this->countryInfos = $countryInfos;
        return $this;
    }

    /**
     * Get countryInfos
     *
     * @return raw $countryInfos
     */
    public function getCountryInfos()
    {
        return $this->countryInfos;
    }

    /**
     * Add device
     *
     * @param OP\UserBundle\Document\Devices $device
     */
    public function addDevice(\OP\UserBundle\Document\Devices $device)
    {
        $this->devices[] = $device;
    }

    /**
     * Remove device
     *
     * @param OP\UserBundle\Document\Devices $device
     */
    public function removeDevice(\OP\UserBundle\Document\Devices $device)
    {
        $this->devices->removeElement($device);
    }

    /**
     * Get devices
     *
     * @return \Doctrine\Common\Collections\Collection $devices
     */
    public function getDevices()
    {
        return $this->devices;
    }

    /**
     * Set notification
     *
     * @param OP\UserBundle\Document\Notification $notification
     * @return $this
     */
    public function setNotification(\OP\UserBundle\Document\Notification $notification)
    {
        $this->notification = $notification;
        return $this;
    }

    /**
     * Get notification
     *
     * @return OP\UserBundle\Document\Notification $notification
     */
    public function getNotification()
    {
        return $this->notification;
    }

    /**
     * Set config
     *
     * @param OP\UserBundle\Document\Config $config
     * @return $this
     */
    public function setConfig(\OP\UserBundle\Document\Config $config)
    {
        $this->config = $config;
        return $this;
    }

    /**
     * Get config
     *
     * @return OP\UserBundle\Document\Config $config
     */
    public function getConfig()
    {
        return $this->config;
    }

    /**
     * Set lastTimelineId
     *
     * @param string $lastTimelineId
     * @return $this
     */
    public function setLastTimelineId($lastTimelineId)
    {
        $this->lastTimelineId = $lastTimelineId;
        return $this;
    }

    /**
     * Get lastTimelineId
     *
     * @return string $lastTimelineId
     */
    public function getLastTimelineId()
    {
        return $this->lastTimelineId;
    }

    /**
     * Set timing
     *
     * @param integer $timing
     * @return $this
     */
    public function setTiming($timing)
    {
        $this->timing = $timing;
        return $this;
    }

    /**
     * Get timing
     *
     * @return integer $timing
     */
    public function getTiming()
    {
        return $this->timing;
    }
}
