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
    OP\MediaBundle\Document\Image,
    OP\UserBundle\Form\AddressType,
    FOS\UserBundle\Event\FormEvent,
    OP\UserBundle\Document\Address,
    FOS\UserBundle\Model\UserInterface,
    OP\MediaBundle\Form\PictureType,
    OP\UserBundle\Security\UserProvider,
    FOS\UserBundle\Form\Factory\FormFactory,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Component\HttpFoundation\StreamedResponse,
    FOS\UserBundle\Model\UserManagerInterface,
    FOS\UserBundle\Event\GetResponseUserEvent,
    FOS\UserBundle\Event\FilterUserResponseEvent,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Symfony\Component\HttpFoundation\RedirectResponse,
    Symfony\Component\Translation\TranslatorInterface,
    Symfony\Component\EventDispatcher\EventDispatcherInterface,
    Symfony\Component\HttpKernel\Exception\NotFoundHttpException,
    Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * Controller managing the registration
 *
 * @author Thibault Duplessis <thibault.duplessis@gmail.com>
 * @author Christophe Coevoet <stof@notk.org>
 */
class RegistrationController extends Controller
{

    protected $translator, $user_provider, $formFactory;

    public function __construct(TranslatorInterface $trans, UserProvider $uProvider, FormFactory $formFactory) {
        $this->translator  = $trans;
        $this->user_provider = $uProvider;
        $this->formFactory  = $formFactory;
    }

    
    public function registerAction(Request $request, EventDispatcherInterface $dispatcher, UserManagerInterface $userManager)
    {

        // $user = $this->userManager->createUser();
        // $user->setEnabled(true);

        // $event = new GetResponseUserEvent($user, $request);
        // $this->eventDispatcher->dispatch(FOSUserEvents::REGISTRATION_INITIALIZE, $event);

        // if (null !== $event->getResponse()) {
        //     return $event->getResponse();
        // }

        $form = $this->formFactory->createForm();
        // $form->setData($user);

        $form->handleRequest($request);

        if ($form->isSubmitted()) {
            if ($form->isValid()) {
                $event = new FormEvent($form, $request);
                $this->eventDispatcher->dispatch(FOSUserEvents::REGISTRATION_SUCCESS, $event);

                $this->userManager->updateUser($user);

                if (null === $response = $event->getResponse()) {
                    $url = $this->generateUrl('fos_user_registration_confirmed');
                    $response = new RedirectResponse($url);
                }

                $this->eventDispatcher->dispatch(FOSUserEvents::REGISTRATION_COMPLETED, new FilterUserResponseEvent($user, $request, $response));

                return $response;
            }

            $event = new FormEvent($form, $request);
            $this->eventDispatcher->dispatch(FOSUserEvents::REGISTRATION_FAILURE, $event);

            if (null !== $response = $event->getResponse()) {
                return $response;
            }
        }

        return $this->render('@OPUser/Registration/register_content.html.twig', array(
            'form' => $form->createView(),
        ));

        // $session = $request->getSession();
        // $registerForm = $this->getRegisterForm($request);
        // $description = 'Sign Up';
        // return  $this->render('OPUserBundle:Registration:register.html.twig', [
        //                         'initialState'  => [
        //                             'App'         => [
        //                                 'sessionId' => $session->getId()
        //                             ],
        //                             'Signup' => [
        //                                 'trans'  => $registerForm['trans'],
        //                                 // 'form'   => $registerForm['form']->createView(),
        //                                 'flashBag'=> $registerForm['flashBag'],
        //                                 'action' => 'api/signup'
        //                             ],
        //                         ],
        //                         'title'     => 'Sign Up',
        //                         'description' => $description, 
        //                         'locale'      => $request->getLocale()
        //                     ]
        //                 );
    }

    public function getRegisterForm(Request $request) {
        return [
            'trans' => $this->getTrans(),
            'flashBag' => $this->getFlashBag($request),
            'form'  => $this->formFactory->createForm()
        ];
    }

