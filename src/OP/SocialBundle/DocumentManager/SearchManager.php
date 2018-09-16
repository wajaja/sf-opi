<?php 
namespace OP\SocialBundle\DocumentManager;

use Pagerfanta\Pagerfanta,
	OP\SocialBundle\Document\Search,
	OP\UserBundle\Model\UserSearch,
	OP\UserBundle\Model\GroupSearch,
	OP\PostBundle\Model\PostSearch,
	Pagerfanta\Adapter\ArrayAdapter,
    Doctrine\ODM\MongoDB\DocumentManager,
    Symfony\Component\HttpFoundation\Request,
    OP\UserBundle\Elastica\QuerySearch,
    JMS\Serializer\SerializerInterface,
    OP\PostBundle\DataTransformer\ToArrayTransformer,
    Symfony\Component\EventDispatcher\EventDispatcherInterface,
	Symfony\Component\DependencyInjection\ContainerInterface as Container;

/**
* 
*/
class SearchManager
{
	protected $dm, $search, $container, $pTransformer, $serializer, $querySearch;
	
	public function __construct(DocumentManager $dm, Search $search, Container $container, ToArrayTransformer $transformer, SerializerInterface $serializer, QuerySearch $querySearch)
	{
		$this->dm 		= $dm;
		$this->search 	= $search;
        $this->container= $container;
        $this->serializer = $serializer;
        $this->querySearch = $querySearch;
        $this->pTransformer = $transformer;
	}


	public function searchUsers(Request $request) {
		// notre index est directement disponible sous forme de service
		$user 	   = new UserSearch();
		$users 	   = [];
		$container = $this->container;

        $user->handleRequest($request);
        $finder  = $container->get('fos_elastica.finder.app.user');

        $query   = $this->querySearch->getQueryForUser($user);
        $results = $finder->find($query);

        /** Alternatve*/
        // $index 	  = $container->get('fos_elastica.index.app.user');
        // $resultSet = $index->search($query);
        // $results   = $resultSet->getResults();

        $adapter = new ArrayAdapter($results);
        $pager   = new Pagerfanta($adapter);
        $pager->setMaxPerPage($user->getPerPage());
        $pager->setCurrentPage($user->getPage());

        foreach ($pager->getCurrentPageResults() as $user) {
            $users[] = $this->serializer->toArray($user);
        }

        return $users;
	}

	public function searchGroups(Request $request) {
		// notre index est directement disponible sous forme de service
		$group 	   = new GroupSearch();
		$groups    = [];
		$container = $this->container;

        $group->handleRequest($request);

        $serializer  = $container->get('jms_serializer');
        $querySearch = $container->get('op_user.elastica.query_search');
        $finder      = $container->get('fos_elastica.finder.app.group');

        $query   = $querySearch->getQueryForGroup($group);
        $results = $finder->find($query);

        /** Alternatve*/
        // $index 	  = $container->get('fos_elastica.index.app.user');
        // $resultSet = $index->search($query);
        // $results   = $resultSet->getResults();

        $adapter = new ArrayAdapter($results);
        $pager   = new Pagerfanta($adapter);
        $pager->setMaxPerPage($group->getPerPage());
        $pager->setCurrentPage($group->getPage());

        foreach ($pager->getCurrentPageResults() as $group) {
            $groups[] = $serializer->toArray($group);
        }

        return $groups;
	}

	public function searchPosts(Request $request) {
		// notre index est directement disponible sous forme de service
		$post 	    = new PostSearch();
		$posts    	= [];
		$container 	= $this->container;
	    $transformer= $container->get('op_post.elastica_to_model.transformer.post');

        $post->handleRequest($request);

        if($post->getCriteria() === 'all') {
	        //Match all posts containing some string char
	        $mngr 		= $container->get('fos_elastica.index_manager');
	        $search 	= $mngr->getIndex('app')->createSearch();
	        $search->addType('post');
	        $resultSet 	= $search->search($post->getQuery());
        }
        else {
	        ///tri of posts list 
	        $index 		 = $container->get('fos_elastica.index.app.post');
	        $query   	 = $this->querySearch->getQueryForPost($post);
	        $resultSet 	 = $index->search($query);
        }

	    $results 	= $transformer->transform($resultSet->getResults());
        $adapter 	= new ArrayAdapter($results);
        $pager   	= new Pagerfanta($adapter);
        $pager->setMaxPerPage($post->getPerPage());
        $pager->setCurrentPage($post->getPage());

        return $pager->getCurrentPageResults();
	}

	public function searchAll(Request $request) {
		// notre index est directement disponible sous forme de service
		$datas 		= [];
		$doc 		= new Search();
        $doc->handleRequest($request);
        $mngr 		= $container->get('fos_elastica.index_manager');
        $search 	= $mngr->getIndex('app')->createSearch();

        $resultSet 	= $search->search($doc->getQuery(), 21);
	    $results 	= $resultSet->getResults();
        $adapter 	= new ArrayAdapter($results);
        $pager   	= new Pagerfanta($adapter);

        $pager->setMaxPerPage($doc->getPerPage());
        $pager->setCurrentPage($doc->getPage());
        foreach ($pager->getCurrentPageResults() as $result) {
        	if($result->getType() === 'post') {
        		$post = $this->dm->getRepository('OPPostBundle:Post')
        				->findSimplePostById($result->getId());
        		$data = $post['type'] === 'opinion' ? $this->pTransformer->opinionToArray($post) 
                                                    : $this->pTransformer->postToArray($post);
        		$result->setParam('_source', $data);
            }
            $datas[] = $this->serializer->toArray($result);
        }
        return $datas;
	}

    public function searchRecents($recents = []) {
        // notre index est directement disponible sous forme de service
        $datas      = $results  = [];
        $mngr       = $container->get('fos_elastica.index_manager');
        $search     = $mngr->getIndex('app')->createSearch();

        $searchPeerTerm = ceil(20 / count($recents));

        foreach ($recents as $term) {
            $resultSet  = $search->search($term, $searchPeerTerm);
            //merge finded results for every term into one array
            $results    = array_merge($results, $resultSet->getResults()); 
        }

        foreach ($results as $result) {
            if($result->getType() === 'post') continue;
            
            $datas[] = $this->serializer->toArray($result);
        }

        return $datas;
    }


	public function findByUserId($user_id) {
		$qb = $this->dm->createQueryBuilder('\OP\SocialBundle\Document\Search')
			->hydrate(false)
		    ->field('user.$id')->equals(new \MongoId($user_id))
			->select('search');

		$notifs = $qb->getQuery()
					->execute()
					->getSingleResult();
		return $notifs;
	}
}