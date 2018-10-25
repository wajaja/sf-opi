<?php
namespace OP\PostBundle\Controller\Api;

use OP\PostBundle\Document\Like,
    OP\PostBundle\Form\LikeType,
    OP\PostBundle\Event\LikeEvent,
    OP\PostBundle\Event\OPPostEvents,
    Nelmio\ApiDocBundle\Annotation as Doc,
    FOS\RestBundle\Controller\Annotations,
    Symfony\Component\HttpFoundation\Request,
    FOS\RestBundle\Controller\FOSRestController,
    FOS\RestBundle\Routing\ClassResourceInterface,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\PostBundle\FormHandler\NewPostFormHandler,
    OP\PostBundle\DocumentManager\LikeManager,
    OP\UserBundle\Security\UserProvider,
    Symfony\Component\EventDispatcher\EventDispatcherInterface,
    OP\PostBundle\DataTransformer\ToArrayTransformer,
    OP\SocialBundle\DocumentManager\NotificationManager,
    FOS\RestBundle\Controller\Annotations\RouteResource;

/**
 * @RouteResource("likes", pluralize=false)
 */
class ApiLikeController extends FOSRestController implements ClassResourceInterface
{

    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }
    
    /**
     * Lists all follows Post posts.
     * @Annotations\Get("/likes/load/{postId}")
     *
     * @return Integer
     */
    public function loadAction(Request $request, $postId, ToArrayTransformer $transformer)
    {
        $res        = new JsonResponse();
        $dm         = $this->getDocumentManager();
        $refer      = $request->get('refer');
        $db_likes   = $dm->getRepository('OPPostBundle:Like')
                             ->loadBy($postId, $refer);

        $likes = [];
        foreach ($db_likes as $db_like) {
            $likes[] = $transformer->likeToArray($db_like);
        }
        return $res->setData(array('likes'=>$likes));
    }

    /**
     * Lists all follows Post posts.
     * @Annotations\Get("/likes/loadmore/{postId}")
     *
     * @return Integer
     */
    public function loadmoreAction(Request $request, $postId, ToArrayTransformer $transformer)
    {
        $cmts = [];
        $ids  = $request->query->get('ids');
        $dm   = $this->getDocumentManager();
        $user = $this->_getUser();
        foreach ($ids as $id) {
            $cmt = $dm->getRepository('OPPostBundle:Like')->findLikeByRefId($id);
            //post not found or masked
           /* if(!$comments || in_array($comment['author']['$id'], $this->objectsToIds($user->getBlockedsWithMe()))) {
                continue;
            }
            else {                
                $posts[] = $transformer->postToArray($post);
            }*/
        }

        $response = new JsonResponse();
        return $response->setData(array('posts'=>$posts));
    }

    /**
     * Creates a new Post post.
     *
     * @Annotations\Post("/likes/add")
     *
     * @return object
     */
    public function addAction(Request $request, NewPostFormHandler $formHandler, EventDispatcherInterface $dispatcher, NotificationManager $notifMan)
    {

        $form    = $this->createForm(LikeType::class, new Like());        
        if($data = $formHandler->process($form, false)) {
            $this->notify($data['like'], $notifMan);  //['like'] is object, ['data'] an array
            $dispatcher->dispatch(OPPostEvents::LIKE_CREATE, new LikeEvent($data['data']));
            return new JsonResponse($data['data']);// $res->setData(array('data'=>));
        }
        else { 
            return new JsonResponse(null);        
        }
    }

    /**
     * Deletes a Post post.
     *
     * @Annotations\Delete("/likes/delete")
     *
     * @param Request $request The request object
     * @param string $id       The post ID
     *
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If post doesn't exists
     */
    public function deleteAction(Request $request, LikeManager $manager)
    {

        $user   = $this->_getUser();
        $res    = new JsonResponse();
        $dm     = $this->getDocumentManager();
        $type   = $request->query->get('refer');
        $refId  = $request->query->get('postId');
        $like   = $dm->getRepository('OPPostBundle:Like')->findLikeByRefId($refId, $type, $user);

        if (!$like) 
            return new JsonResponse(null);

        $data = $manager->deleteLike($like);
        return new JsonResponse($data['data']);
    }

    private function getStreamClient() {
        return new \GetStream\Stream\Client('sewzt6y5y29n', 'c4bdc5xpez98f5vb4pfdu7myg2zsax5ykahuem2thkmsm7d5e9ddztskjwcwdhk8');
    }

    /**
    * Create some notification for all users subscribed
    */
    protected function notify(Like $like, $notifMan)
    {
        $notifMan->likeNotif($like, $like->getType());
        // if($like->getType() == 'comment') $nm->clikeNotif($like);
        // if($like->getType() == 'undercomment') $nm->ulikeNotif($like);
        
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
