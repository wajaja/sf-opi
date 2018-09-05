<?php
namespace OP\UserBundle\Repository;

use OP\UserBundle\Document\User,
    FOS\UserBundle\Model\UserInterface,
    Doctrine\ODM\MongoDB\DocumentRepository,
    Doctrine\ODM\MongoDB\DocumentManager,
    Doctrine\Common\Persistence\ObjectManager,
    FOS\UserBundle\Util\CanonicalFieldsUpdater,
    FOS\UserBundle\Util\PasswordUpdaterInterface,
    FOS\UserBundle\Doctrine\UserManager as BaseUserManager;


/**
 * This class extends the default fos user bundle doctrine usermanager to fit my own user entity.
 */
class OpinionUserManager extends BaseUserManager
{
    protected $objectManager;
    protected $class;
    protected $repository;

    public function __construct(PasswordUpdaterInterface $passwordUpdater, CanonicalFieldsUpdater $canonicalFieldsUpdater, ObjectManager $om, $class) {

            parent::__construct($passwordUpdater, $canonicalFieldsUpdater, $om, $class);
            $this->objectManager = $om;
    $this->repository = $om->getRepository($class);

    $metadata = $om->getClassMetadata($class);
    $this->class = $metadata->getName();
    }

    /* this method return an array of users from the database
    *
    */
    public function loadUsers($searchString){
            $qb = $this->repository->getDocumentManager()->createQueryBuilder('OP\UserBundle\Document\User');
            $users = []; 		$lastname = '';
            $name = 's'.' '.$searchString;
            $name_array = explode(' ', $name); 			//explode the searchString
            $firstname = $name_array[1];
            if(sizeof($name_array)==2){			//if users tape single string
                $qb ->field('locked')->equals(false)
                    ->field('enabled')->equals(true)
                    ->addOr($qb->expr()
                       ->field('firstname')->equals(new \MongoRegex('/.*'.$firstname.'.*/i')))
                    ->addOr($qb->expr()
                       ->field('lastname')->equals(new \MongoRegex('/.*'.$firstname.'.*/i')))
                    ->select(array('_id', 'username','firstname', 'lastname', 'profilePic' ));
                    $users = $qb->getQuery()->execute()->toArray();
            }

            else if(sizeof($name_array)==3){
                    $lastname = $name_array[2];
                    $qb ->field('locked')->equals(false)
                        ->field('enabled')->equals(true)
                            ->addAnd($qb->expr()
                                    ->field('firstname')->equals(new \MongoRegex('/.*'.$firstname.'.*/i')))
                            ->addAnd($qb->expr()
                                    ->field('lastname')->equals(new \MongoRegex('/.*'.$lastname.'.*/i')))
                            ->select(array('_id','username','firstname', 'lastname', 'profilePic' ));
                    $users = $qb->getQuery()
                                    ->execute()
                                    ->toArray();

            }else if(sizeof($name_array)>3){
                    $lastname = $name_array[2];
                    $qb ->field('locked')->equals(false)->field('enabled')->equals(true)
                            ->addAnd($qb->expr()
                                    ->field('firstname')->equals(new \MongoRegex('/.*'.$firstname.'.*/i')))
                            ->addAnd($qb->expr()
                                    ->field('lastname')->equals(new \MongoRegex('/.*'.$lastname.'.*/i')))
                            ->select(array('_id','username','firstname', 'lastname', 'profilePic' ));
                    $users = $qb->getQuery()
                                    ->execute()
                                    ->toArray();
            }
            else{
                    $users = [];
            }
                    return $users;
    }

    /**
    * Function loadSuggestions
    * $initIds | array (empty firstly; array of ids when load more request)
    * $friendIds | array 
    * $blockedIds | array
    * $requestedIds array (of user_ids whose send me request or i've send request)
    */
    public function loadSuggestions(
        $initIds, $friendIds, $blockedIds, $followers, 
        $requestedIds, $city, $country, $clientIp, $limit
    )
    {
        //not in array should contain all blocked users id, this user id and friends id
        $notIn   = [];
        $initIds = $initIds === null ? [] : $initIds;

        // "friendsWithMe": {},
        // "myFriends": {},
        // "myFolloweds": {},
        // "followersWithMe": {},
        // "myFollowers": {},
        // "blockedsWithMe": {},
        // "blockeds": {}

        $qb = $this->repository->getDocumentManager()
                               ->createQueryBuilder('OP\UserBundle\Document\User');

        $qb 
            // ->field('locked')->equals(false)
            // ->field('enabled')->equals(true)
            // ->field('id')->notIn($friendIds)
            // ->field('id')->notIn($blockedIds)
            ->hydrate(false)
            // foreach ($friendIds as $id) {
            //     $qb->addOr($qb->expr()->field('myFriendsIds')->equals($id));
            // }

            // ->addOr($qb->expr()->field('myFollowers.$id')->in($friendIds))
            // ->addAnd($qb->expr()->field('id')->notIn($notIn))
            // ->field('id')->notIn($notIn)

            // $qb->addAnd($qb->expr()->field('id')->notIn([]));
            // $qb->addAnd($qb->expr()->field('id')->notIn([]));
            // $qb->addAnd($qb->expr()->field('id')->notIn([]));
            // $qb->addAnd($qb->expr()->field('id')->notIn([]))
            ->select('id', 'email', 'username', 'firstname', 'lastname', 'profilePic', 'status')
            ;

        $users = $qb->getQuery()->execute()
                    ->toArray();
        return $users;
    }

