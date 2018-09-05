<?php

namespace OP\UserBundle\Controller;

use FOS\UserBundle\FOSUserEvents,
    FOS\UserBundle\Event\FormEvent,
    FOS\UserBundle\Model\UserInterface,
    OP\UserBundle\Security\UserProvider,
    Symfony\Component\HttpFoundation\Request,
    FOS\UserBundle\Event\FilterUserResponseEvent,
    FOS\UserBundle\Event\GetResponseUserEvent,
    OP\UserBundle\Repository\OpinionUserManager,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\MessageBundle\DocumentManager\ThreadManager,
    OP\MessageBundle\DocumentManager\MessageManager,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Symfony\Component\HttpFoundation\RedirectResponse,
    OP\UserBundle\DocumentManager\InvitationManager,
    Symfony\Component\Security\Core\Exception\AccessDeniedException;

/** Controller managing the user profile */
class InvitationController extends Controller
{

    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }
    
    public function indexAction(Request $request, MessageManager $msgMan, ThreadManager $threadMan, InvitationManager $invitMan)
    {
        $session  = $request->getSession();
        if($token = $session->get('access_token') /* && $session->get('refresh_token)*/) {
            $description    = 'Opinion Home page, news list';
            $serializer     = $this->get('jms_serializer');
            $user           = $this->_getUser();

            return $this->render('OPUserBundle:Invitation:index.html.twig', [
                // We pass an array as props
                'initialState'  => [
                    'App'         => [
                        'sessionId'    => $session->getId()
                    ],
                    'User'        => [
                        'user'      => $serializer->toArray($user)
                    ],
                    'Auth'         => [
                        'token'    => $token,
                        'data'      => $session->get('_authData')
                    ],
                    'Notification' => [
                        'nbAlerts'  => $notiMan->countAlerts($user),
                    ],
                    'Invitation'   => [
                        'nbAlerts'  =>  $invitMan->countAlerts($user)
                    ],
                    'RelationShip'   => [
                        'invitations'=> $invitMan->loadInvitations($user, [], 30),
                        'suggestions' => $invitMan->getSuggestionForUser($user, [], 20)
                    ],
                    'Message'      => [
                        'nbAlerts'  =>  $msgMan->countAlerts($user),
                        'threadsIds' => $threadMan->findParticipantInboxThreadsIds($user)
                    ],
                    'Users'        => [
                        'defaults'  => $invitMan->loadDefaultUsers($user, []),
                        'onlines'   => []
                    ],
                    'Invitation'    => [],
                ],
                'title'         => 'Invitations',
                'description'   => 'notifications list', 
                'locale'        => $request->getLocale(),
            ]);
        }
        else {
            return $this->redirect($this->generateUrl('fos_user_security_login'));
        }
    }


    /** Show the user*/
    public function AddFriendAction(Request $request, $userId, OpinionUserManager $user_manager)
    {
        $response = new JsonResponse();
        $dm       = $this->dm;
        $receiver = $user_manager->findUserBy(array('id'=>$userId));

        /*see bottom createInvitation function */
        if($invitation = $this->createInvitation($this->_getUser(),  $receiver)){
            $dm->persist($invitation);
            $this->_getUser()->addInvitation($invitation);
            $user_manager->updateUser($this->_getUser(), false);  //update user collection in db;
            $dm->flush();
            if($request->isXmlHttpRequest()){
                return $response->setData(array('response'=>array('status'=>true, 'id'=>$invitation->getId())));
            }else{
                //redirect to homepage
                return $response->setData(array('response'=>false));
            }
        }
    }


    /** Show the user*/
    public function confirmFriendAction(Request $request, OpinionUserManager $um)
    {
        $id = explode('/', $request->getPathInfo());
        $id = end($id);
        $invitation_id = $request->get('invitation_id');
        $user_id = $request->get('user_id');
        $type = 'friend';

        $response = new JsonResponse();
        if($this->createConfirmation($invitation_id, $id, $user_id, $type, $um)){
            if($request->isXmlHttpRequest()){
                return $response->setData(array('response'=>array('status'=>true)));
            }else{
                /*TODO call redirect function to return to home page */
            }
        }else{
            return $response->setData(array('response'=>array('status'=>false)));
        }
    }

    /** Show the user*/
    public function confirmFollowerAction(Request $request, OpinionUserManager $um)
    {
        $id = explode('/', $request->getPathInfo());
        $id = end($id);
        $invitation_id = $request->get('invitation_id');
        $user_id = $request->get('user_id');
        $type = 'follower';

        $response = new JsonResponse();
        if($invitation = $this->createConfirmation($invitation_id, $id, $user_id, $type, $um)){
            if($request->isXmlHttpRequest()){
                return $response->setData(array('response'=>array('status'=>true)));
            }else{
                /*TODO call redirect function to return to home page */
            }
        }else{
            return $response->setData(array('response'=>array('status'=>false)));
        }
    }

    /**
     * Show the user
     */
    public function deleteInvitationAction(Request $request, OpinionUserManager $um)
    {
        $id = explode('/', $request->getPathInfo());
        $id = end($id);
        $invitation_id = $request->get('invitation_id');
        $response = new JsonResponse();

        if($invitation_id == $id){
            $dm = $this->dm;
            $repos = $dm->getRepository('\OP\UserBundle\Document\Invitation\Invitation');
            if($invitation = $repos->deleteInvitation($invitation_id)){
                $user = $this->_getUser();

                //if this user is sender; then remove the receiver in myfriends collection
                if($invitation->getSender()->getId() == $user->getId()){
                    //remove freind from myFriends collection
                    $user->removeFriend($invitation->getReceiver());        //remove receiver
                    $um->updateUser($user, false);  //update user collection in db
                    $dm->flush();
                    if($request->isXmlHttpRequest()){
                        return $response->setData(array('response'=>array('status'=>true,
                                                                          'userId'=>$invitation->getReceiver()->getId(),
                                                                          'username'=>$invitation->getReceiver()->getId())));
                    }else{
                        /*TODO call redirect function to return to home page */
                    }
                }

                //if this->getUser is receiver; then get receiver and remove this user in myFriends array collection
                if($invitation->getReceiver()->getId() == $user->getId()){
                    //remove friends
                    $invitation->getReceiver()->removeFriend($user);        //remove user
                    $um->updateUser($invitation->getReceiver(), false);  //update user collection in db
                    $dm->flush();
                    if($request->isXmlHttpRequest()){
                        return $response->setData(array('response'=>array('status'=>true,
                                                                          'userId'=>$invitation->getSender()->getId(),
                                                                          'username'=>$invitation->getSender()->getId())));
                    }else{
                        /*TODO call redirect function to return to home page */
                        return $response->setData(array('response'=>array('status'=>true, 'id'=>$invitation->getId())));
                    }
                }
            }
        }
    }

    

    public function createInvitation (\OP\UserBundle\Document\User $sender, \OP\UserBundle\Document\User $receiver){
        $invitation = new \OP\UserBundle\Document\Invitation\Invitation();
        $invitation->setSender($sender);
        $invitation->setReceiver($receiver);
        $meta = new \OP\UserBundle\Document\Invitation\InvitationMetadata();
        $invitation->setMetadata($meta);
        /*add freind & invitation to user*/
        $sender->addFriend($receiver);
        return $invitation;

    }

    public function createConfirmation($invitation_id, $id, $user_id, $type, $um){
        if($invitation_id == $id){
            $dm = $this->getDocumentManager();

            $friend = $um->findUserBy(array('id'=>$user_id));
            $repos = $dm->getRepository('\OP\UserBundle\Document\Invitation\Invitation');

            if($repos->confirmInvitation($id)){
                $user = $this->_getUser();
                if($type == 'friend'){
                    $user->addFriend($friend);
                }elseif($type == 'follower'){
                    $user->addFollower($friend);
                }else{
                    //
                }

                $um->updateUser($user, false);  //update user collection in db
                $dm->flush();
                return true;
            }else{
                return false;
            }
        }
    }

    public function _getUser()
    {
        return $this->user_provider->getHydratedUser();
    }
}
