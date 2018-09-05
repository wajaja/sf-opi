<?php

namespace OP\MessageBundle\MessageBuilder;

use OP\MessageBundle\Document\Message,
    OP\MessageBundle\Document\Thread,
    OP\MessageBundle\Model\ParticipantInterface;

/**
 * Fluent interface message builder
 *
 * @author Cedrick
 */
abstract class AbstractMessageBuilder
{
    /**
     * The message we are building
     *
     * @var MessageInterface
     */
    protected $message;

    /**
     * 
     * @var string
     */
    protected $unique;
    
    /**
     * The thread the message goes in
     *
     * @var ThreadInterface
     */
    protected $thread;

    public function __construct(Message $message, Thread $thread)
    {
        $this->message = $message;
        $this->thread = $thread;

        $this->message->setThread($thread);
        $this->thread->addMessage($message);
    }

    /**
     * Gets the created message.
     *
     * @return MessageInterface the message created
     */
    public function getMessage()
    {
        return $this->message;
    }

    /**
     * @param  string
     * @return MessageBuilder (fluent interface)
     */
    public function setBody($body)
    {
        $this->message->setBody($body);

        return $this;
    }

    /**
     * @param  string
     * @return MessageBuilder (fluent interface)
     */
    public function addImagesIds($ids = array())
    {
        $this->message->addImagesIds($ids);

        return $this;
    }

    /**
     * @param  string
     * @return MessageBuilder (fluent interface)
     */
    public function addDocumentsIds($ids = array())
    {
        $this->message->addDocumentsIds($ids);

        return $this;
    }

    /**
     * @param  ParticipantInterface $sender
     * @return MessageBuilder (fluent interface)
     */
    public function setSender(ParticipantInterface $sender)
    {
        $this->message->setSender($sender);
        $this->thread->addParticipant($sender);

        return $this;
    }

    /**
     * Set unique
     *
     * @param string $unique
     * @return $this
     */
    public function setUnique($unique)
    {
        $this->unique = $unique;
        return $this;
    }

    /**
     * Get unique
     *
     * @return string $unique
     */
    public function getUnique()
    {
        return $this->unique;
    }
}
