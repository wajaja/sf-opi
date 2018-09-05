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
     * Creates a new Share document.
     *
     * @Route("/create/{id}", name="pshare_create")
     * @Method({"POST", "GET"})
     * @Template("OPPostBundle:Share:new.html.twig")
     *
     * @param Request $request
     * @param string $id The document ID
     *
     * @return array
     */
    public function createAction(Request $request, $id, NewPostFormHandler $formHandler)
    {
        $response = new JsonResponse();
        $user = $this->_getUser();
        
        $dm = $this->getDocumentManager();
        $post = $dm->getRepository('OPPostBundle:Post')->find($id);
        if (!$post) {
            throw $this->createNotFoundException('Unable to find Post post.');
        }
        $pshare = new Share();
        $pshare->setPostId($post);
        $pshare->setPostValid($post->getId());
        $pShareForm     = $this->createForm(ShareType::class, $pshare);
        
        $formHandler = $this->container->get('op_post.handler');
        
        if($request->isXmlHttpRequest()){       //process data througt methode
            $response = new JsonResponse();
            if($share = $formHandler->process($pShareForm, false)){       
                return $response->setData(array('response'=>array('status'=>true, 'share'=>$share)));
            }else{
                return $response->setData(array('response' => $this->renderView('OPPostBundle:Share:xhr_new_pshare.html.twig',
                    array('post' => $post, 'pShareForm' => $pShareForm->createView(), 'user'=>$this->_getUser()))
                ));
            }
        }else{
            //if not XmlHttpRequest
            //echo var_dump($formHandler);
            if($share = $formHandler->process($pShareForm, false)){
                return $this->redirect('/');
            }else{
                return $response->setData(array('shareForm' => $this->renderView('OPPostBundle:Share:xhr_new_pshare.html.twig',
                    array('post' => $post, 'pShareForm' => $pShareForm->createView(), 'user'=>$this->_getUser()))
                ));
            }
        }
    }

    /**
     * Finds and displays a Share document.
     *
     * @Route("/{id}/show", name="pshare_show")
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

        $document = $dm->getRepository('OPPostBundle:Share')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find Share document.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return array(
            'document' => $document,
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Displays a form to edit an existing Share document.
     *
     * @Route("/{id}/edit", name="pshare_edit")
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

        $document = $dm->getRepository('OPPostBundle:Share')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find Share document.');
        }

        $editForm = $this->createForm(new ShareType(), $document);
        $deleteForm = $this->createDeleteForm($id);

        return array(
            'document'    => $document,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Edits an existing Share document.
     *
     * @Route("/{id}/update", name="pshare_update")
     * @Method("POST")
     * @Template("OPPostBundle:Share:edit.html.twig")
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

        $document = $dm->getRepository('OPPostBundle:Share')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find Share document.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm   = $this->createForm(new ShareType(), $document);
        $editForm->bind($request);

        if ($editForm->isValid()) {
            $dm->persist($document);
            $dm->flush();

            return $this->redirect($this->generateUrl('pshare_edit', array('id' => $id)));
        }

        return array(
            'document'    => $document,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

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
