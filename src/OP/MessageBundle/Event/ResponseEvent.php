<?php

namespace OP\MessageBundle\Event;

use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\EventDispatcher\Event;
use OP\MessageBundle\Document\Response;
use OP\MessageBundle\Document\Question;

class ResponseEvent extends QuestionEvent
{
    /**
     * The message
     * @var MessageInterface
     */
    private $response;

    public function __construct(Response $response)
    {
        parent::__construct($response->getQuestion());

        $this->response = $response;
    }

    /**
     * Returns the message
     *
     * @return MessageInterface
     */
    public function getResponse()
    {
        return $this->response;
    }
}
