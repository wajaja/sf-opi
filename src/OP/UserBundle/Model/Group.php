<?php

namespace OP\UserBundle\Model;

use FOS\UserBundle\Model\Group as BaseGroup,
	Symfony\Component\HttpFoundation\Request;


/**
* as
*/
class Group extends BaseGroup
{
	
	// function __construct()
	// {
	// 	parent::__construct();
	// }


	 /*
    * ElasticSearch Stuff 
    * source OBTAO
    */
     // un tableau public pour être utilisé comme liste déroulante dans le formulaire
    public static $sortChoices = array(
        'lastActivity desc' => 'Publication date : new to old',
        'lastActivity asc' => 'Publication date : old to new',
    );

    // query string
    protected $querySearch;

    // query string
    protected $criteria;

    // définit le champ utilisé pour le tri par défaut
    protected $sort = 'lastActivity';

    // définit l'ordre de tri par défaut
    protected $direction = 'desc';

    // une proprité "virtuelle" pour ajouter un champ select
    protected $sortSelect;

    // le numéro de page par défault
    protected $page = 1;

    // le nombre d'items par page
    protected $perPage = 10;

    // autres getters et setters
    public function handleRequest(Request $request)
    {
        if('application/x-www-form-urlencoded' !== $request->headers->get('Content-Type')) {
            $this->setPage($request->query->get('page', 1));
            $this->setCriteria($request->query->get('criteria', 'all'));
            // $this->setDirection($request->query->get('direction', 'desc'));
            $this->setQuery(urldecode($request->query->get('q', '')));
        } else {
            $this->setPage($request->get('page', 1));
            $this->setCriteria($request->get('criteria', 'all'));
            // $this->setDirection($request->get('direction', 'desc'));
            $this->setQuery(urldecode($request->get('q', '')));
        }
    }

    public function getPage()
    {
        return $this->page;
    }


    public function setPage($page)
    {
        if ($page != null) {
            $this->page = $page;
        }

        return $this;
    }

    public function getQuery()
    {
        return $this->querySearch;
    }


    public function setQuery($q)
    {
        $this->querySearch = $q;

        return $this;
    }

    public function getCriteria()
    {
        return $this->criteria;
    }


    public function setCriteria($c)
    {
        $this->criteria = $c;

        return $this;
    }

    public function getPerPage()
    {
        return $this->perPage;
    }

    public function setPerPage($perPage=null)
    {
        if($perPage != null){
            $this->perPage = $perPage;
        }

        return $this;
    }

    public function setSortSelect($sortSelect)
    {
        if ($sortSelect != null) {
            $this->sortSelect =  $sortSelect;
        }
    }

    public function getSortSelect()
    {
        return $this->sort.' '.$this->direction;
    }

    public function initSortSelect()
    {
        $this->sortSelect = $this->sort.' '.$this->direction;
    }

    public function getSort()
    {
        return $this->sort;
    }

    public function setSort($sort)
    {
        if ($sort != null) {
            $this->sort = $sort;
            $this->initSortSelect();
        }

        return $this;
    }

    public function getDirection()
    {
        return $this->direction;
    }

    public function setDirection($direction)
    {
        if ($direction != null) {
            $this->direction = $direction;
            $this->initSortSelect();
        }

        return $this;
    }
}