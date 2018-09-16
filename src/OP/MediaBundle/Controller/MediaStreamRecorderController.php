<?php

namespace OP\MediaBundle\Controller;

use Symfony\Component\HttpFoundation\Request,
    OP\MediaBundle\Document\MediaStreamRecorder,
    OP\MediaBundle\Form\MediaStreamRecorderType,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\UserBundle\Security\UserProvider,
    JMS\Serializer\SerializerInterface,
    OP\MessageBundle\DocumentManager\ThreadManager,
    OP\MessageBundle\DocumentManager\MessageManager,
    OP\SocialBundle\DocumentManager\NotificationManager,
    OP\UserBundle\DocumentManager\InvitationManager,
    Symfony\Component\HttpFoundation\File\UploadedFile,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Method,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;


/**
 * MediaStreamRecorder controller.
 *
 * @Route("/streams")
 */
class MediaStreamRecorderController extends Controller
{
    
    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }
    
    /**
     * Lists all Image documents.
     *
     * @Route("", name="mediastreamrecorder")
     *
     * @return array
     */
    public function indexAction(Request $request, ThreadManager $threadMan, MessageManager $messMan, NotificationManager $notifMan, SerializerInterface $serializer, InvitationManager $invitMan)
    {
        $session  = $request->getSession();
        if($token = $session->get('access_token')) {
            $video  = $similar = [];
            $user   = $this->_getUser();
            $postId = $request->query->get('post_id');
            $dm     = $this->getDocumentManager();
            $videos = $dm->getRepository('OP\MediaBundle\Document\Video')->findAll();
            
            return $this->render('OPMediaBundle:Stream:index.html.twig', [
                // We pass an array as props
                'initialState' => [
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
                    'Stream' => [
                        'streams' => [
                            'list' => [],
                        ],
                        'loading'=> false,
                    ],
                    'Notification' => [
                        'nbAlerts'  => $notifMan->countAlerts($user),
                    ],
                    'Invitation'   => [
                        'nbAlerts'  =>  $invitMan->countAlerts($user),
                    ],
                    'Message'      => [
                        'nbAlerts'  =>  $messMan->countAlerts($user),
                        'threadsIds' => $threadMan->findParticipantInboxThreadsIds($user)
                    ],
                    'Users'        => [
                        'defaults'  => $invitMan->loadDefaultUsers($user, []),
                        'onlines'   => []
                    ],
                    'NewsFeed'     => [
                        'news'      => []
                    ],
                    'Invitation'    => [],
                ],
                'title'         => "My Streams",
                'description'   => 'video show', 
                'locale'        => $request->getLocale(),
            ]);
        } else {
            return $this->redirect($this->generateUrl('fos_user_security_login'));
        }
    }


    public function reserveAction(Request $request)
    {
        $notification = 'A message has been received by the server!<br />';
 
        // Handling form	
        $form = $this->createFormBuilder()->getForm();
        $form->handleRequest($request);
 
        // If form valid
        if ($form->isValid()) {
 
            // Calling PHP Redis from global namespace
            $redis = new \Redis();
 
            // Connecting on localhost and port 6379
            $redis->connect('127.0.0.1', '6379');
 
            // Creating Emitter
            $emitter = new Emitter($redis);
 
            // Emit a notification on channel 'notification'
            $emitter->emit('notification', $notification);
 
            // Returning status via JsonResponse
            $response = new JsonResponse();
            $response->setData(array(
                'notification' => $notification
            ));
 
            return $response;
 
        }
 
        return $this->render('AcmeAcmeBundle:Default:index.html.twig', array(
            'form' => $form->createView()
        ));
    }

    /**
     * Displays a form to create a new MediaStreamRecorder document.
     *
     * @Route("/new", name="mediastreamrecorder_new")
     * @Template()
     *
     * @return array
     */
    public function newAction()
    {
        $document = new MediaStreamRecorder();
        $form = $this->createForm(MediaStreamRecorderType::class, $document);

        return array(
            'document' => $document,
            'form'     => $form->createView()
        );
    }

    /**
     * Creates a new MediaStreamRecorder document.
     *
     * @Route("/create", name="mediastreamrecorder_create")
     * @Method("POST")
     * @Template("OPMediaBundle:MediaStreamRecorder:new.html.twig")
     *
     * @param Request $request
     *
     * @return array
     */
    public function createAction(Request $request)
    {
        $author = $this->_getUser();                                            //Get the Current UserId
        $dm = $this->getDocumentManager();
        $mediaStream = new MediaStreamRecorder();                                    //instatiate the objects
        $mediaStreamForm = $this->createForm(MediaStreamRecorderType::class, $mediaStream);       
        
        if('POST'=== $request->getMethod()){
            if($request->isXmlHttpRequest()){
                $contents = $request->request->all();                           //get all content by request
//                $file = var_dump($contents);                       //mediaFile
//
                $path = '';
                $size = 0;
                $originalFiles = $request->files;                               //get the uploaded Files by the request                        
                foreach($originalFiles as $file){
                    if (($file instanceof UploadedFile) && ($file->getError() == '0')) {                         
                        if (($file->getSize() < 2000000000)) {                                
                            $originalName = $file->getClientOriginalName();         //original name                            
                            $name_array = explode('.', $originalName);              //explode the $originalName String                                         
                            $file_type = $name_array[sizeof($name_array) - 1];      //get extension of file by sizeof function                                                    
                            $valid_filetypes = array('wav', 'webm', 'ogg', 'mp4');  //declared the valid types
                            
                            if (in_array(strtolower($file_type), $valid_filetypes)){    
                                $path = md5(uniqid()).'.'.$file->guessExtension(); $size = $file->getSize();  //set the path and size
                                $mediaStream->setPath($path);
                                $mediaStream->setSize($size);
                                $mediaStream->setType($file_type);
                                $mediaStream->setDirectory('mediastream');
                                $file->move($mediaStream->getUploadRootDir(), $path);  //move file
                                unset($file);                                                 //unset file                                                                             
                            } 
                            else{
                              $status = 'failed'; $message = 'Invalid File Type';
                            }
                        } 
                        else{
                            $status = 'failed'; $message = 'Size exceeds limit';
                        }
                    }
                    else{
                        $status = 'failed';  $message = 'File Error';
                    }
                   
                }
//                $mediaStream->setContent($submittedContent);                                //setting the commenrt content 
                $mediaStream->setAuthor($author);
                $dm->persist($mediaStream);
                $dm->flush();  
                return new JsonResponse(array('image'=>$mediaStream));
            }else{
                return new JsonResponse(array('contenu'=>'rien'));
            } 
        }
        return new JsonResponse(array('resultat'=>'voila que rien ne sait passe'));
    }

    /**
     * Finds and displays a MediaStreamRecorder document.
     *
     * @Route("/{id}/show", name="mediastreamrecorder_show")
     * @Template()
     *
     * @param string $id The document ID
     *
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If document doesn't exists
     */
    public function showAction($id)
    {
        $dm = $this->getDocumentManager();

        $document = $dm->getRepository('OPMediaBundle:MediaStreamRecorder')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find MediaStreamRecorder document.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return array(
            'document' => $document,
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Displays a form to edit an existing MediaStreamRecorder document.
     *
     * @Route("/{id}/edit", name="mediastreamrecorder_edit")
     * @Template()
     *
     * @param string $id The document ID
     *
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If document doesn't exists
     */
    public function editAction($id)
    {
        $dm = $this->getDocumentManager();
        $document = $dm->getRepository('OPMediaBundle:MediaStreamRecorder')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find MediaStreamRecorder document.');
        }

        $editForm = $this->createForm(MediaStreamRecorderType::class, $document);
        $deleteForm = $this->createDeleteForm($id);

        return array(
            'document'    => $document,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Edits an existing MediaStreamRecorder document.
     *
     * @Route("/{id}/update", name="mediastreamrecorder_update")
     * @Method("POST")
     * @Template("OPMediaBundle:MediaStreamRecorder:edit.html.twig")
     *
     * @param Request $request The request object
     * @param string $id       The document ID
     *
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If document doesn't exists
     */
    public function updateAction(Request $request, $id)
    {
        $dm = $this->getDocumentManager();

        $document = $dm->getRepository('OPMediaBundle:MediaStreamRecorder')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find MediaStreamRecorder document.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm   = $this->createForm(MediaStreamRecorderType::class, $document);
        $editForm->handleRequest($request);
        
//        if ($form->isSubmitted()){
        if ($editForm->isValid()) {
            $dm->persist($document);
            $dm->flush();

            return $this->redirect($this->generateUrl('mediastreamrecorder_edit', array('id' => $id)));
        }

        return array(
            'document'    => $document,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Deletes a MediaStreamRecorder document.
     *
     * @Route("/{id}/delete", name="mediastreamrecorder_delete")
     * @Method("POST")
     *
     * @param Request $request The request object
     * @param string $id       The document ID
     *
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If document doesn't exists
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->handleRequest($request);

        //if ($form->isSubmitted()){
        if ($form->isValid()) {
            $dm = $this->getDocumentManager();
            $document = $dm->getRepository('OPMediaBundle:MediaStreamRecorder')->find($id);

            if (!$document) {
                throw $this->createNotFoundException('Unable to find MediaStreamRecorder document.');
            }

            $dm->remove($document);
            $dm->flush();
        }

        return $this->redirect($this->generateUrl('mediastreamrecorder'));
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
     *
     * @return DocumentManager
     */
    private function getDocumentManager()
    {
        return $this->dm;
    }
}
