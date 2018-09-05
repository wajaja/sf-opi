<?php

namespace OP\UserBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository;

/**
 * RefreshTokenRepository.
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class JwtRefreshTokenRepository extends DocumentRepository
{
    public function findInvalid($datetime = null)
    {
        $datetime = (null === $datetime) ? new \DateTime() : $datetime;

        // return $this->createQueryBuilder('\OP\UserBundle\Document\JWTRefreshToken')
        //     ->where('u.valid < :datetime')
        //     ->setParameter(':datetime', $datetime)
        //     ->getQuery()
        //     ->getResult();
    }
}
