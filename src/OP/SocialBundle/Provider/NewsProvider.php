<?php
namespace OP\SocialBundle\Provider;

use OP\PostBundle\Provider\PostProvider,
    Symfony\Component\HttpFoundation\RequestStack,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;
//use OP\SocialBundle\Document\News;

/**
 * Description of NewsProvider
 *
 * @author CEDRICK
 */
class NewsProvider 
{
    protected $request;
    
    protected $container;
    
    protected $post_provider;
    
    protected $option_1 = "getFriendsPosts",
              $option_2 = "getPostsCommentedByFriends",
              $option_3 = "getPostsLikedByFriends",
              $option_4 = "getPostsSharedByFriends",
              $option_5 = "getPostsRatedByFriends",
              $option_6 = "getImagesFromFriend";
    
      public function __construct(Container $container, RequestStack $requestStack, PostProvider $postProvider) {
          $this->container      = $container;
          $this->request        = $requestStack->getCurrentRequest();
          $this->post_provider  = $postProvider;
      }
    /**
     * 
     * @return (array) $news
     */
    public function loadNews()
    {
        //      
        return call_user_func(array($this->post_provider, 'getFriendsPosts'));
    }
    
    /**
     * @return array $news
     */
    public function loadMoreNews()
    {
        //      
        return call_user_func(array($this->post_provider,
                                          $this->option_ .rand(1, 5)));
    }
    
    /**
     * 
     * @return array $news
     */
    public function refreshNews()
    {
        return $news;
    }
}
