<?php
namespace OP\PostBundle\Controller\Api;

use OP\PostBundle\Document\Rate,
    OP\PostBundle\Form\RateType,
    OP\PostBundle\Event\RateEvent,
    OP\PostBundle\Event\OPPostEvents,
    OP\UserBundle\Security\UserProvider,
    FOS\RestBundle\Controller\Annotations,
    Symfony\Component\HttpFoundation\Request,
    FOS\RestBundle\Controller\FOSRestController,
    FOS\RestBundle\Routing\ClassResourceInterface,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\PostBundle\FormHandler\NewPostFormHandler,
    OP\PostBundle\DocumentManager\RateManager,
    OP\PostBundle\DataTransformer\ToArrayTransformer,
    OP\SocialBundle\DocumentManager\NotificationManager,
    Symfony\Component\EventDispatcher\EventDispatcherInterface,
    FOS\RestBundle\Controller\Annotations\RouteResource;

/**
 * @RouteResource("rates", pluralize=false)
 */
class ApiRateController extends FOSRestController implements ClassResourceInterface
{

    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }
    
    /**
     * Lists all follows Post posts.
     * @Annotations\Get("/rates/load/{objId}")
     *
     * @return Integer
     */
    public function loadAction(ToArrayTransformer $transformer)
    {
        //$client = $this->getStreamClient();     //getStream.io client
        $post_ids  = [];
        $posts     = [];
        $dm        = $this->getDocumentManager();
        $user_id   = $this->_getUser()->getId();
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
     * Lists all follows Post posts.
     * @Annotations\Get("/rates/loadmore/{objId}")
     *
     * @return Integer
     */
    public function loadmoreAction(Request $request, $objId, ToArrayTransformer $transformer)
    {
        $ids  = $request->query->get('ids');
        $cmts = [];
        $dm   = $this->getDocumentManager();
        $user = $this->_getUser();
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
     * @Annotations\Post("/rates/add")
     *
     * @return object
     */
    public function addAction(Request $request, NewPostFormHandler $formHandler, EventDispatcherInterface $dispatcher, ToArrayTransformer $transformer, NotificationManager $notifMan)
    {

        $res     = new JsonResponse();
        $form    = $this->createForm(RateType::class, new Rate());        
        if($rate = $formHandler->process($form, false)) {
            $this->notify($rate, $notifMan);
            $dispatcher->dispatch(OPPostEvents::RATE_CREATE, new RateEvent($rate));
            $type   = $rate->getType();
            $refId  = $rate->getRefValid();

            if($type === 'post')
                $object = $this->getPost($refId, $transformer);
            else if($type === 'leftcomment')
                $object = $this->getLeftComment($refId, $transformer);
            else if($type === 'rightcomment')
                $object = $this->getRightComment($refId, $transformer);

            return $res->setData(array('post'=>$object));
        }
        else { 
            return $res->setData(array('post'=>null));        
        }
    }

    /**
     * update Clike document.
     * @Annotations\Post("/rates/update/{objId}")
     *
     * @param string $id The document ID
     * @param Request $request
     *
     * @return
     */
    public function updateAction($objId, Request $request, NewPostFormHandler $handler, ToArrayTransformer $transformer)
    {
        $res    = new JsonResponse();
        $dm     = $this->getDocumentManager();
        $rate   = $dm->getRepository('OPPostBundle:Rate')
                         ->findPostLiker($objId, $this->_getUser()->getId());
        if(!$rate) return;
        $session->set('prevRateValue', $rate->getRate());   //store rate value in session

        $form       = $this->createForm(RateType::class, $rate);
        if($rate    = $handler->process($form, true)){
            $refId  = $rate->getRefValid();
            $type   = $rate->getType();

            if($type === 'post') $object = $this->getPost($refId, $transformer);
            if($type === 'leftcomment') $object = $this->getLeftComment($refId, $transformer);
            if($type === 'rightcomment') $object = $this->getRightComment($refId, $transformer);
            return $res->setData(array('post'=>$object));
        }else{
            return $res->setData(array('post'=>null));
        }
    }

    /**
     * Deletes a Post post.
     *
     * @Annotations\Delete("/rates/delete")
     *
     * @param Request $request The request object
     * @param string $id       The post ID
     *
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If post doesn't exists
     */
    public function deleteAction(Request $request, RateManager $manager, ToArrayTransformer $transformer)
    {

        $res    = new JsonResponse();
        $dm     = $this->getDocumentManager();
        $type   = $request->query->get('type');
        $objId  = $request->query->get('objId');

        $rate   = $dm->getRepository('OPPostBundle:Rate')
                     ->findPostLiker($objId, $this->_getUser()->getId());
        if (!$rate) return;

        $refId  = $rate->getRefValid();
        $type   = $rate->getType();

        $manager->deleteRate($rate);

        if($type === 'post') 
            $object = $this->getPost($refId, $transformer);
        else if($type === 'leftcomment') 
            $object = $this->getLeftComment($refId, $transformer);
        else if($type === 'rightcomment') 
            $object = $this->getRightComment($refId, $transformer);
        return $res->setData(array('post'=>$object));
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

    protected function getPost($id, $transformer) {
        $post= $this->getDocumentManager()
                    ->getRepository('OPPostBundle:Post')
                    ->findSimplePostById($id);
        return $transformer->opinionToArray($post);
    }

    protected function getLeftComment($id, $transformer) {
        $post= $this->getDocumentManager()
                    ->getRepository('OPPostBundle:LeftComment')
                    ->findSimpleById($id);
        return $transformer->leftToArray($post);
    }

    protected function getRightComment($id, $transformer) {
        $post= $this->getDocumentManager()
                    ->getRepository('OPPostBundle:RightComment')
                    ->findSimpleById($id);
        return $transformer->rightToArray($post);
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
