<?php

namespace OP\PostBundle\Provider;

use OP\SocialBundle\Document\News,
    OP\PostBundle\DataTransformer\ToArrayTransformer;

class PostProvider extends BasePostProvider
{
    
    public function getFriendsPosts(ToArrayTransformer $transformer)
    {
        $list_news = [];
        $friends_posts = $this->getDocumentManager()->getRepository('OPPostBundle:Post')
                              ->findFriendsPosts(
                                (string)$this->getAuthenticatedUser()['_id'], 
                                $this->getFriendsIds(), 
                                $this->getBlockedsIds()
                            );
        
        
        foreach ($friends_posts as $friend_post){
            $post = new News();
            $post->setData($transformer->postToArray($friend_post));
            $post->setType('friend_post');
            $list_news[] = $post;
            unset($post);
        }
        return $list_news;
    }

    
    public function getPostsCommentedByFriends()
    {
        $list_news = [];
        $friends_posts = $this->getDocumentManager()
                              ->getRepository('OPPostBundle:Post')
                              ->findPostsCommentedByFriends($this->getFriendsIds(), $this->getBlockedsIds());
        
        foreach ($friends_posts as $friend_post){
            $post = $this->news;
            $news = $post->setData($friend_post)
                         ->setType('friend_commented_post');
            $list_news[] = $news;
        }
        return $list_news;
    }
    
    
    public function getPostsLikedByFriends() 
    {
        $list_news = [];
        $friends_posts = $this->getDocumentManager()
                              ->getRepository('OPPostBundle:Post')
                              ->findPostsLikedByFriends($this->getFriendsIds(), $this->getBlockedsIds());
        
        foreach ($friends_posts as $friend_post){
            $post = $this->news;
            $news = $post->setData($friend_post)
                         ->setType('friend_liked_post');
            $list_news[] = $news;
        }
        return $list_news;
    }
    
    
    public function getPostsSharedByFriends()
    {
        $list_news = [];
        $friends_posts = $this->getDocumentManager()
                              ->getRepository('OPPostBundle:Post')
                              ->findPostsSharedByFriends($this->getFriendsIds(), $this->getBlockedsIds());
        
        foreach ($friends_posts as $friend_post){
            $post = $this->news;
            $news = $post->setData($friend_post)
                         ->setType('friend_shared_post');
            $list_news[] = $news;
        }
        return $list_news;
    }
    
    
    public function getPostsRatedByFriends()
    {
        $list_news = [];
        $friends_posts = $this->getDocumentManager()
                              ->getRepository('OPPostBundle:Post')
                              ->findPostsCommentedByFriends($this->getFriendsIds(), $this->getBlockedsIds());
        
        foreach ($friends_posts as $friend_post){
            $post = $this->news;
            $news = $post->setData($friend_post)
                         ->setType('friend_rated_post');
            $list_news[] = $news;
        }
        return $list_news;
    }
    
    
//    public function getPost($postId)
//    {
//        $post = $this->getDocumentManager()
//                     ->getRepository('OPPostBundle:Post')
//                     ->findPostById($postId, $this->getBlockedsIds());
//        if (!$post) {
//            throw new NotFoundHttpException('There is no such thread');
//        }
//        if (!$this->authorizer->canSeeThread($post)) {
//            throw new AccessDeniedException('You are not allowed to see this thread');
//        }
//        return $post;
//    }
}
