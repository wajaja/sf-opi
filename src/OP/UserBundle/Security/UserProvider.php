<?php

namespace OP\UserBundle\Security;

use OP\PostBundle\DocumentManager\PostManager,
    OP\UserBundle\Repository\OpinionUserManager,
    OP\UserBundle\Document\User,
    Symfony\Component\HttpFoundation\RequestStack,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;

class UserProvider
{
    protected $request, $um, $container, $authorizer;

    public function __construct(RequestStack $requestStack, Container $container, OpinionUserManager $um)
    {
        $this->request              = $requestStack->getCurrentRequest();
        $this->container            = $container;
        $this->um                   = $um;
        //$this->authorizer           = $authorizer;
    }

    protected function getUserById($id){
        $author = $this->um->findSimpleUserById($id);        
        $user['id'] = (string)$author['_id'];
        $user['name'] = $author['firstname'].' '.$author['lastname'];
        $user['username'] = $author['username'];
        if(isset($author['profilePic']['$id'])){
            $user['picPath'] = $this->getProfilePic((string)$author['profilePic']['$id']);
        }else{
            $user['picPath'] = "/opinion/web/images/favicon.ico";
        }
        return $user;
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

    protected function getProfilePic($id){
        $picture = $this->dm->getRepository('OP\MediaBundle\Document\Picture')
                            ->findSimplePictureById($id);
        return '\/opinion/'.$this->getUploadRootDir().$picture['directory'].'/'.$picture['path'];
    }
    
    protected function getUploadRootDir()
    {
        return __DIR__.'/../../../../uploads/';
    }
    
}
