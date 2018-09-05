<?php

namespace OP\PostBundle\Event;

use Symfony\Component\EventDispatcher\Event;

class ShareEvent extends Event
{
    /**
     * The readable
     * @var ReadableInterface
     */
    private $share;

    public function __construct(array $data)
    {
        $this->share = $data;
    }

    /**
     * Returns the readable
     *
     * @return ReadableInterface
     */
    public function getData()
    {
        return $this->share;
    }
}