    /**
    * Function loadSuggestions
    * $initIds | array (empty firstly; array of ids when load more request)
    * $friendIds | array 
    * $blockedIds | array
    * $requestedIds array (of user_ids whose send me request or i've send request)
    */
    public function loadUsersByProfilePicRef($refIds)
    {

        $qb = $this->repository->getDocumentManager()
                               ->createQueryBuilder('OP\UserBundle\Document\User');

        $qb 
            ->field('profilePic.$id')->equals(new \MongoId($refIds));
            ;

        $users = $qb->getQuery()->execute()
                    ->toArray();
        return $users;
    }

    /**
    * Function loadSuggestions
    * $initIds | array (empty firstly; array of ids when load more request)
    * $friendIds | array 
    * $blockedIds | array
    * $requestedIds array (of user_ids whose send me request or i've send request)
    */
    public function loadUsersByCoverPicRef($refIds)
    {

        $qb = $this->repository->getDocumentManager()
                               ->createQueryBuilder('OP\UserBundle\Document\User');

        $qb 
            ->field('coverPic.$id')->equals(new \MongoId($refIds));
            ;

        $users = $qb->getQuery()->execute()
                    ->toArray();
        return $users;
    }

    public function loadDefaultUsers($initIds, $friendIds, $blockedIds) {

        //not in array should contain all blocked users id, this user id and friends id
        $notIn   = [];
        $qb = $this->repository->getDocumentManager()
                               ->createQueryBuilder('OP\UserBundle\Document\User');

        $qb 
            // ->field('locked')->equals(false)
            // ->field('enabled')->equals(true)
            // ->field('id')->notIn($friendIds)
            // ->field('id')->notIn($blockedIds)
            ->hydrate(false)
            // foreach ($friendIds as $id) {
            //     $qb->addOr($qb->expr()->field('myFriendsIds')->equals($id));
            // }

            // ->addOr($qb->expr()->field('myFollowers.$id')->in($friendIds))
            // ->addAnd($qb->expr()->field('id')->notIn($notIn))
            // ->field('id')->notIn($notIn)

            // $qb->addAnd($qb->expr()->field('id')->notIn([]));
            // $qb->addAnd($qb->expr()->field('id')->notIn([]));
            // $qb->addAnd($qb->expr()->field('id')->notIn([]));
            // $qb->addAnd($qb->expr()->field('id')->notIn([]))
            ->select('id', 'username', 'email', 'firstname', 'lastname', 'profilePic')
            ;

        $users = $qb->getQuery()->execute()
                    ->toArray();
        return $users;

    }
    
    public function findSimpleUserById($id)
    {
        $qb = $this->repository->getDocumentManager()->createQueryBuilder('OP\UserBundle\Document\User');

        $qb ->field('id')->equals($id)
            ->field('enabled')->equals(true)
            ->hydrate(false)
            //->select('id', 'username', 'firstname', 'lastname', 'profilePic')
            //->field('id')->notIn($notIn_array)
            ;
        $user = $qb->getQuery()
                    ->execute()
                    ->getSingleResult();
        return $user;
    }
    
    public function findDefaultUserById($id)
    {
        $qb = $this->repository->getDocumentManager()->createQueryBuilder('OP\UserBundle\Document\User');

        $qb ->field('id')->equals($id)
            ->field('enabled')->equals(true)
            ->hydrate(false)
            ->select('id', 'username', 'firstname', 'lastname', 'profilePic', 'gender')
            //->field('id')->notIn($notIn_array)
            ;
        $user = $qb->getQuery()
                    ->execute()
                    ->getSingleResult();
        return $user;
    }
    

    public function selectFriends($username)
    {
        $qb = $this->repository->getDocumentManager()
                   ->createQueryBuilder('OP\UserBundle\Document\User');
        $qb ->field('username')->equals($username)
            ->field('enabled')->equals(true)
            ->select('myFriends', 'myFollowers')
            ->hydrate(false)
            ;
        $friends = $qb->getQuery()
                    ->execute()
                    ->getSingleResult();
        return $friends;
    }

