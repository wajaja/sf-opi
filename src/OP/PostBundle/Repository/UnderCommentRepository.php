<?php

namespace OP\PostBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

/**
 * UnderCommentRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class UnderCommentRepository extends DocumentRepository
{
    public function countForCommentId($id){        
        $qb = $this->createQueryBuilder('\OP\PostBundle\Document\UnderComment');
        $qb ->hydrate(false)
            ->field('comment.$id')->equals(new \MongoId($id)); 
        
        $number = $qb->getQuery()->execute()->toArray();
        return count($number);
    }

    public function findUnderIds($id){        
        $qb = $this->createQueryBuilder('\OP\PostBundle\Document\UnderComment');
        $qb ->hydrate(false)
            ->field('comment.$id')->equals(new \MongoId($id))
            ->select('_id');
            
        $ids = $qb->getQuery()
                  ->execute()
                  ->toArray();
        return $ids;
    }
    
    public function allReplyForCommentId($id){        
        $qb = $this->createQueryBuilder('\OP\PostBundle\Document\UnderComment');
        $qb ->field('comment.$id')->equals(new \MongoId($id));   
        
        $reply = $qb->getQuery()->execute()->toArray();
        return $reply;
    }
    
    /**
     * get ten comment reply if itn't xmlHttpRequest
     * @param type $commentId
     * @return type
     */
    public function loadTenUnderComments($commentId, $userId){        
        $qb = $this->createQueryBuilder('\OP\PostBundle\Document\UnderComment');
        $qb ->field('commentId.$id')->equals(new \MongoId($commentId))
            ->hydrate(false)
            ->limit(10);

        $comments = $qb->getQuery()->execute()->toArray();  
        return $comments;
    }
    
    /**
     * get All  under Comment if it's XmlHttpRequest
     * @param type $commentId
     * @return type
     */
    public function xhrUnderComments($commentId){             //for ajax load more comment
        $qb = $this->createQueryBuilder('\OP\PostBundle\Document\UnderComment');
        $qb ->field('comment.$id')->equals(new \MongoId($commentId));

        $comments = $qb->getQuery()->execute()->toArray();  
        return $comments;
    }
}