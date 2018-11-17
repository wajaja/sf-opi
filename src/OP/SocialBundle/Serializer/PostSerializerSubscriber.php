<?php

namespace OP\SocialBundle\Serializer;

use JMS\Serializer\EventDispatcher\ObjectEvent,
    JMS\Serializer\EventDispatcher\EventSubscriberInterface;

class PostSerializerSubscriber implements EventSubscriberInterface
{
    /** @var MyDependency */
    // private $dependency;

    /**
     * MyDependency $dependency
     */
    // public function __construct(MyDependency $dependency)
    // {
    //     $this->dependency = $dependency;
    // }

    public static function getSubscribedEvents()
    {
        return [
            [ 'event' => 'serializer.post_serialize', 
              'method' => 'onPostSerializeMethod', 
              'class' => 'OP\\PostBundle\\Document\\Post'
            ]
        ];
    }

    public function onPostSerializeMethod(ObjectEvent $event)
    {
        $object  = $event->getObject();
        $visitor = $event->getVisitor();

        if(!$object->getProfilePic())
            $visitor->addData('profile_pic', $this->getDefaultProfilePic($object));
    }
}