<?php

namespace OP\SocialBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

/**
 * SearchRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class SearchRepository extends DocumentRepository
{
	public function findByUserId($user_id) {
			die();
		$qb = $this->createQueryBuilder('\OP\SocialBundle\Document\Search')
			->hydrate(false)
		    ->field('user.$id')->equals(new \MongoId($user_id))
			->select('search');

		$notifs = $qb->getQuery()
					->execute()
					->getSingleResult();
		return $notifs;
	}
}