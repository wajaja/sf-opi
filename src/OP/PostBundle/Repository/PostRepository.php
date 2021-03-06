<?php

namespace OP\PostBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

/**
 * PostRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class PostRepository extends DocumentRepository
{
    private function qb()
    {
        return $this->createQueryBuilder('\OP\PostBundle\Document\Post');
    }
    
    public function findSimplePostById($id)
    {
        $qb = $this->qb();
        $qb ->field('id')->equals($id)            
            ->limit(1)
            ->hydrate(false);
        
        $post = $qb->getQuery()
                   ->execute()
                   ->getSingleResult();
        return $post;    
    }

    public function findRecentByAllie($id)
    {
        $qb = $this->qb();
        $qb ->field('mainAllie.id')->equals($id)            
            ->hydrate(false)
            ->sort('createdAt', 'desc')
            ->limit(1)
            ;
        
        $post = $qb->getQuery()
                   ->execute()
                   ->getSingleResult();
        return $post;    
    }

    public function findAllieByOrder($postId, $order)
    {
        $qb = $this->qb();
        $qb ->field('mainAllie.id')->equals($postId)
            ->field('opinionOrder')->equals($order)
            ->hydrate(false)
            ->sort('createdAt', 'desc')
            ->limit(1)
            ;
        
        $post = $qb->getQuery()
                   ->execute()
                   ->getSingleResult();
        return $post;    
    }

    public function findAlliesById($id)
    {
        $qb = $this->qb();
        $qb ->field('mainAllie.id')->equals($id)            
            ->hydrate(false)
            ->sort('createdAt', 'desc')
            ;
        
        $posts = $qb->getQuery()
                   ->execute()
                   ->toArray();
        return $posts;    
    }

    public function getPostForPhoto($id)
    {
        $qb = $this->qb();
        $qb ->field('id')->equals($id)            
            ->limit(1)
            ->select('content', 'images_ids')
            ->hydrate(false);
        
        $post = $qb->getQuery()
                   ->execute()
                   ->getSingleResult();
        return $post;    
    }


    public function findFriendsPosts($user_id, $friend_ids, $blocked_ids)
    {
       $qb = $this->qb();
        $qb ->sort('createdAt', 'desc')
            ->field('author.id')->in($friend_ids)
            ->field('author.id')->notIn($blocked_ids)
            ->field('author.id')->equals($user_id)           
            ->limit(3)
            ->hydrate(false)
            ;
        
        $posts = $qb->getQuery()
                    ->execute()->toArray();
        return $posts;    
    }
    
    public function findLastFive(){
        $qb = $this->createQueryBuilder('\OP\PostBundle\Document\Post');
        $qb ->sort('createdAt', 'desc')
            ->limit(3);
        //->field('receiver.id')->equals($user_id)
            // ->field('metadata.isConfirmed')->equals(false)
            // ->field('metadata.isMasked')->equals(false)
            // ->select('sender', 'sendingDate');
                // ->limit(5);

        $posts = $qb->getQuery()
                         ->execute()->toArray();
        return $posts;
    }


    public function singleFirstPosts(){
        $qb = $this->createQueryBuilder('\OP\PostBundle\Document\Post');
        $qb ->sort('createdAt', 'desc')
            ->hydrate(false)
            ->limit(3);
        //->field('receiver.id')->equals($user_id)
            // ->field('metadata.isConfirmed')->equals(false)
            // ->field('metadata.isMasked')->equals(false)
            // ->select('sender', 'sendingDate');
                // ->limit(5);

        $posts = $qb->getQuery()
                 ->execute()->toArray();
        return $posts;
    }

    public function findPostByDateForUserId($fromDate, $toDate, $id){
        $qb = $this->qb();
        $qb 
            ->addAnd($qb->expr()->field('createdAt')->gte($fromDate))
            ->addAnd($qb->expr()->field('createdAt')->lte($toDate))
            ->field('author.id')->equals($id)
            ->select('createdAt')
            ->hydrate(false)
            ;
        
        $posts = $qb->getQuery()
                    ->execute()
                    ->toArray();
        return $posts;    
    }
    
    public function findCposts($ids){
        $qb = $this->createQueryBuilder('\OP\PostBundle\Document\Post');
        $qb->field('id')->in($ids)
           ->hydrate(false)
           ;
        $posts = $qb->getQuery()
                    ->execute()
                    ->toArray();
        return $posts;
    }
}
