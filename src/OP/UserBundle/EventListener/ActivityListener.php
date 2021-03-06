<?php
namespace OP\UserBundle\EventListener;
define('ANON_PATHS', [
    '/', 
    '/login', 
    '/signup', 
    '/meetyou',
    '/initialize/password'
]);

use Lexik\Bundle\JWTAuthenticationBundle\Exception\{
    JWTDecodeFailureException, JWTEncodeFailureException
};
use FOS\UserBundle\Model\{
    UserInterface, UserManagerInterface, GroupManagerInterface
};
use Symfony\Bundle\FrameworkBundle\{
    Templating\EngineInterface, Routing\Router
};
use Symfony\Component\HttpFoundation\{
    Request, Response, RequestStack, JsonResponse, 
    File\Exception\FileException, RedirectResponse
};
use Symfony\Component\HttpKernel\{
    Event\GetResponseForExceptionEvent, Event\FilterResponseEvent, Event\FilterControllerEvent, 
    Event\GetResponseEvent, HttpKernel, Exception\NotFoundHttpException, Controller\ControllerResolver,
    Exception\MethodNotAllowedHttpException
};
use Symfony\Component\Security\Core\Authentication\Token\{
    UsernamePasswordToken, Storage\TokenStorage
};
use GuzzleHttp\Exception\{RequestException, ConnectException};
use OP\MediaBundle\Document\Image,
    OP\UserBundle\Security\OnlineUsers,
    JMS\Serializer\SerializationContext,
    Namshi\JOSE\InvalidArgumentException,
    Symfony\Component\DependencyInjection\ContainerInterface as Container,
    Symfony\Component\Routing\Exception\ResourceNotFoundException,
    Symfony\Component\Debug\Exception\ContextErrorException,
    Kreait\Firebase\Exception\AuthException,
    OP\UserBundle\Security\UserProvider,
    Symfony\Component\Form\Exception\UnexpectedTypeException,
    Doctrine\ODM\MongoDB\DocumentNotFoundException;

/**
 * Listener that updates the last activity of the authenticated user
 */
class ActivityListener
{
    protected   $tokenStorage, $userManager, $online_users,
                $container, $request, $templating, $router,
                $resolver, $groupManager, $uProvider;

    public function __construct(TokenStorage $tokenStorage, UserManagerInterface $userManager, GroupManagerInterface $groupManager, OnlineUsers $online_users, Container $container, RequestStack $request, EngineInterface $templating, Router $router, ControllerResolver $resolver, UserProvider $uProvider)
    {
        $this->tokenStorage     = $tokenStorage;
        $this->userManager      = $userManager;
        $this->groupManager     = $groupManager;
        $this->online_users     = $online_users;
        $this->container        = $container;
        $this->request          = $request->getCurrentRequest();
        $this->templating       = $templating;
        $this->router           = $router;
        $this->resolver         = $resolver;
        $this->uProvider        = $uProvider;
    }

    /**
     * Listen for request events
     * @param \Symfony\Component\HttpKernel\Event\GetResponseEvent $event
     */
    public function onCoreRequest(GetResponseEvent $event)
    {
        if (!$event->isMasterRequest()){
            return;
        }
        
        $request = $event->getRequest();
        $session = $request->getSession();
  
        if($session->has('domain')) {
            return;
        }
        
        $pathInfo   = $request->getPathInfo();
        if(strpos($pathInfo, '/api/')  !== false){
            return;
        }
        
        //if mobile browser redirect to m.opinion.com
        $host = $request->getHost();
        if( $host !== 'm.opinion.com' &&
            $this->isMobileBrowser($request) &&
            $session->get('domain') !== 'm.opinion.com'
        ) {
            $session->set('domain', 'm.opinion.com');
            if($session->get('access_token')) {
                $url      = $this->router->generate('mobile_homepage');
            } else {
                $url      = $this->router->generate('mobile_login_page');
            }
            $response = new RedirectResponse($url);
            $event->setResponse($response);
            return;
        }

        if (!$this->isMobileBrowser($request) && 
            !$session->get('access_token') && 
            !$this->inArrayPaths($pathInfo, ANON_PATHS) &&
            $session->get('pathInfo') !== '/login'
        ) {
            if($pathInfo !== '/login') {
                $session->set('pathInfo', '/login');
                $response = new RedirectResponse($this->router->generate('fos_user_security_login'));
                $event->setResponse($response);
            }
        }
 
        // //Force authentication code dialog
        // $response = $this->templating->renderResponse('AcmeUserBundle:TwoFactor:email.html.twig');
        // $event->setResponse($response);
    }

