<?php
namespace OP\SocialBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM,
    Symfony\Component\HttpFoundation\Request;

/**
 * OP\SocialBundle\Document\Search
 *
 * @ODM\Document(
 *      db="opinion",
 *      collection="searches",
 *     repositoryClass="OP\SocialBundle\Repository\SearchRepository"
 * )
 * @ODM\ChangeTrackingPolicy("DEFERRED_IMPLICIT")
 */
class Search
{
    /**
     * @var MongoId $id
     *
     * @ODM\Id(strategy="AUTO")
     */
    protected $id;

    /**
     * @var $user
     *
     * @ODM\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $user;

    /**
     * @var string $search
     *
     * @ODM\Field(name="search", type="string")
     */
    protected $search;

    /**
     * @var string $search
     *
     * @ODM\Field(name="query", type="string")
     */
    protected $query;

    /**
     * @var date $createdAt
     *
     * @ODM\Field(name="createdAt", type="date")
     */
    protected $createdAt;

    /**
     * @var date $modifiedAt
     *
     * @ODM\Field(name="modifiedAt", type="date")
     */
    protected $modifiedAt;

    public function __construct() {
        $this->createdAt = new \DateTime(null, new \DateTimeZone("UTC"));
    }

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
    protected $criteria;

    protected $inline;

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
            // $this->setInline($request->query->get('inline', true)); //load all types ??
            $this->setQuery(urldecode($request->query->get('q', '')));
        } else {
            $this->setPage($request->get('page', 1));
            $this->setCriteria($request->get('criteria', 'all'));
            // $this->setInline($request->query->get('inline', true)); //load all types ??
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
        return $this->query;
    }


    public function setQuery($q)
    {
        $this->query = $q;

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

    /**
     * Get id
     *
     * @return id $id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set search
     *
     * @param string $search
     * @return self
     */
    public function setSearch($search)
    {
        $this->search = $search;
        return $this;
    }

    /**
     * Get search
     *
     * @return string $search
     */
    public function getSearch()
    {
        return $this->search;
    }

    /**
     * Set createdAt
     *
     * @param date $createdAt
     * @return self
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    /**
     * Get createdAt
     *
     * @return date $createdAt
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Set modifiedAt
     *
     * @param date $modifiedAt
     * @return self
     */
    public function setModifiedAt($modifiedAt)
    {
        $this->modifiedAt = $modifiedAt;
        return $this;
    }

    /**
     * Get modifiedAt
     *
     * @return date $modifiedAt
     */
    public function getModifiedAt()
    {
        return $this->modifiedAt;
    }

    /**
     * Set user
     *
     * @param OP\UserBundle\Document\User $user
     * @return $this
     */
    public function setUser(\OP\UserBundle\Document\User $user)
    {
        $this->user = $user;
        return $this;
    }

    /**
     * Get user
     *
     * @return OP\UserBundle\Document\User $user
     */
    public function getUser()
    {
        return $this->user;
    }
}
