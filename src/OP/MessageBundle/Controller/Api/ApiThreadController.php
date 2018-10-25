<?php

namespace OP\MessageBundle\Controller\Api;

use Ratchet\Wamp\Topic,
    OP\MessageBundle\Document\Thread,
    OP\MessageBundle\Event\ThreadEvent,
    OP\MessageBundle\Security\Authorizer,
    OP\UserBundle\Security\UserProvider,
    JMS\Serializer\SerializationContext,
    OP\MessageBundle\Event\MessageEvent,
    OP\MessageBundle\Event\OPMessageEvents,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\Security\Core\Security,
    OP\MessageBundle\Form\ReplyMessageFormType,
    OP\MessageBundle\DocumentManager\ThreadManager,
    FOS\RestBundle\Controller\Annotations\View,
    OP\MessageBundle\Provider\Provider,
    OP\MessageBundle\FormModel\NewThreadMessage,
    FOS\RestBundle\Controller\Annotations\Get,
    FOS\RestBundle\Controller\Annotations\Post,
    FOS\RestBundle\Controller\Annotations\Delete,
    OP\MediaBundle\Construct\ImageConstructor,
    FOS\RestBundle\Controller\FOSRestController,
    FOS\RestBundle\Routing\ClassResourceInterface,
    OP\MessageBundle\FormHandler\MessageFormHandler,
    OP\MessageBundle\DocumentManager\MessageManager,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\MessageBundle\Form\NewThreadMessageFormType,
    FOS\RestBundle\Controller\Annotations\RouteResource,
    Symfony\Component\EventDispatcher\EventDispatcherInterface,
    OP\MessageBundle\NewComposer\ThreadConstructor,
    OP\UserBundle\Repository\OpinionUserManager,
    OP\MessageBundle\DataTransformer\ObjectToArrayTransformer;

/**
 * @RouteResource("messages", pluralize=false)
 */
