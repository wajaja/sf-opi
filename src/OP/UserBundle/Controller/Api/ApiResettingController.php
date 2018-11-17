<?php

// /src/AppBundle/Controller/RestPasswordManagementController.php

namespace OP\UserBundle\Controller\Api;

use FOS\RestBundle\Controller\Annotations,
    FOS\UserBundle\FOSUserEvents,
    OP\UserBundle\Security\UserProvider,
    Symfony\Component\HttpFoundation\Request,
    FOS\UserBundle\Event\GetResponseUserEvent,
    FOS\RestBundle\Controller\FOSRestController,
    OP\UserBundle\Repository\OpinionUserManager,
    FOS\RestBundle\Routing\ClassResourceInterface,
    OP\UserBundle\Mailer\Mailer,
    FOS\UserBundle\Event\FormEvent,
    FOS\UserBundle\Event\FilterUserResponseEvent,
    FOS\UserBundle\Form\Factory\FormFactory,
    FOS\UserBundle\Util\TokenGeneratorInterface,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Component\HttpFoundation\RedirectResponse,
    FOS\RestBundle\Controller\Annotations\RouteResource,
    FOS\UserBundle\Event\GetResponseNullableUserEvent,
    Symfony\Component\EventDispatcher\EventDispatcherInterface;

class ApiResettingController extends FOSRestController implements ClassResourceInterface
{

    protected $dm, $user_provider, $tokenGenerator, $userMan, $eventDispatcher, 
                $retryTtl, $mailer, $formFactory;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm, OpinionUserManager $userMan, EventDispatcherInterface $dispatcher, TokenGeneratorInterface $tokenGenerator, Mailer $mailer, FormFactory $formFactory, $retryTtl) {
        $this->dm           = $dm;
        $this->userMan      = $userMan;
        $this->user_provider = $uProvider;
        $this->eventDispatcher = $dispatcher;
        $this->formFactory  = $formFactory;
        $this->tokenGenerator = $tokenGenerator;
        $this->mailer = $mailer;
        $this->retryTtl = $retryTtl;
    }

    /**
     * Reset user password
     * @Annotations\Post("/resetting/reset/{token}")
     */
    public function resetAction(Request $request, $token)
    {
        $user = $this->userMan->findUserByConfirmationToken($token);

        if (null === $user) {
            if('application/x-www-form-urlencoded' === $request->headers->get('Content-Type'))
                return new RedirectResponse($this->router->generate('op_user_security_login'));
            else
                return new JsonResponse(array('success'=> false, 'message' => 'invalid token'));
        }

        if('application/x-www-form-urlencoded' !== $request->headers->get('Content-Type')) { 
            $data       = json_decode($request->getContent(), true);
            $request->request->replace(is_array($data) ? $data : array());
        }

        $event = new GetResponseUserEvent($user, $request);
        $this->eventDispatcher->dispatch(FOSUserEvents::RESETTING_RESET_INITIALIZE, $event);

        if (null !== $event->getResponse()) {
            $response = $event->getResponse();
        }

        $form = $this->formFactory->createForm(['csrf_protection' => false]);

        $form->setData($user);

        $form->handleRequest($request);
        // $form->submit($request->request->all());

        if ($form->isSubmitted()) {
            if($form->isValid()) {
                $event = new FormEvent($form, $request);
                $this->eventDispatcher->dispatch(FOSUserEvents::RESETTING_RESET_SUCCESS, $event);
                $this->userMan->updateUser($user);

                if (null === $response = $event->getResponse()) {
                    $url = $this->router->generate('homepage');
                    $response = new RedirectResponse($url);
                }

                $this->eventDispatcher->dispatch(
                    FOSUserEvents::RESETTING_RESET_COMPLETED,
                    new FilterUserResponseEvent($user, $request, $response)
                );
            } else {
                $this->handleResetFaillure($request, $form);
            }
            return $response;
        }
        return $response; 
    }
    

    //https://stackoverflow.com/questions/40238005/symonfy-3-fosuserbundle-reset-password-with-rest-api
     /**
     * @Annotations\Post("/resetting/send-email", name="resetting_send_email")
     */
    public function sendEmailAction(Request $request)
    {
        $req = $request->request;
        $email = $req->get('email') ? $req->get('email') : $req->get('resetting')['email'];

        $user = $this->userMan->findUserByUsernameOrEmail($email);

        $event = new GetResponseNullableUserEvent($user, $request);
        $this->eventDispatcher->dispatch(FOSUserEvents::RESETTING_SEND_EMAIL_INITIALIZE, $event);

        if (null !== $event->getResponse()) {
            $response = $event->getResponse();
        }

        if (null !== $user && !$user->isPasswordRequestNonExpired($this->retryTtl)) {
            $event = new GetResponseUserEvent($user, $request);
            $this->eventDispatcher->dispatch(FOSUserEvents::RESETTING_RESET_REQUEST, $event);

            if (null !== $event->getResponse()) {
                $response = $event->getResponse();
            }

            if (null === $user->getConfirmationToken()) {
                $user->setConfirmationToken($this->tokenGenerator->generateToken());
            }

            $event = new GetResponseUserEvent($user, $request);
            $this->eventDispatcher->dispatch(FOSUserEvents::RESETTING_SEND_EMAIL_CONFIRM, $event);

            if (null !== $event->getResponse()) {
                $response = $event->getResponse();
            }

            $this->mailer->sendResettingEmailMessage($user);
            $user->setPasswordRequestedAt(new \DateTime());
            $this->userMan->updateUser($user);

            $event = new GetResponseUserEvent($user, $request);
            $this->eventDispatcher->dispatch(FOSUserEvents::RESETTING_SEND_EMAIL_COMPLETED, $event);

            if (null !== $event->getResponse()) {
                $response = $event->getResponse();
            }
        }

        return $response;
         // new RedirectResponse($this->generateUrl('op_user_resetting_check_email', array('email' => $email)));
    }

    protected function handleResetFaillure($request, $form){
        $session  = $request->getSession();
        $flashBag = $session->getFlashBag();

        foreach ($form->all() as $field => $value) {
            if((String)$value->getErrors() !== "") {
                $flashBag->add(
                    'registration.'.$field,
                    (String)$value->getErrors()
                );
            }
        }
    }
}