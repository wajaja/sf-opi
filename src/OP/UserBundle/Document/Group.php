<?php

namespace OP\UserBundle\Document;

use JMS\Serializer\Annotation\Type,
    JMS\Serializer\Annotation\Expose,
    JMS\Serializer\Annotation\Groups,
    Doctrine\Common\Proxy\Proxy,
    Doctrine\ODM\MongoDB\DocumentNotFoundException,
    OP\UserBundle\Model\Group as BaseGroup,
    JMS\Serializer\Annotation\VirtualProperty,
    JMS\Serializer\Annotation\ExclusionPolicy,
    Doctrine\Common\Collections\Collection,
    Doctrine\Common\Collections\ArrayCollection,
    Symfony\Component\Validator\Constraints as Assert,
    Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * @MongoDB\Document(
 *      db="opinion",
 *      collection="groups",
 * indexes={ 
 *          @MongoDB\index(keys={"name"="desc"}, options={"unique"=true})
 *       },
 *       requireIndexes=true
 * )
 *
 * @ExclusionPolicy("all") 
 */
class Group extends BaseGroup
{
    /**
     * @MongoDB\Id(strategy="auto")
     * @Expose
     * @Type("string")
     * @Groups({"Detail", "Infos", "Default"})
     */
    protected $id;

    /**
    * @MongoDB\Field(name="status", type="raw")
    *
    * @Expose
    * @Groups({"Infos", "Detail",})
    * @Type("string")
    */
    protected $status;

    /**
    * @MongoDB\Field(name="goal", type="raw")
    *
    * @Expose
    * @Groups({"Infos", "Detail",})
    * @Type("string")
    */
    protected $goal;

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\UserBundle\Document\Invitation\InvitationGroup")
     */
    protected $invitations;

    /**
    * @MongoDB\EmbedOne(targetDocument="OP\UserBundle\Document\Contact")
    * @Expose
    * @Groups({"Infos", "Detail"})
    * @Type("OP\UserBundle\Document\Contact")
    */
    protected $contact;

    /**
    * @MongoDB\ReferenceMany(targetDocument="OP\MediaBundle\Document\Image")
    */
    protected $listAvatars;

    /**
    * @MongoDB\ReferenceOne(targetDocument="OP\MediaBundle\Document\Image", cascade={"persist", "remove"}, nullable=true)
    * 
    * Embed One target Path to user Profile
    * @Expose
    * @Groups({"Infos", "Detail"})
    * @Type("OP\MediaBundle\Document\Image")
    */
    public $avatar;

    /**
    * @MongoDB\Field(name="requestFromUsersIds", type="collection")
    * 
    * @Expose
    * @Type("array")
    * @Groups({"Detail", "Infos", "Group"})
    */
    public $requestFromUsersIds = array();

    /**
    * @MongoDB\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
    * @Expose
    * @Type("array")
    * @Groups({"Detail", "Infos", "Default"})
    */
    public $owner;

    /**
    * @MongoDB\ReferenceMany(targetDocument="OP\UserBundle\Document\User")
    * @Expose
    * @Type("array")
    * @Groups({"Detail", "Infos"})
    */
    public $contributors;

    /**
    * @MongoDB\ReferenceMany(targetDocument="OP\UserBundle\Document\User")
    * @Expose
    * @Type("array")
    * @Groups({"Detail", "Infos", "Default"})
    */
    public $members;

    /**
    * @MongoDB\Field(name="recipients", type="string")
    * @Expose
    * @Type("string")
    * @Groups({"Detail", "Infos", "Default"})
    */
    public $recipients;

    /**
     * @MongoDB\Field(name="createdAt", type="date")
     * 
     * @var createdAt
     */
    protected $createdAt;

    /**
    * @MongoDB\Field(name="myFriendsIds", type="collection")
    * 
    * @Expose
    * @Type("array")
    * @Groups({"Detail", "Infos", "Default"})
    */
    public $membersIds = array();


    public function __construct($name, $roles = array())
    {
        parent::__construct($name, $roles = array());
        $this->createdAt   = new \Datetime(null, new \DateTimeZone("UTC"));
        $this->invitations  = new ArrayCollection();
        $this->members  = new ArrayCollection();
    }

