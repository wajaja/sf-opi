<?php

namespace OP\UserBundle\Security;

use OP\UserBundle\Repository\OpinionUserManager,
    Symfony\Component\HttpFoundation\RequestStack,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;

class UserProvider
{
    protected $request, $um, $container, $authorizer, $domain_name, $fileBaseUrl;

    public function __construct(RequestStack $requestStack, Container $container, OpinionUserManager $um, $domain_name, $fileBaseUrl)
    {
        $this->request      = $requestStack->getCurrentRequest();
        $this->container    = $container;
        $this->um           = $um;
        $this->domain_name  = $domain_name;
        $this->fileBaseUrl  = $fileBaseUrl;
    }

    protected function getUserById($id){
        $author = $this->um->findSimpleUserById($id);        
        return [
            'id' => (string)$author['_id'],
            'name' => $author['firstname'].' '.$author['lastname'],
            'username' => $author['username'],
            'picPath' => $this->getProfilePic($author)
        ];
    }

    public function getFolloweds($inputIds, $from, $to)
    {
        $users = [];
        $ids = array_slice($inputIds, $from, $to);
        foreach($ids as $id){
            $users[] = $this->getUserById($id);
        }     
        return $users;
    }


    public function getFollowers($inputIds, $from, $to)
    {
        $users = [];
        $ids = array_slice($inputIds, $from, $to);
        foreach($ids as $id){
            $users[] = $this->getUserById($id);
        }     
        return $users;
    }

    public function getFriends($inputIds, $from, $to)
    {
        $users = [];
        $ids = array_slice($inputIds, $from, $to);  
        foreach($ids as $id){
            $users[] = $this->getUserById($id);
        }     
        return $users;
    }

    public function getFollowedIds($user)
    {
        $ids = [];        
        $followeds = isset($user['myFolloweds']) ? $user['myFolloweds'] : $friends = [];
        
        foreach($followeds as $followed){
            $ids[] = (string)$followed['$id'];
        }     
        return $ids;
    }


    public function getFollowerIds($user)
    {
        $ids = [];       
        $followers = isset($user['myFollowers']) ? $user['myFollowers'] : $friends = [];
        
        foreach($followers as $follower){
            $ids[] = (string)$follower['$id'];
        }     
        return $ids;
    }

    public function getFriendIds($user)
    {
        $ids = [];       
        $friends    = isset($user['myFriends']) ? $user['myFriends'] : $friends = [];

        foreach($friends as $friend){
            $ids[] = (string)$friend['$id'];
        }    
        return $ids;
    }
    
    public function getBlockedsIds($user)
    {
        $ids = [];           
        $blockeds = isset($user['myBlockeds']) ? $user['myBlockeds'] : $blockeds = [];
        
        foreach ($blockeds as $blocked) {
           $ids[] = (string)$blocked['$id'];
        }       
        return $ids;
    }
    
    public function getUsername()
    {
        $session    = $this->container->get('session');
        $tokenStorage = $this->container->get('security.token_storage');
        
        // if($this->request->getRequestFormat() === 'html')
        $credential = $session->get('access_token');
        // else
        //     $credential = $tokenStorage->getToken()->getCredentials();
            /** @var $credential */
        return $this->container->get('lexik_jwt_authentication.encoder')
                    ->decode($credential)['username'];
    }

    public function getSimpleUser()
    {
        return $this->um->simpleUserByUsername($this->getUsername());
    }
    
    public function getHydratedUser()
    {
        return $this->um->findUserByUsername($this->getUsername());
    }
    
    public function getProfilePic($user) {

        $id   = !isset($user['profilePic']) ? null : (String)$user['profilePic']['$id'];
        $mal  = $this->fileBaseUrl . '/uploads/gallery/a4a2139157426ca3e2b39af6b374c458.jpeg';
        $fem  = $this->fileBaseUrl . '/uploads/gallery/598616f0316b18de6d3a415c7f3c203b.jpeg';

        if(!$id || gettype($id) !== 'string') {
            if(!isset($user['gender']))
                return $mal;
            
            return $user['gender'] === 'Male' ? $mal : $fem;
        }

        $p  = $this ->dm
                    ->getRepository('OP\MediaBundle\Document\Image')
                    ->findOneBy(array('id' => $id));

        return $p->getWebPath();
    }
    
    protected function getUploadRootDir()
    {
        return __DIR__.'/../../../../uploads/';
    }
    
}
