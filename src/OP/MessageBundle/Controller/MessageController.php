<?php

namespace OP\MessageBundle\Controller;

use OP\MessageBundle\Document\Thread,
    OP\MessageBundle\Provider\Provider,
    OP\UserBundle\Security\UserProvider,
    OP\MediaBundle\Construct\ImageConstructor,
    OP\MessageBundle\FormModel\ReplyMessage,
    Symfony\Component\HttpFoundation\Request,
    OP\MessageBundle\Form\ReplyMessageFormType,
    OP\MessageBundle\FormModel\NewThreadMessage,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\MessageBundle\Form\NewThreadMessageFormType,
    OP\MessageBundle\DocumentManager\ThreadManager,
    OP\MessageBundle\DocumentManager\MessageManager,
    Symfony\Component\HttpFoundation\RedirectResponse,
    OP\MessageBundle\NewComposer\ThreadConstructor,
    OP\SocialBundle\DocumentManager\NotificationManager,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Method,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Template,
    OP\MessageBundle\DataTransformer\ObjectToArrayTransformer,
    OP\UserBundle\DocumentManager\InvitationManager;


class MessageController extends Controller
{

    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }

    
    /**
     * Lists all Message documents.
     *
     * @Route("/", name="inbox")
     *
     * @return array
     */
    public function inboxAction(Request $request, ThreadManager $threadMan, ObjectToArrayTransformer $transf, NotificationManager $notifMan, InvitationManager $invitMan, MessageManager $msgMan)
    {
        $thread   = $request->query->get('thread');
        $session  = $request->getSession();
        if($token = $session->get('access_token')) {
            $description  = 'Message';
            $serializer   = $this->get('jms_serializer');
            $user         = $this->_getUser();
            $nbAlerts     = $msgMan->countAlerts($user);
            $threadsData  = $threadMan->loadThreads($user, 10, []); //User, limit, initIds

            $messages = [
                'messages'  => [],
                'loading'   => false,
                'nbAlerts'  => $nbAlerts,
                'list'      => $threadsData['threads'],
                'threads'   => array(''=>''),
                'threadsIds' => $threadMan->findParticipantInboxThreadsIds($user)
            ];
                
            if(count($thread) === 24) {
                $data = $threadMan->findThreadById($thread);
                if($data) {
                    $messages = [
                        'messages'  => [],
                        'nbAlerts'  => $nbAlerts,
                        'list'      => $threadsData['threads'],
                        'threads'   => [
                            $id     => [
                                'thread' => $transf->threadObjectToArray($data),
                                'loading' => false,
                                'messages' => []
                            ]
                        ],
                        'threadsIds' => $threadMan->findParticipantInboxThreadsIds($user)
                    ];
                }
            }


            return $this->render('OPMessageBundle:Message:inbox.html.twig', [
                    // We pass an array as props
                    'initialState'  => [
                        'App'         => [
                            'sessionId'    => $session->getId()
                        ],
                        'User'          => [
                            'user'      => $serializer->toArray($user)
                        ],
                        'Auth'         => [
                            'token'    => $token,
                            'data'      => $session->get('_authData')
                        ],
                        'Notification'  => [
                            'nbAlerts'  => $notifMan->countAlerts($user),
                        ],
                        'Invitation'    => [
                            'nbAlerts'  =>  $this->get('op_user.invitation_manager')
                                                 ->countAlerts($user),
                        ],
                        'Message'       => $messages,
                        'Users'         => [
                            'defaults'  => $invitMan->loadDefaultUsers($user, []),
                        ]
                    ],
                    'title'         => 'Messages',
                    'description'   => $description, 
                    'locale'        => $request->getLocale(),
                ]);
            
        } else {
            return $this->redirect($this->generateUrl('fos_user_security_login'));
        }
    }

    /**
     * Lists all Message documents.
     *
     * @Route("/navbar/", name="op_message_navbar_inbox")
     * @Template()
     * @Method("GET")
     * @return array
     */
    public function navbarInboxAction(Request $request, Provider $provider, ThreadConstructor $threadConstr)
    {
        if(TRUE === $this->get('security.authorization_checker')->isGranted('ROLE_USER')){
            //start session and set the $lastUrl value under Session storage
            $user       = $this->_getUser();
            $response   = new JsonResponse();
            $db_threads = $provider->getInboxThreads();
            //thread constructor
            $threads    = $threadConstr->navbarThreadsConstructor($db_threads);
            if($request->isXmlHttpRequest()){
                return $response->setData(array('threads'=>$threads));
            }else{
                return $response->setData(array('threads'=>$threads));
                //redirect user to ...
            }
            //$session->set('last_thread_id', $lats_thread_id);
        }else{
        }
    }

