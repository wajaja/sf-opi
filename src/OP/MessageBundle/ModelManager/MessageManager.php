<?php

namespace OP\MessageBundle\ModelManager;

use OP\MediaBundle\Document\Image,
    OP\UserBundle\Document\User,
    OP\MessageBundle\Document\Thread,
    OP\MessageBundle\Document\Message,
    Doctrine\ODM\MongoDB\Query\Builder,
    Doctrine\ODM\MongoDB\DocumentManager,
    OP\UserBundle\Security\UserProvider,
    OP\MessageBundle\Model\ThreadInterface,
    OP\MessageBundle\Model\MessageInterface,
    OP\MessageBundle\Model\ReadableInterface,
    OP\MessageBundle\Model\ParticipantInterface,
    Symfony\Component\HttpFoundation\RequestStack,
    Symfony\Component\HttpFoundation\File\UploadedFile,
    OP\MessageBundle\ModelManager\MessageManager as BaseMessageManager;

/**
 * Abstract Message Manager implementation which can be used as base by
 * your concrete manager.
 *
 */
abstract class MessageManager implements MessageManagerInterface
{
    /**
     * Creates an empty message instance
     * @return MessageInterface
     */
    public function createMessage()
    {
        $class = $this->getClass();
        $message = new $class;

        return $message;
    }

    /**
     * Tells how many unread, non-spam, messages this participant has
     *
     * @param ParticipantInterface $participant
     * @return int the number of unread messages
     */
    public function getNbUnreadMessageByParticipant(ParticipantInterface $participant)
    {
        return $this->repository->createQueryBuilder()
            ->field('unreadForParticipants')->equals($participant->getId())
            ->getQuery()
            ->count();
    }

    public function countAlerts(User $user) {
        $userId = $user->getId();
        $lastReading = $user->getLastMessageView() ? $user->getLastMessageView() : $user->getLastActivity();
        return $this->repository->createQueryBuilder()
                    ->field('unreadForParticipants')->equals($userId)
                    ->field('createdAt')->gt($lastReading)
                    ->getQuery()
                    ->count()
                    ;
    }

    /**
     * Marks the readable as read by this participant
     * Must be applied directly to the storage,
     * without modifying the readable state.
     * We want to show the unread readables on the page,
     * as well as marking the as read.
     *
     * @param ReadableInterface $readable
     * @param ParticipantInterface $participant
     */
    public function markAsReadByParticipant(ReadableInterface $readable, ParticipantInterface $participant)
    {
        return $this->markIsReadByParticipant($readable, $participant, true);
    }

    /**
     * Marks the readable as unread by this participant
     *
     * @param ReadableInterface $readable
     * @param ParticipantInterface $participant
     */
    public function markAsUnreadByParticipant(ReadableInterface $readable, ParticipantInterface $participant)
    {
        return $this->markIsReadByParticipant($readable, $participant, false);
    }

    /**
     * Marks all messages of this thread as read by this participant
     *
     * @param ThreadInterface $thread
     * @param ParticipantInterface $participant
     * @param boolean $isRead
     */
    public function markIsReadByThreadAndParticipant(Thread $thread, ParticipantInterface $participant, $isRead)
    {
        $this->markIsReadByCondition($participant, $isRead, function(Builder $queryBuilder) use ($thread) {
            $queryBuilder->field('thread.$id')->equals(new \MongoId($thread->getId()));
        });
    }

    /**
     * Marks the message as read or unread by this participant
     *
     * @param MessageInterface $message
     * @param ParticipantInterface $participant
     * @param boolean $isRead
     */
    protected function markIsReadByParticipant(Message $message, ParticipantInterface $participant, $isRead)
    {
        $this->markIsReadByCondition($participant, $isRead, function(Builder $queryBuilder) use ($message) {
            $queryBuilder->field('_id')->equals(new \MongoId($message->getId()));
        });
    }

