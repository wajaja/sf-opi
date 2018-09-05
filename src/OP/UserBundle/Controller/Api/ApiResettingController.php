<?php

// /src/AppBundle/Controller/RestPasswordManagementController.php

namespace OP\UserBundle\Controller\Api;

use FOS\RestBundle\Controller\Annotations,
    FOS\UserBundle\FOSUserEvents,
    Nelmio\ApiDocBundle\Annotation as Doc,
    Symfony\Component\HttpFoundation\Request,
    FOS\UserBundle\Event\GetResponseUserEvent,
    FOS\RestBundle\Controller\FOSRestController,
    FOS\RestBundle\Routing\ClassResourceInterface,
    Symfony\Component\HttpFoundation\JsonResponse,
    FOS\RestBundle\Controller\Annotations\RouteResource,
    FOS\UserBundle\Event\GetResponseNullableUserEvent,
    Symfony\Component\EventDispatcher\EventDispatcherInterface,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter,
    Symfony\Component\Security\Core\User\UserInterface;

/**
 * @Annotations\Prefix("password")
 * @RouteResource("password", pluralize=false)
 */
class ApiResettingController extends FOSRestController implements ClassResourceInterface
{
    /**
     * @Annotations\Post("/reset/request")
     */
    public function requestResetAction(Request $request)
    {
        $username = $request->request->get('username');

        /** @var $user UserInterface */
        $user = $this->get('fos_user.user_manager')->findUserByUsernameOrEmail($username);

        /** @var $dispatcher EventDispatcherInterface */
        $dispatcher = $this->get('event_dispatcher');

        /* Dispatch init event */
        $event = new GetResponseNullableUserEvent($user, $request);
        $dispatcher->dispatch(FOSUserEvents::RESETTING_SEND_EMAIL_INITIALIZE, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }

        if (null === $user) {
            return new JsonResponse(
                'User not recognised',
                JsonResponse::HTTP_FORBIDDEN
            );
        }

        $event = new GetResponseUserEvent($user, $request);
        $dispatcher->dispatch(FOSUserEvents::RESETTING_RESET_REQUEST, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }

        if ($user->isPasswordRequestNonExpired($this->container->getParameter('fos_user.resetting.token_ttl'))) {
            return new JsonResponse(
                $this->get('translator')->trans('resetting.password_already_requested', [], 'FOSUserBundle'),
                JsonResponse::HTTP_FORBIDDEN
            );
        }

        if (null === $user->getConfirmationToken()) {
            /** @var $tokenGenerator \FOS\UserBundle\Util\TokenGeneratorInterface */
            $tokenGenerator = $this->get('fos_user.util.token_generator');
            $user->setConfirmationToken($tokenGenerator->generateToken());
        }

        /* Dispatch confirm event */
        $event = new GetResponseUserEvent($user, $request);
        $dispatcher->dispatch(FOSUserEvents::RESETTING_SEND_EMAIL_CONFIRM, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }

        $this->get('fos_user.mailer')->sendResettingEmailMessage($user);
        $user->setPasswordRequestedAt(new \DateTime());
        $this->get('fos_user.user_manager')->updateUser($user);

        $event = new GetResponseUserEvent($user, $request);
        $dispatcher->dispatch(FOSUserEvents::RESETTING_SEND_EMAIL_COMPLETED, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }

        return new JsonResponse(
            $this->get('translator')->trans(
                'resetting.check_email',
                [ '%tokenLifetime%' => floor($this->container->getParameter('fos_user.resetting.token_ttl') / 3600) ],
                'FOSUserBundle'
            ),
            JsonResponse::HTTP_OK
        );
    }

    /**
     * Reset user password
     * @Annotations\Post("/reset/confirm")
     */
    public function confirmResetAction(Request $request)
    {
        $token = $request->request->get('token', null);

        if (null === $token) {
            return new JsonResponse('You must submit a token.', JsonResponse::HTTP_BAD_REQUEST);
        }

        /** @var $formFactory \FOS\UserBundle\Form\Factory\FactoryInterface */
        $formFactory = $this->get('fos_user.resetting.form.factory');
        /** @var $userManager \FOS\UserBundle\Model\UserManagerInterface */
        $userManager = $this->get('fos_user.user_manager');
        /** @var $dispatcher \Symfony\Component\EventDispatcher\EventDispatcherInterface */
        $dispatcher = $this->get('event_dispatcher');

        $user = $userManager->findUserByConfirmationToken($token);

        if (null === $user) {
            return new JsonResponse(
            // no translation provided for this in \FOS\UserBundle\Controller\ResettingController
                sprintf('The user with "confirmation token" does not exist for value "%s"', $token),
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $event = new GetResponseUserEvent($user, $request);
        $dispatcher->dispatch(FOSUserEvents::RESETTING_RESET_INITIALIZE, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }

        $form = $formFactory->createForm([
            'csrf_protection'    => false,
            'allow_extra_fields' => true,
        ]);
        $form->setData($user);
        $form->submit($request->request->all());

        if (!$form->isValid()) {
            return $form;
        }

        $event = new FormEvent($form, $request);
        $dispatcher->dispatch(FOSUserEvents::RESETTING_RESET_SUCCESS, $event);

        $userManager->updateUser($user);

        if (null === $response = $event->getResponse()) {
            return new JsonResponse(
                $this->get('translator')->trans('resetting.flash.success', [], 'FOSUserBundle'),
                JsonResponse::HTTP_OK
            );
        }

        // unsure if this is now needed / will work the same
        $dispatcher->dispatch(FOSUserEvents::RESETTING_RESET_COMPLETED, new FilterUserResponseEvent($user, $request, $response));

        return new JsonResponse(
            $this->get('translator')->trans('resetting.flash.success', [], 'FOSUserBundle'),
            JsonResponse::HTTP_OK
        );
    }





    //https://stackoverflow.com/questions/40238005/symonfy-3-fosuserbundle-reset-password-with-rest-api
     /**
     * @Route("/resetpassword/{userEmail}", name="user_password_reset-request")
     * @Method("GET")
     */
    public function resetPasswordRequestAction(Request $request)
    {
        $email = $request->query->get('userEmail');
        $user = $this->get('fos_user.user_manager')->findUserByEmail($email);
        if (null === $user) {
            throw $this->createNotFoundException();
        }

        if ($user->isPasswordRequestNonExpired($this->container->getParameter('fos_user.resetting.token_ttl'))) {
            throw new BadRequestHttpException('Password request alerady requested');
        }

        if (null === $user->getConfirmationToken()) {
            /** @var $tokenGenerator \FOS\UserBundle\Util\TokenGeneratorInterface */
            $tokenGenerator = $this->get('fos_user.util.token_generator');
            $user->setConfirmationToken($tokenGenerator->generateToken());
        }

        $this->get('fos_user.mailer')->sendResettingEmailMessage($user);
        $user->setPasswordRequestedAt(new \DateTime());
        $this->get('fos_user.user_manager')->updateUser($user);

        return new Response(Response::HTTP_OK);
    }
}