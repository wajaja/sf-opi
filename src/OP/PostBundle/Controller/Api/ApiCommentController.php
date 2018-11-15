<?php
namespace OP\PostBundle\Controller\Api;

use OP\PostBundle\Document\Comment,
    OP\PostBundle\Form\CommentType,
    OP\PostBundle\Event as PostEvents,
    Nelmio\ApiDocBundle\Annotation as Doc,
    OP\UserBundle\Security\UserProvider,
    FOS\RestBundle\Controller\Annotations,
    Symfony\Component\HttpFoundation\Request,
    FOS\RestBundle\Controller\FOSRestController,
    FOS\RestBundle\Routing\ClassResourceInterface,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\PostBundle\DataTransformer\ToArrayTransformer,
    OP\SocialBundle\DocumentManager\NotificationManager,
    FOS\RestBundle\Controller\Annotations\RouteResource,
    OP\PostBundle\FormHandler\NewPostFormHandler,
    OP\PostBundle\Notification\RealTimePost,
    Symfony\Component\EventDispatcher\EventDispatcherInterface;


/**
 * @RouteResource("comments", pluralize=false)
 */
class ApiCommentController extends FOSRestController implements ClassResourceInterface
{

    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }

    
    /**
     * Lists all follows Post posts.
     * @Annotations\Get("/comments/load/{postValid}")
     *
     * @return Integer
     */
    public function loadAction(Request $request, $postValid, ToArrayTransformer $transformer)
    {
        $comments    = [];
        $dm          = $this->getDocumentManager();
        $refer       = $request->query->get('refer');
        $user_id     = $this->_getUser()->getId();
        $records     = $dm->getRepository('OPPostBundle:Comment')
                          ->loadComments($postValid, $refer);
        foreach ($records as $record) {               
            $comments[] = $transformer->commentToArray($record);
        }
        return new JsonResponse($comments);
    }

    /**
     * Lists all follows Post posts.
     * @Annotations\Get("/comments/loadmore/{postId}")
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
            $comment = $dm->getRepository('OPPostBundle:Comment')
                        ->findSimpleCommentById($id);
            //post not found or masked
            if(!$comments || in_array($comment['author']['$id'], $this->objectsToIds($user->getBlockedsWithMe()))) {
                continue;
            }
            else {                
                $posts[] = $transformer->postToArray($post);
            }
        }

        $response = new JsonResponse();
        return $response->setData(array('posts'=>$posts));
    }

    /**
     * Creates a new Post post.
     *
     * @Annotations\Post("/comments/add/")
     *
     * @return object
     */
    public function addAction(Request $request, NewPostFormHandler $formHandler, EventDispatcherInterface $dispatcher, ToArrayTransformer $transformer, NotificationManager $notifMan)
    {

        $res            = new JsonResponse();
        $commentForm    = $this->createForm(CommentType::class, new Comment());
        if($comment     = $formHandler->process($commentForm, false)) {
            $data       = $transformer->commentObjectToArray($comment);
            $this->notify($request, $comment, $notifMan);
            $dispatcher->dispatch(PostEvents\OPPostEvents::COMMENT_CREATE, new PostEvents\CommentEvent($data));
            return $res->setData(array('comment'=>$data));
        } else { 
            return $res->setData(array('comment'=>null));
        }
    }

    /**
    * Create some notification for all users subscribed
    *
    */
    protected function notify(Request $request, Comment $comment, $notifMan)
    {
        $refer  = $request->get('refer');
        $notifMan->commentNotif($comment, $refer);
    }

    /**
     * Finds a Post post.
     *
     * @Annotations\Get("comments/show/{id}")
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
        $comment = $dm->getRepository('OPPostBundle:Comment')->find($id);
        if (!$comment) {
            return new JsonResponse([
                "error" => [
                    "errors"=> [
                        [
                            "domain"=> "global",
                            "reason"=> "notFound",
                            "message"=> "Not Found"
                        ]
                    ],
                    "code"=> 404,
                    "message"=> "Not Found"
                ]
            ]);
        }

        return new JsonResponse([$transformer->commentObjectToArray($comment)]);
    }

    /**
     * Displays a form to edit an existing Post post and update.
     *
     * @Annotations\Put("/comments/edit/{id}")
     *
     * @param string $id The post ID
     *
     * @return object
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If post doesn't exists
     */
    public function editAction(Request $request, $id, NewPostFormHandler $formHandler, EventDispatcherInterface $dispatcher, ToArrayTransformer $transformer)
    {     
        $res        = new JsonResponse();
        $dm         = $this->getDocumentManager();
        $dbCom      = $dm->getRepository('OPPostBundle:Comment')->find($id);

        if (!$dbCom)
            return; //throw $this->createNotFoundException('Unable to find Post post.');
        $form       = $this->createForm(CommentType::class, $dbCom);
        if($comment = $formHandler->process($form, true)) {
            $data   = $transformer->commentObjectToArray($comment);
            $this->notify($request, $comment);
            $dispatcher->dispatch(PostEvents\OPPostEvents::COMMENT_UPDATE, 
                                    new PostEvents\CommentEvent($data));
            return $res->setData(array('comment'=>$data));
        } else { 
            return $res->setData(array('comment'=>null)); 
        }
    }

    /**
     * Deletes a Post post.
     *
     * @Annotations\Delete("/comments/remove/{id}")
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
     * @Annotations\Post("/comments/mask/{id}")
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

    private function returnCommentForm($notifMan)
    {
        $notifMan->postNotif($post);
        $comment = new Comment();
        $comment->setPostId($post);
        $comment->setPostValid($post->getId());  //set the value
        $commentForm = $this->createForm(CommentType::class, $comment);
        return $commentForm;
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
