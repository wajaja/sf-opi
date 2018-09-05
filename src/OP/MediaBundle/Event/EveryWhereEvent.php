<?php

namespace OP\MediaBundle\Event;

use Symfony\Component\EventDispatcher\Event;

class EveryWhereEvent extends Event
{
    /**
     * The thread
     * @var ThreadInterface
     */
    private $everywhere;

    public function __construct($data)
    {
        $this->everywhere = $data;
    }

    /**
     * Returns the thread
     *
     * @return ThreadInterface
     */
    public function getData()
    {
        return $this->everywhere;
    }
}