    private function getTrans() {
        $tr = $this->translator;
        return [
            "firstname_blank" => $tr->trans('fos_user.firstname.blank', array(), 'validators'),
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

    protected function getFlashBag(Request $request) {
        $bag = $request->getSession()->getFlashBag();
        return [
            "firstname" => $bag->get('registration.firstname'),
            "lastname" => $bag->get('registration.lastname'),
            "email" => $bag->get('registration.emailk'),
            "plainPassword_first" => $bag->get('registration.plainPassword.first'),
            "password_short" => $bag->get('registration.gender')
        ];
    }

    /**
     * Tell the user to check his email provider
     */
    public function checkEmailAction()
    {
        $email = $this->get('session')->get('fos_user_send_confirmation_email/email');
        $this->get('session')->remove('fos_user_send_confirmation_email/email');
        $user = $this->get('fos_user.user_manager')->findUserByEmail($email);

        if (null === $user) {
            throw new NotFoundHttpException(sprintf('The user with email "%s" does not exist', $email));
        }

        return $this->render('FOSUserBundle:Registration:checkEmail.html.twig', array(
            'user' => $user,
        ));
    }

    /**
     * Receive the confirmation token from user email provider, login the user
     */
    public function confirmAction(Request $request, $token)
    {
        /** @var $userManager \FOS\UserBundle\Model\UserManagerInterface */
        $userManager = $this->get('fos_user.user_manager');

        $user = $userManager->findUserByConfirmationToken($token);

        if (null === $user) {
            throw new NotFoundHttpException(sprintf('The user with confirmation token "%s" does not exist', $token));
        }

        /** @var $dispatcher \Symfony\Component\EventDispatcher\EventDispatcherInterface */
        $dispatcher = $this->get('event_dispatcher');

        $user->setConfirmationToken(null);
        $user->setEnabled(true);

        $event = new GetResponseUserEvent($user, $request);
        $dispatcher->dispatch(FOSUserEvents::REGISTRATION_CONFIRM, $event);

        $userManager->updateUser($user);

        if (null === $response = $event->getResponse()) {
            $url = $this->generateUrl('fos_user_registration_confirmed');
            $response = new RedirectResponse($url);
        }

        $dispatcher->dispatch(FOSUserEvents::REGISTRATION_CONFIRMED, new FilterUserResponseEvent($user, $request, $response));

        return $response;
    }

    /**
     *
     * Tell the user his account is now confirmed
     */
    public function confirmedIndexAction(Request $request)
    {
        $path = $request->getScheme() . '://' . 
                $request->getHttpHost() . 
                $request->getBaseUrl();
        return $this->redirect($path.'/confirmed/profilepic', 308);
    }

    /**
     *
     * Tell the user his account is now confirmed
     */
    public function confirmedAction(Request $request)
    {
        $user       = $this->_getUser();
        $session    = $request->getSession();
        $referer    = $request->headers->get('referer');
        $panel      = str_replace('/confirmed/', '', $request->getPathInfo());
        $suggestions = ($panel === 'relations') ? $this->getSuggestionForUser($user, []) 
                                                : [];
        $firstname      = $user->getFirstname();
        $description    = "welcome to opinion {$firstname}";
        $title          = "welcome to opinion {$firstname}";
        $serializer     = $this->get('jms_serializer');

        return $this->render('OPUserBundle:Registration:confirmed.html.twig', [
            // We pass an array as props
            'initialState'  => [
                'User'          => [
                    'user'  => $serializer->toArray($user),
                ],
                // 'Token'         => $session->get('access_token'),
                'RelationShip'  => [
                    'suggestions' => $suggestions
                ],
                'Notification'  => [],
                'Invitation'    => [],
                'Message'       => []
            ],
            'title'         => $title,
            'description'   => $description, 
            'locale'        => $request->getLocale(),
        ]);
    }

    protected function getSuggestionForUser($user, $initIds) {
        return $this->container->get('op_user.invitation_manager')
                               ->getSuggestionForUser($user, $initIds);
    }

    public function _getUser()
    {
        return $this->user_provider->getHydratedUser();
    }
}