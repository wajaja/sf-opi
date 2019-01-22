<?php
namespace OP\PostBundle\Controller\Api;

use OP\PostBundle\Document\Post,
    OP\PostBundle\Form\PostType,
    OP\PostBundle\Event\PostEvent,
    OP\UserBundle\Document\Favorite,
    OP\PostBundle\Event\OPPostEvents,
    OP\UserBundle\Security\UserProvider,
    FOS\RestBundle\Controller\Annotations,
    Symfony\Component\HttpFoundation\Request,
    FOS\RestBundle\Controller\FOSRestController,
    FOS\RestBundle\Routing\ClassResourceInterface,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\PostBundle\FormHandler\NewPostFormHandler,
    OP\PostBundle\DataTransformer\ToArrayTransformer,
    OP\SocialBundle\DocumentManager\NotificationManager,
    Symfony\Component\EventDispatcher\EventDispatcherInterface;


/**
 * @Annotations\RouteResource("post", pluralize=false)
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
        $dm    = $this->getDocumentManager();
        $ids   = ['5a42cd6ad8d25a0898001de5', '59b728dbaa95aac40e00002a', '59b6c341aa95aa100c000029', '599e9203aa95aae00400002a', '5984acddaa95aaa00a00002e', '59959ce4aa95aa4c1a00002b', '59959e3aaa95aa6408000032', '5ac82713d8d25a0578000d13', '5ac8c4bfd8d25a06c00015e7', '5ac8e462d8d25a06c00015e9', '5ae95dd5d8d25a0ee800388e'];
        $posts = $dm->getRepository('OPPostBundle:Post')->findCposts($ids);
        
        return new JsonResponse($transformer->postsToArray($posts));
    }

    /**
     * Lists all follows Post posts.
     * @Annotations\Get("/posts/show/{id}")
     *
     * @return Integer
     */
    public function showAction(Request $request, $id, ToArrayTransformer $transformer)
    {
        $user = $this->_getUser();
        $dm   = $this->getDocumentManager();
        $post = $dm->getRepository('OPPostBundle:Post')->find($id);
        //post not found or masked
        //TODO check in blockeds users to restrict 
        if(!$post || $post->is_maskersForUser($user->getId()) ||
           in_array($post->getAuthor()->getId(), $this->objectsToIds($user->getBlockedsWithMe()))) {
            // nothing to do continue;
        }
        else {             
            $data = $post->getType() == 'opinion' ? $transformer->opinionObjectToArray($data) :
                                                 $transformer->postObjectToArray($data);
        }
        return new JsonResponse(['post' => $data]);
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
        return $res->setData(array('post'=> $post));
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
     * Creates a new Post post.
     *
     * @Annotations\Post("/posts/share-card/{$cardId}")
     *
     * @return object
     */
    public function shareCardAction(Request $request, EventDispatcherInterface $dispatcher, ToArrayTransformer $transformer, NotificationManager $notifMan)
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
        $dm   = $this->getDocumentManager();
        $user = $this->_getUser();
        $db_post = $dm->getRepository('OPPostBundle:Post')->find($id);
        if (!$db_post) {
            throw $this->createNotFoundException('Unable to find Post post.');
        }

        if($db_post->getAuthor()->getId() !== $user->getId()) {
            return $this->createAccessDeniedException('You cannot edit this post!');
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
     * @Annotations\Delete("/posts/remove/{id}")
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
        $user = $this->_getUser();
        $dm   = $this->getDocumentManager();
        $post = $dm->getRepository('OPPostBundle:Post')->find($id);
        if (!$post) {
            throw $this->createNotFoundException('Unable to find Post post.');
        }

        if($post->getAuthor()->getId() !== $user->getId()) {
            return $this->createAccessDeniedException('You cannot delete this post!');
        }

        $dm->remove($post);
        $dm->flush();
        return new JsonResponse([true]);
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
