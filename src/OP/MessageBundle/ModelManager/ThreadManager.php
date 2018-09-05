<?php

namespace OP\MessageBundle\ModelManager;

use OP\MessageBundle\Document\Thread,
    Doctrine\ODM\MongoDB\Query\Builder,
    Doctrine\ODM\MongoDB\DocumentManager,
    OP\MessageBundle\Model\ThreadInterface,
    OP\MessageBundle\Model\ReadableInterface,
    OP\MessageBundle\Model\ParticipantInterface,
    OP\MessageBundle\ModelManager\ThreadManager as BaseThreadManager;

/**
 * Abstract Thread Manager implementation which can be used as base class by your
 * concrete manager.
 */
abstract class ThreadManager implements ThreadManagerInterface
{
    /**
     * Creates an empty comment thread instance
     *
     * @return ThreadInterface
     */
    public function createThread()
    {
        $thread = new Thread();

        return $thread;
    }

     /**
     * Finds a thread by its ID
     *
     * @return ThreadInterface or null
     */
    public function findThreadById($id)
    {
        return $this->repository->createQueryBuilder()
            ->field('id')->equals(new \MongoId($id))
            ->getQuery()
            ->execute()
            ->getSingleResult()
            ;
    }

    /**
     * Finds not deleted, non-spam threads for a participant,
     * containing at least one message not written by this participant,
     * ordered by last message not written by this participant in reverse order.
     * In one word: an inbox.
     *
     * @param ParticipantInterface $participant
     * @return Builder a query builder suitable for pagination
     */
    public function getParticipantInboxThreadsQueryBuilder(ParticipantInterface $participant)
    {
        return $this->repository->createQueryBuilder()
            ->field('activeRecipients')->equals($participant->getId())
            /* TODO: Sort by date of the last message written by another
             * participant, as is done for ORM. This is not possible with the
             * current schema; compromise by sorting by last message date.
             */
            ->sort('lastMessageDate', 'desc');
    }

    /**
     * Finds not deleted, non-spam threads for a participant,
     * containing at least one message not written by this participant,
     * ordered by last message not written by this participant in reverse order.
     * In one word: an inbox.
     *
     * @param ParticipantInterface $participant
     * @return array of ThreadInterface
     */
    public function countUnseenThreads(ParticipantInterface $participant, $lastReadingDate)
    {
        $qb = $this->repository->createQueryBuilder()
//                ->hydrate(false)
                ->field('activeParticipants')->equals($participant->getId())
                ->field('lastMessageDate')->gt($lastReadingDate)
                ;

            $threads = $qb->getQuery()
                            ->execute()->toArray();
            return count($threads);
    }

    /**
     * Finds not deleted, non-spam threads for a participant,
     * containing at least one message not written by this participant,
     * ordered by last message not written by this participant in reverse order.
     * In one word: an inbox.
     *
     * @param ParticipantInterface $participant
     * @return array of ThreadInterface
     */
    public function findParticipantInboxThreadsIds(ParticipantInterface $participant)
    {
        $qb = $this->repository->createQueryBuilder()
                ->field('activeParticipants')->equals($participant->getId())
                ->hydrate(false)
                ->select('id')
                ;

            $threads = $qb->getQuery()->execute()->toArray();

            if(!$threads) return [];

            return  array_keys($threads);
    }

    /**
     * Finds not deleted, non-spam threads for a participant,
     * containing at least one message not written by this participant,
     * ordered by last message not written by this participant in reverse order.
     * In one word: an inbox.
     *
     * @param ParticipantInterface $participant
     * @return array of ThreadInterface
     */
    public function findParticipantInboxThreads(ParticipantInterface $participant, $limit=10, $page = 1)
    {
        $qb = $this->repository->createQueryBuilder()
                // ->hydrate(false)
                ->limit($limit)
                // ->field('messages')->prime(true) //TODO::to be fixed
                // ->field('id')->notIn($initIds)
                ->field('activeParticipants')->equals($participant->getId())
                ->selectSlice('messages', -10, 10)  //select 10 last message
                /* TODO: Sort by date of the last message written by another
                 * participant, as is done for ORM. This is not possible with the
                 * current schema; compromise by sorting by last message date.
                 */
                ->sort('lastMessageDate', 'desc');

            $threads = $qb->getQuery()
                            ->execute()->toArray();
            return $threads;
    }

    /**
     * Finds not deleted, non-spam threads for a participant,
     * containing at least one message not written by this participant,
     * ordered by last message not written by this participant in reverse order.
     * In one word: an inbox.
     *
     * @param ParticipantInterface $participant
     * @return array of ThreadInterface
     */
    public function findChatIdForTwo(array $userIds=[])
    {
        $where = "function() { return this.participants && this.participants.length === 2; }";

        $qb = $this->repository->createQueryBuilder()
                ->field('activeParticipants')->equals($userIds[0])
                ->field('participants')->where($where)  //
                ->hydrate(false)
                ->select('id')
                ->limit(1)
                /////Using JavaScript for this is really slow. You should prefer "pure" QueryBuilder:
                // ->field('participants')->exists(true)
                // ->not($qb->expr()->size(1));
                ;
        $qb->addAnd($qb->expr()->field('activeParticipants')->equals($userIds[1]));

        $thread = $qb->getQuery()->execute()->getSingleResult();

        return $thread ? (string)$thread['_id'] : null;
    }

    /**
     * Finds not deleted threads from a participant,
     * containing at least one message written by this participant,
     * ordered by last message written by this participant in reverse order.
     * In one word: an sentbox.
     *
     * @param ParticipantInterface $participant
     * @return Builder a query builder suitable for pagination
     */
    public function getParticipantSentThreadsQueryBuilder(ParticipantInterface $participant)
    {
        return $this->repository->createQueryBuilder()
            ->field('activeSenders')->in(array($participant->getId()))
            /* TODO: Sort by date of the last message written by this
             * participant, as is done for ORM. This is not possible with the
             * current schema; compromise by sorting by last message date.
             */
            ->sort('lastMessageDate', 'desc');
    }

