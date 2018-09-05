<?php
namespace OP\UserBundle\DocumentManager;

use OP\UserBundle\Document\User,
    JMS\Serializer\SerializationContext,
    Doctrine\ODM\MongoDB\DocumentManager,
    OP\UserBundle\Security\UserProvider,
    OP\UserBundle\Document\Invitation\Invitation,
    OP\UserBundle\Document\Invitation\InvitationMetadata,
    OP\UserBundle\DataTransformer\ObjectToArrayTransformer,
    OP\UserBundle\Repository\OpinionUserManager,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;

/**
 * Description of NotificationManager
 * class that manage all about opinion's notifications
 * @author CEDRICK
 */
class InvitationManager
{
    /**
     *
     * @var type
     */
    protected $dm, $container, $transformer, $uProvider, $userManager;

    public function __construct(DocumentManager $dm, Container $container, ObjectToArrayTransformer $transformer, UserProvider $uProvider, OpinionUserManager $uMan) {
        $this->dm           = $dm;
        $this->container    = $container;
        $this->transformer  = $transformer;
        $this->uProvider    = $uProvider;
        $this->userManager  = $uMan;
    }

    public function countAlerts(User $user) {
        $userId = $user->getId();
        $lastReadingDate = $user->getLastInvitationView();
        return $this->dm
            ->getRepository('\OP\UserBundle\Document\Invitation\Invitation')
            ->countAlerts($userId, $lastReadingDate);
    }

    public function loadInvitations(User $user, $initIds, $limit) {
        $invits = [];
        $datas  = $this->dm->getRepository('\OP\UserBundle\Document\Invitation\Invitation')
                          ->loadInvitations($user, $initIds, $limit);

        foreach ($datas as $data) {
            $invits[] = $this->transformer->invitationToArray($data);
        }

        return $invits;
    }


    public function getSuggestionForUser(User $user, $initIds = [], $limit=10) {
        $suggestions  = [];
        $address      = $user->getAddress();
        $city         = !$address ? null : $address->getCity();
        $country      = !$address ? null : $address->getCountry();
        $clientIp     = $user->getClientIp();
        $invitations  = $user->getInvitations();
        $requestedIds = $this->getMyRequestReceiversIds($user);
        $friendIds    = $user->getMyFriendsIds() ? $user->getMyFriendsIds() : [];
        $followers    = $user->getMyFollowers() ? $user->getMyFollowers() : [];
        $blockedIds   = $user->getBlockedsIds() ? $user->getBlockedsIds() : [];

        $datas  = $this->userManager
                    ->loadSuggestions($initIds, $friendIds, $blockedIds, $followers, 
                                         $requestedIds, $city, $country, $clientIp, $limit);

        foreach ($datas as $d) {
            $_id = (string)$d['_id'];
            $profileId = !isset($d['profilePic']['$id']) 
                          ? null : (string)$d['profilePic']['$id'];
            $suggestions[] = [
                'id'            => $_id,
                'email'         => $d['email'],
                'status'        => isset($d['status']) ? $d['status'] : '',
                'username'      => $d['username'],
                'lastname'      => $d['lastname'],
                'firstname'     => $d['firstname'],
                'friendRequest' => $this->checkInvitationRequest($_id, $invitations),
                'profilePic'    => $profileId ? $this->getProfilePic($profileId) 
                                              : "/images/favicon.ico"
            ];
        }
        return $suggestions;
    }

    public function loadDefaultUsers(User $user, $initIds = []) {
        $users        = [];
        $friendIds    = $user->getMyFriendsIds() ? $user->getMyFriendsIds() : [];
        $followers    = $user->getMyFollowers() ? $user->getMyFollowers() : [];
        $blockedIds   = $user->getBlockedsIds() ? $user->getBlockedsIds() : [];

        $datas  = $this->userManager
                    ->loadDefaultUsers($initIds, $friendIds, $blockedIds);

        foreach ($datas as $d) {
            $_id = (string)$d['_id'];
            $profileId = !isset($d['profilePic']['$id']) 
                          ? null : (string)$d['profilePic']['$id'];
            $users[] = [
                'id'            => $_id,
                'email'         => $d['email'],
                'username'      => $d['username'],
                'lastname'      => $d['lastname'],
                'firstname'     => $d['firstname'],
                'profilePic'    => $profileId ? $this->getProfilePic($profileId) 
                                              : "/images/favicon.ico"
            ];
        }
        return $users;
    }

    public function invitationsToArray($objects)
    {
        $invitations = [];
        foreach ($objects as $object) {
            $sender         = $object->getSender();
            $invitations[]  = [
                'id'        => $object->getId(),
                'sender'    => $this->serializeUser($sender),
                'mutualIds' => $this->getMutualFriendsIds($sender, $this->_getUser())
            ];
        }
        return $invitations;
    }

