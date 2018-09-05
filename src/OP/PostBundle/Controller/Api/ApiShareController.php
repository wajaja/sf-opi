<?php
namespace OP\PostBundle\Controller\Api;

use OP\PostBundle\Document\Share,
    OP\PostBundle\Form\ShareType,
    OP\PostBundle\Event\OPPostEvents,
    OP\PostBundle\Event\ShareEvent,
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
 * @RouteResource("shares", pluralize=false)
 */
class ApiShareController extends FOSRestController implements ClassResourceInterface
{

    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }
    
    /**
     * Lists all follows Post posts.
     * @Annotations\Get("/shares/load/{postId}")
     *
     * @return Integer
     */
    public function loadAction(ToArrayTransformer $transformer)
    {
        //$client = $this->getStreamClient();     //getStream.io client
        $post_ids = [];
        $posts    = [];
        $dm       = $this->getDocumentManager();
        $user_id  = $this->_getUser()->getId();
        foreach ($post_ids as $post_id) {
            $post = $dm->getRepository('OPPostBundle:Post')
                        ->findSimplePostById($post_id);
            //post not found or masked
            if(!$post || in_array($user_id, $post['maskersForUserIds'])) {
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
     * @Annotations\Post("/shares/create/")
     *
     * @return object
     */
    public function createAction(Request $request, NewPostFormHandler $formHandler, EventDispatcherInterface $dispatcher, NotificationManager $notifMan)
    {
        $res      = new JsonResponse();
        $form     = $this->createForm(ShareType::class, new Share());      
        if($share = $formHandler->process($form, false)){
            $this->notify($request, $share, $notifMan);
            $dispatcher->dispatch(OPPostEvents::SHARE_CREATE, new ShareEvent($share));
            return $res->setData(array('share'=>$share));
        }else{
            return $res->setData(array('share'=>null));
        }
    }

    /**
    * Create some notification for all users subscribed
    *
    */
    protected function notify(Request $request, Share $share, $notifMan)
    {
        $refer  = $request->get('refer');
        $notifMan->shareNotif($share, $refer);
    }

    /**
     * Finds a Post post.
     *
     * @Annotations\Get("shares/show/{id}")
     *
     * @param string $id The post ID
     * @param Request $request The request object
     *
     * @return object
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If post doesn't exists
     */
    public function showAction(Request $request, $id, ToArrayTransformer $transformer)
    {
        $dm = $this->getDocumentManager();
        $post = $dm->getRepository('OPPostBundle:Share')->simpleFindById($id);
        if (!$post) return;

        $post_arr = $transformer->postToArray($post);
        return $this->render('OPPostBundle:Post:post_show.html.twig', array('post'=>$post_arr));
    }

    /**
     * Displays a form to edit an existing Post post and update.
     *
     * @Annotations\Put("/shares/edit/{id}")
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
        $dbCom   = $dm->getRepository('OPPostBundle:Share')->find($id);

        if (!$dbCom)
            return; //throw $this->createNotFoundException('Unable to find Post post.');
        $form     = $this->createForm(ShareType::class, $dbCom);
        if($share = $formHandler->process($form, true)) {
            $this->notify($request, $share, $notifMan);
            $dispatcher->dispatch(OPPostEvents::COMMENT_CREATE, new ShareEvent($share));
            return $res->setData(array('share'=>$transformer->shareObjectToArray($share)));
        }
        else { 
            return $res->setData(array('share'=>null)); 
        }
    }

    /**
     * Deletes a Post post.
     *
     * @Annotations\Post("/shares/remove/{id}")
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
        $com    = $dm->getRepository('OPPostBundle:Share')->find($id);
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
     * @Annotations\Post("/shares/mask/{id}")
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
        $com    = $dm->getRepository('OPPostBundle:Share')->find($id);
        if (!$com) {
            throw $this->createNotFoundException('Unable to find Post post.');
        }
        $com->doMaskersForUserIds($this->_getUser()->getId());
        $dm->flush($share);
        return $res->setData(array('data'=>$this->_getUser()->getId()));
    }

    private function getStreamClient() {
        return new \GetStream\Stream\Client('sewzt6y5y29n', 'c4bdc5xpez98f5vb4pfdu7myg2zsax5ykahuem2thkmsm7d5e9ddztskjwcwdhk8');
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
