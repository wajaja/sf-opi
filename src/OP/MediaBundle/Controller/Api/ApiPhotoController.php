<?php

namespace OP\MediaBundle\Controller\Api;

use FOS\RestBundle\Controller\Annotations\{Get, Put, Delete, Post as PostMethod, RouteResource};
use Symfony\Component\HttpFoundation\Request,
    FOS\RestBundle\Controller\FOSRestController,
    FOS\RestBundle\Routing\ClassResourceInterface,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\PostBundle\FormHandler\NewPostFormHandler,
    OP\PostBundle\DataTransformer\ToArrayTransformer,
    OP\MediaBundle\DataTransformer\ToArrayTransformer as Transformer,
    JMS\Serializer\SerializerInterface,
    OP\UserBundle\Security\UserProvider,
    OP\UserBundle\DocumentManager\SettingManager,
    OP\SocialBundle\DocumentManager\NotificationManager,
    Symfony\Component\EventDispatcher\EventDispatcherInterface;


/**
 * @RouteResource("photos", pluralize=false)
 */
class ApiPhotoController extends FOSRestController implements ClassResourceInterface
{

    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }
        /**
     * Lists all Image documents.
     *
     * @Get("/photos/")
     *
     * @return array
     */
    public function indexAction()
    {
        $dm = $this->getDocumentManager();

        $documents = $dm->getRepository('OPMediaBundle:Image')->findAll();

        return array('documents' => $documents);
    }

    /**
     * Creates a new Post post.
     *
     * @PostMethod("/pictures/tag/add/{id}")
     *
     * @return object
     */
    public function addTagAction(Request $request, $id, SettingManager $set_man, NewPostFormHandler $formHandler, EventDispatcherInterface $dispatcher, SerializerInterface $serializer, NotificationManager $notifMan)
    {

        $res        = new JsonResponse();
        $user       = $this->_getUser();
        $image      = $dm->getRepository('OPMediaBundle:Image')->findPhotoById($id);

        if (!$image) return;

        $data       = json_decode($request->getContent(), true);

        if($tag  = $set_man->addFriendTag($user, $image, $data)) {
            return $res->setData(
                array(
                    'user' =>$serializer->toArray($this->_getUser()), 
                    'contact'=> $serializer->toArray($tag)
                )
            );
        }

        $form           = $this->createForm(RateType::class, new Rate());        
        if($rate = $formHandler->process($form, false)) {
            $this->notify($rate, $notifMan);
            $dispatcher->dispatch(OPPostEvents::RATE_CREATE, new RateEvent($rate));
            $type   = $rate->getType();
            $refId  = $rate->getRefValid();

            if($type === 'post')
                $object = $this->getPost($refId);
            else if($type === 'leftcomment')
                $object = $this->getLeftComment($refId);
            else if($type === 'rightcomment')
                $object = $this->getRightComment($refId);

            return $res->setData(array('post'=>$object));
        }
        else { 
            return $res->setData(array('post'=>null));        
        }
    }

    /**
     * Finds a Post post.
     *
     * @Get("/photos/show/{id}")
     *
     * @param string $id The post ID
     * @param Request $request The request object
     *
     * @return object
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If post doesn't exists
     */
    public function loadAction(Request $request, $id, Transformer $transformer)
    {
        $res         = new JsonResponse();
        $dm          = $this->getDocumentManager();
        $postId      = $request->query->get('post_id');
        $pic         = $dm->getRepository('OPMediaBundle:Image')->findPhotoById($id);
        if (!$pic) return;

        $post     = $this->getPostForPhoto($postId);
        return $res->setData(array('photo'=>$transformer->photoToArray($pic, $post)));
    }

    /**
     * Finds a Post post.
     *
     * @Get("/photos/zoom/{id}")
     *
     * @param string $id The post ID
     * @param Request $request The request object
     *
     * @return object
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If post doesn't exists
     */
    public function zoomAction(Request $request, $id, Transformer $transformer)
    {
        $res   = new JsonResponse();
        $dm    = $this->getDocumentManager();
        $pic   = $dm->getRepository('OPMediaBundle:Image')->findPhotoById($id);
        if (!$pic) 
            return $res->setData(array('photo'=> null));

        return $res->setData(array('photo'=> $transformer->photoToArray($pic, null)));
    }


    protected function getPostForPhoto($id) {
        $dm       = $this->getDocumentManager();
        return    $dm->getRepository('OPPostBundle:Post')->getPostForPhoto($id);
    }

    /**
     * Creates a new Image document.
     *     post Document as model for gallery
     *
     * @PostMethod("/photos/create")
     *
     * @param Request $request
     *
     * @return array
     */
    public function createGalleryAction(Request $request, ToArrayTransformer $postTransformer)
    {
        //TODO
    }

    protected function notify(Post $post, $notifMan)
    {
        //create some notification for all users subscribed
        $notifMan->postNotif($post);

        $comment = new Comment();
        $comment->setPostId($post);
        $comment->setPostValid($post->getId());  //set the value
        $commentForm = $this->createForm(CommentType::class, $comment);

        return $commentForm;
    }

    /**
     * Edits an existing Image document.
     *
     * @Put("/photos/{id}/update")
     * @param Request $request The request object
     * @param string $id       The document ID
     *
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If document doesn't exists
     */
    public function updateAction(Request $request, $id)
    {
        $dm = $this->getDocumentManager();

        $document = $dm->getRepository('OPMediaBundle:Image')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find Image document.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm   = $this->createForm(ImageType::class, $document);
        $editForm->handleRequest($request);
        
        //if the form is submitted separately
        //if($form->isSubmitted()){
        if ($editForm->isValid()) {
            $dm->persist($document);
            $dm->flush();

            return $this->redirect($this->generateUrl('image_edit', array('id' => $id)));
        }

        return array(
            'document'    => $document,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Deletes a Image document.
     *
     * @Delete("/photos/{id}/delete")
     *
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If document doesn't exists
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->handleRequest($request);
        
//        if($form->isSubmitted()){
        if ($form->isValid()) {
            $dm = $this->getDocumentManager();
            $document = $dm->getRepository('OPMediaBundle:Image')->find($id);

            if (!$document) {
                throw $this->createNotFoundException('Unable to find Image document.');
            }

            $dm->remove($document);
            $dm->flush();
        }

        return $this->redirect($this->generateUrl('image'));
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
