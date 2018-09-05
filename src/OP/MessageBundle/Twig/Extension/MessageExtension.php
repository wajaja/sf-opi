<?php

namespace OP\MessageBundle\Twig\Extension;

use OP\MessageBundle\Security\ParticipantProviderInterface;
use OP\MessageBundle\Model\ReadableInterface;
use OP\MessageBundle\Provider\ProviderInterface;
use OP\MessageBundle\Model\ThreadInterface;
use OP\MessageBundle\Security\AuthorizerInterface;

class MessageExtension extends \Twig_Extension
{
    protected $participantProvider;
    protected $provider;
    protected $authorizer;

    protected $nbUnreadMessagesCache;

    public function __construct(ParticipantProviderInterface $participantProvider, ProviderInterface $provider, AuthorizerInterface $authorizer)
    {
        $this->participantProvider = $participantProvider;
        $this->provider = $provider;
        $this->authorizer = $authorizer;
    }

    /**
     * Returns a list of global functions to add to the existing list.
     *
     * @return array An array of global functions
     */
    public function getFunctions()
    {
        return array(
            'op_message_is_read'  => new \Twig_Function_Method($this, 'isRead'),
            'op_message_nb_unread' => new \Twig_Function_Method($this, 'getNbUnread'),
            'op_message_can_delete_thread' => new \Twig_Function_Method($this, 'canDeleteThread'),
            'op_message_deleted_by_participant' => new \Twig_Function_Method($this, 'isThreadDeletedByParticipant')
        );
    }

    /**
     * Tells if this readable (thread or message) is read by the current user
     *
     * @return boolean
     */
    public function isRead(ReadableInterface $readable)
    {
        return $readable->isReadByParticipant($this->getAuthenticatedParticipant());
    }
    
    
    /**
     * Checks if the participant can mark a thread as deleted
     * 
     * @param ThreadInterface $thread
     * 
     * @return boolean true if participant can mark a thread as deleted, false otherwise
     */
    public function canDeleteThread(ThreadInterface $thread)
    {
        return $this->authorizer->canDeleteThread($thread);
    }
    
    /**
     * Checks if the participant has marked the thread as deleted
     * 
     * @param ThreadInterface $thread
     * 
     * @return boolean true if participant has marked the thread as deleted, false otherwise
     */
    public function isThreadDeletedByParticipant(ThreadInterface $thread)
    {
       return $thread->isDeletedByParticipant($this->getAuthenticatedParticipant());
    }

    /**
     * Gets the number of unread messages for the current user
     *
     * @return int
     */
    public function getNbUnread()
    {
        if (null === $this->nbUnreadMessagesCache) {
            $this->nbUnreadMessagesCache = $this->provider->getNbUnreadMessages();
        }

        return $this->nbUnreadMessagesCache;
    }

    /**
     * Gets the current authenticated user
     *
     * @return ParticipantInterface
     */
    protected function getAuthenticatedParticipant()
    {
        return $this->participantProvider->getAuthenticatedParticipant();
    }

    /**
     * Returns the name of the extension.
     *
     * @return string The extension name
     */
    public function getName()
    {
        return 'op_message';
    }
}
