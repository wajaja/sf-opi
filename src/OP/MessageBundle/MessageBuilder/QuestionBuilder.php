<?php

namespace OP\MessageBundle\MessageBuilder;

use OP\MessageBundle\Document\Question;
use OP\MessageBundle\Model\ParticipantInterface;
use OP\MessageBundle\Document\Response;

/**
 * Fluent interface message builder
 *
 * @author Cedrick
 */
class QuestionBuilder extends AbstractMessageBuilder
{
    /**
     * The response we are building
     *
     * @var Response
     */
    protected $response;

    /**
     * The question the response goes in
     *
     * @var Question
     */
    protected $question;

    public function __construct(Response $response, Question $question)
    {
        $this->response = $response;
        $this->question = $question;

        // $this->response->setPquestionId($question);
        // $question->addPresponse($response);
    }

    /**
     * Gets the created response.
     *
     * @return response created
     */
    public function getResponse()
    {
        return $this->response;
    }

    /**
     * @param  string
     * @return Builder (fluent interface)
     */
    public function setContent($content)
    {
        $this->response->setContent($content);

        return $this;
    }

    /**
     * @param  ParticipantInterface $author
     * @return Builder (fluent interface)
     */
    public function setAuthor(ParticipantInterface $author)
    {
        $this->response->setAuthor($author);


        $this->question->addParticipant($author);

        return $this;
    }
}
