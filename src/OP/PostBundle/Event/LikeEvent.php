<?php

namespace OP\PostBundle\Event;

use Symfony\Component\EventDispatcher\Event;

class LikeEvent extends Event
{
    /**
     * The thread
     * @var ThreadInterface
     */
    private $like;

    public function __construct(array $data)
    {
        $this->like = $data;
    }

    /**
     * Returns the thread
     *
     * @return ThreadInterface
     */
    public function getData()
    {
        return $this->like;
    }
}
