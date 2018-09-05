<?php

namespace OP\PostBundle\Controller;

use OP\PostBundle\Document\UnderComment,
    OP\PostBundle\Form\UnderCommentType,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\PostBundle\FormHandler\NewPostFormHandler,
    OP\SocialBundle\DocumentManager\NotificationManager,
    Symfony\Component\EventDispatcher\EventDispatcherInterface,
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
     * Creates a new Comment document.
     * @Method({"POST", "GET"})
     * @Route("/create/{id}", name="undercomment_create", options={"expose"=true})
     * 
     * @param Request $request The request object
     * @param string $id       The document ID
     *
     * @return array
     */
    public function createAction($id, Request $request, NewPostFormHandler $formHandler, NotificationManager $notifMan)
    {
        $undercomment = new UnderComment();
        if('POST'== $request->getMethod()){
            $comment = $this->getDocumentManager()->getRepository('OPPostBundle:Comment')->find($id);
            if (!$comment) {                
                $response = new JsonResponse();
                return $response->setData(array('response'=>array('msg'=>'Unable to find Message', 'status'=>false, 'id'=>$id))); //return error
            }
            $undercomment->setCommentId($comment);
            $undercomment->setCommentValid($comment->getId());  //set the value
        }

        $underForm = $this->createForm(UnderCommentType::class, $undercomment);

        if($request->isXmlHttpRequest()){     //process data througt methode
            $response = new JsonResponse();
            if($undercomment = $formHandler->process($underForm, false)){
                $notifMan->underCommentNotif($undercomment);
                return $response->setData(
                    array('response'=>
                        array('status'=>true,
                            'author_id'=>$undercomment->getAuthor()->getId(),
                            'images'=>$img_construct->AjaxImageToArray($undercomment->getImages()),
                            'undercomment_id'=>$undercomment->getId()
                        )
                    )
                );
            }else{
                return $response->setData(array('response'=>array('status'=>false, 'id'=>'bdgf')));
            }
        }else{
            if($undercomment = $formHandler->process($underForm, false)){
				$notification_manager = $this->container->get('op_social.notification_manager');    //get the opinion form handler
                $notification_manager->underCommentNotif($undercomment);
                return $this->redirect('\/');
            }else{
                return $this->render('OPPostBundle:UnderComment:new_underComment.html.twig',
                                    array(  'underForm'=>$underForm->createView(), 'user'=>  $this->_getUser()));
            }
        }

    }
    
    /**
     * Displays a form to edit an existing Post post and update.
     *
     * @Route("/edit/{commentId}", name="edit_undercomment")
     * @Template()
     * @Method({"POST", "GET"})
     * @param string $id The post ID
     *
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If post doesn't exists
     */
    public function editAction(Request $request, $commentId, NewPostFormHandler $formHandler)
    {
        $dm = $this->getDocumentManager();
        $db_comment = $dm->getRepository('OPPostBundle:UnderComment')->find($commentId);
        if (!$db_comment) {
            throw $this->createNotFoundException('Unable to find Post post.');
        }
        $form = $this->createForm(UnderCommentType::class, $db_comment);
        $response = new JsonResponse();
        $user = $this->_getUser();
        $img_construct = $this->get('op_media.image_constructor');
        //process data througt methode
        if($request->isXmlHttpRequest()){
            if($comment = $formHandler->process($form, true)){
                return $response->setData(array('response'=>array('status'=>true,
                                                'author_id'=>$comment->getAuthor()->getId(),
                                                'images'=>$img_construct->AjaxImageToArray($comment->getImages()),
                                                'comment_id'=>$comment->getId())));
            }else{
                return $response->setData(array('response'=>array('status'=>true,
                                                'images'=>$img_construct->AjaxImageToArray($db_comment->getImages()),
                                                'comment_id'=>$db_comment->getId())));
            }
        }else{
            //if not XmlHttpRequest
            //echo var_dump($formHandler);
            if($comment = $formHandler->process($form, true)){
                return $this->redirect('\/');
            }else{
                return  $this->render('OPPostBundle:UnderComment:editUnderForm.html.twig', 
                                                                    array('commentForm'=>$form->createView(), 'user'=>$user, 'commentId'=>$db_comment->getId()));
            }
        }
    }
    
     /**
     * Deletes a Post post.
     *
     * @Route("/remove/{id}", name="undercomment_remove")
     * @Method("POST")
     *
     * @param Request $request The request object
     * @param string $id       The post ID
     *
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If post doesn't exists
     */
    public function removeAction(Request $request, $id)
    {
        $response = new JsonResponse();
        $dm = $this->getDocumentManager();
        $comment = $dm->getRepository('OPPostBundle:UnderComment')->find($id);

        if (!$comment) {
            throw $this->createNotFoundException('Unable to find Post post.');
        }
        if($this->_getUser()->getId() === $comment->getAuthor()->getId()){
            $dm->remove($comment);
            $dm->flush();
            return $response->setData(array('response'=>array('status'=>true, 'post'=>'post')));
        }        
        return $response->setData(array('response'=>array('status'=>false, 'post'=>'post')));
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