<?php
namespace OP\MessageBundle\ModelManager;

use OP\MessageBundle\Document\Thread;

/**
 * Abstract Thread Manager implementation which can be used as base class by your
 * concrete manager.
 */
abstract class ThreadManager implements ThreadManagerInterface
{
    /**
     * Creates an empty comment thread instance
     *
     * @return ThreadInterface
     */
    public function createThread()
    {
        $commentThread = new Thread();

        return $commentThread;
    }
}
