<?php
namespace OP\PostBundle\Controller\Api;

use OP\PostBundle\Event\OPPostEvents,
    OP\PostBundle\Document\UnderComment,
    OP\PostBundle\Form\UnderCommentType,
    OP\PostBundle\Event\UnderCommentEvent,
    OP\UserBundle\Security\UserProvider,
    Nelmio\ApiDocBundle\Annotation as Doc,
    FOS\RestBundle\Controller\Annotations,
    Symfony\Component\HttpFoundation\Request,
    FOS\RestBundle\Controller\FOSRestController,
    FOS\RestBundle\Routing\ClassResourceInterface,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\PostBundle\FormHandler\NewPostFormHandler,
    OP\PostBundle\Notification\RealTimePost,
    OP\PostBundle\DataTransformer\ToArrayTransformer,
    OP\SocialBundle\DocumentManager\NotificationManager,
    Symfony\Component\EventDispatcher\EventDispatcherInterface,
    FOS\RestBundle\Controller\Annotations\RouteResource;

/**
 * @RouteResource("undercomments", pluralize=false)
 */
class ApiUnderCommentController extends FOSRestController implements ClassResourceInterface
{

    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }
    
    /**
     * Lists all follows Post posts.
     * @Annotations\Get("/undercomments/load/{commentId}")
     *
     * @return Integer
     */
    public function loadAction($commentId, ToArrayTransformer $transformer)
    {
        $replies     = [];
        $dm          = $this->getDocumentManager();
        $user_id     = $this->_getUser()->getId();
        $records     = $dm->getRepository('OPPostBundle:UnderComment')
                          ->loadTenUnderComments($commentId, $user_id);
        foreach ($records as $record) {               
            $replies[] = $transformer->underCommentToArray($record);
        }
        $res = new JsonResponse();
        return $res->setData(array('comments'=>$replies));
    }

    /**
     * Lists all follows Post posts.
     * @Annotations\Get("/undercomments/loadmore/{postId}")
     *
     * @return Integer
     */
    public function loadmoreAction(Request $request, $postId, ToArrayTransformer $transformer)
    {
        $ids        = $request->query->get('ids');
        $comments   = [];
        $dm         = $this->getDocumentManager();
        $user       = $this->_getUser();
        foreach ($ids as $id) {
            $comment = $dm->getRepository('OPPostBundle:UnderComment')
                        ->findSimpleCommentById($id);
            //post not found or masked
            if(!$comments || in_array($comment['author']['$id'], $this->objectsToIds($user->getBlockedsWithMe()))) {
                continue;
            }
            else {                
                $comments[] = $transformer->commentToArray($post);
            }
        }

        $response = new JsonResponse();
        return $response->setData(array('comments'=>$comments));
    }

    /**
     * Creates a new Post post.
     *
     * @Annotations\Post("/undercomments/add/")
     *
     * @return object
     */
    public function addAction(Request $request, NewPostFormHandler $formHandler, EventDispatcherInterface $dispatcher, NotificationManager $notifMan)
    {

        $res   = new JsonResponse();
        $form  = $this->createForm(UnderCommentType::class, new UnderComment());
        if($comment = $formHandler->process($form, false)) {
            $this->notify($comment, $notifMan);
            $data = $transformer->underCommentObjectToArray($comment);
            $dispatcher->dispatch(OPPostEvents::UNDERCOMMENT_CREATE, new UnderCommentEvent($data));
            return $res->setData(array('comment'=> $data));
        }
        else { return $res->setData(array('comment'=>null)); }
    }

    /**
    * Create some notification for all users subscribed
    *
    */
    protected function notify(UnderComment $comment, $nm)
    {
        $nm->underCommentNotif($comment);
    }

    /**
     * Finds a Post post.
     *
     * @Annotations\Get("undercomments/show/{id}")
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
        $post = $dm->getRepository('OPPostBundle:UnderComment')->simpleFindById($id);
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
     * @Annotations\Put("/undercomments/edit/{id}")
     *
     * @param string $id The post ID
     *
     * @return object
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If post doesn't exists
     */
    public function editAction(Request $request, $id, NewPostFormHandler $formHandler, EventDispatcherInterface $dispatcher, ToArrayTransformer $transformer, NotificationManager $notifMan)
    {     
        $res     = new JsonResponse();
        $dm      = $this->getDocumentManager();
        $dbCom   = $dm->getRepository('OPPostBundle:UnderComment')->find($id);

        if (!$dbCom)
            return; //throw $this->createNotFoundException('Unable to find Post post.');
        $form  = $this->createForm(UnderCommentType::class, $dbCom);
        if($comment = $formHandler->process($form, true)) {
            $this->notify($comment, $notifMan);
            $dispatcher->dispatch(OPPostEvents::UNDERCOMMENT_UPDATE, new UnderCommentEvent($comment));
            return $res->setData(array('comment'=>$transformer->underCommentObjectToArray($comment)));
        }
        else { 
            return $res->setData(array('comment'=>null)); 
        }
    }

    /**
     * Deletes a Post post.
     *
     * @Annotations\Post("/undercomments/remove/{id}")
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
        $com    = $dm->getRepository('OPPostBundle:UnderComment')->find($id);
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
     * @Annotations\Post("/undercomments/mask/{id}")
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
        $dm->flush($comment);
        return $res->setData(array('data'=>$this->_getUser()->getId()));
    }

    public function _getUser()
    {
        return $this->user_provider->getHydratedUser();
    }

    /**
    * Convert array objects from database in 
    * single array of ids
    *@param array Users $objects
    */
    public function objectsToIds($objects)
    {
        $ids = [];
        foreach ($objects as $object) {
            $ids[] = $object->getId();
        }
        return $ids;
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
