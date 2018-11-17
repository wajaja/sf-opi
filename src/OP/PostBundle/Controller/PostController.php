<?php

namespace OP\PostBundle\Controller;

use OP\PostBundle\Document\{Post, User, Comment, Favorite};
use OP\PostBundle\Form\{PostType, CommentType};
use OP\PostBundle\Event\{PostEvent, OPPostEvents};
        
use JMS\Serializer\SerializerInterface,
    OP\UserBundle\Security\UserProvider,
    OP\PostBundle\DocumentManager\PostManager,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\MessageBundle\DocumentManager\ThreadManager,
    OP\MessageBundle\DocumentManager\MessageManager,
    OP\PostBundle\FormHandler\NewPostFormHandler,
    OP\UserBundle\DocumentManager\InvitationManager,
    OP\PostBundle\DataTransformer\ToArrayTransformer,
    OP\SocialBundle\DocumentManager\NotificationManager,
    Symfony\Component\EventDispatcher\EventDispatcherInterface,
    Symfony\Component\Form\Extension\Core\Type\HiddenType,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Method,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;


class PostController extends Controller
{

    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }
    
    /**
     * Lists all Post posts.
     *
     * @Route("/", name="post_index")
     * @Template()
     *
     * @return array
     */
    public function indexAction(Request $request, ThreadManager $threadMan, MessageManager $msgMan, InvitationManager $invitMan, EventDispatcherInterface $dispatcher, SerializerInterface $serializer, ToArrayTransformer $transformer, NotificationManager $notifMan, PostManager $pMan)
    {
        $session  = $request->getSession();
        if($token = $session->get('access_token')) {
            $post = $postIds  = [];
            $utcDate = new \Datetime(null, new \DateTimeZone("UTC"));
            $user = $this->_getUser();
            $dm   = $this->getDocumentManager();


            $postsData    = $this->loadInitialPosts($user, 1, $utcDate, $pMan); //TODO replace by getStream api
        
            return $this->render('OPPostBundle:Post:show.html.twig', [
                // We pass an array as props
                'initialState' => [
                    'App'         => [
                        'sessionId'    => $session->getId()
                    ],
                    'User'        => [
                        'user'      => $serializer->toArray($user)
                    ],
                    'Auth'         => [
                        'token'    => $token,
                        'data'      => $session->get('_authData')
                    ],
                    'Posts' => [
                        'posts'   => $postsData['posts']
                    ],
                    'Stream'         => [
                        'lastStreamId'=> $postsData['lastStreamId'],
                    ],
                    'Notification' => [
                        'nbAlerts'  => $notifMan->countAlerts($user),
                    ],
                    'Invitation'   => [
                        'nbAlerts'  =>  $invitMan->countAlerts($user),
                    ],
                    'Message'      => [
                        'nbAlerts'  =>  $msgMan->countAlerts($user),
                        'threadsIds' => $threadMan->findParticipantInboxThreadsIds($user)
                    ],
                    'Users'        => [
                        'defaults'  => $invitMan->loadDefaultUsers($user, []),
                        'onlines'   => []
                    ],
                    'NewsFeed'     => [
                        'news'      => []
                    ],
                    'Invitation'    => [],
                ],
                'title'         => "Public Post",
                'description'   => 'list of public opinions', 
                'locale'        => $request->getLocale(),
            ]);
        } else {
            return $this->redirect($this->generateUrl('fos_user_security_login'));
        }
    }    

    /**
     * Finds and displays a Post post.
     *
     * @Route("/{id}", name="post_show")
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
    public function showAction(Request $request, $id, ThreadManager $threadMan, MessageManager $msgMan, InvitationManager $invitMan, EventDispatcherInterface $dispatcher, ToArrayTransformer $transformer, NotificationManager $notifMan, SerializerInterface $serializer)
    {
        $session  = $request->getSession();
        if($token = $session->get('access_token')) {
            $post = $postIds  = [];
            $user = $this->_getUser();
            $dm   = $this->getDocumentManager();
            $data = $dm->getRepository('OPPostBundle:Post')->findSimplePostById($id);
            
            if ($data)
                $post  = $transformer->postToArray($data);
        
            return $this->render('OPPostBundle:Post:show.html.twig', [
                // We pass an array as props
                'initialState' => [
                    'App'         => [
                        'sessionId'    => $session->getId()
                    ],
                    'User'        => [
                        'user'      => $serializer->toArray($user)
                    ],
                    'Auth'         => [
                        'token'    => $token,
                        'data'      => $session->get('_authData')
                    ],
                    'Posts' => [
                        'postsById' => [
                            $id => $post
                        ],
                        'postIds'   => [$id]
                    ],
                    'Notification' => [
                        'nbAlerts'  => $notifMan->countAlerts($user),
                    ],
                    'Invitation'   => [
                        'nbAlerts'  =>  $invitMan->countAlerts($user),
                    ],
                    'Message'      => [
                        'nbAlerts'  =>  $msgMan->countAlerts($user),
                        'threadsIds' => $threadMan->findParticipantInboxThreadsIds($user)
                    ],
                    'Users'        => [
                        'defaults'  => $invitMan->loadDefaultUsers($user, []),
                        'onlines'   => []
                    ],
                    'NewsFeed'     => [
                        'news'      => []
                    ],
                    'Invitation'    => [],
                ],
                'title'         => isset($post['author']) ? "Post of {$post['author']['firstname']}" : "Not Found",
                'description'   => 'post show', 
                'locale'        => $request->getLocale(),
            ]);
        } else {
            return $this->redirect($this->generateUrl('fos_user_security_login'));
        }
    }

    /**
     * Deletes a Post post.
     *
     * @Route("/remove/{id}", name="post_remove")
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
        $response   = new JsonResponse();
        $dm         = $this->getDocumentManager();
        $post       = $dm->getRepository('OPPostBundle:Post')->find($id);
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
     * @Route("/favorite/{id}", name="post_favorite")
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
        $res   = new JsonResponse();
        $dm    = $this->getDocumentManager();
        $post  = $dm->getRepository('OPPostBundle:Post')->find($id);
        $user  = $this->_getUser();
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
        $res  = new JsonResponse();
        $dm   = $this->getDocumentManager();
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

    protected function loadInitialPosts(User $user, $page, $date, $manager) {
        $timeline  = $manager->loadPublic($user, $page, $date);
        $posts     = $timeline['posts'];
        $authors   = $newsRefs = [];
        foreach ($posts as $p) {
            $authors[]  = $p['author'];
            $newsRefs[] = [
                'id' => $p['id'],
                'type' => $p['type']
            ];
        }

        return [
            'posts' => $posts,
            'authors' => $authors,
            'newsRefs'  => $newsRefs,
            'lastStreamId' => $timeline['lastStreamId']
        ];
    }

    public function _getUser()
    {
        return $this->user_provider->getHydratedUser();
    }
    
    private function createDeleteForm($id)
    {
        return $this->createFormBuilder(array('id' => $id))
            ->add('id', HiddenType::class, array('required'=>FALSE))
            ->getForm()
        ;
    }

    private function returnCommentForm()
    {
        $notification_manager = $this->container->get('op_social.notification_manager');    //get the opinion form handler
        $notification_manager->postNotif($post);
        $comment = new Comment();
        $comment->setPostId($post);
        $comment->setPostValid($post->getId());  //set the value
        $commentForm = $this->createForm(CommentType::class, $comment);
        return $commentForm;
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
