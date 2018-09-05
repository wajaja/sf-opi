<?php

namespace OP\MessageBundle\Event;

use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\EventDispatcher\Event;
use OP\MessageBundle\Model\ReadableInterface;

class ReadableEvent extends Event
{
    /**
     * The readable
     * @var ReadableInterface
     */
    private $readable;

    public function __construct(ReadableInterface $readable)
    {
        $this->readable = $readable;
    }

    /**
     * Returns the readable
     *
     * @return ReadableInterface
     */
    public function getReadable()
    {
        return $this->readable;
    }
}
