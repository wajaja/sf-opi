<?php

namespace OP\PostBundle\Serializer;

use OP\PostBundle\Document\Post,
    OP\UserBundle\Security\UserProvider,
    Doctrine\ODM\MongoDB\DocumentManager,
    JMS\Serializer\EventDispatcher\ObjectEvent,
    OP\PostBundle\DataTransformer\ToArrayTransformer,
    JMS\Serializer\EventDispatcher\EventSubscriberInterface;

class PostSerializerSubscriber implements EventSubscriberInterface
{
    /** @var MyDependency */
    private $dm, $userProvider, $transformer;

    /**
     * MyDependency $dependency
     */
    public function __construct(DocumentManager $dm, UserProvider $userProvider, ToArrayTransformer $transformer)
    {
        $this->dm          = $dm;
        $this->userProvider= $userProvider;
        $this->transformer = $transformer;
    }

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

        if($data = $this->transform($object)) {
            foreach ($data as $key => $value) {
                $visitor->setData($key, $value);
            }
        }
    }

    public function transform($post)
    {
        $transformer = $this->transformer;
        $userId      = $this->getUser()->getId();
        $data        = [];
        //post not found or masked || TO DO BLOCKED IDS
        if(gettype($post) === 'object') {
            if($post && in_array($userId, $post->getMaskersForUserIds())) {
                $data = $post->getType() == 'opinion' ? $transformer->opinionObjectToArray($post) :
                                                    $transformer->postObjectToArray($post);
            }  
        } else {
            if($post || in_array($userId, $post['maskersForUserIds'])) {
                $data = $post['type'] == 'opinion' ? $transformer->opinionToArray($post) :
                                                    $transformer->postToArray($post);
            }
        }

        return $data;
    }

    protected function getUser() {
        return $this->userProvider->getHydratedUser();
    }
}