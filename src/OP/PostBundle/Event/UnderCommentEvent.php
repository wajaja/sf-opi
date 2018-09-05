<?php

namespace OP\PostBundle\Event;

use Symfony\Component\EventDispatcher\Event;

class UnderCommentEvent extends Event
{
    /**
     * The readable
     * @var ReadableInterface
     */
    private $comment;

    public function __construct(array $data)
    {
        $this->comment = $data;
    }

    /**
     * Returns the readable
     *
     * @return ReadableInterface
     */
    public function getData()
    {
        return $this->comment;
    }
}
