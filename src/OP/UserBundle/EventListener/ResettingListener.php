<?php
// src/OP/UserBundle/EventListener/PasswordResettingListener.php
// depuis la documentation EventListener
namespace OP\UserBundle\EventListener;

use FOS\UserBundle\FOSUserEvents,
    FOS\UserBundle\Event\FormEvent,
    FOS\UserBundle\Event\GetResponseUserEvent,
    Lexik\Bundle\JWTAuthenticationBundle\Events,
    FOS\UserBundle\Event\FilterUserResponseEvent,
    Symfony\Component\HttpFoundation\JsonResponse,
    FOS\UserBundle\Event\GetResponseNullableUserEvent,
    Symfony\Component\HttpFoundation\RedirectResponse,
    Symfony\Component\EventDispatcher\EventSubscriberInterface,
    Symfony\Component\Routing\Generator\UrlGeneratorInterface,
    Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;

/**
 * Listener responsible to change the redirection at the end of the password resetting
 */
class ResettingListener extends AbstractUserListener implements EventSubscriberInterface
{

    /**
     * {@inheritDoc}
     */
    public static function getSubscribedEvents()
    {
        return array(
            FOSUserEvents::RESETTING_SEND_EMAIL_INITIALIZE => 'onSendEmailRessettingInitialize',
            FOSUserEvents::RESETTING_RESET_SUCCESS => 'onPasswordResettingSuccess',
            FOSUserEvents::RESETTING_RESET_COMPLETED => 'onPasswordResettingCompleted',

            FOSUserEvents::RESETTING_SEND_EMAIL_CONFIRM => 'onSendEmailRessettingConfirm',
            FOSUserEvents::RESETTING_SEND_EMAIL_COMPLETED => 'onSendEmailRessettingCompleted',

            FOSUserEvents::RESETTING_RESET_INITIALIZE => 'onResetRessettingInitialize'
        );
    }

    public function onSendEmailRessettingInitialize(GetResponseNullableUserEvent $event) {
        $request  = $event->getRequest();
        $session  = $request->getSession();
        $flashBag = $session->getFlashBag();
        $user     = $event->getUser();
        if($user === null) {
            $flashBag->add('resetting', 'user doesn\'t exist');
            if('application/x-www-form-urlencoded' === $request->headers->get('Content-Type'))
                $response = new RedirectResponse($this->router->generate('op_user_resetting_request', array('email' => 'invalid')));
            else
                $response = new JsonResponse(array('errors'=> $flashBag));
        } else {
            $flashBag->add('resetting', 'email sended');
            if('application/x-www-form-urlencoded' === $request->headers->get('Content-Type'))
                $response = new RedirectResponse($this->router->generate('op_user_resetting_check_email', array('email' => $user->getEmail())));
            else
                $response = new JsonResponse(array('errors'=> $flashBag));
        }
        $event->setResponse($response);
    }


    public function onResetRessettingInitialize(GetResponseUserEvent $event){
        $request  = $event->getRequest();
        $user     = $event->getUser();
        $token    = $user->getConfirmationToken();

        if('application/x-www-form-urlencoded' === $request->headers->get('Content-Type')) {
            $url = $this->router->generate('op_user_resetting_reset', array('token' => $token));
            $response = new RedirectResponse($url);
        } else {
            $response = new JsonResponse(array('success'=> false, "errors" => "form errors"));
        }

        $event->setResponse($response);
    }

    public function onPasswordResettingSuccess(FormEvent $event)
    {
        $request  = $event->getRequest();
        $session  = $request->getSession();
        $flashBag = $session->getFlashBag();
        $mobile = $request->getHost() === "m.opinion.com" ? true : false;
        // $form     = $event->getForm();

        if('application/x-www-form-urlencoded' === $request->headers->get('Content-Type')) {
            $url = $this->router->generate($mobile ? 'mobile_homepage' : 'homepage');
            $response   = new RedirectResponse($url);
        } else {
            $response   = new JsonResponse();
            $response->setData(array('errors'=> $flashBag));
        }

        $event->setResponse($response);
    }

    public function onPasswordResettingCompleted(FilterUserResponseEvent $event)
    {
        $user       = $event->getUser();
        $request    = $event->getRequest();
        $session    = $request->getSession();
        $response   = $event->getResponse();
        $jwt        = $this->jwtManager->create($user);
        $jwtEvent   = new AuthenticationSuccessEvent(['token' => $jwt], $user, $response);

        $session->set('access_token', $jwtEvent->getData()['token']); //token in session
        if('application/x-www-form-urlencoded' === $request->headers->get('Content-Type')) {
            $this->dispatcher->dispatch(Events::AUTHENTICATION_SUCCESS, $jwtEvent);
        } else {
            $this->dispatcher->dispatch(Events::AUTHENTICATION_SUCCESS, $jwtEvent);
            $response->setData($jwtEvent->getData());
        }

        $password = $request->request->get('resetting') ? $request->request->get('resetting')['plainPassword']['first'] : 'default1';

        // //create Firebase User
        // try {
        //     $this->updateFirebaseUser($user, $password);
        // } catch (Exception $e) {
            
        // }

        //setting data for firebase authentication
        //|| or get countryCode + PhoneNumber
        $session->set('_authData', ['email' => $user->getEmail(), 'password' => $password ]);

        $event->setResponse($response);
    }

    public function onSendEmailRessettingConfirm(GetResponseUserEvent $event)
    {
        $user       = $event->getUser();
        $request    = $event->getRequest();
        $req        = $request->request;
        $session    = $request->getSession();
        $email      = $req->get('email') ? $req->get('email') : $req->get('resetting')['email'];

        if('application/x-www-form-urlencoded' === $request->headers->get('Content-Type')) {
            $url = $this->router->generate('op_user_resetting_check_email', array('email' => $email));
            $response = new RedirectResponse($url);
        } else {
            $response   = new JsonResponse();
            $response->setData(array('success'=> true));
        }
        $event->setResponse($response);
    }

    public function onSendEmailRessettingConpleted(GetResponseUserEvent $event)
    {

        $user       = $event->getUser();
        $request    = $event->getRequest();
        $req        = $request->request;
        $session    = $request->getSession();
        $email      = $req->get('email') ? $req->get('email') : $req->get('resetting')['email'];
        echo "dessus";
        if('application/x-www-form-urlencoded' === $request->headers->get('Content-Type')) {
            $url = $this->router->generate('op_user_resetting_check_email', array('email' => $email));
            $response = new RedirectResponse($url);
        } else {
            echo "string";
            die();
            $response   = new JsonResponse();
            $response->setData(array('success'=> true));
        }
        $event->setResponse($response);
    }

    /**
     * @param FormEvent $event
     */
    public function onResettingResetSuccess(FormEvent $event)
    {
        /** @var $user \FOS\UserBundle\Model\UserInterface */
        $user = $event->getForm()->getData();

        $user->setConfirmationToken(null);
        $user->setPasswordRequestedAt(null);
        $user->setEnabled(true);
    }

    public function onSendEmailRessettingCompleted(GetResponseUserEvent $event) {

    }
}