<?php

/*
 * This file is part of the FOSUserBundle package.
 *
 * (c) FriendsOfSymfony <http://friendsofsymfony.github.com/>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace OP\UserBundle\Controller;

use FOS\UserBundle\FOSUserEvents,
    FOS\UserBundle\Event\FormEvent,
    FOS\UserBundle\Event\GetResponseUserEvent,
    FOS\UserBundle\Event\FilterUserResponseEvent,
    FOS\UserBundle\Model\UserInterface,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Symfony\Component\HttpFoundation\Request,
    OP\UserBundle\Security\UserProvider,
    FOS\UserBundle\Form\Factory\FormFactory,
    Symfony\Component\HttpFoundation\RedirectResponse,
    Symfony\Component\Translation\TranslatorInterface,
    Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Controller managing the resetting of the password
 *
 * @author Thibault Duplessis <thibault.duplessis@gmail.com>
 * @author Christophe Coevoet <stof@notk.org>
 */
class ResettingController extends Controller
{

    protected $translator, $user_provider, $formFactory;

    public function __construct(TranslatorInterface $trans, UserProvider $uProvider, FormFactory $formFactory) {
        $this->translator  = $trans;
        $this->user_provider = $uProvider;
        $this->formFactory  = $formFactory;
    }


    /**
     * Request reset user password: show form
     */
    public function requestAction(Request $request)
    {
        $session = $request->getSession();
        $description = 'reset your password';
        return  $this->render(
            'OPUserBundle:Resetting:index.html.twig', 
            [
                'initialState'  => [
                    'App'         => [
                        'sessionId' => $session->getId()
                    ],
                    'Resetting' => [
                        'invalid_username' => false,
                        'action' => 'api/resetting/send-email',
                        'trans' => [
                            'username' => $this->translator->trans('resetting.request.username', array(), 'OPUserBundle'),
                            'submit' => $this->translator->trans('resetting.request.submit', array(), 'OPUserBundle')
                        ]
                    ],
                ],
                'title'       => 'Reset your password',
                'description' => $description, 
                'locale'      => $request->getLocale()
            ]
        );
    }
                    // 'invalid_username_trans' => $this->translator->trans('resetting.request.invalid_username', array("username" => null), 'OPUserBundle');
        // resetting.request.submit
        // $Check_trans = $this->translator->trans('resetting.check_email', array(), 'OPUserBundle')
        // resetting.reset.submit

    /**
     * Request reset user password: submit form and send email
     */
    public function sendEmailAction(Request $request)
    {
        $username = $request->request->get('username');

        /** @var $user UserInterface */
        $user = $this->get('fos_user.user_manager')->findUserByUsernameOrEmail($username);

        if (null === $user) {
            return $this->render('FOSUserBundle:Resetting:request.html.twig', array(
                'invalid_username' => $username
            ));
        }

        if ($user->isPasswordRequestNonExpired($this->container->getParameter('fos_user.resetting.token_ttl'))) {
            return $this->render('FOSUserBundle:Resetting:passwordAlreadyRequested.html.twig');
        }

        if (null === $user->getConfirmationToken()) {
            /** @var $tokenGenerator \FOS\UserBundle\Util\TokenGeneratorInterface */
            $tokenGenerator = $this->get('fos_user.util.token_generator');
            $user->setConfirmationToken($tokenGenerator->generateToken());
        }

        $this->get('fos_user.mailer')->sendResettingEmailMessage($user);
        $user->setPasswordRequestedAt(new \DateTime());
        $this->get('fos_user.user_manager')->updateUser($user);

        return new RedirectResponse($this->generateUrl('fos_user_resetting_check_email',
            array('email' => $this->getObfuscatedEmail($user))
        ));
    }

    /**
     * Tell the user to check his email provider
     */
    public function checkEmailAction(Request $request)
    {
        $email = $request->query->get('email');

        if (empty($email)) {
            // the user does not come from the sendEmail action
            return new RedirectResponse($this->generateUrl('fos_user_resetting_request'));
        }

        return $this->render('FOSUserBundle:Resetting:checkEmail.html.twig', array(
            'email' => $email,
        ));
    }

    /**
     * Reset user password
     */
    public function resetAction(Request $request, $token)
    {
        /** @var $formFactory \FOS\UserBundle\Form\Factory\FactoryInterface */
        $formFactory = $this->get('fos_user.resetting.form.factory');
        /** @var $userManager \FOS\UserBundle\Model\UserManagerInterface */
        $userManager = $this->get('fos_user.user_manager');
        /** @var $dispatcher \Symfony\Component\EventDispatcher\EventDispatcherInterface */
        $dispatcher = $this->get('event_dispatcher');

        $user = $userManager->findUserByConfirmationToken($token);

        if (null === $user) {
            throw new NotFoundHttpException(sprintf('The user with "confirmation token" does not exist for value "%s"', $token));
        }

        $event = new GetResponseUserEvent($user, $request);
        $dispatcher->dispatch(FOSUserEvents::RESETTING_RESET_INITIALIZE, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }

        $form = $formFactory->createForm();
        $form->setData($user);

        $form->handleRequest($request);

        if ($form->isValid()) {
            $event = new FormEvent($form, $request);
            $dispatcher->dispatch(FOSUserEvents::RESETTING_RESET_SUCCESS, $event);

            $userManager->updateUser($user);

            if (null === $response = $event->getResponse()) {
                ///////////////////////////////////////////////
                $url = $this->generateUrl('fos_user_profile_show');
                $response = new RedirectResponse($url);
            }

            $dispatcher->dispatch(FOSUserEvents::RESETTING_RESET_COMPLETED, new FilterUserResponseEvent($user, $request, $response));

            return $response;
        }

        return $this->render('FOSUserBundle:Resetting:reset.html.twig', array(
            'token' => $token,
            'form' => $form->createView(),
        ));
    }

    private function getTrans() {
        $tr = $this->translator;
        return [
            "firstname_blank" => $tr->trans('resetting.check_email', array(), 'validators'),
            "firstname_short" => $tr->trans('fos_user.firstname.short', array(), 'validators'),
            "firstname_long" => $tr->trans('fos_user.firstname.long', array(), 'validators'),

            "lastname_blank" => $tr->trans('fos_user.lastname.blank', array(), 'validators'),
            "lastname_short" => $tr->trans('fos_user.lastname.short', array(), 'validators'),
            "lastname_long" => $tr->trans('fos_user.lastname.long', array(), 'validators'),

            "email_blank" => $tr->trans('fos_user.email.blank', array(), 'validators'),
            "email_short" => $tr->trans('fos_user.email.short', array(), 'validators'),
            "email_long" => $tr->trans('fos_user.email.long', array(), 'validators'),
            "email_already_used" => $tr->trans('fos_user.email.already_used', array(), 'validators'),

            "password_blank" => $tr->trans('fos_user.password.blank', array(), 'validators'),
            "password_short" => $tr->trans('fos_user.password.short', array(), 'validators'),
            "password_mismatch" => $tr->trans('fos_user.password.mismatch', array(), 'validators')
        ];
    }

    /**
     * Get the truncated email displayed when requesting the resetting.
     *
     * The default implementation only keeps the part following @ in the address.
     *
     * @param \FOS\UserBundle\Model\UserInterface $user
     *
     * @return string
     */
    protected function getObfuscatedEmail(UserInterface $user)
    {
        $email = $user->getEmail();
        if (false !== $pos = strpos($email, '@')) {
            $email = '...' . substr($email, $pos);
        }

        return $email;
    }
}