//    /**
//     * Displays a form to create a new Message document.
//     *
//     * @Route("/create", name="messages_new_thread")
//     * @Template()
//     *
//     * @return array
//     */
//    public function newThreadAction(Request $request, ImageConstructor $img_construct, ThreadManager $threadMan)
//    {
//        $formHandler  = $this->container->get('op_message.new_thread_form.handler');
//        $response     = new JsonResponse();
//        $form         = $this->createForm(NewThreadMessageFormType::class, new NewThreadMessage());
//        $thread       = new Thread();
//
//        if($request->getMethod() === 'POST'){
//            if($request->isXmlHttpRequest()){
//                $content = $request->request->all();
//                $threadId = $content['thread_id'];// == '' ? '' : $content['thread_id'];
//                if(strlen($threadId)==24){ //24 lenght of mongodb object Id
//                    $formHandler = $this->container->get('op_message.reply_message_form.handler');
//                    $thread = $threadMan->findThreadById($threadId);       //get thread by it's id
//                    if (!$thread) {
//                        return $response->setData(array('response'=>array('msg'=>'Unable to find Message', 'status'=>false)));
//                    }
//                }
//            }
//        }
//        //return $response->setData(array('response'=>array('msg'=>'Unable to find Message', 'status'=>false)));
//        if($request->isXmlHttpRequest()){
//            if($message = $formHandler->process($form, $thread)){
//                $csrf = $this->get('security.csrf.token_manager');
//                return $response->setData(
//                    array('response'=>
//                        array(
//                            'status'    =>true,
//                            'token'     =>$csrf->refreshToken('8')->getValue(),
//                            'threadId'  =>$message->getThread()->getId(),
//                            'message_body'=>$message->getBody(),
//                            'images'    =>$img_construct->AjaxImageToArray($message->getImages()),
//                            'message_id'=>$message->getId()
//                        )
//                    )
//                );
//            }else{
//                //create new thread message in modal form
//                return $response->setData(array('thread'=> $this->renderView('OPMessageBundle:Message:ajax_newThread.html.twig',
//                                                            array('thread_form'=> $form->createView(),
//                                                                    'user'=>  $this->_getUser())),
//                                                'response'=>array('status'=>false, 'text'=>'new')));
//            }
//        }else{
//            if($message = $formHandler->process($form, $thread)){
//                return new RedirectResponse($this->container->get('router')->generate('op_message_thread_view', array(
//                'threadId' => $message->getThread()->getId()
//                )));
//            }else{
//                return $response->setData(array('ok'=>'no handle'));
//            }
//        }
//    }

    /**
     * Finds and displays a Message document.
     *
     * @Route("/thread/{threadId}", name="op_message_thread")
     * @Template()
     * @Method({"GET", "POST"})
     * @param string $threadId The document ID
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If document doesn't exists
     */
    public function threadAction($threadId, Request $request, ImageConstructor $img_construct, ThreadManager $threadMan)
    {
        $response    = new JsonResponse();
        $formHandler = $this->container->get('op_message.reply_message_form.handler');
        $thread      = $threadMan->findThreadById($threadId);       //get thread by it's id
        if (!$thread) {
            return $response->setData(array('response'=>array('msg'=>'Unable to find Message', 'status'=>false))); //return error
        }
        $thread_form = $this->createForm(ReplyMessageFormType::class, new ReplyMessage());

        if($request->isXmlHttpRequest()){       //statement if POST method
            if($message = $formHandler->process($thread_form, $thread)){
                $csrf = $this->get('security.csrf.token_manager');  //generaete new token
                return $response->setData(
                    array('response'=>
                        array(
                            'status'    =>true,
                            'token'     =>$csrf->refreshToken('5')->getValue(),
                            'message_body'=>$message->getBody(),
                            'images'    =>$img_construct->AjaxImageToArray($message->getImages()),
                            'message_id'=>$message->getId())));
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


    /**
     * Displays a form to edit an existing Message document.
     *
     * @Route("/{id}/edit", name="messages_edit")
     * @Template()
     *
     * @param string $id The document ID
     *
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If document doesn't exists
     */
    public function editThreadAction($id)
    {
        $dm = $this->getDocumentManager();

        $document = $dm->getRepository('OPMessageBundle:Message')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find Message document.');
        }

        $editForm = $this->createForm(new MessageType(), $document);
        $deleteForm = $this->createDeleteForm($id);

        return array(
            'document'    => $document,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Edits an existing Message document.
     *
     * @Route("/{id}/update", name="messages_update")
     * @Method("POST")
     * @Template("OPMessageBundle:Message:edit.html.twig")
     *
     * @param Request $request The request object
     * @param string $id       The document ID
     *
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If document doesn't exists
     */
    public function updateThreadAction(Request $request, $id)
    {
        $dm = $this->getDocumentManager();

        $document = $dm->getRepository('OPMessageBundle:Message')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find Message document.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm   = $this->createForm(new MessageType(), $document);
        $editForm->bind($request);

        if ($editForm->isValid()) {
            $dm->persist($document);
            $dm->flush();

            return $this->redirect($this->generateUrl('messages_edit', array('id' => $id)));
        }

        return array(
            'document'    => $document,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Deletes a Message document.
     *
     * @Route("/delete", name="messages_delete")
     * @Method("POST")
     *
     * @param Request $request The request object
     * @param string $id       The document ID
     *
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If document doesn't exists
     */
    public function deleteMessageAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->bind($request);

        if ($form->isValid()) {
            $dm = $this->getDocumentManager();
            $document = $dm->getRepository('OPMessageBundle:Message')->find($id);

            if (!$document) {
                throw $this->createNotFoundException('Unable to find Message document.');
            }

            $dm->remove($document);
            $dm->flush();
        }

        return $this->redirect($this->generateUrl('messages'));
    }

    /**
     * Deletes a Message document.
     *
     * @Route("/{threadId}/delete", name="messages_thread_delete")
     * @Method("POST")
     *
     * @param Request $request The request object
     * @param string $id       The document ID
     *
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If document doesn't exists
     */
    public function deleteThreadAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->bind($request);

        if ($form->isValid()) {
            $dm = $this->getDocumentManager();
            $document = $dm->getRepository('OPMessageBundle:Message')->find($id);

            if (!$document) {
                throw $this->createNotFoundException('Unable to find Message document.');
            }

            $dm->remove($document);
            $dm->flush();
        }

        return $this->redirect($this->generateUrl('messages'));
    }

    /**
     * Deletes a Message document.
     *
     * @Route("/{threadId}/undelete", name="messages_thread_undelete")
     * @Method("POST")
     *
     * @param Request $request The request object
     * @param string $id       The document ID
     *
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If document doesn't exists
     */
    public function unDeleteThreadAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->bind($request);

        if ($form->isValid()) {
            $dm = $this->getDocumentManager();
            $document = $dm->getRepository('OPMessageBundle:Message')->find($id);

            if (!$document) {
                throw $this->createNotFoundException('Unable to find Message document.');
            }

            $dm->remove($document);
            $dm->flush();
        }

        return $this->redirect($this->generateUrl('messages'));
    }

    private function createDeleteForm($id)
    {
        return $this->createFormBuilder(array('id' => $id))
            ->add('id', 'hidden')
            ->getForm()
        ;
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
}
