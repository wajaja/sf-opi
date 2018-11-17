<?php

namespace OP\PostBundle\Elastica;

use FOS\ElasticaBundle\Repository;

class PostRepository extends Repository
{

    /**
     * Used by Elastica to transform results to model
     * 
     * @param string $entityAlias
     * @return  Doctrine\ORM\QueryBuilder
     */
    public function createSearchQueryBuilder($entityAlias)
    {

        $qb = $this->createQueryBuilder($entityAlias);
        
        // $qb->select($entityAlias, 'g')
        //     ->innerJoin($entityAlias.'.groups', 'g');
            
        return $qb;
    }



    public function getQueryForSearch(User $user)
    {
        $criteria = $user->getCriteria();
        // nous créons une requête 
        // mais si le critèria est spécifié dans le param, nous l'utilisons
        $boolQuery = $this->$criteria($user);

        // puis nous créons les filtres selon les critères choisis
        // $boolQuery = new \Elastica\Query\Bool();
        // $boolQuery->addMust($query);

        /*
            Filtre dates
            Nous ajoutons ce filtre seulement si le filtre ispublished n'est pas à "false"
        */
        // $boolQuery->addMust(new \Elastica\Query\Range('publishedAt',
        //     array(
        //         'gte' => \Elastica\Util::convertDate($user->getDateFrom()->getTimestamp()),
        //         'lte' => \Elastica\Util::convertDate($user->getDateTo()->getTimestamp())
        //     )
        // ));

        // Filtre enabled
        // $boolQuery->addMust(
        //     new \Elastica\Query\Terms('enabled', array(true))
        // );

        $query = new \Elastica\Query($boolQuery);
        //sorting by lastActivity date
        // $query->setSort(array(
        //     $user->getSort() => array(
        //         'order' => $user->getDirection()
        //     )
        // ));

        return $query;
    }

    public function search(User $user)
    {
        $query = $this->getQueryForSearch($user);
        // var_dump($query);
        // die();

        return $this->find($query);  //search
    }

    protected function all($user) {
        $q = $user->getQuery();
        $boolQuery = new \Elastica\Query\BoolQuery();
        $query = new \Elastica\Query\MatchAll();
        $boolQuery->addMust($query);
        return $boolQuery;
    }

    protected function name($user) {
        $q = $user->getQuery();
        $q_first = new \Elastica\Query\Term();
        $q_first->setTerm('user.firstname', $q);
        // $q_first->setFieldFuzziness('user.firstname', 0.7);
        // $q_first->setFieldMinimumShouldMatch('user.firstname', '80%');

        $q_last = new \Elastica\Query\Match();
        $q_last->setFieldQuery('user.lastname', $q);
        // $q_last->setFieldFuzziness('user.lastname', 0.7);
        // $q_last->setFieldMinimumShouldMatch('user.lastname', '80%');

        $q_nick = new \Elastica\Query\Match();
        $q_nick->setFieldQuery('user.nickname', $q);
        // $q_nick->setFieldFuzziness('user.nickname', 0.7);
        // $q_nick->setFieldMinimumShouldMatch('user.nickname', '80%');

        $boolQuery = new \Elastica\Query\BoolQuery();
        // echo "string";
        // die();
        $boolQuery->addShould($q_first);
        // $boolQuery->addShould($q_last);
        // $boolQuery->addShould($q_nick);

        return $boolQuery;
    }
 
    protected function email($user) {
        $q = $user->getQuery();
        $query = new \Elastica\Query\Match();
        $query->setFieldQuery('user.email', $q);
        $query->setFieldFuzziness('user.email', 0.7);
        $query->setFieldMinimumShouldMatch('user.email', '80%');

        $boolQuery = new \Elastica\Query\BoolQuery();
        $boolQuery->addMust($query);
        return $boolQuery;
    }

    protected function username($user) {
        $q = $user->getQuery();
        $query = new \Elastica\Query\Match();
        $query->setFieldQuery('user.username', $q);
        $query->setFieldFuzziness('user.username', 0.7);
        $query->setFieldMinimumShouldMatch('user.username', '80%');

        $boolQuery = new \Elastica\Query\BoolQuery();
        $boolQuery->addMust($query);
        return $boolQuery;
    }
}