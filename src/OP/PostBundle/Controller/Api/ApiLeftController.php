<?php
namespace OP\PostBundle\Controller\Api;

use OP\PostBundle\Document\LeftComment, 
    OP\PostBundle\Form\LeftCommentType,
    OP\PostBundle\Event as PostEvents,
    OP\UserBundle\Security\UserProvider,
//    Nelmio\ApiDocBundle\Annotation\ApiDoc,
    FOS\RestBundle\Controller\Annotations,
    Symfony\Component\HttpFoundation\Request,
    FOS\RestBundle\Controller\FOSRestController,
    FOS\RestBundle\Routing\ClassResourceInterface,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\PostBundle\FormHandler\NewPostFormHandler,
    OP\PostBundle\DataTransformer\ToArrayTransformer,
    OP\PostBundle\Notification\RealTimePost,
    OP\SocialBundle\DocumentManager\NotificationManager,
    Symfony\Component\EventDispatcher\EventDispatcherInterface;

/**
 * @Annotations\RouteResource("lefts", pluralize=false)
 */
class ApiLeftController extends FOSRestController implements ClassResourceInterface
{

    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }

    
    /**
     * Lists all follows Post posts.
     * @Annotations\Get("/lefts/load/{postId}")
     *
     * @return Integer
     */
    public function loadAction(Request $request, $postId,  ToArrayTransformer $transformer)
    {
        $res    = new JsonResponse();
        $dm     = $this->getDocumentManager();
        $comment= $dm->getRepository('OPPostBundle:LeftComment')->load($postId);
        if(!$comment) {
            return $res->setData(array('comment'=>[]));
        }
        return $res->setData(array('comment'=> $transformer->opinionCommentToArray($comment, 'leftcomment')));
    }

    /**
     * Lists all follows Post posts.
     * @Annotations\Get("/lefts/load_all/{postId}")
     *
     * @return Integer
     */
    public function loadAllAction(Request $request, $postId, ToArrayTransformer $transformer)
    {
        $notIn   = $request->query->get('ids');
        $dm      = $this->getDocumentManager();
        $refer   = $request->query->get('refer');
        $comments = $dm->getRepository('OPPostBundle:LeftComment')
                        ->loadComments($postId, $refer, $notIn);

        $res = new JsonResponse();
        return $res->setData($transformer->opinionCommentsToArray($comments, 'leftcomment'));
    }

    /**
     * Creates a new Post post.
     *
     * @Annotations\Post("/lefts/add/")
     *
     * @return object
     */
    public function addAction(Request $request, NewPostFormHandler $formHandler, EventDispatcherInterface $dispatcher, ToArrayTransformer $transformer, NotificationManager $notifMan)
    {

        $res         = new JsonResponse();
        $commentForm = $this->createForm(LeftCommentType::class, new LeftComment());
        if($comment = $formHandler->process($commentForm, false)) {
            $data   = $transformer->opinionCommentObjectToArray($comment, 'leftcomment');
            $this->notify($request, $comment, $notifMan);
            $dispatcher->dispatch(PostEvents\OPPostEvents::LEFT_COMMENT_CREATE, 
                                    new PostEvents\LeftCommentEvent($data));
            return $res->setData(array('comment'=>$data));
        } else {
            return $res->setData(array('comment'=>null));
        }
    }

    /**
    * Create some notification for all users subscribed
    *
    */
    protected function notify(Request $request, LeftComment $comment, $notifMan)
    {
        $notifMan->leftNotif($comment);
    }

    /**
     * Finds a Post post.
     *
     * @Annotations\Get("lefts/show/{id}")
     *
     * @param string $id The post ID
     * @param Request $request The request object
     *
     * @return object
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If post doesn't exists
     */
    public function showAction(Request $request, $id, ToArrayTransformer $transformer, RealTimePost $realtime_post)
    {
        $dm = $this->getDocumentManager();
        $post = $dm->getRepository('OPPostBundle:Post')->simpleFindById($id);
        if (!$post) {
            throw $this->createNotFoundException('Unable to find Post post.');
        }
        
        $realtime_post->publish($this->_getUser()->getId(), "initiale message de from");
        $post_arr = $transformer->postToArray($post);
        
        // $redis = $this->get('snc_redis.default');
        // $onlines = $redis->sinter('valll');
        // $users = [];
        // foreach ($onlines as $online) {
        //     $users[] = unserialize($online);
        // }
//        $response = new JsonResponse();
////        return $response->setData(array('postAuthor'=>$postArray));
        return $this->render('OPPostBundle:Post:post_show.html.twig', array('post'=>$post_arr));
    }

    /**
     * Displays a form to edit an existing Post post and update.
     *
     * @Annotations\Put("/lefts/edit/{id}")
     *
     * @param string $id The post ID
     *
     * @return object
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If post doesn't exists
     */
    public function editAction(Request $request, $id, NewPostFormHandler $formHandler, EventDispatcherInterface $dispatcher, ToArrayTransformer $transformer, NotificationManager $notifMan)
    {     
        $res        = new JsonResponse();
        $dm         = $this->getDocumentManager();
        $dbCom      = $dm->getRepository('OPPostBundle:Comment')->find($id);

        if (!$dbCom)
            return; //throw $this->createNotFoundException('Unable to find Post post.');
        $form       = $this->createForm(CommentType::class, $dbCom);
        if($comment = $formHandler->process($form, true)) {
            $this->notify($comment, $notifMan);
            $dispatcher->dispatch(PostEvents\OPPostEvents::COMMENT_CREATE, 
                                    new PostEvents\CommentEvent($comment));
            return $res->setData(array('comment'=>$transformer->commentObjectToArray($comment)));
        }
        else { 
            return $res->setData(array('comment'=>null)); 
        }
    }

    /**
     * Deletes a Post post.
     *
     * @Annotations\Post("/lefts/remove/{id}")
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
        $res    = new JsonResponse();
        $dm     = $this->getDocumentManager();
        $com    = $dm->getRepository('OPPostBundle:Comment')->find($id);
        if (!$com) {
            throw $this->createNotFoundException('Unable to find Post post.');
        }
        $dm->remove($com);
        $dm->flush();
        return $res->setData(array('data'=>true));
    }
    
    /**
     * Mask a Post post.
     *
     * @Annotations\Post("/lefts/mask/{id}")
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
        $res    = new JsonResponse();
        $dm     = $this->getDocumentManager();
        $com    = $dm->getRepository('OPPostBundle:Comment')->find($id);
        if (!$com) {
            throw $this->createNotFoundException('Unable to find Post post.');
        }
        $com->doMaskersForUserIds($this->_getUser()->getId());
        $dm->flush($com);
        return $res->setData(array('data'=>$this->_getUser()->getId()));
    }

    public function _getUser()
    {
        return $this->user_provider->getHydratedUser();
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
