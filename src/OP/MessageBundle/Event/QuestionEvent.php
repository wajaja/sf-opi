<?php
namespace OP\MessageBundle\Event;

use Symfony\Component\EventDispatcher\Event;

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
