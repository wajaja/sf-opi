<?php

namespace OP\PostBundle\Elastica;

use OP\PostBundle\Model\PostSearch,
    Elastica\Query\BoolQuery,
    Elastica\Query\Match;

class QuerySearch
{

    public function getQueryForPost(PostSearch $post)
    {
        $criteria   = $post->getCriteria();
        $boolQuery  = $this->$criteria($post);

        /** TODO */
        // $rolesQuery = new \Elastica\Query\Terms();
        // $rolesQuery->setTerms('roles', array('ROLE_ADMIN'));
        // $boolQuery->addMust($tagsQuery);

        // $enabledQuery = new \Elastica\Query\Terms();
        // $enabledQuery->setTerms('enabled', array(true));
        // $boolQuery->addMust($enabledQuery);

        return $boolQuery;
    }

    protected function all($post) {
        $q = $post->getQuery();
        $boolQuery = new BoolQuery();
        $query = new \Elastica\Query\MatchAll();
        $boolQuery->addMust($query);
        return $boolQuery;
    }

    protected function author($post) {
        $word       = $post->getQuery();
        $boolQuery  = new BoolQuery();

        $m_last     = new Match();
        $m_last->setFieldQuery('author.lastname', $word);
        $m_last->setFieldFuzziness('author.lastname', 0.7);
        $m_last->setFieldMinimumShouldMatch('author.lastname', '80%');

        $m_first     = new Match();
        $m_first->setFieldQuery('author.firstname', $word);
        $m_first->setFieldFuzziness('author.firstname', 0.7);
        $m_first->setFieldMinimumShouldMatch('author.firstname', '80%');

        $boolQuery->addShould($m_last);
        $boolQuery->addShould($m_first);

        return $boolQuery;
    }

    protected function content($post) {
        $word   = $post->getQuery();
        $boolQuery = new BoolQuery();

        $query1  = new Match();
        $query1->setFieldQuery('content', $word);
        $query1->setFieldFuzziness('content', 0.7);
        $query1->setFieldMinimumShouldMatch('content', '80%');

        $query2  = new Match();
        $query2->setFieldQuery('keywords', $word);
        $query2->setFieldFuzziness('keywords', 0.7);
        $query2->setFieldMinimumShouldMatch('keywords', '80%');

        $boolQuery->addShould($query1);
        $boolQuery->addShould($query2);
        return $boolQuery;
    }
}