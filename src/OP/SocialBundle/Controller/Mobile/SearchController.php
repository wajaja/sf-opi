<?php

namespace OP\SocialBundle\Controller\Mobile;

use OP\SocialBundle\Document\Search,
    OP\SocialBundle\Form\SearchType,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Method,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * Search controller.
 *
 * @Route("/search")
 */
class SearchController extends Controller
{
    /**
     * Lists all Search documents.
     *
     * @Route("/", name="search")
     * @Template()
     *
     * @return array
     */
    public function indexAction()
    {
        $dm = $this->getDocumentManager();

        $documents = $dm->getRepository('OPSocialBundle:Search')->findAll();

        return array('documents' => $documents);
    }

    /**
     * Displays a form to create a new Search document.
     *
     * @Route("/new", name="search_new")
     * @Template()
     *
     * @return array
     */
    public function newAction()
    {
        $document = new Search();
        $form = $this->createForm(new SearchType(), $document);

        return array(
            'document' => $document,
            'form'     => $form->createView()
        );
    }

    /**
     * Creates a new Search document.
     *
     * @Route("/create", name="search_create")
     * @Method("POST")
     * @Template("OPSocialBundle:Search:new.html.twig")
     *
     * @param Request $request
     *
     * @return array
     */
    public function createAction(Request $request)
    {
        $document = new Search();
        $form     = $this->createForm(new SearchType(), $document);
        $form->bind($request);

        if ($form->isValid()) {
            $dm = $this->getDocumentManager();
            $dm->persist($document);
            $dm->flush();

            return $this->redirect($this->generateUrl('search_show', array('id' => $document->getId())));
        }

        return array(
            'document' => $document,
            'form'     => $form->createView()
        );
    }

    /**
     * Finds and displays a Search document.
     *
     * @Route("/{id}/show", name="search_show")
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

        $document = $dm->getRepository('OPSocialBundle:Search')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find Search document.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return array(
            'document' => $document,
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Displays a form to edit an existing Search document.
     *
     * @Route("/{id}/edit", name="search_edit")
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

        $document = $dm->getRepository('OPSocialBundle:Search')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find Search document.');
        }

        $editForm = $this->createForm(new SearchType(), $document);
        $deleteForm = $this->createDeleteForm($id);

        return array(
            'document'    => $document,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Edits an existing Search document.
     *
     * @Route("/{id}/update", name="search_update")
     * @Method("POST")
     * @Template("OPSocialBundle:Search:edit.html.twig")
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

        $document = $dm->getRepository('OPSocialBundle:Search')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find Search document.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm   = $this->createForm(new SearchType(), $document);
        $editForm->bind($request);

        if ($editForm->isValid()) {
            $dm->persist($document);
            $dm->flush();

            return $this->redirect($this->generateUrl('search_edit', array('id' => $id)));
        }

        return array(
            'document'    => $document,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Deletes a Search document.
     *
     * @Route("/{id}/delete", name="search_delete")
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
            $document = $dm->getRepository('OPSocialBundle:Search')->find($id);

            if (!$document) {
                throw $this->createNotFoundException('Unable to find Search document.');
            }

            $dm->remove($document);
            $dm->flush();
        }

        return $this->redirect($this->generateUrl('search'));
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
