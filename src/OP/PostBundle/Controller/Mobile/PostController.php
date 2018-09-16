<?php

namespace OP\PostBundle\Controller;

use OP\PostBundle\Document\Post,
    OP\PostBundle\Form\PostType,
    OP\PostBundle\Event\PostEvent,
    OP\PostBundle\Document\Comment,
    OP\PostBundle\Form\CommentType,
    OP\UserBundle\Document\Favorite,
    OP\PostBundle\Event\OPPostEvents,
    Symfony\Component\HttpFoundation\Request,
    OP\PostBundle\Notification\RealTimePost,
    OP\PostBundle\FormHandler\NewPostFormHandler,
    Symfony\Component\EventDispatcher\EventDispatcherInterface,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Component\Form\Extension\Core\Type\HiddenType,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Method,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    OP\PostBundle\FormHandler\NewPostFormHandler,
    OP\PostBundle\DataTransformer\ToArrayTransformer,
    OP\SocialBundle\DocumentManager\NotificationManager,
    Symfony\Component\EventDispatcher\EventDispatcherInterface,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;


class PostController extends Controller
{


    /**
     * Lists all Post posts.
     *
     * @Route("/", name="post_index_mobile", host="m.opinion.com")
     * @Template()
     *
     * @return array
     */
    public function indexAction()
    {
        echo "something work just fine";
        die();
        
        $dm = $this->getDocumentManager();

        $post = $dm->getRepository('OPPostBundle:Post')->findSimplePostById("58834ce5aa95aa040f000042");
        if(!$post){
            throw new \Exception("Error Processing Request", 1);    
        }
        $post = new \DateTime();
        $post = $post->getTimestamp();
        // $postTransformer = $this->get('op_post.object_to_array.transformer');

        // $post = $postTransformer->postToArray($post);
        // foreach ($posts as $post){
        //     $post = $postTransformer->postObjectToArray($post);
        // }

        $response = new JsonResponse();
        return $this->render('OPPostBundle:Post:new.html.twig', array('post'=>$post));
        // return $response->setData(array('post' => $post));
    }

    /**
     * Creates a new Post post.
     *
     * @Route("/create", name="post_create_mobile", host="m.opinion.com")
     * @Method({"POST", "GET"})
     * @Template("OPPostBundle:Post:new.html.twig")
     *
     * @param Request $request
     *
     * @return array
     */
    public function createAction(Request $request, NewPostFormHandler $formHandler, EventDispatcherInterface $dispatcher, ToArrayTransformer $transformer, NotificationManager $notifMan)
    {        
        $form   = $this->createForm(PostType::class, new Post());
        $user   = $this->_getUser();
        //process data througt methode
        if($request->isXmlHttpRequest()){
            $res = new JsonResponse();
            //return $response->setData(array('response'=>array('status'=>true, 'post'=>$form)));
            if($post = $formHandler->process($form, false)){
                $event = new PostEvent($post);        
                $dispatcher->dispatch(OPPostEvents::POST_CREATE, $event);
                $commentForm = $this->notifyAndReturnCommentForm($post, $notifMan);
                return $response->setData(
                    array('response'=>
                        array(
                            'post'  => $transformer->postObjectToArray($post),
                            'commentFormView' => $this->renderView(
                                'OPPostBundle:Comment:xhr_newComment.html.twig',
                                array(
                                    'commentForm' => $commentForm->createView(),
                                    'postValid'   => $post->getId(),
                                    'user'        => $this->_getUser()
                                )
                            ),
                            'commentsView'  => []
                        )
                    )
                );
            }else{
                return $response->setData(array('response'=>array('status'=>false, 'token'=>'')));
            }
        }else{
            if($post = $formHandler->process($form, false)){
                $event = new PostEvent($post);        
                $dispatcher->dispatch(OPPostEvents::POST_CREATE, $event);
                $commentForm = $this->notifyAndReturnCommentForm($post, $notifMan);
                $post = $postTransformer->postObjectToArray($post);
                return $this->render('OPPostBundle:Post:new.html.twig', array('post'=> $post));
            }else{
                return $this->renderView('OPSocialBundle:Home:form.html.twig', array('pform'=> $form->createView(), 'user'=>$user));
            }
        }
    }

