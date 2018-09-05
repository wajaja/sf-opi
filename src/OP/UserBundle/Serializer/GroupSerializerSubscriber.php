<?php

namespace OP\UserBundle\Serializer;

use OP\UserBundle\Document\Group,
    JMS\Serializer\EventDispatcher\ObjectEvent,
    JMS\Serializer\EventDispatcher\EventSubscriberInterface;

class GroupSerializerSubscriber implements EventSubscriberInterface
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
        $img = 'http://opinion.com/uploads/gallery/862fd08f285cae49ac4db2fc65ed3a4c.jpeg';
        return [
            'id' => null,
            'path' => null,
            'web_path' => $img
        ];
    }
}