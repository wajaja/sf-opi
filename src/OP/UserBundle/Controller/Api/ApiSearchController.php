<?php

// /src/AppBundle/Controller/RestProfileController.php

namespace OP\UserBundle\Controller\Api;

use FOS\RestBundle\Controller\Annotations, 
    Symfony\Component\HttpFoundation\Request,
    JMS\Serializer\SerializerInterface,
    OP\UserBundle\Security\UserProvider,
    OP\UserBundle\Security\OnlineUsers,
    OP\UserBundle\Repository\OpinionUserManager,
    FOS\RestBundle\Controller\FOSRestController,
    FOS\RestBundle\Routing\ClassResourceInterface,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\UserBundle\DocumentManager\InvitationManager,
    OP\PostBundle\DataTransformer\ToArrayTransformer;

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
                    'firstname' => $u['firstname']?? null,
                    'lastname'  => $u['lastname'] ?? null,
                    'profilePic'=> $transformer->getProfilePic(u)
                );
        }

        return $res->setData(array('users'=>$users));
    }

    // /**
    // * @Annotations\Get("/search/ff/")
    // * 
    // * @Annotations\View(serializerGroups={"Default"})
    // */
    // public function getFriendsOrFollowersAction(ToArrayTransformer $transformer, OpinionUserManager $uMan) {
        
    //     $users = [];
    //     $res   = new JsonResponse();
    //     $datas = $uMan->friendsOrFollowers();

    //     foreach ($datas as $u) {
    //         $users [] = 
    //             array(
    //                 'id'        => (String)$u['_id'],
    //                 'email'     => $u['email'],
    //                 'username'  => $u['username'],
    //                 'firstname' => ['firstname'] ?? null,
    //                 'lastname'  => ['lastname'] ?? null,
    //                 'profilePic'=> $transformer->getProfilePic(u)
    //
    //             );
    //     }

    //     return $res->setData(array('users'=>$users));
    // }

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
    public function loadSuggestionsAction(Request $request, ToArrayTransformer $transformer, InvitationManager $invitMan)
    {
        $user    = $this->_getUser();
        $initIds = $request->query->get('initIds');   //initiale data from clients

        $datas  = $invitMan->getSuggestionForUser($user, [], 10);

        return new JsonResponse($datas);
    }

    /**
     * @Annotations\Get("/search/invitations")
     * 
     * @Annotations\View(serializerGroups={"Default"})
     * Note: Could be refactored to make     of the User Resolver in Symfony 3.2 onwards
     * more at : http://symfony.com/blog/new-in-symfony-3-2-user-value-resolver-for-controllers
     */
    public function loadInvitationsAction(Request $request, SerializerInterface $serializer)
    {
        $user         = $this->_getUser();
        $dm           = $this->getDocumentManager();
        // $requestedIds = $this->getMyRequestInvitationsIds($user);
        $ins  = $this->getDocumentManager()
                     ->getRepository('\OP\UserBundle\Document\Invitation\Invitation')
                     ->findRequestInvitations($user->getId(), false); //false => not confimerd

        if(!$ins) 
            return new JsonResponse([]);
            
        $datas = [];
        foreach($ins as $in){
            $datas [] = [
                'id'     => $in->getId(),
                'sender'  => $serializer->toArray($in->getSender()),
                'receiver' => $serializer->toArray($in->getReceiver())
            ];
        }

        return new JsonResponse($datas);
    }




    protected function getMyRequestInvitationsIds($user) {
        $ids         = [];
        $invitations = $this->getDocumentManager()
                            ->getRepository('\OP\UserBundle\Document\Invitation\Invitation')
                            ->findRequestInvitations($user->getId(), false); //not confimerd
        foreach ($invitations as $i) {
            $ids[] = $i['receiver_id'];
        }
        return $ids;
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