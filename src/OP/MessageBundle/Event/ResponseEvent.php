<?php

namespace OP\MessageBundle\Event;

use OP\MessageBundle\Document\Response;

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
