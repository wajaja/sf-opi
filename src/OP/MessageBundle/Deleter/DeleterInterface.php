<?php

namespace OP\MessageBundle\Deleter;

use OP\MessageBundle\Model\ThreadInterface;

/**
 * Marks threads as deleted
 */
interface DeleterInterface
{
    /**
     * Marks the thread as deleted by the current authenticated user
     *
     * @param ThreadInterface $thread
     */
    function markAsDeleted(ThreadInterface $thread);

    /**
     * Marks the thread as undeleted by the current authenticated user
     *
     * @param ThreadInterface $thread
     */
    function markAsUndeleted(ThreadInterface $thread);
}
