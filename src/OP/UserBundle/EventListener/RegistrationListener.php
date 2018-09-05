<?php

namespace OP\UserBundle\EventListener;

use FOS\UserBundle\FOSUserEvents,
    FOS\UserBundle\Event\FormEvent,
    Lexik\Bundle\JWTAuthenticationBundle\Events,
    FOS\UserBundle\Event\FilterUserResponseEvent,
    OP\MediaBundle\DocumentManager\PictureManager,
    Symfony\Component\EventDispatcher\EventSubscriberInterface,
    Symfony\Component\HttpFoundation\RedirectResponse,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Component\Routing\Generator\UrlGeneratorInterface,
    Lexik\Bundle\JWTAuthenticationBundle\Services\JWTManager,
    Symfony\Component\EventDispatcher\EventDispatcherInterface,
    Symfony\Component\DependencyInjection\ContainerInterface as Container,
    Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;

/**
 * Listener responsible to change the redirection at the end of the password resetting
 */
class RegistrationListener extends AbstractUserListener implements EventSubscriberInterface
{

    /**
     * {@inheritdoc}
     */
    public static function getSubscribedEvents()
    {

        return array(
            //If you don't onRegistrationSuccess to -10, ``EmailConfirmationListener`` 
            //will be called earlier and you will be redirected to
            //``fos_user_registration_check_email`` route.
            FOSUserEvents::REGISTRATION_SUCCESS => [
                ['onRegistrationSuccess', -10],
            ],
            FOSUserEvents::REGISTRATION_FAILURE => 'onRegistrationFaillure',
            FOSUserEvents::REGISTRATION_COMPLETED => 'onRegistrationCompleted',
        );
    }

    public function onRegistrationCompleted(FilterUserResponseEvent $event, PictureManager $pic_man) {

        $user       = $event->getUser();
        $request    = $event->getRequest();
        $session    = $request->getSession();
        $response   = $event->getResponse();
        $jwt        = $this->jwtManager->create($user);
        $defaultPic = $pic_man->provideDefaultProfile($user);
        $jwtEvent   = new AuthenticationSuccessEvent(['token' => $jwt], $user, $response);
        
        if($defaultPic) {
            $user->setCoverPic($defaultPic);
            $user->setProfilePic($defaultPic);
        }

        if('application/x-www-form-urlencoded' === $request->headers->get('Content-Type')) {
            $this->dispatcher->dispatch(Events::AUTHENTICATION_SUCCESS, $jwtEvent);
            $session->set('access_token', $jwtEvent->getData()['token']); //token in session
            $session->set('refresh_token', $jwtEvent->getData()['refresh_token']);
        } else {
            $response   = new JsonResponse();
            $this->dispatcher->dispatch(Events::AUTHENTICATION_SUCCESS, $jwtEvent);
            $response->setData($jwtEvent->getData());
        }
        $password = $request->request->get('password');

        //create Firebase User
        try {
            $this->createFirebaseUser($user, $password);
        } catch (Exception $e) {
            
        }

        //setting data for firebase authentication
        $session->set('_authData', ['email' => $user->getEmail(),
                                //|| or get countryCode + PhoneNumber
                                'password' => $request->request->get('password') 
                            ]
                    );

        $event->setResponse($response);
    }

    public function onRegistrationSuccess(FormEvent $event) {

        if('application/x-www-form-urlencoded' === $this->request->headers->get('Content-Type')) {
            $url        = $this->router->generate('fos_user_registration_confirmed', array('panel' => 'profilepic'));
            $response   = new RedirectResponse($url);
        } else {
            $response   = new JsonResponse();
            $response->setData(array('error'=>'registration error'));
        }

        $event->setResponse($response);
    }

    public function onRegistrationFaillure(FormEvent $event)
    {
        $session  = $this->request->getSession();
        $flashBag = $session->getFlashBag();
        $form     = $event->getForm();

        foreach ($form->all() as $field => $value) {
            if((String)$value->getErrors() !== "") {
                $flashBag->add(
                    'registration.'.$field,
                    (String)$value->getErrors()
                );
            }
        }

        if('application/x-www-form-urlencoded' === $this->request->headers->get('Content-Type')) {
            $url        = $this->router->generate('fos_user_registration_register');
            $response   = new RedirectResponse($url);
        } else {
            $response   = new JsonResponse();
            $response->setData(array('errors'=>'registration error'));
        }

        $event->setResponse($response);
    }
}