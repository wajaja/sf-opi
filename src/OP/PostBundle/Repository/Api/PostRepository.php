<?php

namespace OP\PostBundle\Repository\Api;

use Doctrine\ODM\MongoDB\DocumentRepository;

/**
 * This part of postRepository contains all queries hydrate to false
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class PostRepository extends DocumentRepository
{
    public function apiFindEarlyPost() {
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
}