    public function removeAvatar() {
        $this->avatar = null;
        return $this;
    }

    /**
     * Set status
     *
     * @param raw $status
     * @return $this
     */
    public function setStatus($status)
    {
        $this->status = $status;
        return $this;
    }

    /**
     * Get status
     *
     * @return raw $status
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Set goal
     *
     * @param raw $goal
     * @return $this
     */
    public function setGoal($goal)
    {
        $this->goal = $goal;
        return $this;
    }

    /**
     * Get goal
     *
     * @return raw $goal
     */
    public function getGoal()
    {
        return $this->goal;
    }

    /**
     * Add invitation
     *
     * @param OP\UserBundle\Document\Invitation\InvitationGroup $invitation
     */
    public function addInvitation(\OP\UserBundle\Document\Invitation\InvitationGroup $invitation)
    {
        $this->invitations[] = $invitation;
    }

    /**
     * Remove invitation
     *
     * @param OP\UserBundle\Document\Invitation\InvitationGroup $invitation
     */
    public function removeInvitation(\OP\UserBundle\Document\Invitation\InvitationGroup $invitation)
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
     * Add listAvatar
     *
     * @param OP\MediaBundle\Document\Image $listAvatar
     */
    public function addListAvatar(\OP\MediaBundle\Document\Image $listAvatar)
    {
        $this->listAvatars[] = $listAvatar;
    }

    /**
     * Remove listAvatar
     *
     * @param OP\MediaBundle\Document\Image $listAvatar
     */
    public function removeListAvatar(\OP\MediaBundle\Document\Image $listAvatar)
    {
        $this->listAvatars->removeElement($listAvatar);
    }

    /**
     * Get listAvatars
     *
     * @return \Doctrine\Common\Collections\Collection $listAvatars
     */
    public function getListAvatars()
    {
        return $this->listAvatars;
    }

    /**
     * Set avatar
     *
     * @param OP\MediaBundle\Document\Image $avatar
     * @return $this
     */
    public function setAvatar(\OP\MediaBundle\Document\Image $avatar)
    {
        $this->avatar = $avatar;
        return $this;
    }

    /**
     * Get avatar
     *
     * @return OP\MediaBundle\Document\Image $avatar
     */
    public function getAvatar()
    {
        return $this->avatar;
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
     * Set owner
     *
     * @param OP\UserBundle\Document\User $owner
     * @return $this
     */
    public function setOwner(\OP\UserBundle\Document\User $owner)
    {
        $this->owner = $owner;
        return $this;
    }

    /**
     * Get owner
     *
     * @return OP\UserBundle\Document\User $owner
     */
    public function getOwner()
    {
        return $this->owner;
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
     * @param  
     * @return NewThreadMessageBuilder
     */
    public function addMembers(Collection $members)
    {
        //add the collection of recipient instance of participantInterface
        foreach ($members as $m) {
            $this->addMember($m);
        }
        return $this;
    }

    /**
     * Add member
     *
     * @param OP\UserBundle\Document\User $member
     */
    public function addMember(\OP\UserBundle\Document\User $member)
    {
        $this->members[] = $member;
    }

    /**
     * Remove member
     *
     * @param OP\UserBundle\Document\User $member
     */
    public function removeMember(\OP\UserBundle\Document\User $member)
    {
        $this->members->removeElement($member);
    }

    /**
     * Get members
     *
     * @return \Doctrine\Common\Collections\Collection $members
     */
    public function getMembers()
    {
        return $this->members;
    }

    /**
     * Set createdAt
     *
     * @param date $createdAt
     * @return $this
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
     * Set membersIds
     *
     * @param collection $membersIds
     * @return $this
     */
    public function setMembersIds($membersIds)
    {
        $this->membersIds = $membersIds;
        return $this;
    }

    /**
     * Get membersIds
     *
     * @return collection $membersIds
     */
    public function getMembersIds()
    {
        return $this->membersIds;
    }

    /**
     * Set recipients
     *
     * @param string $recipients
     * @return $this
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
}
