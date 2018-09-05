<?php

namespace OP\UserBundle\Controller\Mobile;

use FOS\UserBundle\FOSUserEvents,
    FOS\UserBundle\Event\FormEvent,
    FOS\UserBundle\Model\UserInterface,
    OP\UserBundle\Security\OnlineUsers,
    Symfony\Component\HttpFoundation\Request,
    FOS\UserBundle\Event\FilterUserResponseEvent,
    FOS\UserBundle\Event\GetResponseUserEvent,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Symfony\Component\HttpFoundation\RedirectResponse,
    Symfony\Component\Security\Core\Exception\AccessDeniedException;

/** Controller managing the user profile */
class InvitationController extends Controller
{
    
    public function getInvitationsForUserAction(Request $request, OnlineUsers $onlineMan){
        // $dm = $this->getDocumentManager();
        // $dm->getSchemaManager()->ensureIndexes();
        // $user_id = $this->_getUser()->getId();
        // $dm->getSchemaManager()->ensureIndexes();
        // $invitations = $dm->getRepository('\OP\UserBundle\Document\Invitation\Invitation')
        //                   ->findUserInvitations($user_id, false);
        // $invitations = $this->invitationsToArray($invitations);
        // $response = new JsonResponse();
        // $user = $this->get('op_user.user_manager')->simpleUserByUsername('cedrickngeja@yahoo.fr');
        // $friends = isset($user['myFriends']) ? $user['myFriends'] : $friends = [];
        // $friend_ids = [];

        // foreach ($friends as $friend) {
        //    $friend_ids[] = (string)$friend['$id'];
        // }


        // $serializer = $this->container->get('jms_serializer');
        // $onlines = $onlineMan->online();
        // $users = [];
        // foreach ($onlines as $online) {
        //     $users[] = $serializer->deserialize($online, 'OP\UserBundle\Document\User', 'json');
        // }
        // die();
        // return $this->render('OPUserBundle:Security:test.html.twig', array('user'=> $request->getSession()->get('gallerypost')));
        //return  $response->setData(array('invitations'=>var_dump($userManager)));
    }


    /** Show the user*/
    public function AddFriendAction(Request $request, $userId)
    {
        $response = new JsonResponse();
        $dm = $this->getDocumentManager();
        $user_manager = $this->get('op_user.user_manager');
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
    public function confirmFriendAction(Request $request)
    {
        $id = explode('/', $request->getPathInfo());
        $id = end($id);
        $invitation_id = $request->get('invitation_id');
        $user_id = $request->get('user_id');
        $type = 'friend';

        $response = new JsonResponse();
        if($this->createConfirmation($invitation_id, $id, $user_id, $type)){
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
    public function confirmFollowerAction(Request $request)
    {
        $id = explode('/', $request->getPathInfo());
        $id = end($id);
        $invitation_id = $request->get('invitation_id');
        $user_id = $request->get('user_id');
        $type = 'follower';

        $response = new JsonResponse();
        if($invitation = $this->createConfirmation($invitation_id, $id, $user_id, $type)){
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
    public function deleteInvitationAction(Request $request)
    {
        $id = explode('/', $request->getPathInfo());
        $id = end($id);
        $invitation_id = $request->get('invitation_id');
        $response = new JsonResponse();

        if($invitation_id == $id){
            $dm = $this->getDocumentManager();
            $um = $this->get('op_user.user_manager');
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

    public function invitationsToArray($objects){
        $invitation = [];
        $invitations = [];
        foreach ($objects as $object) {
            $invitation['id'] = $object->getId();
            $invitation['sender']['id'] = $object->getSender()->getId();
            if($object->getSender()->getProfilePic())
                $invitation['sender']['profilepic'] = '/opinion/web/'.$object->getSender()->getProfilePic()->getWebPath();
            else
                $invitation['sender']['profilepic'] = null;
            $invitation['sender']['username'] = $object->getSender()->getUsername();
            $invitation['sender']['firstname'] = $object->getSender()->getFirstname();
            $invitation['sender']['lastname'] = $object->getSender()->getLastname();
            $invitations[] = $invitation;
        }
        return $invitations;
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

    public function createConfirmation($invitation_id, $id, $user_id, $type){
        if($invitation_id == $id){
            $dm = $this->getDocumentManager();
            $um = $this->get('op_user.user_manager');

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
}
