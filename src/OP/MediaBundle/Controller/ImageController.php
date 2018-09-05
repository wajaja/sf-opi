<?php

namespace OP\MediaBundle\Controller;

use OP\MediaBundle\Document\Image,
    OP\MediaBundle\Form\ImageType,
    OP\PostBundle\Document\Post,
    OP\PostBundle\Document\Comment,
    OP\PostBundle\Form\CommentType,
    OP\UserBundle\Security\UserProvider,
    Symfony\Component\HttpFoundation\Request,
    OP\MessageBundle\DocumentManager\ThreadManager,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\MessageBundle\DocumentManager\MessageManager,
    OP\SocialBundle\DocumentManager\NotificationManager,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Method,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * Image controller.
 *
 * @Route("/pictures")
 */
class ImageController extends Controller
{

    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }
    
    /**
     * Lists all Image documents.
     *
     * @Route("/", name="image")
     * @Template()
     *
     * @return array
     */
    public function indexAction()
    {
        $dm = $this->getDocumentManager();

        $documents = $dm->getRepository('OPMediaBundle:Image')->findAll();

        return array('documents' => $documents);
    }

    /**
     * Finds and displays a Post post.
     *
     * @Route("/{id}", name="picture_show")
     * @Method("GET")
     * @Template()
     *
     * @param string $id The post ID
     * @param Request $request The request object
     *
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If post doesn't exists
     */
    public function showAction(Request $request, $id, ThreadManager $threadMan, MessageManager $messMan, NotificationManager $notifMan)
    {
        $session  = $request->getSession();
        if($token = $session->get('access_token')) {
            $photos     = [];
            $serializer = $this->get('jms_serializer');
            $user       = $this->_getUser();
            $postId     = $request->query->get('post_id');
            $invit_man  = $this->get('op_user.invitation_manager');
            $dm         = $this->getDocumentManager();
            $data       = $dm->getRepository('OPMediaBundle:Image')->findPhotoById($id);
            if ($data) {
                $transformer = $this->get('op_media.to_array.transformer');
                $post        = $this->getPostForPhoto($postId);
            }

            $photo = $transformer->photoToArray($pic, $post);
            $photos[] = $photo;
            
            return $this->render('OPPostBundle:Post:show.html.twig', [
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
                    'Photo' => [
                        'photo' => $photo,
                        'loading'=> false,
                    ],
                    'Photos' => $photos,
                    'Notification' => [
                        'nbAlerts'  => $notifMan->countAlerts($user),
                    ],
                    'Invitation'   => [
                        'nbAlerts'  =>  $this->get('op_user.invitation_manager')
                                             ->countAlerts($user),
                    ],
                    'Message'      => [
                        'nbAlerts'  =>  $messMessage->countAlerts($user),
                        'threadsIds' => $threadMan->findParticipantInboxThreadsIds($user)
                    ],
                    'Users'        => [
                        'defaults'  => $invit_man->loadDefaultUsers($user, []),
                        'onlines'   => []
                    ],
                    'NewsFeed'     => [
                        'news'      => []
                    ],
                    'Invitation'    => [],
                ],
                'title'         => "Photo of {$photo['author']['firstname']}",
                'description'   => 'photo show', 
                'locale'        => $request->getLocale(),
            ]);
        } else {
            return $this->redirect($this->generateUrl('fos_user_security_login'));
        }
    }

    /**
     * Creates a new Image document.
     * use post Document as model for gallery
     *
     * @Route("/create", name="gallery_create")
     * @Method("POST")
     *
     * @param Request $request
     *
     * @return array
     */
    public function createGalleryAction(Request $request, NotificationManager $notifMan)
    {
        $formHandler = $this->container->get('op_media.handler');
        $image      = new Image();
        $post       = new Post();
        $form       = $this->createFormBuilder($post, array('csrf_protection'=>false))
                           ->add('title')
                           ->add('objectType')
                           ->add('type')
                           ->getForm();
        $user=$this->_getUser();
        //process data througt methode
        if($request->isXmlHttpRequest()){
            $response = new JsonResponse();
            //return $response->setData(array('response'=>array('status'=>true, 'post'=>$form)));
            $postTransformer = $this->get('op_post.object_to_array.transformer');
            if($post = $formHandler->process($form, false)){
                $commentForm = $this->notifyAndReturnCommentForm($post, $notifMan);
                return $response->setData(array('response'
                    =>array('commentForm'
                        =>$this->renderView('OPPostBundle:Comment:xhr_newComment.html.twig',
                                array('commentForm'=>$commentForm->createView(),
                                      'postValid'=>$post->getId(), 
                                      'user'=>  $this->_getUser())),
                        'post'=>$postTransformer->postObjectToArray($post))));
            }else{
                return $response->setData(array('response'=>array('status'=>false, 'token'=>'')));
            }
        }else{
            //if not XmlHttpRequest
            //echo var_dump($formHandler);
            if($post = $formHandler->process($form, false)){
                $commentForm = $this->notifyAndReturnCommentForm($post, $notifMan);
                // $realtime_post = $this->container->get('op_post.realtime_post');
                // $realtime_post->publish("channel", "initiale message");
                $postTransformer = $this->get('op_post.object_to_array.transformer');
                $post = $postTransformer->postObjectToArray($post);
                return var_dump($post); //$this->redirect('/');
            }else{
                return $this->renderView('OPSocialBundle:Home:form.html.twig', array('pform'=> $form->createView(), 'user'=>$user));
            }
        }
    }

    protected function notifyAndReturnCommentForm(Post $post, $notifMan)
    {
        $notifMan->postNotif($post);

        $comment = new Comment();
        $comment->setPostId($post);
        $comment->setPostValid($post->getId());  //set the value
        $commentForm = $this->createForm(CommentType::class, $comment);

        return $commentForm;
    }

    /**
     * Displays a form to edit an existing Image document.
     *
     * @Route("/{id}/edit", name="image_edit")
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

        $document = $dm->getRepository('OPMediaBundle:Image')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find Image document.');
        }

        $editForm = $this->createForm(ImageType::class, $document);
        $deleteForm = $this->createDeleteForm($id);

        return array(
            'document'    => $document,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Edits an existing Image document.
     *
     * @Route("/{id}/update", name="image_update")
     * @Method("POST")
     * @Template("OPMediaBundle:Image:edit.html.twig")
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

        $document = $dm->getRepository('OPMediaBundle:Image')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find Image document.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm   = $this->createForm(ImageType::class, $document);
        $editForm->handleRequest($request);
        
        //if the form is submitted separately
        //if($form->isSubmitted()){
        if ($editForm->isValid()) {
            $dm->persist($document);
            $dm->flush();

            return $this->redirect($this->generateUrl('image_edit', array('id' => $id)));
        }

        return array(
            'document'    => $document,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Deletes a Image document.
     *
     * @Route("/{id}/delete", name="image_delete")
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
        
//        if($form->isSubmitted()){
        if ($form->isValid()) {
            $dm = $this->getDocumentManager();
            $document = $dm->getRepository('OPMediaBundle:Image')->find($id);

            if (!$document) {
                throw $this->createNotFoundException('Unable to find Image document.');
            }

            $dm->remove($document);
            $dm->flush();
        }

        return $this->redirect($this->generateUrl('image'));
    }

    private function createDeleteForm($id)
    {
        return $this->createFormBuilder(array('id' => $id))
            ->add('id', 'hidden')
            ->getForm()
        ;
    }

    protected function getPostForPhoto($id) {
        $dm       = $this->getDocumentManager();
        return    $dm->getRepository('OPPostBundle:Post')->getPostForPhoto($id);
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

    public function _getUser()
    {
        return $this->user_provider->getHydratedUser();
    }
}
