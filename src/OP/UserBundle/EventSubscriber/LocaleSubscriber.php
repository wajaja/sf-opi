<?php

// src/AppBundle/EventSubscriber/LocaleSubscriber.php
namespace OP\UserBundle\EventSubscriber;

use Symfony\Component\HttpKernel\Event\GetResponseEvent,
    FOS\UserBundle\FOSUserEvents,
    OP\UserBundle\Document\Devices,
    FOS\UserBundle\Event\UserEvent,
    Symfony\Component\HttpKernel\KernelEvents,
    Symfony\Component\EventDispatcher\EventSubscriberInterface,
    Symfony\Component\HttpFoundation\Session\SessionInterface,
    Symfony\Component\Security\Http\SecurityEvents,
    FOS\UserBundle\Model\UserManagerInterface,
    FOS\UserBundle\EventListener\LastLoginListener,
    Symfony\Component\Security\Http\Event\InteractiveLoginEvent,
    Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;

/**
* For full doc see Making at
* The Locale "Sticky" during a User's Session
* Symfony Doc
*/
class LocaleSubscriber implements EventSubscriberInterface 
{
    protected $defaultLocale,
            $userManager,
            $container,
            $session;

    public function __construct($defaultLocale = 'en', SessionInterface $session, UserManagerInterface $userManager, Container $container)
    {
        $this->defaultLocale = $defaultLocale;
        $this->session       = $session;
        $this->userManager      = $userManager;
        $this->container  = $container;

    }

    /** Typically, _locale is used 
    * as a routing parameter to signify the locale
    *
    */
    public function onKernelRequest(GetResponseEvent $event)
    {
        $request = $event->getRequest();
        if (!$request->hasPreviousSession()) {
            return;
        }

        // try to see if the locale has been set as a _locale routing parameter
        if ($locale = $request->attributes->get('_locale')) {
            $request->getSession()->set('_locale', $locale);
        } else {
            echo $g;
            // if no explicit locale has been set on this request, use one from the session
            $request->setLocale($request->getSession()->get('_locale', $this->defaultLocale));
        }
    }

    /**
     * @param UserEvent $event
     */
    public function onImplicitLogin(UserEvent $event)
    {
        // $user = $event->getUser();

        // $user->setLastLogin(new \DateTime());
        // $this->userManager->updateUser($user);
    }

    /**
     * @param InteractiveLoginEvent $event
     */
    public function onSecurityInteractiveLogin(InteractiveLoginEvent $event)
    {
        // $request        = $event->getRequest();
        // $user           = $event->getAuthenticationToken()->getUser();
        // // $clientIp       = $request->getClientIp();
        // // $url            = "http://api.ipinfodb.com/?key=$your_key&ip=$ip&format=json";
        // // $d              = file_get_contents($url);
        // // $data           = json_decode($d , true);
        // // $countryInfos   = $this->getCountryInfos($clientIp);
        // $deviceDetector = $this->container->get('op_user.device_detector');
        // $dm             = $this->container->get('doctrine.odm.mongodb.document_manager.public');

        // if (null !== $user->getLocale()) {
        //     $this->session->set('_locale', $user->getLocale());
        // }


        // $token = new UsernamePasswordToken($user, null, "main", $user->getRoles());
        // $this->container->get("security.token_storage")->setToken($token);

        // /** @var User $user */
        // $user->setLastLogin(new \Datetime(null, new \DateTimeZone("UTC")));
        // $device = new Devices($deviceDetector->getBrowser());
        // $device->setUser($user);
        // $dm->persist($device);
        // // $user->setCountryInfos($countryInfos);
        // $this->userManager->updateUser($user);
    }

    protected function getCountryInfos($clientIp) {

    }

    public static function getSubscribedEvents()
    {
        return array(
            // must be registered after the default Locale listener
            // KernelEvents::REQUEST => array(array('onKernelRequest', 15)),
            // FOSUserEvents::SECURITY_IMPLICIT_LOGIN => 'onImplicitLogin',
            SecurityEvents::INTERACTIVE_LOGIN => 'onSecurityInteractiveLogin',
        );
    }
}