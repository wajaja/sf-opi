<?php

namespace OP\PostBundle\Controller;

use OP\PostBundle\Document\Comment,
    OP\PostBundle\Form\CommentType,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Method,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    OP\PostBundle\FormHandler\NewPostFormHandler,
    OP\PostBundle\DataTransformer\ToArrayTransformer,
    Symfony\Component\EventDispatcher\EventDispatcherInterface,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * Comment controller.
 *
 * @Route("/comment")
 */
class CommentController extends Controller
{
    /**
     * Displays a form to create a new Plike document.
     *
     * @Route("/new/{id}", name="comment_new")
     * @Template("OPSocialBundle:Home:news.html.twig")
     *
     * @param Request $request The request object
     * @param string $id The document ID
     *
     * @return array
     */
    public function newAction(Request $request, $id)
    {
        //Get the Current UserId
        $userId = $this->_getUser()->getId();

        //find the PostId in the DB
        $dm = $this->getDocumentManager();
        $postId = $dm->getRepository('OPPostBundle:Post')->find($id);

        $comment = new Comment();
        $comment->setPostId($postId);
        $postValid = $postId->getId();
        $comment->setPostValid($postValid);
        $commentForm = $this->createForm(CommentType::class, $comment);
        $commentForm->handleRequest($request);
        return $this->render('OPPostBundle:Comment:newComment.html.twig',
                                    array('commentForm'=>$commentForm->createView(), 'postValid'=>$postValid));
    }


    /**
     * Lists all Comment documents.
     *
     * @Route("/all/{id}", name="listcomments")
     * @Template("OPSocialBundle:Home:comment.html.twig")
     *
     * @return array
     */
    public function listCommentsAction($id)
    {
        $dm = $this->getDocumentManager();
        $post = $dm->getRepository('OPPostBundle:Post')->find($id);
        
         //Get list of Comments
        $db_comments = $dm->getRepository('OPPostBundle:Comment')->findFiveLastComments($post);
        $repo = $dm->getRepository('OPPostBundle:UnderComment');
        $listComments = [];
        foreach ($db_comments as $db_comment) {
            $numbReply = $repo->countForCommentId($db_comment->getId());
            $db_comment->setNbUnder($numbReply);
            $listComments[] = $db_comment;
            
        }
        // Check if the user as allways liked that db_comment in list
        return $this->render('OPPostBundle:Comment:listComments.html.twig', array('listComments'=>$listComments, 
                                                                                'user'=>  $this->_getUser()));
    }
    
    /**
     * Lists all Comment documents.
     *
     * @Route("/plus/{postId}/{lastCommentId}", name="load_more_comment")
     * @Method("GET")
     * @Template("OPSocialBundle:Home:comment.html.twig")
     * 
     * @param Request $request
     * @param type $lastCommentId
     * @param type $postId
     * @return array of comment_list from database
     */
    public function loadMoreCommentAction(Request $request, $lastCommentId, $postId, ToArrayTransformer $transformer){
        
        $dm     = $this->getDocumentManager();
        $cRepo  = $dm->getRepository('OPPostBundle:Comment');
        $uCrepo = $dm->getRepository('OPPostBundle:UnderComment');
        $limit  = true;
        $listComments = [];
        if($request->isXmlHttpRequest()){
            $res   = new JsonResponse(); 
            $limit = false;
            $db_comments = $cRepo->loadMoreComments($lastCommentId, $postId, $limit);          
            foreach ($db_comments as $db_comment) {
                $numbReply = $uCrepo->countForCommentId($db_comment->getId());
                $db_comment->setNbUnder($numbReply);
                $listComments[] = $db_comment;
            }
           $listComments =  $transformer->commentToArray($listComments);
           return $response->setData(array('response'=>array('commentList'=>$listComments)));
        }else{
            $db_comments = $commentRepo->loadMoreComments($lastCommentId, $postId, $limit);
            foreach ($db_comments as $db_comment) {
                $numbReply = $underCrepo->countForCommentId($db_comment->getId());
                $db_comment->setNbUnder($numbReply);
                $listComments[] = $db_comment;
            }
        }        
        // Check if the user as allways liked that db_comment in list
        return $this->render('OPPostBundle:Comment:listComments.html.twig', 
            array(
                'listComments'=>$listComments, 
                'user'=>  $this->_getUser()
            )
        );
    }

