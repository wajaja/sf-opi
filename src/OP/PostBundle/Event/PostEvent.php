<?php

namespace OP\PostBundle\Event;

use Symfony\Component\EventDispatcher\Event;

class PostEvent extends Event
{
    /**
     * The message
     * @var MessageInterface
     */
    private $post;

    public function __construct(array $data)
    {
        $this->post = $data;
    }

    /**
     * Returns the message
     *
     * @return MessageInterface
     */
    public function getData()
    {
        return $this->post;
    }
}
