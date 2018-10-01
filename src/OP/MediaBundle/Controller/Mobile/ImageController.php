<?php

namespace OP\MediaBundle\Controller\Mobile;

use OP\MediaBundle\Document\Image,
    OP\MediaBundle\Form\ImageType,
    OP\PostBundle\Document\Post,
    OP\PostBundle\Document\Comment,
    OP\PostBundle\Form\CommentType,
    OP\UserBundle\Security\UserProvider,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\SocialBundle\DocumentManager\NotificationManager,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Method,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;


/**
 * Image controller.
 *
 * @Route("/image")
 */
class ImageController extends Controller
{
    /**
     * Lists all Image documents.
     *
     * @Route("/", name="m_image", host="m.opinion.com")
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
     * Creates a new Image document.
     * use post Document as model for gallery
     *
     * @Route("/create", name="m_gallery_create", host="m.opinion.com")
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
     * Finds and displays a Image document.
     *
     * @Route("/{id}/show", name="m_image_show", host="m.opinion.com")
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

        $document = $dm->getRepository('OPMediaBundle:Image')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find Image document.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return array(
            'document' => $document,
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Displays a form to edit an existing Image document.
     *
     * @Route("/{id}/edit", name="m_image_edit", host="m.opinion.com")
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
     * @Route("/{id}/update", name="m_image_update", host="m.opinion.com")
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
     * @Route("/{id}/delete", name="m_image_delete", host="m.opinion.com")
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
}
