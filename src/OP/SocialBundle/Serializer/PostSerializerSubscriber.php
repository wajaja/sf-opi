<?php

namespace OP\SocialBundle\Serializer;

use OP\PostBundle\Document\Post,
    JMS\Serializer\EventDispatcher\ObjectEvent,
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

    // default data in user pictire
    // 
    public function getDefaultProfilePic($user)
    {
        $maleAvatar = 'http://opinion.com/uploads/gallery/862fd08f285cae49ac4db2fc65ed3a4c.jpeg';
        $femaleAvatar = 'http://opinion.com/uploads/gallery/94132ea0069186e77a530619bf4a4d36.jpeg';
        return [
            'id' => null,
            'path' => 'null',
            'web_path' => $user->getGender() === 'Male' ? $maleAvatar : $femaleAvatar
        ];
    }

    public function getDefaultCoverPic($user)
    {
        $maleAvatar = 'http://opinion.com/uploads/gallery/a4a2139157426ca3e2b39af6b374c458.jpeg';
        $femaleAvatar = 'http://opinion.com/uploads/gallery/598616f0316b18de6d3a415c7f3c203b.jpeg';
        return [
            'id' => null,
            'path' => 'null',
            'web_path' => $user->getGender() === 'Male' ? $maleAvatar : $femaleAvatar
        ];
    }
}