<?php

namespace OP\UserBundle\Serializer;

use OP\UserBundle\Security\UserProvider,
    JMS\Serializer\EventDispatcher\ObjectEvent,
    Symfony\Component\HttpFoundation\RequestStack,
    JMS\Serializer\EventDispatcher\EventSubscriberInterface;

class GroupSerializerSubscriber implements EventSubscriberInterface
{
    /**
     * services convert images object to array 
     * @var type 
     */
    protected $request, $user_provider;


    public function __construct(RequestStack $request, UserProvider $user_provider) {
        $this->request          = $request->getCurrentRequest();
        $this->user_provider    = $user_provider;
    }

    public static function getSubscribedEvents()
    {
        return [
            [ 'event' => 'serializer.post_serialize', 
              'method' => 'onPostSerializeMethod', 
              'class' => 'OP\\UserBundle\\Document\\Group'
            ]
        ];
    }

    public function onPostSerializeMethod(ObjectEvent $event)
    {
        $object  = $event->getObject();
        $visitor = $event->getVisitor();

        if(!$object->getAvatar())
            $visitor->addData('avatar', $this->getDefaultAvatar($object));
    }

    // default data in user pictire
    // 
    public function getDefaultAvatar($group)
    {
        return [
            'id' => null,
            'path' => null,
            'web_path' => $this->user_provider->getDefaultAvatar($group)
        ];
    }
}