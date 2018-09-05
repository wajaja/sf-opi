<?php

namespace OP\PostBundle\Event;

use Symfony\Component\EventDispatcher\Event;

class RateEvent extends Event
{
    /**
     * The thread
     * @var ThreadInterface
     */
    private $rate;

    public function __construct($data)
    {
        $this->rate = $data;
    }

    /**
     * Returns the thread
     *
     * @return ThreadInterface
     */
    public function getData()
    {
        return $this->rate;
    }
}