    public function simpleUserByUsername($username)
    {
        $qb = $this->repository->getDocumentManager()->createQueryBuilder('OP\UserBundle\Document\User');

        $qb ->field('username')->equals($username)
            ->field('enabled')->equals(true)
            ->hydrate(false)
            //->select('id', 'username', 'firstname', 'lastname', 'profilePic')
            //->field('id')->notIn($notIn_array)
            ;
        $user = $qb->getQuery()
                    ->execute()
                    ->getSingleResult();
        return $user;
    }
    
    //TO DO : make for user  argument -----\OP\UserBundle\Document\User $user
    public function loadDefault($notIn)
    {
        //not in array should contain all blocked users id, this user id and friends id
//        $notIn_array[] = $user->getId();
//        $blockeds = $user->blockeds;
//        foreach($blockeds as $blocked){
//            $notIn_array[] = $blocked->getId();
//        }

//        $friends = $user->myFriends;
//        foreach($friends as $friend){
//            $notIn_array[] = $friend->getId();S
//        }
//
//        $followers = $user->myFriends;
//        foreach($followers as $follower){
//            $notIn_array[] = $follower->getId();
//        }
        $dm = $this->repository->getDocumentManager();
        $qb = $dm->createQueryBuilder('OP\UserBundle\Document\User');

        $qb 
            // ->field('locked')->equals(false)
            ->field('enabled')->equals(true)
            ->select('id', 'username', 'firstname', 'lastname', 'profilePic', 'email')
            ->field('id')->notIn($notIn)
            ->hydrate(false)
            ;

        $users = $qb->getQuery()
                    ->execute()
                    ->toArray();
        return $users;
    }

    public function checkEmail($email) {

        $dm = $this->repository->getDocumentManager();
        $qb = $dm->createQueryBuilder('OP\UserBundle\Document\User');

        $qb 
            // ->field('locked')->equals(false)
            ->field('enabled')->equals(true)
            ->field('email')->equals($email)
            ->select('email')
            ->hydrate(false)
            ;

        $user = $qb->getQuery()
                    ->execute()
                    ->toArray();
        return count($user);
    }

    //return some tag when user set his profile
    //like contact, adress...
    public function loadInfos($username) {
        $qb = $this->repository->getDocumentManager()->createQueryBuilder('OP\UserBundle\Document\User');

        $qb ->field('username')->equals($username);
        $user = $qb->getQuery()->execute()->getSingleResult();

        return [
            'adress' => $user->getAddress() !== null ? $user->getAddress() : [], //TO DO::rename
            'contact' => $user->getContact() !== null ? $user->getContact() : [],
            'aboutme' => $user->getAboutMe() !== null ? $user->getAboutMe() : []
        ];
    }

    //return some tag when user set his profile
    //like contact, adress...
    // public function loadInfos($username) {
    //     $qb = $this->repository->getDocumentManager()->createQueryBuilder('OP\UserBundle\Document\User');

    //     $qb ->field('username')->equals($username);
    //     $user = $qb->getQuery()->execute()->getSingleResult();

    //     return [
    //         'adress' => $user->getAddress() !== null ? $user->getAddress() : [], //TO DO::rename
    //         'contact' => $user->getContact() !== null ? $user->getContact() : [],
    //         'aboutme' => $user->getAboutMe() !== null ? $user->getAboutMe() : []
    //     ];
    // }

    //return some tag when user set his profile
    //like contact, adress...
    public function getSettingTag($tag, $userId) {
        $qb = $this->repository->getDocumentManager()->createQueryBuilder('OP\UserBundle\Document\User');

        $qb ->field('id')->equals($userId);
        $user = $qb->getQuery()->execute()->getSingleResult();

        if($tag === 'notification')
            return $user->getNotification() !== null ? $user->getNotification() : [];
        else if($tag === 'adress') 
            return $user->getAddress() !== null ? $user->getAddress() : [];//TO DO::rename
        else if($tag === 'contact')
            return $user->getContact() !== null ? $user->getContact() : [];
        else if($tag === 'aboutme')
            return $user->getAboutMe() !== null ? $user->getAboutMe() : [];
        else if($tag === 'security')
            return $user;
        else
            return $user;
    }

    public function loadUsernamesByString($normalStr) 
    {
        $usernames  = [];
         $qb = $this->repository->getDocumentManager()
                    ->createQueryBuilder('OP\UserBundle\Document\User');
                    
        $qb ->addOr(
                $qb ->expr()
                    ->field('username')->equals(new \MongoRegex('/^'.$normalStr.'.*/i'))
            )
            //to implement later
            // ->addOr(
            //  $qb ->expr()
            //          ->field('username')->equals(new \MongoRegex('/^'.$inversedStr.'.*/i'))
            // )
            ->select('username')
            ->hydrate(false);

            $users = $qb->getQuery()->execute()->toArray();
            foreach ($users as $u) {
                $usernames[] = $u['username'];
            }

        return $usernames;
    }
}
