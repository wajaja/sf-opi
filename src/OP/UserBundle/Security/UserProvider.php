<?php

namespace OP\UserBundle\Security;

//TODO:: set
define('MALE_PIC', '/uploads/gallery/a4a2139157426ca3e2b39af6b374c458.jpeg');
define('FEMALE_PIC', '/uploads/gallery/598616f0316b18de6d3a415c7f3c203b.jpeg');
define('GROUP_PIC', '/uploads/gallery/862fd08f285cae49ac4db2fc65ed3a4c.jpeg');

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
    
    /**
     * 
     * @param type $user
     * @param type $isObject
     * @return string
     */
    public function getProfilePic($user, $isObject = false) {

        $mal  = $this->fileBaseUrl . MALE_PIC;
        $fem  = $this->fileBaseUrl . FEMALE_PIC;
        $id   = !isset($user['profilePic']) ? null : (String)$user['profilePic']['$id'];
        
        if(!$id || gettype($id) !== 'string') {
            $gender = $user['gender'] ?? 'Male';
            
            return $gender === 'Male' ? $mal : $fem;
        }

        $p  = $this ->dm
                    ->getRepository('OP\MediaBundle\Document\Image')
                    ->findOneBy(array('id' => $id));

        return $p->getWebPath();
    }
    
    /**
     * 
     * @param Object $user
     * @return string
     */
    public function getDefaultPic($user) : string {

        $mal  = $this->fileBaseUrl . MALE_PIC;
        $fem  = $this->fileBaseUrl . FEMALE_PIC;
        
        if($gender = $user->getGender())
            return $gender === 'Male' ? $mal : $fem;
            
        return $mal;
    }
    
    public function getDefaultAvatar($group) : string {
        return $this->fileBaseUrl . GROUP_PIC;
    }
    
    protected function getUploadRootDir()
    {
        return __DIR__.'/../../../../uploads/';
    }
    
}
