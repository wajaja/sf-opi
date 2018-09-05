<?php

namespace OP\UserBundle\Serializer;

use OP\UserBundle\Document\User,
    OP\UserBundle\Security\UserProvider,
    JMS\Serializer\EventDispatcher\ObjectEvent,
    OP\MessageBundle\DocumentManager\ThreadManager,
    JMS\Serializer\EventDispatcher\EventSubscriberInterface,
    Symfony\Component\HttpFoundation\RequestStack,
    OP\UserBundle\DataTransformer\ObjectToArrayTransformer,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;

class UserSerializerSubscriber implements EventSubscriberInterface
{
    /**
     * services convert images object to array 
     * @var type 
     */
    protected $container, $dm, $request, $um, $user_provider,
              $participantProvider, $threadMan, $transformer;


    public function __construct(Container $container, RequestStack $request, UserProvider $user_provider, ThreadManager $threadMan, ObjectToArrayTransformer $transformer) {
        $this->request          = $request->getCurrentRequest();
        $this->container        = $container;
        $this->user_provider    = $user_provider;
        $this->threadMan        = $threadMan;
        $this->transformer      = $transformer;
    }

    public static function getSubscribedEvents()
    {
        return [
            [ 'event' => 'serializer.post_serialize', 
              'method' => 'onPostSerializeMethod', 
              'class' => 'OP\\UserBundle\\Document\\User'
            ]
        ];
    }

    public function onPostSerializeMethod(ObjectEvent $event)
    {
        $object  = $event->getObject();
        $visitor = $event->getVisitor();
        $context = $event->getContext();
        $type    = $event->getType();
        $grContext= $context->attributes->get('groups');

        //add "mutuals" field to user 
        if ($grContext->isDefined()) {
            $groups = $grContext->get();
            if (is_array($groups) && count($groups) === 2 && in_array('WithMutual', $groups)) {
                $tran    = $this->transformer;
                $mutuals = $tran->getMutualFriends($object, $this->_getUser());
                $visitor->addData('mutuals', $mutuals);
            }
            if (is_array($groups) && count($groups) >= 1 && in_array('Detail', $groups)) {
                $now    = new \Datetime(null, new \DateTimeZone("UTC"));
                $userId = $this->_getUser()->getId();
                $last   = $this->getLastActivity($object);
                $visitor->addData('last_conn', $last);
                $visitor->addData('time_elapsed', ($now->getTimestamp() - $last));
                $visitor->addData('thread_id', $this->getThreadId($object->getId(), $userId));
            }
        } else {
        }
                // die();

        if(!$object->getProfilePic())
            $visitor->addData('profile_pic', $this->getDefaultProfilePic($object));

        if(!$object->getCoverPic())
            $visitor->addData('cover_pic', $this->getDefaultCoverPic($object));
    }

    // default data in user pictire
    // 
    public function getDefaultProfilePic($user)
    {
        $maleAvatar = 'http://opinion.com/uploads/gallery/862fd08f285cae49ac4db2fc65ed3a4c.jpeg';
        $femaleAvatar = 'http://opinion.com/uploads/gallery/94132ea0069186e77a530619bf4a4d36.jpeg';
        return [
            'id' => null,
            'path' => null,
            'web_path' => $user->getGender() === 'Male' ? $maleAvatar : $femaleAvatar
        ];
    }

    public function getDefaultCoverPic($user)
    {
        $maleAvatar = 'http://opinion.com/uploads/gallery/a4a2139157426ca3e2b39af6b374c458.jpeg';
        $femaleAvatar = 'http://opinion.com/uploads/gallery/598616f0316b18de6d3a415c7f3c203b.jpeg';
        return [
            'id' => null,
            'path' => null,
            'web_path' => $user->getGender() === 'Male' ? $maleAvatar : $femaleAvatar
        ];
    }

    protected function getLastActivity($user) {
        try {
            $last = $user->getLastActivity() ? $user->getLastActivity() : $user->getLastLogin();
        } catch (Exception $e) {
            //catch if lastActivité come from seialized data in redis
            //then renew value
             $last = new \Datetime(null, new \DateTimeZone("UTC"));
        }
        return $last->getTimestamp();
    }

    protected function getThreadId($id1, $id2) {
        $arr = array($id1, $id2);
        return $this->threadMan->findChatIdForTwo($arr);
    }

    /**
     * Gets the current authenticated user
     * @see::OPMEssageBundle participantprovider
     * @return ParticipantInterface
     */
    protected function _getUser()
    {
        return $this->user_provider->getHydratedUser();
    }
}