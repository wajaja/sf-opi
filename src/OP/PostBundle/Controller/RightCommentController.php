<?php

namespace OP\PostBundle\Controller;

use OP\MediaBundle\Document\Image,
    OP\PostBundle\Document\RightComment,
    OP\PostBundle\Form\RightCommentType,
    OP\SocialBundle\Document\Notification,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Component\HttpFoundation\File\UploadedFile,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Method,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;


/**
 * RightComment controller.
 *
 * @Route("/rightcomment")
 */
class RightCommentController extends Controller
{
    /**
     * Lists all RightComment documents.
     *
     * @Route("/", name="rightcomment")
     * @Template()
     *
     * @return array
     */
    public function indexAction()
    {
        $dm = $this->getDocumentManager();

        $documents = $dm->getRepository('OPPostBundle:RightComment')->findAll();

        return array('documents' => $documents);
    }

    /**
     * Displays a form to create a new RightComment document.
     *
     * @Route("/new", name="rightcomment_new")
     * @Template()
     *
     * @return array
     */
    public function newAction()
    {
        $document = new RightComment();
        $form = $this->createForm(RightCommentType::class, $document);

        return array(
            'document' => $document,
            'form'     => $form->createView()
        );
    }

    /**
     * Lists all Comment documents.
     *
     * @Route("/{id}", name="list_right_comments")
     *
     *
     * @return array
     */
    public function listCommentsAction($id)
    {
        $dm = $this->getDocumentManager();
        $opinionId = $dm->getRepository('OPPostBundle:Opinion')->find($id);

        //Get list of Comments
        $listComments = $opinionId->getRightComments();
        return $this->render('OPPostBundle:RightComment:listcomments.html.twig', array('listComments'=>$listComments));
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
