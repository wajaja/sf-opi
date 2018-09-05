<?php

namespace OP\MessageBundle\Security;

use OP\MessageBundle\Model\ThreadInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use OP\MessageBundle\Model\ParticipantInterface;
use OP\MessageBundle\Security\ParticipantProviderInterface;

/**
 * Manages permissions to manipulate threads and messages
 */
class Authorizer implements AuthorizerInterface
{
    /**
     * The participant provider
     *
     * @var ParticipantProviderInterface
     */
    protected $participantProvider;

    public function __construct(ParticipantProviderInterface $participantProvider)
    {
        $this->participantProvider = $participantProvider;
    }

    /**
     * Tells if the current participant is allowed
     * to see this thread
     *
     * @param ThreadInterface $thread
     * @return boolean
     */
    public function canSeeThread(ThreadInterface $thread)
    {
        return $this->getAuthenticatedParticipant() && $thread->isParticipant($this->getAuthenticatedParticipant());
    }

    /**
     * Tells if the current participant is allowed
     * to delete this thread
     *
     * @param ThreadInterface $thread
     * @return boolean
     */
    public function canDeleteThread(ThreadInterface $thread)
    {
        return $this->canSeeThread($thread);
    }

    /**
     * Tells if the current participant is allowed
     * to send a message to this other participant
     *
     * @param ParticipantInterface $participant the one we want to send a message to
     * @return boolean
     */
    public function canMessageParticipant(ParticipantInterface $participant)
    {
        return true;
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
