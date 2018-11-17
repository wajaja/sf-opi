<?php

namespace OP\MessageBundle\Event;

use Symfony\Component\EventDispatcher\Event;

class MessageEvent extends Event
{
    /**
     * The message
     * @var MessageInterface
     */
    private $data, $threadId;

    public function __construct($data = [], $threadId = '')
    {
        $this->data = $data;
        $this->threadId = $threadId;
    }

    /**
     * Returns the message
     *
     * @return MessageInterface
     */
    public function getData()
    {
        return $this->data;
    }

    public function getThreadId() {
        return $this->threadId;
    }
}
