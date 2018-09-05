<?php
namespace OP\SocialBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\{Method, Route, Template};
use Symfony\Component\HttpFoundation\{ Session\Session};
use Symfony\Component\Security\Core\{Exception\AuthenticationException, Security};
use OP\UserBundle\Document\User,
    JMS\Serializer\SerializerInterface,
    OP\UserBundle\Security\UserProvider,
    FOS\UserBundle\Form\Factory\FormFactory,
    Symfony\Component\EventDispatcher\EventDispatcherInterface,
    Symfony\Component\HttpFoundation\Request,
    OP\MessageBundle\DocumentManager\ThreadManager,
    OP\MessageBundle\DocumentManager\MessageManager,
    OP\PostBundle\DocumentManager\PostManager,
    OP\UserBundle\Repository\OpinionUserManager,
    OP\UserBundle\DocumentManager\InvitationManager,
    OP\SocialBundle\DocumentManager\NotificationManager,
    Symfony\Bundle\FrameworkBundle\Controller\Controller;


class HomeController extends Controller
{

    protected $dm, $user_provider, $formFactory;

    public function __construct(UserProvider $uProvider, FormFactory $formFactory, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
        $this->formFactory  = $formFactory;
    }

    
    /**
     * home
     *
     * @Route("/", name="homepage", host="opinion.com",)
     * @Template()
     *
     * @return array
     */
    public function indexAction(Request $request, ThreadManager $threadMan, MessageManager $msgMan, PostManager $pMan, NotificationManager $notifMan, InvitationManager $invitMan, SerializerInterface $serializer)
    {
        //         $client = new \GetStream\Stream\Client('sewzt6y5y29n', 'c4bdc5xpez98f5vb4pfdu7myg2zsax5ykahuem2thkmsm7d5e9ddztskjwcwdhk8');
        $session = $request->getSession();
        // $session->invalidate();
        //control over state jwt_token key

        $dm         = $this->getDocumentManager();
        $dm->getSchemaManager()->ensureIndexes();

        if($token = $session->get('access_token') /* && $session->get('refresh_token)*/) {
            $description  = 'Opinion Home page, news list';
            $user         = $this->_getUser();
            $utcDate      = new \Datetime(null, new \DateTimeZone("UTC"));
            $postsData    = $this->loadInitialPosts($user, 1, $utcDate, $pMan);

            // $firebase = $this->get('op_social.firebase');
            // $db     = $firebase->getDatabase();
            // $fireUser = $db
            //     ->getReference("users/{$user->getId()}")->getValue();
            // var_dump($fireUser);
            // die();


            return $this->render('OPSocialBundle:Home:home.html.twig', [
                // We pass an array as props
                'initialState'  => [
                    'App'         => [
                        'sessionId'    => $session->getId()
                    ],
                    'User'          => [
                        'user'      => $serializer->toArray($user),
                        'newsRefs'  => $postsData['newsRefs']
                    ],
                    'Auth'         => [
                        'token'    => $token,
                        'data'      => $session->get('_authData')
                    ],
                    'Stream'         => [
                        'lastStreamId'=> $postsData['lastStreamId'],
                    ],
                    'NewsFeed'      => [
                        'news'      => $postsData['posts']
                    ],
                    'Notification'  => [
                        'nbAlerts'  =>  $notifMan->countAlerts($user),
                    ],
                    'Invitation'    => [
                        'nbAlerts'  =>  $this->getInvitationManager()
                                             ->countAlerts($user),
                    ],
                    'RelationShip'  => [
                        'suggestions' => $invitMan->getSuggestionForUser($user, [])
                    ],
                    'Message'       => [
                        'nbAlerts'  =>  $msgMan->countAlerts($user),
                        'threadsIds' => $threadMan->findParticipantInboxThreadsIds($user)
                    ],
                    'Users'         => [
                        'defaults'  => $invitMan->loadDefaultUsers($user, []),
                        'onlines'   => [],
                    ],
                    'Authors'       => [
                        'authors'   => $postsData['authors']
                    ]
                ],
                'title'         => 'Opinion',
                'description'   => $description, 
                'locale'        => $request->getLocale(),
            ]);

        } else {
            $loginKeys      = $this->getLoginKeys($request);
            $description    = 'Welcome to opinion';
            return  $this->render(
                            'OPSocialBundle:Welcome:welcome.html.twig', 
                            array(
                                'title'         => 'Welcome to Opinion', 
                                'description'   => $description, 
                                'locale'        => $request->getLocale(),
                                'form'          => $this->getRegisterForm(),
                                'error'         => $loginKeys['error'],
                                'csrf_token'    => $loginKeys['csrf_token'],
                                'last_username' => $loginKeys['last_username']
                            )
                        );
        }
    }