    /**
     * Marks messages as read/unread
     * by updating directly the storage
     *
     * @param ParticipantInterface $participant
     * @param boolean $isRead
     * @param \Closure $condition
     */
    protected function markIsReadByCondition(ParticipantInterface $participant, $isRead, \Closure $condition)
    {
        $queryBuilder = $this->repository->createQueryBuilder();
        $condition($queryBuilder);
        $queryBuilder->update()
            ->field('metadata.participant.$id')->equals(new \MongoId($participant->getId()));

        /* If marking the message as read for a participant, we should pull
         * their ID out of the unreadForParticipants array. The same is not
         * true for the inverse. We should only add a participant ID to this
         * array if the message is not considered spam.
         */
        if ($isRead) {
            $queryBuilder->field('unreadForParticipants')->pull($participant->getId());
        }

        $queryBuilder
            ->field('metadata.$.isRead')->set((boolean) $isRead)
            ->getQuery(array('multiple' => true))
            ->execute();

        /* If marking the message as unread for a participant, add their ID to
         * the unreadForParticipants array if the message is not spam. This must
         * be done in a separate query, since the criteria is more selective.
         */
        if (!$isRead) {
            $queryBuilder = $this->repository->createQueryBuilder();
            $condition($queryBuilder);
            $queryBuilder->update()
                ->field('metadata.participant.$id')->equals(new \MongoId($participant->getId()))
                ->field('isSpam')->equals(false)
                ->field('unreadForParticipants')->addToSet($participant->getId())
                ->getQuery(array('multiple' => true))
                ->execute();
        }
    }

    /**
     * Saves a message
     *
     * @param MessageInterface $message
     * @param Boolean $andFlush Whether to flush the changes (default true)
     */
    public function saveMessage(Message $message, $andFlush = true)
    {
        $message->denormalize();
        /*
         * manage file upload for message using ajax oneup_uploader
         */
        $this->dm->persist($message);
        if ($andFlush) {
             $this->dm->flush($message->getThread());
        }
    }

    /**
     * Returns the fully qualified comment thread class name
     *
     * @return string
     */
    public function getClass()
    {
        return $this->class;
    }

    /**
     * Creates a new MessageMetadata instance
     *
     * @return MessageMetadata
     */
    protected function createMessageMetadata()
    {
        return new $this->metaClass();
    }

    /**
     * DENORMALIZATION
     * All following methods are relative to denormalization
     */

    /**
     * Performs denormalization tricks
     *
     * @param Message $message
     */
    public function denormalize(Message $message)
    {
        $this->doEnsureMessageMetadataExists($message);
        $message->denormalize();
    }

    /**
     * Ensures that the message has metadata for each thread participant
     *
     * @param Message $message
     */
    protected function doEnsureMessageMetadataExists(Message $message)
    {
        if (!$thread = $message->getThread()) {
            throw new \InvalidArgumentException(sprintf('No thread is referenced in message with id "%s"', $message->getId()));
        }

        foreach ($thread->getParticipants() as $participant) {
            ///set last thread for participant
            $participant->setLastThreadActivity($thread->getId());

            if (!$meta = $message->getMetadataForParticipant($participant)) {
                $meta = $this->createMessageMetadata();
                $meta->setParticipant($participant);
                $message->addMetadata($meta);
            }
        }
    }

    /**
     * Tells how many unread, non-spam, messages this participant has
     *
     * @param ParticipantInterface $participant
     * @return int the number of unread messages
     */
    public function getMessagesByThreadId($threadId, $initIds= [], $limit=15)
    {
        return $this->repository->createQueryBuilder()
            ->field('thread.$id')->equals(new \MongoId($threadId))
            ->field('thread.$id')->notIn($initIds)
            ->sort('createdAt', 'desc')
            ->limit($limit)
            ->getQuery()
            ->execute();
    }

    /**
     * Gets the current authenticated user
     * @see::OPMEssageBundle participantprovider
     * @return ParticipantInterface
     */
    protected function getAuthenticatedUser()
    {
        return $this->userProvider->getHydratedUser();
    }

}
