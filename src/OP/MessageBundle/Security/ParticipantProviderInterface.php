<?php

namespace OP\MessageBundle\Security;

use OP\MessageBundle\Model\ParticipantInterface;

/**
 * Provides the authenticated participant
 */
interface ParticipantProviderInterface
{
    /**
     * Gets the current authenticated user
     *
     * @return ParticipantInterface
     */
    function getAuthenticatedParticipant();
}
