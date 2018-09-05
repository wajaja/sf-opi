<?php

namespace OP\MediaBundle\Controller;

use OP\MediaBundle\Document\Document,
    OP\MediaBundle\Form\DocumentType,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Method,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
    

/**
 * Document controller.
 *
 * @Route("/document")
 */
class DocumentController extends Controller
{
    /**
     * Lists all Document documents.
     *
     * @Route("/", name="document")
     * @Template()
     *
     * @return array
     */
    public function indexAction()
    {
        $dm = $this->getDocumentManager();

        $documents = $dm->getRepository('OPMediaBundle:Document')->findAll();

        return array('documents' => $documents);
    }

    /**
     * Displays a form to create a new Document document.
     *
     * @Route("/new", name="document_new")
     * @Template()
     *
     * @return array
     */
    public function newAction()
    {
        $document = new Document();
        $form = $this->createForm(new DocumentType(), $document);

        return array(
            'document' => $document,
            'form'     => $form->createView()
        );
    }

    /**
     * Creates a new Document document.
     *
     * @Route("/create", name="document_create")
     * @Method("POST")
     * @Template("OPMediaBundle:Document:new.html.twig")
     *
     * @param Request $request
     *
     * @return array
     */
    public function createAction(Request $request)
    {
        $document = new Document();
        $form     = $this->createForm(new DocumentType(), $document);
        $form->bind($request);

        if ($form->isValid()) {
            $dm = $this->getDocumentManager();
            $dm->persist($document);
            $dm->flush();

            return $this->redirect($this->generateUrl('document_show', array('id' => $document->getId())));
        }

        return array(
            'document' => $document,
            'form'     => $form->createView()
        );
    }

    /**
     * Finds and displays a Document document.
     *
     * @Route("/{id}/show", name="document_show")
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

        $document = $dm->getRepository('OPMediaBundle:Document')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find Document document.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return array(
            'document' => $document,
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Displays a form to edit an existing Document document.
     *
     * @Route("/{id}/edit", name="document_edit")
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

        $document = $dm->getRepository('OPMediaBundle:Document')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find Document document.');
        }

        $editForm = $this->createForm(new DocumentType(), $document);
        $deleteForm = $this->createDeleteForm($id);

        return array(
            'document'    => $document,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Edits an existing Document document.
     *
     * @Route("/{id}/update", name="document_update")
     * @Method("POST")
     * @Template("OPMediaBundle:Document:edit.html.twig")
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

        $document = $dm->getRepository('OPMediaBundle:Document')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find Document document.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm   = $this->createForm(new DocumentType(), $document);
        $editForm->bind($request);

        if ($editForm->isValid()) {
            $dm->persist($document);
            $dm->flush();

            return $this->redirect($this->generateUrl('document_edit', array('id' => $id)));
        }

        return array(
            'document'    => $document,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Deletes a Document document.
     *
     * @Route("/{id}/delete", name="document_delete")
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
            $document = $dm->getRepository('OPMediaBundle:Document')->find($id);

            if (!$document) {
                throw $this->createNotFoundException('Unable to find Document document.');
            }

            $dm->remove($document);
            $dm->flush();
        }

        return $this->redirect($this->generateUrl('document'));
    }

    private function createDeleteForm($id)
    {
        return $this->createFormBuilder(array('id' => $id))
            ->add('id', 'hidden')
            ->getForm()
        ;
    }
}