    /**
    * Function getMutualFriendsIds 
    * return an array of 
    * userIds; that array is an intersection 
    * over two users
    */
    protected function getMutualFriendsIds($from, $to) {
        $arrayFrom    = $from->getMyFriendsIds();
        $arrayTo      = $to->getMyFriendsIds();
        return array_values(array_unique(array_intersect($arrayFrom, $arrayTo)));
    }

    public function createInvitation(User $sender, User $receiver)
    {
        $dm         = $this->dm;
        $um         = $this->userManager;
        $invitation = new Invitation();
        $meta       = new InvitationMetadata();

        $invitation->setSender($sender);
        $invitation->setReceiver($receiver);
        $invitation->setMetadata($meta);
        $dm->persist($invitation);
        $sender->addFriend($receiver);
        $sender->addRequestToUserId($receiver->getId());
        $receiver->addRequestFromUserId($sender->getId());
        $um->updateUser($sender, false);
        $um->updateUser($receiver, false);
        $dm->flush();

        return $invitation;
    }

    public function createConfirmation($sender, $receiver) {
        
        $dm  = $this->dm;
        $um  = $this->userManager;
        $rep = $dm->getRepository('\OP\UserBundle\Document\Invitation\Invitation');

        if($rep->confirmInvitation($sender, $receiver)){
            $receiver->addFriend($sender);
            $receiver->removeRequestFromUserId($sender->getId());
            $sender->removeRequestToUserId($receiver->getId());
            $um->updateUser($receiver, false);  //update user collection in db
            $dm->flush();
            return true;
        }

        return false;
    }

    public function deleteInvitation($sender, $receiver)
    {
        $dm         = $this->dm;
        $um         = $this->userManager;
        $repos      = $dm->getRepository('\OP\UserBundle\Document\Invitation\Invitation');
        $repos->deleteInvitation($sender, $receiver);

        //if this user is sender; then remove the receiver in myfriends collection
        //remove freind from myFriends collection
        $sender->removeFriend($receiver);
        $receiver->removeFriend($sender); 
        $sender->removeRequestToUserId($receiver->getId());
        $receiver->removeRequestFromUserId($sender->getId);
        $um->updateUser($receiver, false);  
        $um->updateUser($sender, false);
        $dm->remove($invitation);
        $dm->flush();

        return $invitation;
    }

    public function follow($user,  $target)
    {
        $dm         = $this->dm;
        $um         = $this->userManager;
        $authUser   = $this->_getUser();
        $invit      = new Invitation();

        $invit->setSender($user);
        $invit->setReceiver($target);
        //TODO more control on invitation (type['friend', 'follow'])
        if($user->getId() === $authUser->getId()){
            $user->addFollower($target); 
            $dm->persist($invit);
            // $target->addFollowing($user); 
            // $um->updateUser($target, false);
            $um->updateUser($user, false);  
            $dm->flush();
            return $invit;
        }
        return false;
    }

    public function unFollow($follower,  $following)
    {
        $dm         = $this->dm;
        $um         = $this->userManager;
        $user       = $this->_getUser();

        if($follower->getId() === $user->getId()){
            $follower->removeFollower($following); 
            $um->updateUser($follower, false);  
            $dm->flush();
            return true;
        }
        return false;
    }

    protected function updateLastView() {
        $user = $this->_getUser();
        $lastReading = new \Datetime(null, new \DateTimeZone("UTC"));
        $user->setLastInvitationView($lastReading);
        $this->userManager->updateUser($user);
    }

    protected function getMyRequestReceiversIds($user) {
        $ids         = [];
        $invitations = $this->dm->getRepository('\OP\UserBundle\Document\Invitation\Invitation')
                            ->findRequestInvitations($user->getId(), false); //not confimerd
        foreach ($invitations as $i) {
            $ids[] = isset($i['receiver_id']) ? $i['receiver_id'] : '1';
        }
        return $ids;
    }

    protected function checkInvitationRequest($sugId, $invitations) {
        foreach ($invitations as $inv) {
            if($inv->getSender()->getId() === $sugId) {
                return true;
            }
        }
        return false;
    }

    protected function getProfilePic($id){
        $picture = $this->dm
                    ->getRepository('OP\MediaBundle\Document\Image')
                    ->findOneBy(array('id' =>$id));

        return $picture->getWebPath();
    }

    protected function serializeUser($data, $format = 'json')
    {
        $context = new SerializationContext();
        $context->setSerializeNull(true);
        $groups = array('Infos');
        $context->setGroups($groups);

        return $this->container->get('jms_serializer')
            ->serialize($data, $format, $context);
    }

    /**
     * Gets the current authenticated user
     * See::OPMEssageBundle participantprovider
     * @return ParticipantInterface
     */
    public function _getUser()
    {
        return $this->uProvider->getHydratedUser();
    }
}
