<?php

namespace OP\MediaBundle\Controller;

use OP\MediaBundle\Document\Image,
    OP\MediaBundle\Form\ImageType,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Method,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * Picture controller.
 *
 * @Route("/uploader")
 */
class UploaderController extends Controller
{

    /**
     * Remove An image from gallery by id in qq instance
     * @Route("/_gal_img/delete", name="delete_gallery_image")
     * @Template()
     *
     * @return array
     */
    public function removeInGalleryImageAction(Request $request)
    {
        $filename   = $request->get('filename');
        $session    = $request->getSession();
        $orphans    = $session->get('galleryimage');

        unset($orphans[$filename]);

        $session->set('galleryimage', $orphans);

        $response = new JsonResponse();
        return $response->setData(array('confirm'=>$filename));
    }

    /**
     * Remove An image from gallery by id in qq instance
     * @Route("/_gal_post/delete", name="delete_gallery_post")
     *
     * @return array
     */
    public function removeInGalleryPostAction(Request $request)
    {
        $filename   = $request->get('filename');
        $session    = $request->getSession();
        $orphans    = $session->get('gallerypost');

        unset($orphans[$filename]);

        $session->set('gallerypost', $orphans);

        $response = new JsonResponse();
        return $response->setData(array('confirm'=>$filename));
    }

    /**
     * Remove An image from gallery by id in qq instance
     * @Route("/_gal_msg/delete", name="delete_gallery_message")
     *
     * @return array
     */
    public function removeInGalleryMessageAction(Request $request)
    {
        $filename   = $request->get('filename');
        $session    = $request->getSession();
        $orphans    = $session->get('gallerymessage');

        unset($orphans[$filename]);

        $session->set('gallerymessage', $orphans);

        $response = new JsonResponse();
        return $response->setData(array('confirm'=>$filename));
    }

    /**
     * Deletes a Picture document.
     *
     * @Route("/{id}/delete", name="picture_delete")
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
        
//        if ($form->isSubmitted()){
        if ($form->isValid()) {
            $dm = $this->getDocumentManager();
            $document = $dm->getRepository('OPMediaBundle:Picture')->find($id);

            if (!$document) {
                throw $this->createNotFoundException('Unable to find Picture document.');
            }

            $dm->remove($document);
            $dm->flush();
        }

        return $this->redirect($this->generateUrl('picture'));
    }
}
