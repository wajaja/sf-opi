<?php

namespace OP\MessageBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;
use OP\UserBundle\Document\User;

/**
 * QuestionRepository
 *
 * This class was generated by the Doctrine ODM. Add your own custom
 * repository methods below.
 */
class QuestionRepository extends DocumentRepository
{
    public function countPrivateQuestion($user_id, $post_id){
        $qb = $this->createQueryBuilder('\OP\MessageBundle\Document\Question');
        $qb ->field("postId.id")->equals($post_id)
            ->field("participants.id")->equals($user_id)
            ->hydrate(false)
            ;

        $questions = $qb->getQuery()
                        ->execute()
                        ->toArray();
        return count($questions);
    }
    
    public function countPublicQuestion($post_id){
        $qb = $this->createQueryBuilder('\OP\MessageBundle\Document\Question');
        $qb ->field("postId.id")->equals($post_id)
            ->hydrate(false)
            ;

        $questions = $qb->getQuery()
                        ->execute()
                        ->toArray();
        return count($questions);
    }

    public function simpleFindById($id){
        $qb = $this->createQueryBuilder('\OP\MessageBundle\Document\Question');
        $qb ->field('id')->equals(new \MongoId($id))
            ->limit(1)
            ->hydrate(false)
            ;

        $question = $qb->getQuery()
                       ->execute()
                       ->getSingleResult();
        return $question;
    }
    
    public function findQuestionForUser($postId, $userId, $refer){
        $qb = $this->createQueryBuilder('\OP\MessageBundle\Document\Question');
        if($refer === 'post') {
            $qb ->field("post.id")->equals($postId)

            ->field("createdBy.id")->equals($userId)
            ->limit(1)
            ->hydrate(false)
            ;
        } else {
            $qb ->field("photo.id")->equals($postId)

            ->field("createdBy.id")->equals($userId)
            ->limit(1)
            ->hydrate(false)
            ;
        }        

        $question = $qb->getQuery()
                       ->execute()
                       ->getSingleResult();
        return $question;
    }

    public function findQuestionsForAuthor($postId, $userId, $refer){
        $qb = $this->createQueryBuilder('\OP\MessageBundle\Document\Question');

        if($refer === 'post') {
            $qb ->field("post.id")->equals(new \MongoId($postId))
            // ->field("participants.id")->equals(new \MongoId($userId))
            ->hydrate(false)
            ;
        } else {
            $qb ->field("photo.id")->equals(new \MongoId($postId))
            // ->field("participants.id")->equals(new \MongoId($userId))
            ->hydrate(false)
            ;
        }        

        $questions = $qb->getQuery()
                        ->execute()
                        ->toArray();
        return $questions;
    }
}