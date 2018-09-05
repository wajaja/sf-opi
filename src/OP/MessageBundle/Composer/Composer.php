<?php

namespace OP\MessageBundle\Composer;

use OP\MessageBundle\Document\Response,
    OP\MessageBundle\Document\Question,
    OP\MessageBundle\Model\ThreadInterface,
    OP\MessageBundle\MessageBuilder\QuestionBuilder,
    OP\MessageBundle\MessageBuilder\ReplyMessageBuilder,
    OP\MessageBundle\ModelManager\ThreadManagerInterface,
    OP\MessageBundle\ModelManager\MessageManagerInterface,
    OP\MessageBundle\MessageBuilder\NewThreadMessageBuilder;

/**
 * Factory for message builders
 *
 * @author Cedrick Ngeja
 */
class Composer implements ComposerInterface
{
    /**
     * Message manager
     *
     * @var MessageManagerInterface
     */
    protected $messageManager;

    /**
     * Thread manager
     *
     * @var ThreadManagerInterface
     */
    protected $threadManager;

    public function __construct(MessageManagerInterface $messageManager, ThreadManagerInterface $threadManager)
    {
        $this->messageManager = $messageManager;
        $this->threadManager = $threadManager;
    }

    /**
     * Starts composing a message, starting a new thread
     *
     * @return NewThreadMessageBuilder
     */
    public function newThread()
    {
        $thread = $this->threadManager->createThread();
        $message = $this->messageManager->createMessage();
        return new NewThreadMessageBuilder($message, $thread);
    }  

    /**
     * Starts composing a message in a reply to a thread
     *
     * @return ReplyMessageBuilder
     */
    public function reply(ThreadInterface $thread)
    {
        $message = $this->messageManager->createMessage();

        return new ReplyMessageBuilder($message, $thread);
    }
    
    /**
     * 
     * @param \OP\MessageBundle\Composer\Pquestion $question
     * @return \OP\MessageBundle\Composer\PquestionBuilder
     */
    public function postQuestion(Response $response)
    {
        $question = new Question();
        return new QuestionBuilder($response, $question);
    }
}