<?php

namespace OP\MediaBundle\Repository;

use Doctrine\ODM\MongoDB\DocumentRepository,
    OP\UserBundle\Document\User;

/**
 * ImageRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class ImageRepository extends DocumentRepository
{
    
    public function findPhotoById($id){
        $qb = $this->createQueryBuilder('OP\MediaBundle\Document\Image');
        $qb->field('id')->equals(new \MongoId($id))
           ->hydrate(false)
           ->limit(1);
        $photo = $qb->getQuery()
                    ->execute()
                    ->getSingleResult();
        return $photo;
    }

    public function findImageByPath($path) {
        $qb = $this->createQueryBuilder('OP\MediaBundle\Document\Image');
        $qb->field('path')->equals($path)
           ->hydrate(false)
           ->limit(1);
        $photo = $qb->getQuery()->execute()->getSingleResult();
        return $photo;
    }

    public function findTenImagesForUserId($userId){
        $qb = $this->createQueryBuilder('OP\MediaBundle\Document\Image');
        $qb->field('author.$id')->equals(new \MongoId($userId))
           ->sort('createdAt', 'DESC')
           ->select('id', 'path', 'directory')
           ->hydrate(false)
           ->limit(9);
        $pictures = $qb->getQuery()
                       ->execute()
                       ->toArray();
        return $pictures;
    }

    public function loadImages(User $user, $page, $limit){
        $qb = $this->createQueryBuilder('OP\MediaBundle\Document\Image');
        $qb->field('author.$id')->equals(new \MongoId($user->getId()))
            //or identifyd by......
            // ->field('published')->equals(true)
            ->sort('createdAt', 'DESC')
            ->field('directory')->equals('gallerypost')
            ->select('id', 'path', 'directory')
            ->hydrate(false)
            ->limit($limit);
            
        $pictures = $qb->getQuery()
                       ->execute()
                       ->toArray();
        return $pictures;
    }

    public function loadOrphansImages(User $user, $page, $limit){
        $qb = $this->createQueryBuilder('OP\MediaBundle\Document\Image');
        $qb->field('author.$id')->equals(new \MongoId($user->getId()))
            //or identifyd by......
            // ->field('published')->equals(true) //not published
            ->sort('createdAt', 'DESC')
            ->select('id', 'path', 'directory')
            ->hydrate(false)
            ->limit($limit);
            
        $pictures = $qb->getQuery()
                       ->execute()
                       ->toArray();
        return $pictures;
    }

}