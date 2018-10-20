<?php

namespace OP\MessageBundle\DocumentManager;

use OP\MessageBundle\Model\{ThreadInterface, ReadableInterface, ParticipantInterface};
use OP\MessageBundle\Document\Thread,
    Doctrine\ODM\MongoDB\Query\Builder,
    Doctrine\ODM\MongoDB\DocumentManager,
    OP\UserBundle\Repository\OpinionUserManager,
    OP\MessageBundle\DataTransformer\ObjectToArrayTransformer,
    OP\MessageBundle\ModelManager\ThreadManager as BaseThreadManager;

/**
 * Default MongoDB ThreadManager.
 */
class ThreadManager extends BaseThreadManager
{
    /**
     * @var DocumentManager
     */
    protected $dm, $repository, $class, $userManager,
              $metaClass, $transformer, $messageManager;

    /**
     * Constructor.
     *
     * @param DocumentManager $dm
     * @param string          $class
     * @param string          $metaClass
     * @param MessageManager  $messageManager
     */
    public function __construct(DocumentManager $dm, $class, $metaClass, MessageManager $messageManager, ObjectToArrayTransformer $transformer, OpinionUserManager $um)
    {
        $this->dm             = $dm;
        $this->repository     = $dm->getRepository($class);
        $this->class          = $dm->getClassMetadata($class)->name;
        $this->metaClass      = $dm->getClassMetadata($metaClass)->name;
        $this->messageManager = $messageManager;
        $this->transformer    = $transformer;
        $this->userManager    = $um;
    }

    public function loadThreads(ParticipantInterface $user, $limit, $initIds) 
    {
        $datas['threads']    = [];
        $datas['messages']   = [];
        $objects      = $this->findParticipantInboxThreads($user, $limit, $initIds);

        foreach ($objects as $object) {
            $datas['threads'][] = $this->transformer->threadObjectToArray($object);
        }

        return $datas;
    }

    public function loadList(ParticipantInterface $user, $limit, $page) 
    {
        $objects      = $this->findParticipantInboxThreads($user, $limit, $page);
        foreach ($objects as $o) {
            if($o->isDeletedByParticipant($user))  continue;
            $datas[] = $this->transformer->threadObjectToArray($o);
        }

        return $datas;
    }

    protected function getThreadLastMessage($thread) {
        $message = $thread->getLastMessage();

        return $this->transformer->messageObjectToArray($message);
    }

    protected function getThreadMessages($thread) {
        $messages = [];
        foreach ($thread->getMessages() as $message) {
            $messages[] = $this->transformer->messageObjectToArray($message);
        }

        return $messages;
    }
   
}
