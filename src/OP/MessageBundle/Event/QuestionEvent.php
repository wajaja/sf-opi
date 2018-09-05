<?php
namespace OP\MessageBundle\Event;

use Symfony\Component\EventDispatcher\Event,
    Symfony\Component\HttpKernel\HttpKernelInterface;

class QuestionEvent extends Event
{
    /**
     * The thread
     * @var ThreadInterface
     */
    private $data;

    public function __construct($data = [])
    {
        $this->data = $data;
    }

    /**
     * Returns the thread
     *
     * @return ThreadInterface
     */
    public function getData()
    {
        return $this->data;
    }
}
