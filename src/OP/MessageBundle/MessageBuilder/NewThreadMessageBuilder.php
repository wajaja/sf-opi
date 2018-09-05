<?php

namespace OP\MessageBundle\MessageBuilder;

use OP\MessageBundle\Model\ParticipantInterface;
use Doctrine\Common\Collections\Collection;

/**
 * Fluent interface message builder for new thread messages
 *
 */
class NewThreadMessageBuilder extends AbstractMessageBuilder
{
    /**
     * The thread subject
     *
     * @param  string
     * @return NewThreadMessageBuilder (fluent interface)
     */
    public function setSubject($subject)
    {
        $this->thread->setSubject($subject);

        return $this;
    }

    /**
     * @param  ParticipantInterface $recipient
     * @return NewThreadMessageBuilder (fluent interface)
     */
    public function addRecipient(ParticipantInterface $recipient)
    {
        $this->thread->addParticipant($recipient);

        return $this;
    }

    /**
     * @param  Collection $recipients
     * @return NewThreadMessageBuilder
     */
    public function addRecipients(Collection $recipients)
    {
        //add the collection of recipient instance of participantInterface
        foreach ($recipients as $recipient) {
            $this->addRecipient($recipient);
        }
        return $this;
    }

}
