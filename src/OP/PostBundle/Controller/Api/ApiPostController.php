<?php
namespace OP\PostBundle\Controller\Api;

use GetStream\Stream\Client, 
    OP\PostBundle\Document\Post,
    OP\PostBundle\Form\PostType,
    OP\PostBundle\Event\PostEvent,
    OP\UserBundle\Document\Favorite,
    OP\PostBundle\Event\OPPostEvents,
    OP\UserBundle\Security\UserProvider,
    Nelmio\ApiDocBundle\Annotation as Doc,
    FOS\RestBundle\Controller\Annotations,
    Symfony\Component\HttpFoundation\Request,
    FOS\RestBundle\Controller\FOSRestController,
    FOS\RestBundle\Routing\ClassResourceInterface,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\PostBundle\FormHandler\NewPostFormHandler,
    OP\PostBundle\DataTransformer\ToArrayTransformer,
    OP\SocialBundle\DocumentManager\NotificationManager,
    Symfony\Component\EventDispatcher\EventDispatcherInterface,
    FOS\RestBundle\Controller\Annotations\RouteResource;


/**
 * @RouteResource("post", pluralize=false)
 */
class ApiPostController extends FOSRestController implements ClassResourceInterface
{

    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }

    /**
     * Lists all follows Post posts.
     * @Annotations\Get("/posts/load/{userId}")
     *
     * @return Integer
     */
    public function loadAction(Request $request, $userId, ToArrayTransformer $transformer)
    {
        $dm         = $this->getDocumentManager();
        $response   = new JsonResponse();
        // $client = $this->getStreamClient();     //getStream.io client

        // Instantiate a feed object
        // $userFeed = $client->feed('user', $user->getId());
        
        $posts    = [];
        $user_id  = $this->_getUser()->getId();
        $post_ids = ['5a42cd6ad8d25a0898001de5', '59b728dbaa95aac40e00002a', '59b6c341aa95aa100c000029', '599e9203aa95aae00400002a', '5984acddaa95aaa00a00002e', '59959ce4aa95aa4c1a00002b', '59959e3aaa95aa6408000032', '5ac82713d8d25a0578000d13', '5ac8c4bfd8d25a06c00015e7', '5ac8e462d8d25a06c00015e9', '5ae95dd5d8d25a0ee800388e'];
        foreach ($post_ids as $post_id) {
            $post = $dm->getRepository('OPPostBundle:Post')
                        ->findSimplePostById($post_id);
            //post not found or masked
            if(!$post || in_array($user_id, $post['maskersForUserIds'])) {
                continue;
            }
            else {             
                $posts[] = $post['type'] == 'opinion' ? $transformer->opinionToArray($post) :
                                                        $transformer->postToArray($post);
            }
        }
        
        return $response->setData(array('posts'=>$posts));
    }

    /**
     * Lists all follows Post posts.
     * @Annotations\Get("/posts/show/{id}")
     *
     * @return Integer
     */
    public function showAction(Request $request, $id, ToArrayTransformer $transformer)
    {
        $post       = [];
        $response   = new JsonResponse();
        $dm         = $this->getDocumentManager();
        $userId     = $this->_getUser()->getId();
        $data       = $dm->getRepository('OPPostBundle:Post')->findSimplePostById($id);
        //post not found or masked
        if(!$data || in_array($userId, $data['maskersForUserIds'])) {
            // nothing to do continue;
        }
        else {             
            $post = $data['type'] == 'opinion' ? $transformer->opinionToArray($data) :
                                                 $transformer->postToArray($data);
        }
        
        return $response->setData(array('post'=>$post));
    }

    /**
     * Lists all follows Post posts.
     * @Annotations\Get("/posts/allies/recent/{postId}")
     *
     * @return Integer
     */
    public function recentAllieAction(Request $request, $postId, ToArrayTransformer $transf)
    {
        $dm     = $this->getDocumentManager();
        $post   = $dm->getRepository('OPPostBundle:Post')->findRecentByAllie($postId);
        $res    = new JsonResponse();
        if (!$post) return;

        $post = $transf->postChildToArray($post);
        return $res->setData(array('post'=>$post));
    }

    /**
     * Lists all follows Post posts.
     * @Annotations\Get("/posts/allies/load/{postId}")
     *
     * @return Integer
     */
    public function loadAllieAction(Request $request, $postId, ToArrayTransformer $transf)
    {
        $dm     = $this->getDocumentManager();
        $order  = (int)$request->query->get('order');
        $post   = $dm->getRepository('OPPostBundle:Post')->findAllieByOrder($postId, $order);
        $res    = new JsonResponse();
        if (!$post) return;

        $post = $transf->postChildToArray($post);
        return $res->setData(array('post'=>$post));
    }

    /**
     * Lists all follows Post posts.
     * @Annotations\Get("/posts/allies/all/{postId}")
     *
     * @return Integer
     */
    public function alliesAction($postId, ToArrayTransformer $transf)
    {
        $dm     = $this->getDocumentManager();
        $db_p   = $dm->getRepository('OPPostBundle:Post')->findAlliesById($postId);
        $res    = new JsonResponse();
        
        $posts = [];
        foreach ($db_p as $p) {
            $posts[] = $transf->postChildToArray($p);
        }
        return $res->setData(array('posts'=>$posts));
    }

    /**
     * Creates a new Post post.
     *
     * @Annotations\Post("/posts/create")
     *
     * @return object
     */
    public function createAction(Request $request, NewPostFormHandler $handler, EventDispatcherInterface $dispatcher, ToArrayTransformer $transformer, NotificationManager $notifMan)
    {        
        $res     = new JsonResponse();
        $form    = $this->createForm(PostType::class, new Post());
        
        if($post = $handler->process($form, false)) {      
            $this->notify($post, $notifMan);
            if($post->getType() == 'opinion')
                $data = $transformer->opinionObjectToArray($post);
            else 
                $data = $transformer->postObjectToArray($post);

            $dispatcher->dispatch(OPPostEvents::POST_CREATE, new PostEvent($data));

            return $res->setData(array('post' =>$data));
        }
        else {
            return $response->setData(array('error'=>'error'));
        }
    }

    /**
    * Create some notification for all users subscribed
    *
    */
    protected function notify(Post $post, $notifMan)
    {
        $notifMan->postNotif($post);
    }
   
    /**
     * Displays a form to edit an existing Post post and update.
     *
     * @Annotations\Put("/posts/edit/{id}")
     *
     * @param string $id The post ID
     *
     * @return object
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If post doesn't exists
     */
    public function editAction(Request $request, $id, NewPostFormHandler $formHandler, EventDispatcherInterface $dispatcher, ToArrayTransformer $transformer)
    {     
        $dm      = $this->getDocumentManager();
        $db_post = $dm->getRepository('OPPostBundle:Post')->find($id);
        if (!$db_post) {
            throw $this->createNotFoundException('Unable to find Post post.');
        }
        $form = $this->createForm(PostType::class, $db_post);
        $response = new JsonResponse();
        if($request->isXmlHttpRequest()){
            if($post = $formHandler->process($form, true)){
                return $response->setData(array('post' =>$transformer->postObjectToArray($post)));
            }else{
                return $response->setData(array('error' => 'error'));
            }
        }else{
            if($post = $formHandler->process($form, true)) {
                return $response->setData(array('post' => $transformer->postObjectToArray($post)));
            } else {
                return $response->setData(array('post'=>'ffff'));
            }
        }
    }

    /**
     * Displays a form to edit an existing Post post and update.
     *
     * @Annotations\Post("/posts/add")
     *
     * @param string $id The post ID
     *
     * @return object
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If post doesn't exists
     */
    public function addAction(Request $request, NewPostFormHandler $formHandler, EventDispatcherInterface $dispatcher, ToArrayTransformer $transformer, NotificationManager $notifMan)
    {     
        $res     = new JsonResponse();
        $form    = $this->createForm(PostType::class, new Post());
        if($post = $handler->process($form, false)) {      
            $this->notify($post, $notifMan);
            return $res->setData(
                        array('post' =>$transformer->postChildObjectToArray($post))
                    );
        }
        else {
            return $response->setData(array('error'=>'error'));
        }
    }

    /**
     * Deletes a Post post.
     *
     * @Annotations\Post("/posts/remove/{id}")
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
        $post = $dm->getRepository('OPPostBundle:Post')->find($id);
        if (!$post) {
            throw $this->createNotFoundException('Unable to find Post post.');
        }
        $dm->remove($post);
        $dm->flush();
        return $response->setData(array('data'=>true));
    }
    
    /**
     * Favorite a Post post.
     *
     * @Annotations\Post("/posts/favorite/{id}")
     *
     * @param Request $request The request object
     * @param string $id       The post ID
     *
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If post doesn't exists
     */
    public function favoriteAction(Request $request, $id)
    {
        $dm     = $this->getDocumentManager();
        $post   = $dm->getRepository('OPPostBundle:Post')->find($id);
        $user   = $this->_getUser();
        if (!$post) {
            throw $this->createNotFoundException('Unable to find Post post.');
        }
        $favor = new Favorite();
        $favor->addPost($post);
        $favor->setAuthor($user);
        $favor->setType('favorite');
        $favor->setTarget('post');
        $post->doFavoritesForUserIds($user->getId());
        $dm->persist($favor);
        $dm->flush();
        $response = new JsonResponse();
        return $response->setData(array('data'=>true));
    }
    
    /**
     * Mask a Post post.
     *
     * @Annotations\Post("/posts/mask/{id}")
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
        $dm = $this->getDocumentManager();
        $post = $dm->getRepository('OPPostBundle:Post')->find($id);
        $user = $this->_getUser();
        if (!$post) {
            throw $this->createNotFoundException('Unable to find Post post.');
        }
        $favor = new Favorite();
        $favor->addPost($post);
        $favor->setAuthor($user);
        $favor->setType('mask');
        $favor->setTarget('post');
        $post->doMaskersForUserIds($user->getId());
        $dm->persist($favor);
        $dm->flush();
        $response = new JsonResponse();
        return $response->setData(array('data'=>$user->getId()));
    }
    
    private function createDeleteForm($id)
    {
        return $this->createFormBuilder(array('id' => $id))
            ->add('id', HiddenType::class, array('required'=>FALSE))
            ->getForm()
        ;
    }

    private function getStreamClient() {
        return new \GetStream\Stream\Client('sewzt6y5y29n', 'c4bdc5xpez98f5vb4pfdu7myg2zsax5ykahuem2thkmsm7d5e9ddztskjwcwdhk8');
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
