<?php

namespace OP\MessageBundle\Event;

use Symfony\Component\EventDispatcher\Event,
    Symfony\Component\HttpKernel\HttpKernelInterface;

class ThreadEvent extends Event
{
    /**
     * The data
     * @var ThreadInterface
     */
    private $data;

    public function __construct($data = [])
    {
        $this->data = $data;
    }

    /**
     * Returns the data
     *
     * @return ThreadInterface
     */
    public function getData()
    {
        return $this->data;
    }
}
