<?php
namespace OP\SocialBundle\Controller\Api;

use OP\SocialBundle\Document\Search,
    OP\UserBundle\Security\UserProvider,
    FOS\RestBundle\Controller\Annotations,
    OP\SocialBundle\DocumentManager\SearchManager,
    Symfony\Component\HttpFoundation\Request,
    FOS\RestBundle\Controller\FOSRestController,
    FOS\RestBundle\Routing\ClassResourceInterface,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * @Annotations\RouteResource("searches", pluralize=false)
 */
class ApiSearchController extends FOSRestController implements ClassResourceInterface
{

    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }
    
    /**
     * @Annotations\Get("/searches")
     * 
     * Perform recent searches for user_id
     * just after user's login
     * @param type String
     */
    public function searchAction(Request $request, SearchManager $searchMan)
    {
        $tag  = $request->query->get('tag');
        if($tag === 'users') 
            $results = $searchMan->searchUsers($request);
        else if($tag === 'posts') 
            $results = $searchMan->searchPosts($request);
        else if($tag === 'groups') 
            $results = $searchMan->searchGroups($request);
        else //all 
            $results = $searchMan->searchAll($request);

        return new JsonResponse($results);
    }

    /**
     * @Annotations\Get("/searches/recent")
     * 
     * Perform recent searches for user_id
     * just after user's login
     * @param type String
     */
    public function recentAction(Request $request, SearchManager $sMan)
    {
        $terms   = [];
        $dm      = $this->getDocumentManager();
        $searchs = $dm->getRepository('OPSocialBundle:Search')->findAll();

        //get most recents 10 search's keyword
        foreach ($searchs as $key => $search) {
            if($key >= 10) break;

            $terms[] = $search->getQuery();
        }

        $results = $sMan->searchRecents($terms);

        return new JsonResponse(['terms' => $terms, 'results' => $results]);
    }

    /**
     * @Annotations\Post("/searches")
     * 
     * Create a search record for history lookup
     * @param {string} user_id This required param specifies the user id to associate search with
     * @param {string} search This required param specifies the search value
     * returns {object} Returns a 200 status code with an array of search objects
     */
    public function triggerAction(Request $request)
    {
        $recent = [];
        $dm     = $this->getDocumentManager();
        $user   = $this->_getUser();
        $search = new Search();
        $search->handleRequest($request);
        $search->setUser($user);
        $dm->persist($search);
        $dm->flush();

        $datas = $dm->getRepository('OPSocialBundle:Search')->findAll();
        foreach ($datas as $data) {
            $recent[] = $data->getQuery();
        }

        return new JsonResponse($recent);
    }

        // $users = [];
        // $hashtags = [];
        // $locations = [];

        // $recent['users'] = $users;
        // $recent['hashtags'] = $hashtags;
        // $recent['locations'] = $locations;

    public function _getUser()
    {
        return $this->user_provider->getHydratedUser();
    }

    /**
    * Shortcut to throw a AccessDeniedException($message) if the user is not authenticated
    * @param String $message The message to display (default:'warn.user.notAuthenticated')
    */
    protected function forwardIfNotAuthenticated($message='warn.user.notAuthenticated'){
        if (!is_object($this->_getUser())) {
            throw new AccessDeniedException($message);
        }
    }

    /**
     * Returns the DocumentManager
     *
     * @return DocumentManager
     */
    private function getDocumentManager()
    {
        return $this->dm;
    }
}