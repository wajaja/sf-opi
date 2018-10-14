<?php

namespace OP\UserBundle\Security\Http\Authentication;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent,
    Lexik\Bundle\JWTAuthenticationBundle\Events,
    OP\UserBundle\Document\Devices,
    OP\UserBundle\Document\User,
    Kreait\Firebase\Factory,
    Kreait\Firebase\ServiceAccount,
    OP\SocialBundle\Firebase\Firebase,
    Doctrine\ODM\MongoDB\DocumentManager,
    OP\UserBundle\Security\DeviceDetector,
    FOS\UserBundle\Model\UserManagerInterface,
    Symfony\Component\HttpFoundation\RedirectResponse,
    Lexik\Bundle\JWTAuthenticationBundle\Response\JWTAuthenticationSuccessResponse,
    Lexik\Bundle\JWTAuthenticationBundle\Services\JWTManager,
    Symfony\Component\EventDispatcher\EventDispatcherInterface,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\RequestStack,
    Symfony\Component\Security\Core\Authentication\Token\TokenInterface,
    Symfony\Component\Security\Core\User\UserInterface,
    Symfony\Component\DependencyInjection\ContainerInterface as Container,
    Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken,
    Symfony\Component\Security\Http\Event\InteractiveLoginEvent,
    Symfony\Component\Security\Core\Exception\UsernameNotFoundException,
    Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;

/**
 * AuthenticationSuccessHandler.
 *
 * @author Dev Lexik <dev@lexik.fr>
 */
class AuthenticationSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    /**
     * @var JWTManager
     */
    protected $jwtManager, $dispatcher, $firebase,
              $request, $userManager, $deviceDetector,
              $container, $dm;

    /**
     * @param JWTManager               $jwtManager
     * @param EventDispatcherInterface $dispatcher
     */
    public function __construct(RequestStack $requestStack, JWTManager $jwtManager, EventDispatcherInterface $dispatcher, Container $container, UserManagerInterface $userManager, Firebase $fb, DeviceDetector $device, DocumentManager $dm)
    {
        $this->jwtManager = $jwtManager;
        $this->dispatcher = $dispatcher;
        $this->request    = $requestStack->getCurrentRequest();
        $this->container  = $container;
        $this->userManager= $userManager;
        $this->firebase   = $fb;
        $this->deviceDetector = $device;
        $this->dm         = $dm;
    }

    /**
     * {@inheritdoc}
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token)
    {
        return $this->handleAuthenticationSuccess($token->getUser());
    }

    public function handleAuthenticationSuccess(UserInterface $user, $jwt = null)
    {
        $request    = $this->request;
        $session    = $request->getSession();
        $referer    = $request->headers->get('referer');

        if(!$session->isStarted())  $session->start();

        if (null === $jwt) {
            $jwt = $this->jwtManager->create($user);
        }

        ////check request type or device
        if('application/x-www-form-urlencoded' === $request->headers->get('Content-Type')) { 

            $response  = new RedirectResponse($referer);    //we will redirect user to referer

            $event    = new AuthenticationSuccessEvent(['token' => $jwt], $user, $response);
            $this->dispatcher->dispatch(Events::AUTHENTICATION_SUCCESS, $event);
            $session->set('access_token', $event->getData()['token']);   //store token in session
            $session->set('refresh_token', $event->getData()['refresh_token']);
        } else {
            $response = new JWTAuthenticationSuccessResponse($jwt); //extend JsonResponse
            $event    = new AuthenticationSuccessEvent(['token' => $jwt], $user, $response);
            $this->dispatcher->dispatch(Events::AUTHENTICATION_SUCCESS, $event);
            $session->set('access_token', $event->getData()['token']);
            $session->set('refresh_token', $event->getData()['refresh_token']);
            $response->setData($event->getData());
        }

        $password = $request->request->get('password');
        $email    = $user->getEmail();
        //setting data for firebase authentication
        $session->set('_authData', [
            'email' => $email, //|| or get countryCode + PhoneNumber
            'password' => $password
        ]);

        $this->updateLastLogin($user);
        try {
            $this->firebaseLogin($email, $password);
        } catch (\Exception $e) {
            //TODO dev
        }

        ////manual user's login
        // $token = new UsernamePasswordToken($user, null, "main", $user->getRoles());
        // $this->container->get("security.token_storage")->setToken($token);
        return $response;
    }

    protected function firebaseLogin($email, $password) {
        $serviceAccount = ServiceAccount::fromJsonFile(__DIR__.'/google-service-account.json');
        $auth       = $this->firebase->getAuth();

        try {
            $userRecord = $auth->verifyPassword($email, $password);
        } catch (Kreait\Firebase\Exception\Auth\InvalidPassword $e) {
            //TODO
            echo "userRecord string";
            echo $e->getMessage();
            exit;
        }
        //detail on https://github.com/kreait/firebase-php/issues/178
        //Authenticate with limited privileges
        $userConnection = (new Factory)
            ->withServiceAccount($serviceAccount)
            ->asUser($userRecord->uid)
            ->create();
    }


    /**
    * copy from LocaleSubcriber
    * due to issue in InteractiveLogin Listener
    */
    protected function updateLastLogin(User $user) {
        // $clientIp       = $request->getClientIp();
        // $url            = "http://api.ipinfodb.com/?key=$your_key&ip=$ip&format=json";
        // $d              = file_get_contents($url);
        // $data           = json_decode($d , true);
        // $countryInfos   = $this->getCountryInfos($clientIp);
        $request = $this->request;
        $session = $request->getSession();
        $deviceDetector = $this->deviceDetector;

        if (null !== $user->getLocale()) {
            $session->set('_locale', $user->getLocale());
        }

        $session->set('isMobile', $deviceDetector->isMobileBrowser($request));
        $token = new UsernamePasswordToken($user, null, "api", $user->getRoles());
        $this->container->get("security.token_storage")->setToken($token);

        /** @var User $user */
        $user->setLastLogin(new \Datetime(null, new \DateTimeZone("UTC")));
        $device = new Devices($deviceDetector->getBrowser());
        $device->setUser($user);
        $this->dm->persist($device);
        // $user->setCountryInfos($countryInfos);
        $this->userManager->updateUser($user);


    }
}
