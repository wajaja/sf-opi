<?php

namespace OP\UserBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

/**
 * DiaryRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class DevicesRepository extends DocumentRepository
{

	public function findUserDevices($user){
		// $qb = $this->createQueryBuilder('OP\UserBundle\Document\Diary');
  //       $qb 
  //           ->addAnd($qb->expr()->field('meetAt')->gte($fromDate))
  //           ->addAnd($qb->expr()->field('meetAt')->lte($toDate))
  //           ->field('createdBy.$id')->equals(new \MongoId($userId))
  //           ->field('subcriber_ids')->equals($userId)
  //           ->field('started')->equals(false)
  //           ->field('isRead')->equals(false)
  //           ->select('createdAt')
  //           ->hydrate(false)
  //           ;
        
  //       $d = $qb->getQuery()
  //                   ->execute()
  //                   ->toArray();
  //       return $d;    
	}
}