    /**
    * Update the user "lastActivity" on each request
    * @param FilterControllerEvent $event
    */
    public function onCoreController(FilterControllerEvent $event)
    {
        if (!$event->isMasterRequest()){
            return;
        }
        
        $request    = $event->getRequest();
        $pathInfo   = $request->getPathInfo();
        if(strpos($pathInfo, '/api/')  !== false){
            return;
        }
        
        $session    = $request->getSession();

        // redirect user to login page
        if (!$this->isMobileBrowser($request) && 
            !$session->get('access_token') && 
            !$this->inArrayPaths($pathInfo, ANON_PATHS) &&
            $session->get('pathInfo') !== '/login'
        ) {
            if($pathInfo !== '/login') {
                $session->set('pathInfo', '/login');
                $url      = $this->router->generate('fos_user_security_login');
                $response = new RedirectResponse($url);
                $event->setController(function() use ($response) {
                    return $response;
                });
            }
        }

        //redirect user to home page
        if (!$this->isMobileBrowser($request) && 
            $session->get('access_token') && 
            $this->inArrayPaths($pathInfo, ANON_PATHS) &&
            $session->get('pathInfo') !== '/'
        ) {
            if($pathInfo !== '/') {
                $session->set('pathInfo', '/login');
                $url      = $this->router->generate('homepage');
                $response = new RedirectResponse($url);
                $event->setController(function() use ($response) {
                    return $response;
                });
            }
        }
        
        // Check token authentication availability
        if ($this->tokenStorage->getToken()) {
            $this->updateUser($this->getUser());
        }
    }

    protected function getUser() {
        return $this->uProvider->getHydratedUser();
    }

    public function onCoreResponse(FilterResponseEvent $event)
    {
        $response = $event->getResponse();
        if($response instanceof RedirectResponse) {

            if(!$this->isRedirectToOtherDomain($response)) {
                try {
                    $this->matchResponseWithRouter($response);
                }catch(ResourceNotFoundException $e) {
                    // Router does not know that url
                    $this->redirectToSafePage($response);
                }
            }
        }
    }


    public function onCoreException(GetResponseForExceptionEvent $event)
    {
        $exception  = $event->getException();
        $request    = $event->getRequest();
        $session    = $request->getSession();
        $msg        = $exception->getMessage();

        //Customize html page render exception
        if('html' === $request->getRequestFormat()) {
            if($exception instanceof NotFoundHttpException || 
               (/*environement*/ false && $exception instanceof MethodNotAllowedHttpException)) {
                $this->renderException($event, $msg, 'route');
            } 
            else if($exception instanceof UnexpectedTypeException) {
                //redirect ....
            } 
            else if($exception instanceof ConnectException) {
                //redirect to not found page
                echo "TODO customize this later; because guzzle connect error ConnectException";
                die();
            }
            else if($exception instanceof RequestException) {
                echo "TODO customize this later; because guzzle connect error RequestException";
                die();
            }
            else if($exception instanceof OutOfRangeCurrentPageException) {
                //redirect to not found page
            }
            //most time exception from cache on jms_serializer
            //when referenced document was removed
            //to prevent app crache
            else if($exception instanceof DocumentNotFoundException) {
                // work on image collection
                if (strpos($msg, '"MongoDBODMProxies\__CG__\OP\MediaBundle\Document\Image"') !== false) {
                    $_second = explode('The "MongoDBODMProxies\__CG__\OP\MediaBundle\Document\Image" document with identifier "', $msg)[1];
                    $proxy_id = explode('" could not be found.', $_second)[0];

                    $picUsers = $this->userManager->loadUsersByProfilePicRef($proxy_id);
                    foreach ($picUsers as $user) {
                        $user->removeProfilePic(); 
                        $this->userManager->updateUser($user); //flush
                    }

                    $covUsers = $this->userManager->loadUsersByCoverPicRef($proxy_id);
                    foreach ($covUsers as $user) {
                        $user->removeCoverPic();
                        $this->userManager->updateUser($user); //flush
                    }

                    $groups = $this->groupManager->loadGroupsByAvatarRef($proxy_id);
                    foreach ($groups as $group) {
                        $group->removeAvatar(); 
                        $this->groupManager->updateGroup($group); //flush
                    }
                }
                // var_dump($exception);
                // die();
            }

            else if($exception instanceof ContextErrorException) {
                // echo "ContextErrorException";
                // die();
            }
            //jwt token exceptions 
            else if ($exception instanceof JWTDecodeFailureException) {
                $msg = $exception->getMessage();
                if('Expired JWT Token' === $msg || 'Invalid JWT Token' === $msg) {
                    // echo $msg;
                    // die();
                    /**
                    * fully logout server side then
                    * onCoreController will take place after
                    * session->invalidate
                    */
                    $session->invalidate();     
                    $this->renderException($event, $msg, 'jwt');
                }
            } else if($exception instanceof InvalidArgumentException) {
                $msg = $exception->getMessage();
                if('Expired JWT Token' === $msg || 'Invalid JWT Token' === $msg) {
                    /**
                    * fully logout server side then
                    * onCoreController will take place after
                    * session->invalidate
                    */
                    $session->invalidate();     
                    $this->renderException($event, $msg, 'jwt');
                }
            } else {
                // echo "string";
                // die();
            }
        }

        if('json' === $request->getRequestFormat()) {
            if ($exception instanceof JWTDecodeFailureException) {
                $msg = $exception->getMessage();
                if('Expired JWT Token' === $msg || 'Invalid JWT Token' === $msg) {
                    //fully logout server side
                    $session->invalidate();
                }
            }

            if($exception instanceof FileException) {
                if(preg_match("/upload_max_filesize/i", $exception->getMessage())) {
                    //fully logout server side
                    // $session->invalidate();
                }
            }

            if($exception instanceof OutOfRangeCurrentPageException) {
                //redirect to not found page
                //attach empy array to request
            }
        }
    }