class ApiThreadController extends FOSRestController implements ClassResourceInterface
{

    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }
    
    /**
     * @Get("/messages/alert/unseen")
     *
     * @return Integer
     */
    public function countUnseenAction(Request $request, Provider $provider)
    {
        // Instantiate a new client
        $client = new \GetStream\Stream\Client('sewzt6y5y29n', 'c4bdc5xpez98f5vb4pfdu7myg2zsax5ykahuem2thkmsm7d5e9ddztskjwcwdhk8');
        $response = new JsonResponse();
        $user = $this->_getUser();
        $lastReading = $user->getLastMessageView() ? 
                       $user->getLastMessageView() :
                       $user->getLastActivity();

        $nbThreads = $provider->countUnseenThreads($lastReading, $user->getId());

        return  $nbThreads;
    }

    /**
    * @Get("/messages/alert/seeing")
    */
    public function seeingAction(Request $request, Provider $provider, ThreadConstructor $threadConstr, OpinionUserManager $userManager) {
        $res = new JsonResponse();
        $this->updateLastView($userManager);
        $db_threads = $provider->getInboxThreads();
        //thread constructor
        $threads = $threadConstr->navbarThreadsConstructor($db_threads);

        return $res->setData(
            array(
                'threads'=>$threads, 
                'offset'=>0,
                'total'=>12
            )
        );
    }

    /**
     * Lists all Message documents.
     *
     * @Post("/messages/notifications")
     * @return array
     */
    public function getNotificationAction(Request $request, Provider $provider, ThreadConstructor $threadConstr, OpinionUserManager $userManager)
    {
        $this->updateLastView($userManager);      //update last Message view date in user's metadata
        $user       = $this->_getUser();
        $db_threads = $provider->getInboxThreads();
        //thread constructor
        $threads = $threadConstr->navbarThreadsConstructor($db_threads);
        return $threads;
    }

    /**
     * Displays a form to create a new Message document.
     *
     * @Post("/threads/create")
     *
     * @return array
     */
    public function createAction(Request $request, ThreadManager $threadMan, MessageFormHandler $formHandler, EventDispatcherInterface $dispatcher, ObjectToArrayTransformer $transf)
    {
        $response    = new JsonResponse();
        $uniqueString= $request->get('uniqueString');
        $form        = $this->createForm(NewThreadMessageFormType::class, new NewThreadMessage());
 
        //second arg means thread; here  null for new thread
        if($message = $formHandler->processMessage($form, null)){
            $_thread  = $transf->threadObjectToArray($message->getThread());
            $_message = $transf->messageObjectToArray($message);
            // $this->notify($post);
            $dispatcher->dispatch(OPMessageEvents::THREAD_CREATE, new ThreadEvent($_thread));
            $dispatcher->dispatch(OPMessageEvents::MESSAGE_SEND, new MessageEvent($_message, $_thread['id']));
            return $response->setData(array(
                'thread'=> $_thread,
                'message'=> $_message
            ));
        }else{
            return $response->setData(array(
                'thread'=> null,
                'message'=> null
            ));
        }
    }

    /**
     * Finds a Post post.
     *
     * @Get("threads/show/{id}")
     *
     * @param string $id The post ID
     * @param Request $request The request object
     *
     * @return object
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If post doesn't exists
     */
    public function showAction(Request $request, $id, ThreadManager $threadMan, MessageManager $msgMan, ObjectToArrayTransformer $transformer)
    {
        $messages       = [];
        $user           = $this->_getUser();
        $thread         = $threadMan->findThreadById($id);
        $msgs           = $msgMan->getMessagesByThreadId($id, [], 15);

        if (!$thread) return new JsonResponse(['thread'=> null]);

        if($thread->isDeletedByParticipant($user)) {
            return new JsonResponse(['thread' => 'deleted']);
        }

        foreach ($msgs as $m) {
            $messages[] = $transformer->messageObjectToArray($m);
        }

        // Sort the data with message ascending
        // Add $messages as the last parameter, to sort by the common key
        foreach ($messages as $key => $row) {
            $message[$key]  = $row['createdAt'];
        }
        array_multisort($message, SORT_ASC, $messages);

        return new JsonResponse([
            'messages' => $messages,
            'thread'=> $transformer->threadObjectToArray($thread)
        ]);
    }

    /**
     * Finds a Post post.
     *
     * @Delete("threads/remove/{id}")
     *
     * @param string $id The post ID
     * @param Request $request The request object
     *
     * @return object
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If post doesn't exists
     */
    public function removeAction(Request $request, $id, ThreadManager $threadMan, Authorizer $auth)
    {
        $user = $this->_getUser();
        $thread = $threadMan->findThreadById($id);

        if (!$thread) {
            return new JsonResponse(['success'=> null]);
        } 
        else if($auth->canSeeThread($thread)) {
            $thread->setIsDeletedByParticipant($user, true);
            $this->getDocumentManager()->flush();
        }

        return new JsonResponse(['success' => true]);
    }

    /**
     * Finds a Post post.
     *
     * @Get("threads/threads_ids")
     *
     * @param string $id The post ID
     * @param Request $request The request object
     *
     * @return object
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If post doesn't exists
     */
    public function threadsIdsAction(Request $request, ThreadManager $threadMan)
    {
        $user       = $this->_getUser();
        $threadsIds = $threadMan->findParticipantInboxThreadsIds($user);

        if (!$threadsIds) return new JsonResponse([]);

        return new JsonResponse($threadsIds);
    }

    /**
     * @param string $threadId The document ID
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If document doesn't exists
     */
    public function threadAction($threadId, Request $request, ImageConstructor $construct, ThreadManager $threadMan)
    {
        // $img_construct = $this->get('op_media.image_constructor');
        $response = new JsonResponse();
        $request->getSession()->start();
        $formHandler = $this->container->get('op_message.reply_message_form.handler');
        $thread = $threadMan->findThreadById($threadId);       //get thread by it's id
        if (!$thread) {
            return $response->setData(array('response'=>array('msg'=>'Unable to find Message', 'status'=>false))); //return error
        }
        $thread_form = $this->createForm(ReplyMessageFormType::class, new ReplyMessage());

        if($request->isXmlHttpRequest()){       //statement if POST method
            if($message = $formHandler->process($thread_form, $thread)){
                $csrf = $this->get('security.csrf.token_manager');  //generaete new token
                return $response->setData(
                    array('response' => array(
                        'status'    =>true,
                        'token'     =>$csrf->refreshToken('5')->getValue(),
                        'message_body'=>$message->getBody(),
                        'images'    =>$construct->AjaxImageToArray($message->getImages()),
                        'message_id'=>$message->getId()
                    )
                    )
                );
            }else{
                return $response->setData(array('thread'=> $this->renderView('OPMessageBundle:Message:ajax_thread.html.twig',
                                                            array('thread_form'=> $thread_form->createView(), 'user'=>  $this->_getUser(),
                                                                         'thread'=>$thread,             'thread_id'=>$threadId))
                                          ));
            }
        }else{
            //else if no post message or error
            $csrf = $this->get('security.csrf.token_manager');
            return $response->setData(array('response'=>array('status'=>true, 'token'=>$csrf->refreshToken('5')->getValue())));
            if($message = $formHandler->process($thread_form)){
                //redirect to thread view success
                echo 'new form ';
            }else{
                //redirect to new form
                return $response->setData(array('thread'=> $this->renderView('OPMessageBundle:Message:ajax_thread.html.twig',
                                                            array('thread_form'=> $thread_form->createView(), 'user'=>  $this->_getUser(),
                                                                         'thread'=>$thread,             'thread_id'=>$threadId))
                                          ));
            }
        }
    }

    protected function updateLastView($userManager) {
        $user = $this->_getUser();
        $lastReading = new \Datetime(null, new \DateTimeZone("UTC"));
        $user->setLastMessageView($lastReading);
        $userManager->updateUser($user);
    }

    public function _getUser()
    {
        return $this->user_provider->getHydratedUser();
    }

    protected function sortMessages($data) {
        foreach ($data as $key => $row) {
            $message[$key]  = $row['createdAt'];
        }

        // Sort the data with volume descending, edition ascending
        // Add $data as the last parameter, to sort by the common key
        return array_multisort($message, SORT_ASC, $data);

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
