<?php

namespace OP\MessageBundle\Composer;

use OP\MessageBundle\Model\ThreadInterface;

/**
 * Factory for message builders
 */
interface ComposerInterface
{
    /**
     * Starts composing a message, starting a new thread
     *
     * @return MessageBuilderInterface
     */
    function newThread();

    /**
     * Starts composing a message in a reply to a thread
     *
     * @return MessageBuilderInterface
     */
    function reply(ThreadInterface $thread);
}