    /**
     * Finds not deleted threads from a participant,
     * containing at least one message written by this participant,
     * ordered by last message written by this participant in reverse order.
     * In one word: an sentbox.
     *
     * @param ParticipantInterface $participant
     * @return array of ThreadInterface
     */
    public function findParticipantSentThreads(ParticipantInterface $participant)
    {
        return $this->getParticipantSentThreadsQueryBuilder($participant)->getQuery()->execute();
    }

    /**
     * {@inheritDoc}
     */
    public function getParticipantDeletedThreadsQueryBuilder(ParticipantInterface $participant)
    {
        return $this->repository->createQueryBuilder()
            ->field('metadata.isDeleted')->equals(true)
            ->field('metadata.participantId')->equals($participant->getId())
            ->sort('lastMessageDate', 'desc');
    }

    /**
     * {@inheritDoc}
     */
    public function findParticipantDeletedThreads(ParticipantInterface $participant)
    {
        return $this->getParticipantDeletedThreadsQueryBuilder($participant)->getQuery()->execute();
    }

    /**
     * Finds not deleted threads for a participant,
     * matching the given search term
     * ordered by last message not written by this participant in reverse order.
     *
     * @param ParticipantInterface $participant
     * @param string $search
     * @return Builder a query builder suitable for pagination
     */
    public function getParticipantThreadsBySearchQueryBuilder(ParticipantInterface $participant, $search)
    {
        // remove all non-word chars
        $search = preg_replace('/[^\w]/', ' ', trim($search));
        // build a regex like (term1|term2)
        $regex = sprintf('/(%s)/', implode('|', explode(' ', $search)));

        return $this->repository->createQueryBuilder()
            ->field('activeParticipants')->equals($participant->getId())
            // Note: This query is not anchored, so "keywords" need not be indexed
            ->field('keywords')->equals(new \MongoRegex($regex))
            /* TODO: Sort by date of the last message written by this
             * participant, as is done for ORM. This is not possible with the
             * current schema; compromise by sorting by last message date.
             */
            ->sort('lastMessageDate', 'desc');
    }

    /**
     * Finds not deleted threads for a participant,
     * matching the given search term
     * ordered by last message not written by this participant in reverse order.
     *
     * @param ParticipantInterface $participant
     * @param string $search
     * @return array of ThreadInterface
     */
    public function findParticipantThreadsBySearch(participantinterface $participant, $search)
    {
        return $this->getParticipantThreadsBySearchQueryBuilder($participant, $search)->getQuery()->execute();
    }

    /**
     * Gets threads created by a participant
     *
     * @param ParticipantInterface $participant
     * @return array of ThreadInterface
     */
    public function findThreadsCreatedBy(ParticipantInterface $participant)
    {
        return $this->repository->createQueryBuilder()
            ->field('createdBy.$id')->equals(new \MongoId($participant->getId()))
            ->getQuery()
            ->execute();
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
        return $this->messageManager->markIsReadByThreadAndParticipant($readable, $participant, true);
    }

    /**
     * Marks the readable as unread by this participant
     *
     * @param ReadableInterface $readable
     * @param ParticipantInterface $participant
     */
    public function markAsUnreadByParticipant(ReadableInterface $readable, ParticipantInterface $participant)
    {
        return $this->messageManager->markIsReadByThreadAndParticipant($readable, $participant, false);
    }

    /**
     * Saves a thread
     *
     * @param ThreadInterface $thread
     * @param Boolean $andFlush Whether to flush the changes (default true)
     */
    public function saveThread(ThreadInterface $thread, $andFlush = true)
    {
        $this->denormalize($thread);
        $this->dm->persist($thread);

        if ($andFlush) {
            $this->dm->flush();
        }else{
            $threadId = $thread->getId();
            $participants = $thread->getParticipants();
            foreach ($participants as $participant) {
                $thread->addParticipant($participant);
            }
        }
    }

    /**
     * Deletes a thread
     * This is not participant deletion but real deletion
     *
     * @param ThreadInterface $thread the thread to delete
     */
    public function deleteThread(ThreadInterface $thread)
    {
        $this->dm->remove($thread);
        $this->dm->flush();
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
     * Creates a new ThreadMetadata instance
     *
     * @return ThreadMetadata
     */
    protected function createThreadMetadata()
    {
        return new $this->metaClass();
    }

    /**
     * DENORMALIZATION
     *
     * All following methods are relative to denormalization
     */

    /**
     * Performs denormalization tricks
     *
     * @param Thread $thread
     */
    protected function denormalize(Thread $thread)
    {
        $this->doParticipants($thread);
        $this->doEnsureThreadMetadataExists($thread);
        $thread->denormalize();

        foreach ($thread->getMessages() as $message) {
            $this->messageManager->denormalize($message);
        }
    }

    /**
     * Ensures that the thread participants are up to date
     */
    protected function doParticipants(Thread $thread)
    {
        foreach ($thread->getMessages() as $message) {
            $thread->addParticipant($message->getSender());
        }
    }

    /**
     * Ensures that metadata exists for each thread participant and that the
     * last message dates are current
     *
     * @param Thread $thread
     */
    protected function doEnsureThreadMetadataExists(Thread $thread)
    {
        foreach ($thread->getParticipants() as $participant) {
            if (!$meta = $thread->getMetadataForParticipant($participant)) {
                $meta = $this->createThreadMetadata();
                $meta->setParticipant($participant);
                $thread->addMetadata($meta);
            }
        }
    }
}