    private function inArrayPaths($pathInfo, $anonPaths) {
        foreach ($anonPaths as $path) {
            if($path === $pathInfo) {
                return true;
            }
        }
        return false;
    }


    /**
   * @param $response
   * @throws ResourceNotFoundException
   */
    protected function matchResponseWithRouter($response) {
        // $url = $response->getTargetUrl();
        // $this->router->match($url);
    }
    protected function isRedirectToOtherDomain($response) {
        //TODO: Implement
        return false;
    }
    protected function redirectToSafePage($response) {
        $response->setTargetUrl('/');
    }



    protected function updateUser($user)
    {
        $newDate = new \Datetime(null, new \DateTimeZone("UTC"));
        if ($user instanceof UserInterface) {
            $timing  = $user->getTiming();
            $lastAct = $user->getLastActivity();

            //update user connexion timing
            $newDateDateTimeStamp = $newDate->format("U");
            $lastActDateTimeStamp = $lastAct->format("U");
            $diff = (int) round($newDateDateTimeStamp - $lastActDateTimeStamp);
            if($diff < (1000 * 300) ) { //1s * 300 = 6min
                $_timing = (int) $timing + $diff;
                $user->setTiming($_timing);
            }

            if(!($user->isActiveNow())) {
                $user->setLastActivity($newDate);
            }

            $this->userManager->updateUser($user);
            $serializer = $this->container->get('jms_serializer');

            // $context    = new SerializationContext();
            // $groups     = array('Detail');
            // $context->setSerializeNull(true);
            // $context->setGroups($groups);
            $this->online_users->ping($serializer->serialize($user, 'json'));
        }
    }

    private function isMobileBrowser(Request $request) {

        $useragent = $request->headers->get('User-Agent');
        if(preg_match('/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i',$useragent)||preg_match('/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i',substr($useragent,0,4))
        )
            return true;

        return false;
    }

    //render Exception page to user
    function renderException($event, $msg, ...$rest) {
        $request    = $event->getRequest();
        $session    = $request->getSession();
        $token      = $session->get('access_token');
        $serializer = $this->container->get('jms_serializer');
        $response   = $this->templating->renderResponse(
            'OPSocialBundle:Home:home.html.twig', 
            [
                // We pass an array as props
                'initialState'  => [
                    'Exception' => [
                        'status' => true,
                        'message' => $msg,
                        'suggestions' => []
                    ],
                    'Auth'         => [
                        'token'    => $token,
                        'data'      => $session->get('_authData')
                    ],
                    'App' => [
                        'sessionId' => $session->getId()
                    ],
                    'User' => [
                        'user' => $token ? $serializer->toArray($this->getUser()) : null,
                    ]
                ],
                'title'         => 'Opinion',
                'description'   => 'go to login', 
                'locale'        => $request->getLocale(),
            ], 
            // le 3ème paramètre permet de fournir un objet Response :
            new Response(null, 423)
        );

        $event->setResponse($response);
    }
}