    protected function loadInitialPosts(User $user, $page, $date, $manager) {
        $timeline  = $manager->loadPost($user, $page, $date);
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

    

    /**
     * @param Request $request
     *
     * @return Response
     */
    private function getLoginKeys(Request $request)
    {
        /** @var $session Session */
        $session = $request->getSession();

        $authErrorKey = Security::AUTHENTICATION_ERROR;
        $lastUsernameKey = Security::LAST_USERNAME;

        // get the error if any (works with forward and redirect -- see below)
        if ($request->attributes->has($authErrorKey)) {
            $error = $request->attributes->get($authErrorKey);
        } elseif (null !== $session && $session->has($authErrorKey)) {
            $error = $session->get($authErrorKey);
            $session->remove($authErrorKey);
        } else {
            $error = null;
        }

        if (!$error instanceof AuthenticationException) {
            $error = null; // The value does not come from the security component.
        }

        // last username entered by the user
        $lastUsername = (null === $session) ? '' : $session->get($lastUsernameKey);

        $csrfToken = $this->has('security.csrf.token_manager')
            ? $this->get('security.csrf.token_manager')->getToken('authenticate')->getValue()
            : null;

        return  array (
                    'last_username' => $lastUsername,
                    'error' => $error,
                    'csrf_token' => $csrfToken,
                );
    }

    protected function getRegisterForm() {
        return $this->formFactory->createForm()->createView();
    }
    
    private function goWelcomePage($helper, $request)
    {
        $session = $request->getSession();
        if (class_exists('\Symfony\Component\Security\Core\Security')) {
            $authErrorKey = Security::AUTHENTICATION_ERROR;
            $lastUsernameKey = Security::LAST_USERNAME;
        } else {
            // BC for SF < 2.6
            $authErrorKey = SecurityContextInterface::AUTHENTICATION_ERROR;
            $lastUsernameKey = SecurityContextInterface::LAST_USERNAME;
        }

        //  get the error if any (works with forward and redirect -- see below)
        if ($request->attributes->has($authErrorKey)) {
            $error = $request->attributes->get($authErrorKey);
        } elseif (null !== $session && $session->has($authErrorKey)) {
            $error = $session->get($authErrorKey);
            $session->remove($authErrorKey);
        } else {
            $error = null;
        }

        if (!$error instanceof AuthenticationException) {
            $error = null; // The value does not come from the security component.
        }

        // last username entered by the user
        $lastUsername = (null === $session) ? '' : $session->get($lastUsernameKey);


        if ($this->has('security.csrf.token_manager')) {
            $csrfToken = $this->get('security.csrf.token_manager')->getToken('authenticate')->getValue();
        } else {
            // BC for SF < 2.4
            $csrfToken = $this->has('form.csrf_provider')
                ? $this->get('form.csrf_provider')->generateCsrfToken('authenticate')
                : null;
        }       
        
        $description = "Welcome To opinion";
        $top =$this->renderView('::base.html.twig', 
            array('title'=>'Welcome to Opinion',
                  'description'=>$description,
                  'last_username' => $lastUsername,
                  'error' => $error,
                  'csrf_token' => $csrfToken)
        );
        
        $helper->out($top);
        sleep(2);
        
        $register_view = $this->registerView($request);
        $register_js = file_get_contents('http://opinion/app/social/pbc-sugg-news.js');
        $helper->outPlaceholder($register_view, 'wlc_register_ctnr', $register_js);
                
        $bottom = $this->renderView('OPSocialBundle:Welcome:bottom.html.twig');
        echo $bottom;
    }
    
    private function registerView($request, $user_manager, $dispatcher)
    {
        /** @var $formFactory \FOS\UserBundle\Form\Factory\FactoryInterface */
        $formFactory = $this->formFactory;
        /** @var $userManager \FOS\UserBundle\Model\UserManagerInterface */
        $userManager = $this->get('fos_user.user_manager');
        /** @var $dispatcher \Symfony\Component\EventDispatcher\EventDispatcherInterface */
        $dispatcher = $this->get('event_dispatcher');

        $user = $userManager->createUser();
        $user->setEnabled(true);

        $event = new GetResponseUserEvent($user, $request);
        $dispatcher->dispatch(FOSUserEvents::REGISTRATION_INITIALIZE, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }

        $form = $formFactory->createForm();
        $form->setData($user);

        $form->handleRequest($request);

        if ($form->isValid()) {
            $event = new FormEvent($form, $request);
            $dispatcher->dispatch(FOSUserEvents::REGISTRATION_SUCCESS, $event);

            $userManager->updateUser($user);

            if (null === $response = $event->getResponse()) {
                $url = $this->generateUrl('fos_user_registration_confirmed');
                $response = new RedirectResponse($url);
            }

            $dispatcher->dispatch(FOSUserEvents::REGISTRATION_COMPLETED, new FilterUserResponseEvent($user, $request, $response));

            return $response;
        }
        return $this->renderView('FOSUserBundle:Registration:register_content.html.twig', array('form' => $form->createView(),));
    }
    
    public function getFriendsIds()
    {
        $friends = $this->container->get('op_user.user_manager')
                        ->selectFriends($this->_getUser()->getUsername());
        $friends_ids = [];
        foreach($friends as $friend){
            if(is_object($friend)){
                $friends_ids[] = (string)$friend->{'$id'};
            }            
        }
        return $friends_ids;
    }

    private function getInvitationManager() {
        return $this->container->get('op_user.invitation_manager');
    }

    private function getMessageMassage() {
        return $this->container->get('op_message.message_manager');
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
