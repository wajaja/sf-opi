<?php

namespace OP\UserBundle\Repository;

use OP\UserBundle\Document\User,
    Doctrine\ODM\MongoDB\DocumentRepository;

/**
 * InvitationRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class InvitationRepository extends DocumentRepository
{

    /**
     * Count number of unseen invitations at notifications section
     * 
     * @param [ParticipantInterface $participant, $lastReadingDate] 
     * @return number of threads
     */
    public function countAlerts($userId, $lastReadingDate)
    {
        $qb = $this->createQueryBuilder('\OP\UserBundle\Document\Invitation\Invitation');
        $qb ->field('receiver.$id')->equals(new \MongoId($userId))
            ->field('metadata.isConfirmed')->equals(false)
            ->field('metadata.isMasked')->equals(false)
            ->field('sendingDate')->gt($lastReadingDate)
            ->select('sender', 'sendingDate');

        $invitations = $qb->getQuery()
                         ->execute()->toArray();
        return 2;
    }

    public function loadInvitations($user, $initIds, $limit) {
        $qb = $this->createQueryBuilder('OP\SocialBundle\Document\Invitation\Invitation');
        $qb 
            // ->field('receiver.$id')->equals(new \MongoId($user->getId()))
            ->field('id')->notIn($initIds)
            ->field('metadata.isConfirmed')->equals(false)
            ->limit($limit)
            // ->field('metadata.isMasked')->equals(false)
            // ->field('unreadForParticipants')->equals($userId)
            // ->select('lastParticipantActivityDate')
            // ->hydrate(false)
            ;
        
        $datas = $qb->getQuery()
                    ->execute()
                    ->toArray();
        return $datas;    
    }

    public function findUserInvitations($user_id, $isConfirmed){
        $qb = $this->createQueryBuilder('\OP\UserBundle\Document\Invitation\Invitation');
        $qb //->field('receiver.id')->equals($user_id)
            ->field('metadata.isConfirmed')->equals(false)
            ->field('metadata.isMasked')->equals(false)
            ->select('sender', 'sendingDate');

        $invitations = $qb->getQuery()
                         ->execute()->toArray();
        return $invitations;
    }
    
    public function findRelatedInvitations($user_id, $isConfirmed){
        $qb = $this->createQueryBuilder('\OP\UserBundle\Document\Invitation\Invitation');
        $qb ->field('metadata.isConfirmed')->equals(false)
            ->field('metadata.isMasked')->equals(false)
            ->select('receiver', 'sender');

        $invitations = $qb->getQuery()
                         ->execute()->toArray();
        return $invitations;
    }

    public function findRequestInvitations($user_id, $isConfirmed) {
        $qb = $this->createQueryBuilder('\OP\UserBundle\Document\Invitation\Invitation');
        $qb ->field('metadata.isConfirmed')->equals(false)
            ->field('metadata.isMasked')->equals(false)
            ->field('receiver.$id')->equals(new \MongoId($user_id))
            ->hydrate(false)
            ;

        $i = $qb->getQuery()->execute()->toArray();
        return $i;
    }
    
    public function confirmInvitation($sender, $receiver){
        $qb = $this->createQueryBuilder('\OP\UserBundle\Document\Invitation\Invitation');
        $qb ->findAndUpdate()
            ->field('metadata.isMasked')->equals(false)
            ->field('metadata.isConfirmed')->set(true)
            ->field('receiver.$id')->equals(new \MongoId($receiver->getId()))
            ->field('sender.$id')->equals(new \MongoId($sender->getId()))
            ;           

        $qb->getQuery()->execute();
        return true;
    }

    public function deleteInvitation($sender, $receiver){
        $qb = $this->createQueryBuilder('\OP\UserBundle\Document\Invitation\Invitation');
        $qb ->findAndRemove()
            ->field('metadata.isDeleted')->equals(true)
            ->field('metadata.isMasked')->equals(false)
            ->field('metadata.isConfirmed')->set(false)
            ->field('receiver.$id')->equals(new \MongoId($receiver->getId()))
            ->field('sender.$id')->equals(new \MongoId($sender->getId()))
            ;     

        $invitation = $qb->getQuery()->execute();
        return $invitation;
    }

    public function findInvitationByUsers($sender, $receiver){
        $qb = $this->createQueryBuilder('\OP\UserBundle\Document\Invitation\Invitation');
        $qb 
            // ->field('sender')->equals($sender)
            // ->field('receiver')->equals($receiver)
            ->field('metadata.isDeleted')->equals(false)
            ->field('receiver.$id')->equals(new \MongoId($receiver->getId()))
            ->field('sender.$id')->equals(new \MongoId($sender->getId()))
            ;   

        $invitation = $qb->getQuery()->execute()->getSingleResult();
        return $invitation;
    }

    public function getMaskedInvitationsForUser(){

    }

    public function getDeletedInvitationsForUser(){

    }
}
