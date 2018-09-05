<?php

namespace OP\PostBundle\ModelManager;

use OP\PostBundle\Model\ReadableInterface,
    OP\PostBundle\Model\ParticipantInterface;

/**
 * Capable of updating the read state of objects directly in the storage,
 * without modifying the state of the object
 */
interface ReadableManagerInterface
{
    /**
     * Marks the readable as read by this participant
     * Must be applied directly to the storage,
     * without modifying the readable state.
     * We want to show the unread readables on the page,
     * as well as marking them as read.
     *
     * @param ReadableInterface $readable
     * @param ParticipantInterface $user
     */
    function markAsReadByParticipant(ReadableInterface $readable, ParticipantInterface $user);

    /**
     * Marks the readable as unread by this participant
     *
     * @param ReadableInterface $readable
     * @param ParticipantInterface $user
     */
    function markAsUnreadByParticipant(ReadableInterface $readable, ParticipantInterface $user);
}
