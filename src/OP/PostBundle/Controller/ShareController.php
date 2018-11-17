<?php

namespace OP\PostBundle\Controller;

use OP\PostBundle\Document\Share,
    OP\PostBundle\Form\ShareType,
    OP\MediaBundle\Document\Image,
    OP\SocialBundle\Document\Notification,
    Symfony\Component\HttpFoundation\Request,
    OP\PostBundle\FormHandler\NewPostFormHandler,
    Symfony\Component\EventDispatcher\EventDispatcherInterface,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Method,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * Share controller.
 *
 * @Route("/pshare")
 */
class ShareController extends Controller
{
    /**
     * Deletes a Share document.
     *
     * @Route("/{id}/delete", name="pshare_delete")
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
            $document = $dm->getRepository('OPPostBundle:Share')->find($id);

            if (!$document) {
                throw $this->createNotFoundException('Unable to find Share document.');
            }

            $dm->remove($document);
            $dm->flush();
        }

        return $this->redirect($this->generateUrl('pshare'));
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
