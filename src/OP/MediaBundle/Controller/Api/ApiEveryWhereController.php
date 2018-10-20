<?php
namespace OP\MediaBundle\Controller\Api;

use OP\PostBundle\Document\EveryWhere,
    OP\MediaBundle\Event\EveryWhereEvent,
    OP\MediaBundle\DocumentManager\PictureManager,
    OP\PostBundle\Event\OPPostEvents,
    OP\UserBundle\Security\UserProvider,
    Symfony\Component\HttpFoundation\Request,
    FOS\RestBundle\Routing\ClassResourceInterface,
    OP\PostBundle\FormHandler\NewPostFormHandler,
    OP\PostBundle\DocumentManager\RateManager,
    JMS\Serializer\SerializerInterface,
    Symfony\Component\HttpFoundation\JsonResponse,
    \OP\PostBundle\DataTransformer\ToArrayTransformer,
    OP\SocialBundle\DocumentManager\NotificationManager;
use FOS\RestBundle\Controller\{Annotations, FOSRestController, Annotations\RouteResource};

/**
 * @RouteResource("rates", pluralize=false)
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
        //$client = $this->getStreamClient();     //getStream.io client
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
    public function addAction(Request $request, $photoId, PictureManager $pMan, NotificationManager $notifMan, SerializerInterface $serializer)
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
    public function updateAction($objId, Request $request, NewPostFormHandler $handler, ToArrayTransformer $transformer)
    {
        $session = $request->getSession();
        $res     = new JsonResponse();
        $dm      = $this->getDocumentManager();
        $ever    = $dm->getRepository('OPMediaBundle:EveryWhere')->find($objId);

        if(!$rate) 
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
    public function deleteAction(Request $request, $id, RateManager $manager, ToArrayTransformer $transformer)
    {

        $res    = new JsonResponse();
        $dm     = $this->getDocumentManager();
        $type   = $request->query->get('type');
        $objId = $request->query->get('objId');

        $rate   = $dm->getRepository('OPPostBundle:Rate')
                     ->findPostLiker($objId, $this->_getUser()->getId());
        if (!$rate) return;

        $refId  = $rate->getRefValid();
        $type   = $rate->getType();

        $manager->deleteRate($rate);

        if($type === 'post') 
            $object = $this->getPost($refId, $transformer);
        else if($type === 'leftcomment') 
            $object = $this->getLeftComment($refId);
        else if($type === 'rightcomment') 
            $object = $this->getRightComment($refId);
        return $res->setData(array('post'=>$object));
    }

    private function getStreamClient() {
        return new \GetStream\Stream\Client('sewzt6y5y29n', 'c4bdc5xpez98f5vb4pfdu7myg2zsax5ykahuem2thkmsm7d5e9ddztskjwcwdhk8');
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
    * Convert array objects from database in 
    * single array of ids
    *@param array Users $objects
    */
    // public function objectsToIds($objects)
    // {
    //     $ids = [];
    //     foreach ($objects as $object) {
    //         $ids[] = $object->getId();
    //     }
    //     return $ids;
    // }

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
