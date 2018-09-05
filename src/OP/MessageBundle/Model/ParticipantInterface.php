<?php

namespace OP\MessageBundle\Model;

/**
 * A user participating to a thread.
 * May be implemented by a OP\UserBundle user document or entity.
 * Or anything you use to represent users in the application.
 */
interface ParticipantInterface
{
    /**
     * Gets the unique identifier of the participant
     *
     * @return string
     */
    function getId();
}
