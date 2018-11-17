<?php

namespace OP\PostBundle\Controller;

use OP\PostBundle\Document\UnderComment,
    OP\PostBundle\Form\UnderCommentType,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\PostBundle\FormHandler\NewPostFormHandler,
    OP\SocialBundle\DocumentManager\NotificationManager,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Method,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * UnderComment controller.
 *
 * @Route("/undercomment")
 */
class UnderCommentController extends Controller
{
    /**
     * Get undercomment list for some comment 
     * @Method("GET")
     * @Route("/all/{commentId}", name="undercomment_list", options={"expose"=true})
     * 
     * @param Request $request
     * @param type $commentId
     * @return type
     */
    public function listUnderCommentsAction(Request $request, $commentId){
        $dm = $this->getDocumentManager();
        $underCrepo = $dm->getRepository('OPPostBundle:UnderComment');
        if($request->isXmlHttpRequest()){
            $response = new JsonResponse();
            $listComment = $underCrepo->xhrUnderComments($commentId);
            $listComments =  $postTransformer->underCommentToArray($listComment);
           return $response->setData(array('response'=>array('commentList'=>$listComments)));
        }else{
            $listComments = $underCrepo->loadtenUnderComments($commentId);
        }        
        // Check if the user as allways liked that db_comment in list
        return $this->render('OPPostBundle:UnderComment:listComments.html.twig', array('listComments'=>$listComments, 
                                                                                'user'=>  $this->_getUser()));
    }
  
    /**
     * Mask a Post post.
     *
     * @Route("/mask/{id}", name="comment_mask")
     * @Method("POST")
     *
     * @param Request $request The request object
     * @param string $id       The post ID
     *
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If post doesn't exists
     */
    public function maskAction(Request $request, $id)
    {
        $response = new JsonResponse();
        $dm = $this->getDocumentManager();
        $comment = $dm->getRepository('OPPostBundle:UnderComment')->find($id);

        if (!$comment) {
            throw $this->createNotFoundException('Unable to find Post post.');
        }
        $comment->doMaskersForUserIds($this->_getUser()->getId());
        $dm->flush($comment);
        return $response->setData(array('response'=>array('status'=>true, 'post'=>'post')));
    }

    /** Returns the DocumentManager
     * @return DocumentManager
     */
    private function getDocumentManager()
    {
        return $this->dm;
    }
}