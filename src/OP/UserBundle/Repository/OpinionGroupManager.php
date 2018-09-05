<?php
namespace OP\UserBundle\Repository;

use OP\UserBundle\Document\User,
    FOS\UserBundle\Model\UserInterface,
    Doctrine\ODM\MongoDB\DocumentRepository,
    Doctrine\ODM\MongoDB\DocumentManager,
    Doctrine\Common\Persistence\ObjectManager,
    FOS\UserBundle\Util\CanonicalFieldsUpdater,
    FOS\UserBundle\Util\PasswordUpdaterInterface,
    FOS\UserBundle\Doctrine\GroupManager as BaseManager;


/**
 * This class extends the default fos user bundle doctrine usermanager to fit my own user entity.
 */
class OpinionGroupManager extends BaseManager
{
    protected $objectManager;
    protected $class;
    protected $repository;

    public function __construct(ObjectManager $om, $class) {
        parent::__construct($om, $class);
        $this->objectManager = $om;
        $this->repository = $om->getRepository($class);

        $metadata = $om->getClassMetadata($class);
        $this->class = $metadata->getName();
    }

    /**
     * {@inheritdoc}
     */
    public function findGroupById($id)
    {
        return $this->findGroupBy(array('id' => $id));
    }

    /* this method return an array of users from the database
    *
    */
    public function loadUsers($searchString){
            $qb = $this->repository->getDocumentManager()->createQueryBuilder('OP\UserBundle\Document\User');
            $users = [];        $lastname = '';
            $name = 's'.' '.$searchString;
            $name_array = explode(' ', $name);          //explode the searchString
            $firstname = $name_array[1];
            if(sizeof($name_array)==2){         //if users tape single string
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
                    $qb ->field('locked')->equals(false)->field('enabled')->equals(true)
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

    public function memberGroups($member, $initIds, $limit = 10) {

        $qb = $this->repository->createQueryBuilder();

        $qb 
            ->limit($limit)
            ->field('id')->notIn($initIds)
            ->field('membersIds')->equals($member->getId());

        $groups = $qb->getQuery()->execute()
                    ->toArray();
        return $groups;

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
            ->select('id', 'username', 'firstname', 'lastname', 'profilePic')
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
