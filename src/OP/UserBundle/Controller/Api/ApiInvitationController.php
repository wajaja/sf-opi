<?php
namespace OP\UserBundle\Controller\Api;

use FOS\UserBundle\Model\UserInterface,
//     FOS\RestBundle\View\View,
    OP\UserBundle\Document\User,
    FOS\UserBundle\FOSUserEvents,
    OP\SocialBundle\Stream\Stream,
    FOS\UserBundle\Event\FormEvent,
    JMS\Serializer\SerializationContext,
    OP\UserBundle\Security\UserProvider,
    FOS\RestBundle\Controller\Annotations,
    Nelmio\ApiDocBundle\Annotation as Doc,
    Symfony\Component\HttpFoundation\Request,
    FOS\UserBundle\Event\GetResponseUserEvent,
    FOS\RestBundle\Controller\FOSRestController,
    OP\UserBundle\Repository\OpinionUserManager,
    FOS\UserBundle\Event\FilterUserResponseEvent,
    OP\UserBundle\DocumentManager\InvitationManager,
    \OP\UserBundle\DataTransformer\ObjectToArrayTransformer,
    FOS\RestBundle\Routing\ClassResourceInterface,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\SocialBundle\DocumentManager\MailManager,
    FOS\RestBundle\Controller\Annotations\RouteResource,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter,
    Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * @RouteResource("invitations", pluralize=false)
 */
