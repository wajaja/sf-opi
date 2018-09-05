<?php

namespace OP\UserBundle\Elastica;

use OP\UserBundle\Model\UserSearch,
    OP\UserBundle\Model\GroupSearch,
    Elastica\Query\BoolQuery,
    Elastica\Query\Match;

class QuerySearch
{

    public function getQueryForUser(UserSearch $user)
    {
        $criteria   = $user->getCriteria();
        $boolQuery  = $this->$criteria($user);

        /** TODO */
        // $rolesQuery = new \Elastica\Query\Terms();
        // $rolesQuery->setTerms('roles', array('ROLE_ADMIN'));
        // $boolQuery->addMust($tagsQuery);

        // $enabledQuery = new \Elastica\Query\Terms();
        // $enabledQuery->setTerms('enabled', array(true));
        // $boolQuery->addMust($enabledQuery);

        return $boolQuery;
    }

    public function getQueryForGroup(GroupSearch $group)
    {
        $criteria   = $group->getCriteria();
        $boolQuery  = $this->groupName($group);

        /** TODO */
        // $rolesQuery = new \Elastica\Query\Terms();
        // $rolesQuery->setTerms('roles', array('ROLE_ADMIN'));
        // $boolQuery->addMust($tagsQuery);

        // $enabledQuery = new \Elastica\Query\Terms();
        // $enabledQuery->setTerms('enabled', array(true));
        // $boolQuery->addMust($enabledQuery);

        return $boolQuery;
    }

    protected function groupName($group) {
        $word       = $group->getQuery();
        $boolQuery  = new BoolQuery();

        $m     = new Match();
        $m->setFieldQuery('name', $word);
        $m->setFieldFuzziness('name', 0.7);
        $m->setFieldMinimumShouldMatch('name', '80%');

        $boolQuery->addShould($m);

        return $boolQuery;
    }

    protected function all($user) {
        $q = $user->getQuery();
        $boolQuery = new BoolQuery();
        $query = new \Elastica\Query\MatchAll();
        $boolQuery->addMust($query);
        return $boolQuery;
    }

    protected function name($user) {
        $word       = $user->getQuery();
        $boolQuery  = new BoolQuery();

        $m_last     = new Match();
        $m_last->setFieldQuery('lastname', $word);
        $m_last->setFieldFuzziness('lastname', 0.7);
        $m_last->setFieldMinimumShouldMatch('lastname', '80%');

        $m_first     = new Match();
        $m_first->setFieldQuery('firstname', $word);
        $m_first->setFieldFuzziness('firstname', 0.7);
        $m_first->setFieldMinimumShouldMatch('firstname', '80%');

        $m_nick     = new Match();
        $m_nick->setFieldQuery('nickname', $word);
        $m_nick->setFieldFuzziness('nickname', 0.7);
        $m_nick->setFieldMinimumShouldMatch('nickname', '80%');

        $boolQuery->addShould($m_last);
        $boolQuery->addShould($m_first);
        $boolQuery->addShould($m_nick);

        return $boolQuery;
    }
 
    protected function email($user) {
        $word  = $user->getQuery();
        $query = new Match();
        $boolQuery = new BoolQuery();

        $query->setFieldQuery('email', $word);
        $query->setFieldFuzziness('email', 0.7);
        $query->setFieldMinimumShouldMatch('email', '80%');
        $boolQuery->addShould($query);
        return $boolQuery;
    }

    protected function username($user) {
        $word   = $user->getQuery();
        $query  = new Match();
        $boolQuery = new BoolQuery();

        $query->setFieldQuery('username', $word);
        $query->setFieldFuzziness('username', 0.7);
        $query->setFieldMinimumShouldMatch('username', '80%');

        $boolQuery->addMust($query);
        return $boolQuery;
    }
}