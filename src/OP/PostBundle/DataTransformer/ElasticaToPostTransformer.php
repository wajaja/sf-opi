<?php

/*
 * This file is part of the FOSElasticaBundle package.
 *
 * (c) FriendsOfSymfony <http://friendsofsymfony.github.com/>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace OP\PostBundle\DataTransformer;

use FOS\ElasticaBundle\Doctrine\AbstractElasticaToModelTransformer,
    Doctrine\Common\Persistence\ManagerRegistry,
    Doctrine\ODM\MongoDB\DocumentManager,
    OP\UserBundle\Security\UserProvider;

/**
 * Maps Elastica documents with Doctrine objects
 * This mapper assumes an exact match between
 * elastica documents ids and doctrine object ids.
 */
class ElasticaToPostTransformer extends AbstractElasticaToModelTransformer
{

    protected $dm, $userProvider, $postTransformer;

    /**
     * Instantiates a new Mapper.
     *
     * @param ManagerRegistry $registry
     * @param string          $objectClass
     * @param array           $options
     */
    public function __construct(ManagerRegistry $registry, $objectClass, DocumentManager $dm, UserProvider $userProvider, ToArrayTransformer $transformer, array $options = [])
    {
        parent::__construct($registry, $objectClass, $options);
        $this->dm            = $dm;
        $this->userProvider  = $userProvider;
        $this->postTransformer = $transformer;
    }



    /**
     * Fetch objects for theses identifier values.
     *
     * @param array $identifierValues ids values
     * @param bool  $hydrate          whether or not to hydrate the objects, false returns arrays
     *
     * @return array of objects or arrays
     */
    protected function findByIdentifiers(array $identifierValues, $hydrate) : array {

        if(empty($identifierValues))
            return array();
    
        $posts   = $this->dm->getRepository('OPPostBundle:Post')
                        ->load($identifierValues);
        return $this->postTransformer->postsToArray($posts);
    }

    /**
     * Transforms an array of elastica objects into an array of
     * model objects fetched from the doctrine repository.
     *
     * @param array $elasticaObjects of elastica objects
     *
     * @throws \RuntimeException
     *
     * @return array
     **/
    public function transform(array $elasticaObjects)
    {
        $ids = $highlights = [];
        foreach ($elasticaObjects as $elasticaObject) {
            $ids[] = $elasticaObject->getId();
            $highlights[$elasticaObject->getId()] = $elasticaObject->getHighlights();
        }

        $objects = $this->findByIdentifiers($ids, $this->options['hydrate']);

        $propertyAccessor = $this->propertyAccessor;
        $identifier = $this->options['identifier'];

        $idPos = array_flip($ids);
        usort($objects,  function ($a, $b) use ($idPos, $identifier, $propertyAccessor) {
                return $idPos[$a[$identifier]] > $idPos[$b[$identifier]];
            }
        );

        return $objects;  //transformed data array
    }

    /**
     * Gets the current authenticated user
     * @see::OPMEssageBundle participantprovider
     * @return ParticipantInterface
     */
    protected function getUser()
    {
        return $this->userProvider->getHydratedUser();
    }
}