class ApiInvitationController extends FOSRestController implements ClassResourceInterface
{
    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }
    
    /**
     * @Annotations\Get("/invitations/load/suggestions")
     * 
     * @Annotations\View(serializerGroups={"Default","Details"})
     * Note: Could be refactored to make     of the User Resolver in Symfony 3.2 onwards
     * more at : http://symfony.com/blog/new-in-symfony-3-2-user-value-resolver-for-controllers
     */
    public function loadSuggestionsAction(Request $request)
    {
        $user       = $this->_getUser();
        $iManager   = $this->get('op_user.invitation_manager');
        $initIds    = $request->query->get('initIds'); //initial data from clients
        $res        = new JsonResponse();

        return $res->setData(
            array('suggestions' => $iManager->getSuggestionForUser($user, $initIds))
        );
    }

    /**
     * @Annotations\Get("/invitations/load/requests")
     * 
     * @Annotations\View(serializerGroups={"Default","Details"})
     * Note: Could be refactored to make     of the User Resolver in Symfony 3.2 onwards
     * more at : http://symfony.com/blog/new-in-symfony-3-2-user-value-resolver-for-controllers
     */
    public function loadRequestsAction(Request $request)
    {
        $initIds      = [];
        $session      = $this->container->get('session');
        $user         = $this->_getUser();
        $invitations  = $this->getDocumentManager()
                             ->getRepository('\OP\UserBundle\Document\Invitation\Invitation')
                             ->findRequestInvitations($user->getId(), false); //not confimerd
        
        if(!$invitations) return new JsonResponse([]);
            
        return new JsonResponse($this->invitationsToArray($invitations));
    }

    /**
    *@Annotations\Get("invitations/alert/show")
    *Get following activities
    */
    public function getAlertAction(Request $request)
    {
        $user       = $this->_getUser();
        $lastReading = $user->getLastInvitationView() ? 
                            $user->getLastInvitationView() :
                            $user->getLastActivity();

        $nbInvitations = $this->getDocumentManager()
                              ->getRepository('\OP\UserBundle\Document\Invitation\Invitation')
                              ->countAlerts($user, $lastReading);

        return new JsonResponse([$nbInvitations]) ;
    }

    /**
     *@Annotations\Get("invitations/alert/hide")
     *
    */
    public function hideAlertAction(InvitationManager $invitMan, ObjectToArrayTransformer $trans) {
        $invitMan->updateLastView();
        $dm = $this->getDocumentManager();
        $user_id = $this->_getUser()->getId();
        $invitations = $dm->getRepository('\OP\UserBundle\Document\Invitation\Invitation')
                          ->findUserInvitations($user_id, false);
        //$invitations = $this->invitationsToArray($invitations);
        return new JsonResponse($trans->invitationsToArray($invitations));
    }

    /**
     *@Annotations\Get("invitations/load")
     *
    */
    public function loadAction(InvitationManager $invitMan, ObjectToArrayTransformer $trans) {
        $invitMan->updateLastView();
        $dm = $this->getDocumentManager();
        $user_id = $this->_getUser()->getId();
        $invitations = $dm->getRepository('\OP\UserBundle\Document\Invitation\Invitation')
                          ->findUserInvitations($user_id, false);
        //$invitations = $this->invitationsToArray($invitations);
        return new JsonResponse($trans->invitationsToArray($invitations));
    }

    /**
    * @Annotations\Post("invitations/friend/")
    *
    */
    public function friendAction(Request $request, OpinionUserManager $um)
    {
        $res        = new JsonResponse();
        $targetId   = $request->get('targetId');
        $userId     = $request->get('userId');
        $im         = $this->get('op_user.invitation_manager');
        $sender     = $um->findUserBy(array('id' => $userId));
        $receiver   = $um->findUserBy(array('id' => $targetId));

        /*see bottom createInvitation function */
        if($invitation = $im->createInvitation($sender,  $receiver)){
            return $res->setData(array('invitation' => $invitation));
        }
        return $res->setData(array('invitation' => null));
    }


    /** 
    * @Annotations\Post("invitations/confirm/")
    *
    */
    public function confirmAction(Request $request, OpinionUserManager $um)
    {
        $res        = new JsonResponse();
        $im         = $this->get('op_user.invitation_manager');
        $targetId   = $request->get('targetId');
        $userId     = $request->get('userId');
        $sender     = $um->findUserBy(array('id' => $targetId));
        $receiver   = $um->findUserBy(array('id' => $userId));

        /*see bottom createInvitation function */
        if($confirm = $im->createConfirmation($sender,  $receiver)){
            return $res->setData(array('confirm' => true));
        }

        return $response->setData(array('confirm' => false));
    }

    /**
    * @Annotations\Post("invitations/follow/")
    *
    */
    public function followAction(Request $request, Stream $stream, OpinionUserManager $um)
    {
        $res        = new JsonResponse();
        $targetId   = $request->get('targetId');
        $userId     = $request->get('userId');
        $im         = $this->get('op_user.invitation_manager');
        $follower   = $um->findUserBy(array('id' => $userId));
        $following  = $um->findUserBy(array('id' => $targetId));

        if($demand = $im->follow($follower,  $following)){
            $stream->follow($userId, $targetId, $demand);
            return $res->setData(array('follow' => true));
        }
        return $res->setData(array('follow' => false));
    }

    /**
    * @Annotations\Post("invitations/unfollow/")
    *
    */
    public function unFollowAction(Request $request, OpinionUserManager $um)
    {
        $res        = new JsonResponse();
        $targetId   = $request->get('targetId');
        $userId     = $request->get('userId');
        $im         = $this->get('op_user.invitation_manager');
        $follower   = $um->findUserBy(array('id' => $userId));
        $following  = $um->findUserBy(array('id' => $targetId));

        /*see bottom createInvitation function */
        if($status = $im->unFollow($follower,  $following)){
            return $res->setData(array('follow' => true));
        }
        return $res->setData(array('follow' => false));
    }

    /**
     * @Annotations\Delete("invitations/delete/")
     */
    public function deleteAction(Request $request, OpinionUserManager $um)
    {
        $res        = new JsonResponse();
        $targetId   = $request->get('targetId');
        $userId     = $request->get('userId');
        $dm         = $this->getDocumentManager();
        $im         = $this->get('op_user.invitation_manager');
        $sender     = $um->findUserBy(array('id' => $targetId));
        $receiver   = $um->findUserBy(array('id' => $userId));

        /*see bottom createInvitation function */
        if($status = $im->deleteInvitation($sender, $receiver)){
            return $res->setData(array('invitation' => true));
        }

        return $res->setData(array('invitation' => false));
    }

    /**
     * @Annotations\Delete("invitations/abord/")
     */
    public function abordAction(Request $request, OpinionUserManager $um)
    {
        $res        = new JsonResponse();
        $targetId   = $request->get('targetId');
        $userId     = $request->get('userId');
        $im         = $this->get('op_user.invitation_manager');
        $sender     = $um->findUserBy(array('id' => $targetId));
        $receiver   = $um->findUserBy(array('id' => $userId));
        $repos      = $dm->getRepository('\OP\UserBundle\Document\Invitation\Invitation');
        $invitation = $repos->findInvitationByIds($userId, $targetId);

        /*see bottom createInvitation function */
        if($status = $im->deleteInvitation($invitation)){
            return $res->setData(array('invitation' => true));
        }

        return $res->setData(array('invitation' => false));
    }

    //send email
    //https://blog.intelligentbee.com/2015/12/02/send-emails-in-symfony2-the-right-way/
    public function sendEmailAction(Request $request, MailManager $mailler)
    {
        $form = $this->createForm(new ContactType());
 
        $form->handleRequest($request);
 
        //this is where we define which template to use
        $template = 'contact';
 
        if($form->isValid()){
            //Get data from the submitted form
            $data = $form->getData();
            $mail_params = array(
                'firstName' => $data["firstName"],
                'lastName'  => $data["lastName"],
                'message'   => $data["message"],
                'phoneNumber' => $data["phoneNumber"],
                'email'     => $data["email"]
            );
 
            //grab the addresses defined in parameters.yml
            $to = $this->container->getParameter('contact_email');
            $from =  $this->container->getParameter('from_email');
            $fromName = $this->container->getParameter('from_name');
 
            //use the MailManager service to send emails
            $mailler->sendEmail($template, $mail_params, $to, $from, $fromName);
 
            return $this->redirectToRoute('contact');
        }
 
        return $this->render('AppBundle:StaticPages:contact.html.twig',array(
            'form' => $form->createView()
        ));
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
     * @return DocumentManager
     */
    private function getDocumentManager()
    {
        return $this->dm;
    }
}
