<?php

namespace OP\PostBundle\Repository;

use OP\UserBundle\Document\User,
    Doctrine\ODM\MongoDB\DocumentRepository;

/**
 * ClikeRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class LikeRepository extends DocumentRepository
{
    public function findCommentLiker($id, $user_id){
        $qb = $this->createQueryBuilder('\OP\PostBundle\Document\Like');
        $qb 
            ->field('author.$id')->equals(new \MongoId($user_id))
            ->field('comment.$id')->equals(new \MongoId($id))
            ->hydrate(false)
            ;
        $like = $qb->getQuery()
                ->execute()
                ->getSingleResult();
        return $like;
    }

    public function findPostLiker($id, $user_id){
        $qb = $this->createQueryBuilder('\OP\PostBundle\Document\Like');
        $qb 
            ->field('author.$id')->equals(new \MongoId($user_id))
            ->field('post.$id')->equals(new \MongoId($id))
            ->hydrate(false)
            ;
        $like = $qb->getQuery()
                ->execute()
                ->getSingleResult();
        return $like;
    }

    public function findPhotoLiker($id, $user_id){
        $qb = $this->createQueryBuilder('\OP\PostBundle\Document\Like');
        $qb 
            ->field('author.$id')->equals(new \MongoId($user_id))
            ->field('image.$id')->equals(new \MongoId($id))
            ->hydrate(false)
            ;
        $like = $qb->getQuery()
                ->execute()
                ->getSingleResult();
        return $like;
    }

    public function findUnderCommentLiker($id, $user_id){
        $qb = $this->createQueryBuilder('\OP\PostBundle\Document\Like');
        $qb 
            ->field('author.$id')->equals(new \MongoId($user_id))
            ->field('undercomment.$id')->equals(new \MongoId($id))
            ->hydrate(false)
            ;
        $like = $qb->getQuery()
                ->execute()
                ->getSingleResult();
        return $like;
    }
    
    public function findLikeForUserId($user, $comment){
        $qb = $this->createQueryBuilder('\OP\PostBundle\Document\Like');
        $qb ->field('author')->references($user)
            ->field('comment')->references($comment);
        $clike = $qb->getQuery()->execute()->getSingleResult();
        return $clike;
    }

    public function findLikeByRefId($refId, $type, User $user) {
        $qb = $this->createQueryBuilder('\OP\PostBundle\Document\Like');
        $qb ->field('refValid')->equals($refId)
            ->field('author')->references($user)
            ->field('type')->equals($type);

        $like = $qb->getQuery()
                   ->execute()
                   ->getSingleResult();
        return $like;
    }
}