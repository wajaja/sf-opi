<?php

namespace OP\MessageBundle\Listener;

use OP\MessageBundle\Event as Events,
    OP\UserBundle\Repository\OpinionUserManager,
    Symfony\Component\HttpFoundation\RequestStack,
    OP\MessageBundle\Security\ParticipantProviderInterface,
    OP\MessageBundle\DataTransformer\ObjectToArrayTransformer,
    Gos\Bundle\WebSocketBundle\DataCollector\PusherDecorator,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;

/**
* 
*/
class MessageListener
{

    private $userManager, $container, $participantProvider, $pusher,
                    $request, $transformer;

    public function __construct(RequestStack $request, Container $container, ObjectToArrayTransformer $transformer,  OpinionUserManager $um, ParticipantProviderInterface $participantProvider, PusherDecorator $pusher)
    {
            $this->container    = $container;
            $this->transformer  = $transformer;
            $this->request      = $request->getCurrentRequest();
            $this->userManager  = $um;
            $this->pusher       = $pusher;
            $this->participantProvider  = $participantProvider;
    }

    public function onThreadCreate(Events\ThreadEvent $event)
    {
        $data       = $event->getData();
//            $session    = $this->request->getSession();
        $thread_id  =  $data['id'];
        $this->pusher->push(
                ['data'=> $data], 'thread_create_topic', ['thread_id' => $thread_id]
        );
    }

    public function onMessageSend(Events\MessageEvent $event)
    {
        $data 		= $event->getData();
        $thread_id  = $event->getThreadId();


        $user = $this->participantProvider->getAuthenticatedParticipant();
        $user->setLastThreadActivity($thread_id);
        $this->userManager->updateUser($user);

        $this->pusher->push(
                ['data'=> $data], 'message_send_topic', ['thread_id' => $thread_id]
        );		
    }

    public function onMessageRead(Events\MessageEvent $event)
    {
        $thread_id  = $event->getThreadId();
        $this->pusher->push(
                ['data'=> $data], 'message_read_topic', ['thread_id' => $thread_id]
        );
    }

    public function onMessageWriting(Events\MessageEvent $event)
    {
        $thread_id  = $event->getThreadId();
        $this->pusher->push(
                ['data'=> $data], 'message_writing_topic', ['thread_id' => $thread_id]
        );
    }
}