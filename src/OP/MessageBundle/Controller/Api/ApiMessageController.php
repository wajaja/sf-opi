<?php

namespace OP\MessageBundle\Controller\Api;

use FOS\RestBundle\Controller\{
    Annotations\Get, Annotations\View, Annotations\Post, Annotations\Put,
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
    OP\MessageBundle\DocumentManager\MessageManager,
    OP\MessageBundle\FormHandler\MessageFormHandler,
    FOS\RestBundle\Routing\ClassResourceInterface,
    OP\UserBundle\Repository\OpinionUserManager,
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
            'list'      => $threadsData['threads'],  //TODO push thread_id in every metadata row :!!!!!!!
            'threads'   => array(''=>''),
            'threadsIds' => $threadMan->findParticipantInboxThreadsIds($user)
        ];

        return new JsonResponse($inbox);
    }

    /**
     * @Get("/messages/load")
     *
     * @param type $username
     */
    public function loadAction(Request $request, ThreadManager $threadMan)
    {
        $user         = $this->_getUser();
        $threadsData  = $threadMan->loadList($user, 10, 1); //User, limit, page

        return new JsonResponse($threadsData);
    }

    /**
     * @Get("/messages/load/{page}")
     *
     * @param type $username
     */
    public function loadPageAction(Request $request, int $page, ThreadManager $threadMan)
    {
        $user         = $this->_getUser();
        $threadsData  = $threadMan->loadList($user, 10, $page); //User, limit, page

        return new JsonResponse($threadsData);
    }

    /**
    *@Get("messages/alert/show")
    *Get following activities
    */
    public function getAlertAction(Request $request, MessageManager $man)
    {
        return  new JsonResponse($man->countAlerts($this->_getUser()));
    }

    /**
     *@Get("messages/alert/hide")
     *
    */
    public function hideAlertAction(MessageManager $man, OpinionUserManager $userManager) {
        $this->updateLastView($userManager);
        //$invitations = $this->invitationsToArray($invitations);
        return  new JsonResponse(['success' => true]);
    }

     /**
     * @Put("/messages/read/{id}")
     *
     */
    public function readAction(Request $request, $id, ThreadManager $threadMan)
    {
        $user   = $this->_getUser();
        $dm     = $this->getDocumentManager();
        $thread = $dm->getRepository('OPMessageBundle:Thread')->find($id);
        $threadMan->markAsReadByParticipant($thread, $user);

        return $response = new JsonResponse(['success' => true]);
    }

    /**
     * @Put("/messages/unread/{id}")
     *
     */
    public function unreadAction(Request $request, $id, ThreadManager $threadMan)
    {
        $user   = $this->_getUser();
        $dm     = $this->getDocumentManager();
        $thread = $dm->getRepository('OPMessageBundle:Thread')->find($id);
        $threadMan->markAsUnreadByParticipant($thread, $user);
        return $response = new JsonResponse(['success' => true]);
    }

    protected function updateLastView($userManager) {
        $user = $this->_getUser();
        $user->setLastMessageView(new \Datetime(null, new \DateTimeZone("UTC")));
        $userManager->updateUser($user);
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
