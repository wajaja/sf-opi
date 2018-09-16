<?php

namespace OP\SocialBundle\Controller\Mobile;

use OP\SocialBundle\SeveralClass\Order,
    OP\SocialBundle\Document\Notification,
    OP\SocialBundle\Form\NotificationType,
    Symfony\Component\HttpFoundation\Request,
    OP\SocialBundle\SeveralClass\DateTransformer,
    OP\SocialBundle\SeveralClass\NoteConstructor,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Method,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * Notification controller.
 *
 * @Route("/notification")
 */
class NotificationController extends Controller
{
    /**
     * Lists all Notification documents.
     *
     * @Route("/", name="notification_mobile")
     * @Template()
     *
     * @return array
     */
    public function indexAction()
    {
        // $constructor = $this->container->get('op_social.notification_constructor');
        $documents = $this->getDocumentManager()->getRepository('OPSocialBundle:Notification')->findAll();

        $notifs = [];
        foreach ($documents as $document) {
            if($target = $document->getOpinion()){
                $notifs[] = $constructor->getOpinionNote($document);
            }elseif($target = $document->getPost()){
                $notifs[] = $constructor->getPostNote($document);
            }elseif($target = $document->getComment()){
                $notifs[] = $constructor->getCommentNote($document);
            }elseif($target = $document->getUndercomment()){
                $notifs[] = $constructor->getUndercommentNote($document);
            }elseif($target = $document->getOshare()){
                $notifs[] = $constructor->getOshareNote($document);
            }elseif($target = $document->getLeftcomment()){
                $notifs[] = $constructor->getLeftcommentNote($document);
            }elseif($target = $document->getRightcomment()){
                $notifs[] = $constructor->getRightcommentNote($document);
            }elseif($target = $document->getPshare()){
                $notifs[] = $constructor->getPshareNote($document);
            }elseif($target = $document->getOlike()){
                $notifs[] = $constructor->getOlikeNote($document);
            }elseif($target = $document->getOunlike()){
                $notifs[] = $constructor->getOunlikeNote($document);
            }elseif($target = $document->getPlike()){
                $notifs[] = $constructor->getPlikeNote($document);
            }elseif($target = $document->getLlike()){
                $notifs[] = $constructor->getLlikeNote($document);
            }elseif($target = $document->getRlike()){
                $notifs[] = $constructor->getRlikeNote($document);
            }elseif($target = $document->getClike()){
                $notifs[] = $constructor->getClikeNote($document);
            }elseif($target = $document->getMcomment()){
                $notifs[] = $constructor->getMlikeNote($document);
            }else{
                //do nothing
            }
                        
        }
        $response = new JsonResponse();
        return $response->setData(array('notifs'=>$notifs));
    }

    /**
     * Displays a form to create a new Notification document.
     *
     * @Route("/new", name="notification_new")
     * @Template()
     *
     * @return array
     */
    public function newAction()
    {
        $document = new Notification();
        $form = $this->createForm(new NotificationType(), $document);

        return array(
            'document' => $document,
            'form'     => $form->createView()
        );
    }

    /**
     * Creates a new Notification document.
     *
     * @Route("/create", name="notification_create")
     * @Method("POST")
     * @Template("OPSocialBundle:Notification:new.html.twig")
     *
     * @param Request $request
     *
     * @return array
     */
    public function createAction(Request $request)
    {
        $document = new Notification();
        $form     = $this->createForm(new NotificationType(), $document);
        $form->bind($request);

        if ($form->isValid()) {
            $dm = $this->getDocumentManager();
            $dm->persist($document);
            $dm->flush();

            return $this->redirect($this->generateUrl('notification_show', array('id' => $document->getId())));
        }

        return array(
            'document' => $document,
            'form'     => $form->createView()
        );
    }

    /**
     * Finds and displays a Notification document.
     *
     * @Route("/{id}/show", name="notification_show")
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

        $document = $dm->getRepository('OPSocialBundle:Notification')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find Notification document.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return array(
            'document' => $document,
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Displays a form to edit an existing Notification document.
     *
     * @Route("/{id}/edit", name="notification_edit")
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

        $document = $dm->getRepository('OPSocialBundle:Notification')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find Notification document.');
        }

        $editForm = $this->createForm(new NotificationType(), $document);
        $deleteForm = $this->createDeleteForm($id);

        return array(
            'document'    => $document,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Edits an existing Notification document.
     *
     * @Route("/{id}/update", name="notification_update")
     * @Method("POST")
     * @Template("OPSocialBundle:Notification:edit.html.twig")
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

        $document = $dm->getRepository('OPSocialBundle:Notification')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find Notification document.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm   = $this->createForm(new NotificationType(), $document);
        $editForm->bind($request);


        if ($editForm->isValid()) {
            $dm->persist($document);
            $dm->flush();

            return $this->redirect($this->generateUrl('notification_edit', array('id' => $id)));
        }

        return array(
            'document'    => $document,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Deletes a Notification document.
     *
     * @Route("/{id}/delete", name="notification_delete")
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
        $form->bind($request);

        if ($form->isValid()) {
            $dm = $this->getDocumentManager();
            $document = $dm->getRepository('OPSocialBundle:Notification')->find($id);

            if (!$document) {
                throw $this->createNotFoundException('Unable to find Notification document.');
            }

            $dm->remove($document);
            $dm->flush();
        }

        return $this->redirect($this->generateUrl('notification'));
    }

    private function createDeleteForm($id)
    {
        return $this->createFormBuilder(array('id' => $id))
            ->add('id', 'hidden')
            ->getForm()
        ;
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
