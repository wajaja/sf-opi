<?php

// /src/AppBundle/Controller/RestProfileController.php

namespace OP\UserBundle\Controller\Api;

use OP\UserBundle\Document\User,
    FOS\UserBundle\FOSUserEvents,
//     FOS\RestBundle\View\View,
    FOS\UserBundle\Event as Events,
    JMS\Serializer\DeserializationContext,
    Nelmio\ApiDocBundle\Annotation as Doc,
    FOS\RestBundle\Controller\Annotations, 
    Symfony\Component\HttpFoundation\Request,
    JMS\Serializer\SerializerInterface,
    OP\UserBundle\Security\UserProvider,
    OP\UserBundle\Security\OnlineUsers,
    OP\UserBundle\Repository\OpinionUserManager,
    FOS\RestBundle\Controller\FOSRestController,
    FOS\RestBundle\Routing\ClassResourceInterface,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Component\Security\Core\User\UserInterface,
    OP\PostBundle\DataTransformer\ToArrayTransformer,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;

/**
 * @Annotations\RouteResource("search", pluralize=false)
 */
class ApiSearchController extends FOSRestController implements ClassResourceInterface
{

    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }
    
    /**
     * @Annotations\Get("/search/load_default/")
     *
     * @param type $username
     * 
     * @Annotations\View(serializerGroups={"Default","Details"})
     * Note: Could be refactored to make     of the User Resolver in Symfony 3.2 onwards
     * more at : http://symfony.com/blog/new-in-symfony-3-2-user-value-resolver-for-controllers
     */
    public function loadDefaultAction(Request $request, ToArrayTransformer $transformer, OpinionUserManager $uMan)
    {

        $not_in = $users = [];
        $res    = new JsonResponse();
        $datas  = $uMan->loadDefault($not_in);
        foreach ($datas as $u) {
            $users [] = 
                array(
                    'id'        => (String)$u['_id'],
                    'email'     => $u['email'],
                    'username'  => $u['username'],
                    'firstname' => isset($u['firstname']) ?: null,
                    'lastname'  => isset($u['lastname']) ?: null,
                    'profilePic'=> $transformer->getProfilePic(
                        !isset($u['profilePic']) ?: (String)$u['profilePic']['$id'])
                );
        }

        return $res->setData(array('users'=>$users));
    }

    /**
    * @Annotations\Get("/search/ff/")
    * 
    * @Annotations\View(serializerGroups={"Default"})
    */
    public function getFriendsOrFollowersAction(ToArrayTransformer $transformer, OpinionUserManager $uMan) {
        
        $users = [];
        $res   = new JsonResponse();
        $datas = $uMan->friendsOrFollowers();

        foreach ($datas as $u) {
            $users [] = 
                array(
                    'id'        => (String)$u['_id'],
                    'email'     => $u['email'],
                    'username'  => $u['username'],
                    'firstname' => isset($u['firstname']) ?: null,
                    'lastname'  => isset($u['lastname']) ?: null,
                    'profilePic'=> $transformer->getProfilePic(
                        !isset($u['profilePic']) ?: (String)$u['profilePic']['$id'])
                );
        }

        return $res->setData(array('users'=>$users));
    }

    /**
    * @Annotations\Get("/search/online/")
    * 
    * @Annotations\View(serializerGroups={"Default"})
    */
    public function onlineAction(SerializerInterface $serializer, OnlineUsers $onlineMan)
    {
        $res     = new JsonResponse();
        $notIds  = [$this->_getUser()->getId()];  //blocked or me...
        $onlines = $onlineMan->online();
        $all     = [];

        foreach ($onlines as $o) {
            $u      = $serializer->deserialize($o, 'OP\UserBundle\Document\User', 'json');
            $all[]  = $serializer->toArray($u);
        }

        /**
        * SO: multidimensional-array-unique-based-on-value-not-array-key
        * + array_search() not in some id's list 
        */
        $temp  = array();
        //"Ampersand &": It passes a reference to the variable so when any variable assigned the reference 
        // is edited, the original variable is changed.
        $users = array_filter($all, function($user) use ($notIds, &$temp) {
            if (in_array($user['id'], $temp)) { //if user already exist in temp return false
                $return = false;
            } else { 
                array_push($temp, $user['id']);
                $return = true;
            }

            return !in_array($user['id'], $notIds) && $return;
        });

        return $res->setData(array('users'=> $users));
    }

    /**
     * @Annotations\Get("/search/suggestions")
     * 
     * @Annotations\View(serializerGroups={"Default","Details"})
     * Note: Could be refactored to make     of the User Resolver in Symfony 3.2 onwards
     * more at : http://symfony.com/blog/new-in-symfony-3-2-user-value-resolver-for-controllers
     */
    public function loadSuggestionsAction(Request $request, ToArrayTransformer $transformer, OpinionUserManager $uMan)
    {
        $suggestions  = [];
        $res          = new JsonResponse();
        $initIds      = $request->query->get('initIds');   //initiale data from clients
        $session      = $request->getSession();
        $dm           = $this->getDocumentManager();
        $user         = $this->_getUser();
        $requestedIds = $this->getMyRequestReceiversIds($user);
        $friendIds    = $session->get('friends_ids');
        $blockedIds   = $session->get('blockeds_ids');

        $datas  = $uMan->loadSuggestions($initIds, $friendIds, $blockedIds, $requestedIds);

        foreach ($datas as $u) {
            $suggestions [] = 
                array(
                    'id'        => (String)$u['_id'],
                    'email'     => $u['email'],
                    'username'  => $u['username'],
                    'firstname' => isset($u['firstname']) ?: null,
                    'lastname'  => isset($u['lastname']) ?: null,
                    'profilePic'=> $transformer->getProfilePic(
                        !isset($u['profilePic']) ?: (String)$u['profilePic']['$id'])
                );
        }

        return $res->setData(array('suggestions' => $suggestions ));
    }

    /**
     * @Annotations\Get("/search/invitations")
     * 
     * @Annotations\View(serializerGroups={"Default","Details"})
     * Note: Could be refactored to make     of the User Resolver in Symfony 3.2 onwards
     * more at : http://symfony.com/blog/new-in-symfony-3-2-user-value-resolver-for-controllers
     */
    public function loadInvitationsAction(Request $request)
    {
        $initIds      = [];
        $session      = $this->container->get('session');
        $dm           = $this->getDocumentManager();
        $user         = $this->_getUser();
        $requestedIds = $this->getMyRequestInitationsIds($user);
        $invitations  = $this->getDocumentManager()
                             ->getRepository('\OP\UserBundle\Document\Invitation\Invitation')
                             ->findRequestInvitations($user->getId(), false); //not confimerd
        
        if(!$invitations) return $res->setData(array('invitations' => []));
            
        $datas = [];
        foreach($invitations as $invitation){
            $i                  = [];
            $i['id']            = $invitation->getId();
            $i['receiver_id']   = $invitation->getReceiver()->getId();
            $i['sender_id']     = $invitation->getSender()->getId();
        }

        $datas [] = $user;
    }




    protected function getMyRequestReceiversIds($user) {
        $ids         = [];
        $invitations = $this->getDocumentManager()
                            ->getRepository('\OP\UserBundle\Document\Invitation\Invitation')
                            ->findRequestInvitations($user->getId(), false); //not confimerd
        foreach ($invitations as $i) {
            $ids[] = $i['receiver_id'];
        }
        return $ids;
    }

    protected function getProfilePic($id){
        $picture = $this->getDocumentManager()
                        ->getRepository('OP\MediaBundle\Document\Image')
                        ->findPhotoById($id);

        return $this->getUploadRootDir().$picture['directory'].'/'.$picture['path'];
    }
    
    protected function getUploadRootDir()
    {
        return __DIR__.'/../../../../web/uploads/';
    }

    /**
     * Gets the current authenticated user
     * See::OPMEssageBundle participantprovider
     * @return ParticipantInterface
     */
    public function _getUser()
    {
        return $this->user_provider->getHydratedUser();
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