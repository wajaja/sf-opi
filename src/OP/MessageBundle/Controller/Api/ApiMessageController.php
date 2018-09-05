<?php

namespace OP\MessageBundle\Controller\Api;

use FOS\RestBundle\Controller\{
    Annotations\Get, Annotations\View, Annotations\Post,
    Annotations\RouteResource, FOSRestController };
use OP\MessageBundle\Event\{MessageEvent, OPMessageEvents};
use OP\MessageBundle\Document\Thread,
    JMS\Serializer\SerializationContext,
    OP\UserBundle\Security\UserProvider,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\Security\Core\Security,
    OP\MessageBundle\FormModel\ReplyMessage,
    OP\MessageBundle\Form\ReplyMessageFormType,
    OP\MessageBundle\DocumentManager\ThreadManager,
    OP\MessageBundle\FormHandler\MessageFormHandler,
    FOS\RestBundle\Routing\ClassResourceInterface,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\MessageBundle\DataTransformer\ObjectToArrayTransformer,
    Symfony\Component\EventDispatcher\EventDispatcherInterface;

/**
 * @RouteResource("message", pluralize=false)
 */
class ApiMessageController extends FOSRestController implements ClassResourceInterface
{

    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }

    /**
     * @Get("/messages/inbox/")
     *
     * @param type $username
     */
    public function inboxAction(Request $request, ThreadManager $threadMan)
    {
        $user         = $this->_getUser();
        $threadsData  = $threadMan->loadThreads($user, 10, 1); //User, limit, 1

        $inbox = [
            'messages'  => [],
            'loading'   => false,
            'list'      => $threadsData['threads'],
            'threads'   => array(''=>''),
            'threadsIds' => $thread_man->findParticipantInboxThreadsIds($user)
        ];

        return new JsonResponse($inbox);
    }

    /**
     * @Get("/messages/list/{page}")
     *
     * @param type $username
     */
    public function listAction(Request $request, int $page, ThreadManager $threadMan)
    {
        $user         = $this->_getUser();
        $threadsData  = $threadMan->loadList($user, 10, $page); //User, limit, page

        return new JsonResponse($threadsData);
    }

    /**
    *@Get("messages/alert/show")
    *Get following activities
    */
    public function getAlertAction(Request $request)
    {
        // Instantiate a new client
        $client = new \GetStream\Stream\Client('sewzt6y5y29n', 'c4bdc5xpez98f5vb4pfdu7myg2zsax5ykahuem2thkmsm7d5e9ddztskjwcwdhk8');
        $response = new JsonResponse();
        $user = $this->_getUser();
        $lastReading = $user->getLastInvitationView() ? 
                            $user->getLastInvitationView() :
                            $user->getLastActivity();

        $nbInvitations = $this->getDocumentManager()
                              ->getRepository('\OP\UserBundle\Document\Invitation\Invitation')
                              ->countUnseenInvitations($user, $lastReading);

        return  $nbInvitations;
    }

    /**
     *@Get("messages/alert/hide")
     *
    */
    public function hideAlertAction() {
        $this->updateLastView();
        $dm = $this->getDocumentManager();
        $user_id = $this->_getUser()->getId();
        $invitations = $dm->getRepository('\OP\UserBundle\Document\Invitation\Invitation')
                          ->findUserInvitations($user_id, false);
        //$invitations = $this->invitationsToArray($invitations);
        return $invitations;
    }

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

     /**
     * Displays a form to create a new Message document.
     *
     * @Post("messages/create/{threadId}")
     *
     * @return array
     */
    public function createAction(Request $request, $threadId, ThreadManager $threadMan, MessageFormHandler $formHandler, EventDispatcherInterface $dispatcher, ObjectToArrayTransformer $transf)
    {
        $response   = new JsonResponse();
        $form        = $this->createForm(ReplyMessageFormType::class, new ReplyMessage());
        $thread      = $threadMan->findThreadById($threadId); 

        if (!$thread)
            return $response->setData(array('message'=> null));
 
        //second arg means thread; here  null for new thread
        if($message = $formHandler->processMessage($form, $thread)){
            $_message = $transf->messageObjectToArray($message);
            // $this->notify($post);
            $dispatcher->dispatch(OPMessageEvents::MESSAGE_SEND, new MessageEvent($_message, $threadId));
            return $response->setData(array('message'=> $_message));
        }
        else{
            return $response->setData(array('message'=> null));
        }
    }
}
