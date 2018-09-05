<?php

namespace OP\MessageBundle\Sender;

use OP\MessageBundle\Event\MessageEvent,
    OP\SocialBundle\Firebase\Firebase,
    OP\MessageBundle\Event\OPMessageEvents,
    OP\MessageBundle\Model\MessageInterface,
    Symfony\Component\HttpFoundation\RequestStack,
    OP\MessageBundle\ModelManager\ThreadManagerInterface,
    OP\MessageBundle\ModelManager\MessageManagerInterface,
    OP\MessageBundle\DataTransformer\ObjectToArrayTransformer,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;

/**
 * Sends messages
 */
class Sender implements SenderInterface
{
    /**
     * The message manager
     *
     * @var MessageManagerInterface
     */
    protected $messageManager, $threadManager, $container, $request, $transformer, $firebase;

    public function __construct(MessageManagerInterface $messageManager, ThreadManagerInterface $threadManager, Container $container, RequestStack $request, ObjectToArrayTransformer $transformer, Firebase $fb)
    {
        $this->messageManager   = $messageManager;
        $this->threadManager    = $threadManager;
        $this->request          = $request->getCurrentRequest();
        $this->container        = $container;
        $this->transformer      = $transformer;
        $this->firebase         = $fb;
    }

    /**
     * Sends the message by persisting it to the message manager and undeletes
     * the thread for all participants.
     *
     * @param MessageInterface $message
     */
    public function send(MessageInterface $message)
    {
        $this->threadManager->saveThread($message->getThread(), false);

        $this->messageManager->saveMessage($message, false);

        /* Note: Thread::setIsDeleted() depends on metadata existing for all
         * thread and message participants, so both objects must be saved first.
         * We can avoid flushing the object manager, since we must save once
         * again after undeleting the thread.
         */
        $message->getThread()->setIsDeleted(false);
        $this->messageManager->saveMessage($message);

        if($this->readyForFirbase()) {
            try {
                $this->pushInFirebase($message, $thread);  //TODO Async
            } catch (Exception $e) { 
                
            }
        }
        // $this->container->dispatch(OPMessageEvents::POST_SEND, new MessageEvent($message));
        
        return $message;
    }

    protected function readyForFirbase() {
        $request = $this->request;
        //TODO:: more control
        if(!$request->isXmlHttpRequest() || 
            $request->headers->get('Content-Type') !== 'application/json') {
            return false;
        }
        return true;
    }

    protected function pushInFirebase($m, $t) {
        $db        = $this->firebase->getDatabase();
        // $fireUser = $db
        //     ->getReference("users/{$user->getId()}")->getValue();
        // var_dump($fireUser);
        // die();

        $thread_arr = [
            'id'                => $object->getId(),
            'metadata'          => $this->transformer->getThreadMetadata($t),
            'lastMessage'       => $m,
            'lastMessageDate'   => $m->getCreatedAt()->getTimestamp(),
            'createdAt'         => $t->getCreatedAt()->getTimestamp(),
            // 'otherParticipants' => $this->getOtherParticipants($object, $user),
        ];


        $msg_arr = [
            // 'id'  => (String)$db_m['_id'],
            'body'      => $m->getBody(),
            'createdAt' => $m->getCreatedAt()->getTimestamp(),
            'threadId'  => $t->getId(),
            'sender'    => $m->getSender()->getId(),
            'images'    => $this->transformer->getImagesForFirebase($m),
            'metadata'  => $this->transformer->getMessageMetadata($m)
        ];

        $msg_ref = $db->getReference("threads/{$thread->getId()}/messages");
        $msg_ref->push($msg_arr);


        $msg_ref->getSnapshot();
        // $message->getKey(); // => -KVr5eu8gcTv7_AHb-3-
        // $message->getUri(); // => https://my-project.firebaseio.com/blog/posts/-KVr5eu8gcTv7_AHb-3-
        // $message->getChild('title')->set('Changed post title');
        // $message->getValue(); // Fetches the data from the realtime database
        // $message->remove();
    }
}
