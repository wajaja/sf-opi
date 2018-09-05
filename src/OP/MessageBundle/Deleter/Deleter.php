<?php

namespace OP\MessageBundle\Deleter;

use OP\MessageBundle\Security\AuthorizerInterface;
use OP\MessageBundle\Model\ThreadInterface;
use OP\MessageBundle\Security\ParticipantProviderInterface;
use OP\MessageBundle\Event\OPMessageEvents;
use OP\MessageBundle\Event\ThreadEvent;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

/**
 * Marks threads as deleted
 */
class Deleter implements DeleterInterface
{
    /**
     * The authorizer instance
     *
     * @var AuthorizerInterface
     */
    protected $authorizer;

    /**
     * The participant provider instance
     *
     * @var ParticipantProviderInterface
     */
    protected $participantProvider;

    /**
     * The event dispatcher
     *
     * @var EventDispatcherInterface
     */
    protected $dispatcher;

    public function __construct(AuthorizerInterface $authorizer, ParticipantProviderInterface $participantProvider, EventDispatcherInterface $dispatcher)
    {
        $this->authorizer = $authorizer;
        $this->participantProvider = $participantProvider;
        $this->dispatcher = $dispatcher;
    }

    /**
     * Marks the thread as deleted by the current authenticated user
     *
     * @param ThreadInterface $thread
     */
    public function markAsDeleted(ThreadInterface $thread)
    {
        if (!$this->authorizer->canDeleteThread($thread)) {
            throw new AccessDeniedException('You are not allowed to delete this thread');
        }
        $thread->setIsDeletedByParticipant($this->getAuthenticatedParticipant(), true);

        $this->dispatcher->dispatch(OPMessageEvents::POST_DELETE, new ThreadEvent($thread));
    }

    /**
     * Marks the thread as undeleted by the current authenticated user
     *
     * @param ThreadInterface $thread
     */
    public function markAsUndeleted(ThreadInterface $thread)
    {
        if (!$this->authorizer->canDeleteThread($thread)) {
            throw new AccessDeniedException('You are not allowed to delete this thread');
        }
        $thread->setIsDeletedByParticipant($this->getAuthenticatedParticipant(), false);

        $this->dispatcher->dispatch(OPMessageEvents::POST_UNDELETE, new ThreadEvent($thread));
    }

    /**
     * Gets the current authenticated user
     *
     * @return ParticipantInterface
     */
    protected function getAuthenticatedParticipant()
    {
        return $this->participantProvider->getAuthenticatedParticipant();
    }
}
