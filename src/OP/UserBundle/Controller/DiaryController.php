<?php

namespace OP\UserBundle\Controller;

use OP\UserBundle\Document\Diary,
    OP\UserBundle\Form\DiaryType,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Method,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * Diary controller.
 *
 * @Route("/diary")
 */
class DiaryController extends Controller
{
    /**
     * Lists all Diary documents.
     *
     * @Route("/", name="diary")
     * @Template()
     *
     * @return array
     */
    public function indexAction()
    {
        $dm = $this->getDocumentManager();

        $documents = $dm->getRepository('OPUserBundle:Diary')->findAll();

        return array('documents' => $documents);
    }

    /**
     * Displays a form to create a new Diary document.
     *
     * @Route("/new", name="diary_new")
     * @Template()
     *
     * @return array
     */
    public function newAction()
    {
        $document = new Diary();
        $form = $this->createForm(new DiaryType(), $document);

        return array(
            'document' => $document,
            'form'     => $form->createView()
        );
    }

    /**
     * Creates a new Diary document.
     *
     * @Route("/create", name="diary_create")
     * @Method("POST")
     * @Template("OPUserBundle:Diary:new.html.twig")
     *
     * @param Request $request
     *
     * @return array
     */
    public function createAction(Request $request)
    {
        $document = new Diary();
        $form     = $this->createForm(new DiaryType(), $document);
        $form->bind($request);

        if ($form->isValid()) {
            $dm = $this->getDocumentManager();
            $dm->persist($document);
            $dm->flush();

            return $this->redirect($this->generateUrl('diary_show', array('id' => $document->getId())));
        }

        return array(
            'document' => $document,
            'form'     => $form->createView()
        );
    }

    /**
     * Finds and displays a Diary document.
     *
     * @Route("/{id}/show", name="diary_show")
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

        $document = $dm->getRepository('OPUserBundle:Diary')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find Diary document.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return array(
            'document' => $document,
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Displays a form to edit an existing Diary document.
     *
     * @Route("/{id}/edit", name="diary_edit")
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

        $document = $dm->getRepository('OPUserBundle:Diary')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find Diary document.');
        }

        $editForm = $this->createForm(new DiaryType(), $document);
        $deleteForm = $this->createDeleteForm($id);

        return array(
            'document'    => $document,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Edits an existing Diary document.
     *
     * @Route("/{id}/update", name="diary_update")
     * @Method("POST")
     * @Template("OPUserBundle:Diary:edit.html.twig")
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

        $document = $dm->getRepository('OPUserBundle:Diary')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find Diary document.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm   = $this->createForm(new DiaryType(), $document);
        $editForm->bind($request);

        if ($editForm->isValid()) {
            $dm->persist($document);
            $dm->flush();

            return $this->redirect($this->generateUrl('diary_edit', array('id' => $id)));
        }

        return array(
            'document'    => $document,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Deletes a Diary document.
     *
     * @Route("/{id}/delete", name="diary_delete")
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
            $document = $dm->getRepository('OPUserBundle:Diary')->find($id);

            if (!$document) {
                throw $this->createNotFoundException('Unable to find Diary document.');
            }

            $dm->remove($document);
            $dm->flush();
        }

        return $this->redirect($this->generateUrl('diary'));
    }

    private function createDeleteForm($id)
    {
        return $this->createFormBuilder(array('id' => $id))
            ->add('id', 'hidden')
            ->getForm()
        ;
    }
}
