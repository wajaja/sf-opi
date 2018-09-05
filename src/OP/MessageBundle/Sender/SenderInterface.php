<?php

namespace OP\MessageBundle\Sender;

use OP\MessageBundle\Model\MessageInterface;

/**
 * Sends messages
 */
interface SenderInterface
{
    /**
     * Sends the message
     *
     * @param MessageInterface $message
     */
    function send(MessageInterface $message);
}
