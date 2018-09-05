<?php

namespace OP\PostBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

/**
 * PlikeRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class RateRepository extends DocumentRepository
{
    public function findRate($post_id, $user_id){
        $qb = $this->createQueryBuilder('\OP\PostBundle\Document\Rate');
        $qb 
            ->field('author.$id')->equals(new \MongoId($user_id))
            ->field('post.$id')->equals(new \MongoId($post_id))
            ->hydrate(false)
            ;
        $rate = $qb->getQuery()
                ->execute()
                ->getSingleResult();
        return $rate;
    }
    
    public function findLikeForUserId($user, $post){
        $qb = $this->createQueryBuilder('\OP\PostBundle\Document\Plike');
        $qb ->field('author')->references($user)
            ->field('postId')->references($post);
        $plike = $qb->getQuery()->execute()->getSingleResult();
        return $plike;
    }
    
    public function findListPlikeForPostId($post){
        $qb = $this->createQueryBuilder('\OP\PostBundle\Document\Plike');
        $qb ->field('postId')->references($post);
        $plikes = $qb->getQuery()
                     ->execute()
                     ->toArray();
        return $plikes;
    }

    public function findPostLiker($postId, $userId){
        $qb = $this->createQueryBuilder('\OP\PostBundle\Document\Rate');
        $qb 
            ->field('author.$id')->equals(new \MongoId($userId))
            ->field('post.$id')->equals(new \MongoId($postId))
            ;
        $rate = $qb->getQuery()
                ->execute()
                ->getSingleResult();
        return $rate;
    }

    public function findLeftLiker($postId, $userId) {
        $qb = $this->createQueryBuilder('\OP\PostBundle\Document\Rate');
        $qb 
            ->field('author.$id')->equals(new \MongoId($user_id))
            ->field('leftcomment.$id')->equals(new \MongoId($postId))
            ;
        $rate = $qb->getQuery()
                ->execute()
                ->getSingleResult();
        return $rate;
    }

    public function findRightLiker($postId, $userId) {
        $qb = $this->createQueryBuilder('\OP\PostBundle\Document\Rate');
        $qb 
            ->field('author.$id')->equals(new \MongoId($user_id))
            ->field('rightcomment.$id')->equals(new \MongoId($postId))
            ;
        $rate = $qb->getQuery()
                ->execute()
                ->getSingleResult();
        return $rate;
    }
}