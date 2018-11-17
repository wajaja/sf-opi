<?php

namespace OP\UserBundle\DataTransformer;

use OP\UserBundle\Security\UserProvider,
    JMS\Serializer\SerializationContext,
    Doctrine\ODM\MongoDB\DocumentManager,
    OP\UserBundle\Repository\OpinionUserManager,
    Symfony\Component\HttpFoundation\RequestStack,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;

/**
 * Description of BaseObjectToArrayTransformer
 *
 * @author CEDRICK
 */
class ObjectToArrayTransformer
{
    /**
     * services convert images object to array 
     * @var type 
     */
    protected $container, $dm, $request, $um, $user_provider,
              $participantProvider, $domain_name;


    public function __construct(Container $container, RequestStack $request, DocumentManager $dm, OpinionUserManager $um, UserProvider $user_provider, $domain_name) {
        $this->dm               = $dm;
        $this->um               = $um;
        $this->request          = $request->getCurrentRequest();
        $this->container        = $container;
        $this->user_provider    = $user_provider;
        $this->domain_name      = $domain_name;
    }

    public function invitationToArray($inv){
        $sender = $inv->getSender();
        return [
            'id' => $inv->getId(),
            'sender' => $this->serializeUser($sender),
            'isConfirmed' => $inv->getMetadata()->getIsConfirmed(),
            'mutualIds' => $this->getMutualFriendsIds($sender, $this->getUser())
        ];
    }

    public function invitationsToArray(array $invs) {
        $return = [];
        foreach ($invs as $inv) {
            $return[] = $this->invitationToArray($inv);
        }
        return $return;
    }

    public function getMutualFriends($from, $to) {
        $return = [];
        $um     = $this->um;
        (array) $mutualIds = $this->getMutualFriendsIds($from, $to);
        //TODO :: more work here 
        /**
         * Sorry for the long feedback loop. This feature is not supported by the serializer and 
         * there are no plans to support it in the near future
         * https://github.com/schmittjoh/serializer/issues/319
         * Error:: Can't pop from an empty datastructure" error when multiple serializer calls
         */
        // foreach ($mutualIds as $key => $id) {
        //     if($id === 1) {
        //         $return[] =  $this->serializeUser($um->findUserBy(array('id' =>$id)));
        //     }
        // }
        return $mutualIds;
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

    protected function serializeUser($data)
    {
        $context = new SerializationContext();
        $context->setSerializeNull(true);
        $groups = array('Infos');
        $context->setGroups($groups);

        return $this->container->get('jms_serializer')
            ->toArray($data, $context);
    }

    /**
    * @protected Function getAuthor
    * @param $id
    * @return Array
    */
    protected function getAuthor($id)
    {
        $u  = $this->um->findDefaultUserById($id);
        return [
            'id'        => (String)$u['_id'],
            'username'  => $u['username'],
            'firstname' => $u['firstname'] ?? '',
            'lastname'  => $u['lastname'] ?? '',
            'profile_pic'=> $this->user_provider->getProfilePic(u)
        ];
    }

    /**
     * Gets the current authenticated user
     * @see::OPMEssageBundle participantprovider
     * @return ParticipantInterface
     */
    protected function getUser()
    {
        return $this->user_provider->getHydratedUser();
    }
}