    /**
     * Creates a new Comment document.
     *
     * @Route("/create/{id}", name="comment_create")
     * @Method({"POST", "GET"})
     * @Template("OPSocialBundle:Home:news.html.twig")
     *
     * @param Request $request The request object
     * @param string $id       The document ID
     *
     * @return array
     */
    public function createAction(Request $request, $id, NewPostFormHandler $formHandler, EventDispatcherInterface $dispatcher)
    {
        //$response = new JsonResponse();
        // $post = $this->getDocumentManager()->getRepository('OPPostBundle:Post')->find($id);
        // if (!$post) {
        //     $response = new JsonResponse();
        //     return $response->setData(array('response'=>array('msg'=>'Unable to find Message', 'status'=>false))); //return error
        // }
        // $comment = new Comment();
        // $comment->setPostId($post);
        // $comment->setPostValid($post->getId());  //set the value

        // $commentForm = $this->createForm(CommentType::class, $comment);

        // $notification_manager = $this->container->get('op_social.notification_manager');    //get the opinion form handler

        // //process data througt methode
        // if($request->isXmlHttpRequest()){
        //     $response = new JsonResponse();
        //     if($comment = $formHandler->process($commentForm, false)){
        //         //create some notification for all users subscribed
        //         //$csrf = $this->get('security.csrf.token_manager');
        //         $img_construct = $this->get('op_media.image_constructor');
        //         $notification_manager->commentNotif($comment);
        //         return $response->setData(array('response'=>array('status'=>true,
        //                                         'author_id'=>$comment->getAuthor()->getId(),
        //                                         'images'=>$img_construct->AjaxImageToArray($comment->getImages()),
        //                                         'comment_id'=>$comment->getId())));
        //     }else{
        //         return $response->setData(array('response'=>array('status'=>false)));
        //     }
        // }else{
        //     if($comment = $formHandler->process($commentForm, false)){
        //         $notification_manager->commentNotif($comment);
        //         return $this->redirect('\/');
        //     }else{
        //         return $this->render('OPPostBundle:Comment:newComment.html.twig',
        //                             array(  'commentForm'=>$commentForm->createView(),
        //                                     'postValid'=>$post->getId(), 'user'=>  $this->_getUser()));
        //     }
        // }
    }

    /**
     * Displays a form to edit an existing Post post and update.
     *
     * @Route("/edit/{commentId}", name="edit_comment")
     * @Template()
     * @Method({"POST", "GET"})
     * @param string $id The post ID
     *
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If post doesn't exists
     */
    public function editAction(Request $request, $commentId, NewPostFormHandler $formHandler, EventDispatcherInterface $dispatcher)
    {
        // $dm = $this->getDocumentManager();
        // $db_comment = $dm->getRepository('OPPostBundle:Comment')->find($commentId);
        // if (!$db_comment) {
        //     throw $this->createNotFoundException('Unable to find Post post.');
        // }
        // $form = $this->createForm(CommentType::class, $db_comment);
        // $response = new JsonResponse();
        // $user = $this->_getUser();
        // $img_construct = $this->get('op_media.image_constructor');
        // //process data througt methode
        // if($request->isXmlHttpRequest()){
        //     if($comment = $formHandler->process($form, true)){
        //         return $response->setData(array('response'=>array('status'=>true,
        //                                         'author_id'=>$comment->getAuthor()->getId(),
        //                                         'images'=>$img_construct->AjaxImageToArray($comment->getImages()),
        //                                         'comment_id'=>$comment->getId())));
        //     }else{
        //         return $response->setData(array('response'=>array('status'=>true,
        //                                         'images'=>$img_construct->AjaxImageToArray($db_comment->getImages()),
        //                                         'comment_id'=>$db_comment->getId())));
        //     }
        // }else{
        //     //if not XmlHttpRequest
        //     //echo var_dump($formHandler);
        //     if($comment = $formHandler->process($form, true)){
        //         return $this->redirect('\/');
        //     }else{
        //         return  $this->render('OPPostBundle:Comment:editCommentForm.html.twig', 
        //                                                             array('commentForm'=>$form->createView(), 'user'=>$user, 'commentId'=>$db_comment->getId()));
        //     }
        // }
    }

    /**
     * Deletes a Post post.
     *
     * @Route("/remove/{id}", name="comment_remove")
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
        $comment = $dm->getRepository('OPPostBundle:Comment')->find($id);

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
        $comment = $dm->getRepository('OPPostBundle:Comment')->find($id);

        if (!$comment) {
            throw $this->createNotFoundException('Unable to find Post post.');
        }
        $comment->doMaskersForUserIds($this->_getUser()->getId());
        $dm->flush($comment);
        return $response->setData(array('response'=>array('status'=>true, 'post'=>'post')));
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