    protected function notifyAndReturnCommentForm(Post $post, $notifMan)
    {
        $notifMan->postNotif($post);

        $comment = new Comment();
        $comment->setPostId($post);
        $comment->setPostValid($post->getId());  //set the value
        $commentForm = $this->createForm(CommentType::class, $comment);

        return $commentForm;
    }

    /**
     * Finds and displays a Post post.
     *
     * @Route("/show/{id}", name="post_show_mobile", host="m.opinion.com")
     * @Method("GET")
     * @Template()
     *
     * @param string $id The post ID
     * @param Request $request The request object
     *
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If post doesn't exists
     */
    public function showAction(Request $request, $id, ToArrayTransformer $transformer, RealTimePost $realtime_post)
    {
        $dm = $this->getDocumentManager();
        $post = $dm->getRepository('OPPostBundle:Post')->simpleFindById($id);
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
     * @Route("/edit/{id}", name="post_edit_mobile", host="m.opinion.com")
     * @Template()
     * @Method({"POST", "GET"})
     * @param string $id The post ID
     *
     * @return array
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
        $form   = $this->createForm(PostType::class, $db_post);
        $user   = $this->_getUser();
        $res    = new JsonResponse();
        if($request->isXmlHttpRequest()) {
            if($post = $formHandler->process($form, true)){
                return $res->setData(
                    array('response'=> 
                        array(
                            'status' => true, 
                            'token'  => $this->get('security.csrf.token_manager')->refreshToken('1'),
                            'post'   => $postTransformer->postToArray($post)
                        )
                    )
                );
            }else{
                return $res->setData(
                    array('editForm' => 
                        $this->renderView(
                            'OPPostBundle:Post:xhr_post_edit.html.twig', 
                            array(
                                'editForm'=> $form->createView(), 
                                'user'=>$user, 
                                'post'=>$db_post
                            )
                        )
                    )
                );
            }
        }else{
            //if not XmlHttpRequest
            //echo var_dump($formHandler);
            if($post = $formHandler->process($form, true)){
                return $this->redirect('\/');
            }else{
                return  $this->render(
                    'OPPostBundle:Post:xhr_post_edit.html.twig', 
                    array(
                        'editForm' => $form->createView(), 
                        'user'     => $user, 
                        'post'     => $db_post
                    )
                );
            }
        }
    }

    /**
     * Deletes a Post post.
     *
     * @Route("/remove/{id}", name="post_remove_mobile", host="m.opinion.com")
     * @Method("POST")
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
        return $response->setData(array('response'=>array('status'=>true, 'post'=>'post')));
    }
    
    /**
     * Favorite a Post post.
     *
     * @Route("/favorite/{id}", name="post_favorite_mobile", host="m.opinion.com")
     * @Method("POST")
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
        $response = new JsonResponse();
        $dm = $this->getDocumentManager();
        $post = $dm->getRepository('OPPostBundle:Post')->find($id);
        $user = $this->_getUser();
        if (!$post) {
            throw $this->createNotFoundException('Unable to find Post post.');
        }
        $favor = new Favorite();
        $favor  ->addPost($post)
                ->setAuthor($user)
                ->setType('favorite')
                ->setTarget('post');
        $post->doFavoritesForUserIds($user->getId());
        $dm->persist($favor);
        $dm->flush();
        return $response->setData(array('response'=>array('status'=>true, 'post'=>'post')));
    }
    
    /**
     * Mask a Post post.
     *
     * @Route("/mask/{id}", name="post_mask")
     * @Method("POST")
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
        $response = new JsonResponse();
        $dm = $this->getDocumentManager();
        $post = $dm->getRepository('OPPostBundle:Post')->find($id);
        $user = $this->_getUser();
        if (!$post) {
            throw $this->createNotFoundException('Unable to find Post post.');
        }
        $favor = new Favorite();
        $favor  ->addPost($post)
                ->setAuthor($user)
                ->setType('mask')
                ->setTarget('post');
        $post->doMaskersForUserIds($user->getId());
        $dm->persist($favor);
        $dm->flush();
        return $response->setData(array('response'=>array('status'=>true, 'post'=>'post')));
    }
    
    private function createDeleteForm($id)
    {
        return $this->createFormBuilder(array('id' => $id))
            ->add('id', HiddenType::class, array('required'=>FALSE))
            ->getForm()
        ;
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
