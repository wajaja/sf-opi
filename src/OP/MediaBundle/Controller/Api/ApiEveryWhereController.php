<?php
namespace OP\MediaBundle\Controller\Api;

use OP\MediaBundle\DocumentManager\PictureManager,
    OP\UserBundle\Security\UserProvider,
    Symfony\Component\HttpFoundation\Request,
    FOS\RestBundle\Routing\ClassResourceInterface,
    OP\PostBundle\FormHandler\NewPostFormHandler,
    JMS\Serializer\SerializerInterface,
    Symfony\Component\HttpFoundation\JsonResponse,
    \OP\PostBundle\DataTransformer\ToArrayTransformer,
    OP\SocialBundle\DocumentManager\NotificationManager;
use FOS\RestBundle\Controller\{Annotations, FOSRestController};

/**
 * @Annotations\RouteResource("everywhere", pluralize=false)
 */
class ApiEveryWhereController extends FOSRestController implements ClassResourceInterface
{

    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }
    
    /**
     * Lists all follows Post posts.
     * @Annotations\Get("/ever/load/{photoId}")
     *
     * @return Integer
     */
    public function loadAction(\OP\PostBundle\DataTransformer\ToArrayTransformer $transformer)
    {
        $post_ids = $posts = [];
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
     * @Annotations\Post("/ever/add/{photoId}")
     *
     * @return object
     */
    public function addAction($photoId, PictureManager $pMan, NotificationManager $notifMan, SerializerInterface $serializer)
    {

        $res  = new JsonResponse();
        $user = $this->_getUser();
        if($ever = $pMan->createEveryWhere($photoId, $user)) {
            // $this->notify($ever, $notifMan);
            // $dispatcher = $this->get('event_dispatcher');
            // $dispatcher->dispatch(OPPostEvents::EVERYWHERE_CREATE, new EveryWhereEvent($ever));
            return $res->setData(array('ever'=>$serializer->toArray($ever)));
        }
        else { 
            return $res->setData(array('post'=>null));        
        }
    }

    /**
     * update Clike document.
     * @Annotations\Put("/ever/update/{objId}")
     *
     * @param string $id The document ID
     * @param Request $request
     *
     * @return
     */
    public function updateAction($objId, Request $request, NewPostFormHandler $handler, PictureManager $pMan, ToArrayTransformer $transformer, SerializerInterface $serializer)
    {
        $session = $request->getSession();
        $res     = new JsonResponse();
        $dm      = $this->getDocumentManager();
        $ever    = $dm->getRepository('OPMediaBundle:EveryWhere')->find($objId);

        if(!$ever) {
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
        
        $session->set('prevEveryWhere', $ever);   //store rate value in session
        if($ever = $pMan->updateEveryWhere($ever)) {
            // $this->notify($ever, $notifMan);
            // $dispatcher = $this->get('event_dispatcher');
            // $dispatcher->dispatch(OPPostEvents::EVERYWHERE_CREATE, new EveryWhereEvent($ever));
            return $res->setData(array('ever'=>$serializer->toArray($ever)));
        }
        else { 
            return $res->setData(array('ever'=>null));        
        }
    }

    /**
     * Deletes a Post post.
     *
     * @Annotations\Delete("/ever/delete/{id}")
     *
     * @param Request $request The request object
     * @param string $id       The post ID
     *
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If post doesn't exists
     */
    public function deleteAction(Request $request, $id, PictureManager $pMan)
    {

        $dm      = $this->getDocumentManager();
        $ever    = $dm->getRepository('OPMediaBundle:EveryWhere')->find($id);
        $pMan->deleteEveryWhere($ever);
        return new JsonResponse(["success" => true]);
    }

    /**
    * Create some notification for all users subscribed
    */
    protected function notify(Rate $rate, $nm)
    {
        if($rate->getType() === 'post')
            $nm->prateNotif($rate);
        else if($rate->getType() === 'leftcomment') 
            $nm->lrateNotif($rate);
        else if($rate->getType() === 'rightcomment') 
            $nm->rrateNotif($rate);
        
    }

    public function _getUser()
    {
        return $this->user_provider->getHydratedUser();
    }

    protected function getPost($id, $transf) {
        $post= $this->getDocumentManager()
                    ->getRepository('OPPostBundle:Post')
                    ->findSimplePostById($id);
        return $transf->opinionToArray($post);
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
