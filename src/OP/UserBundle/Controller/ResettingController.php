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
    private $retryTtl;

    public function __construct(TranslatorInterface $trans, UserProvider $uProvider, $retryTtl) {
        $this->translator  = $trans;
        $this->user_provider = $uProvider;
        $this->retryTtl     = $retryTtl;
    }


    /**
     * Request reset user password: show form
     */
    public function requestAction(Request $request)
    {
        $invalid = $request->query->get('email');
        return  $this->renderRequest($request, $invalid);
    }


    public function renderRequest($request, $invalid_email) {
        $session = $request->getSession();
        $description = 'reset your password';
        return $this->render(
            'OPUserBundle:Resetting:index.html.twig', 
            [
                'initialState'  => [
                    'App'         => [
                        'sessionId' => $session->getId()
                    ],
                    'Resetting' => [
                        'invalid_username' => $invalid_email,
                        'action' => 'api/resetting/send-email',
                        'trans' => [
                            'username' => $this->translator->trans('resetting.request.username', array(), 'OPUserBundle'),
                            'submit' => $this->translator->trans('resetting.request.submit', array(), 'OPUserBundle'),
                            //implode --> to string
                            'invalid_username' => implode("|", $session->getFlashBag()->get('resetting'))
                        ]
                    ],
                ],
                'title'       => 'Reset your password',
                'description' => $description, 
                'locale'      => $request->getLocale()
            ]
        );
    }

    /**
     * Tell the user to check his email provider
     */
    public function checkEmailAction(Request $request)
    {
        $email = $request->query->get('email');

        if (empty($email)) {
            // the user does not come from the sendEmail action
            return new RedirectResponse($this->generateUrl('op_user_resetting_request'));
        }

        return $this->render(
            'OPUserBundle:Resetting:checkEmail.html.twig', 
            [
                'initialState'  => [
                    'App'         => [
                        'sessionId' => $request->getSession()->getId()
                    ],
                    'Resetting' => [
                        'email' => $email,
                        'trans' => [
                            'check_email' => $this->translator->trans(
                                'resetting.check_email', 
                                array(
                                    //'email' => $email, 
                                    '%tokenLifetime%' => ceil($this->retryTtl / 3600)), 
                                'OPUserBundle'
                            )
                        ]
                    ],
                ],
                'title'       => 'Reset your password | check email',
                'description' => "Reset password | check email", 
                'locale'      => $request->getLocale()
            ]
        );
    }

    /**
     * Reset user password
     */
    public function resetAction(Request $request, $token)
    {
        $session = $request->getSession();
        $description = 'reset your password';
        return $this->render(
            'OPUserBundle:Resetting:reset.html.twig', 
            [
                'initialState'  => [
                    'App'         => [
                        'sessionId' => $session->getId()
                    ],
                    'Resetting' => [
                        'token' => $token,
                        'action' => 'api/resetting/send-email',
                        'trans' => [
                            'submit' => $this->translator->trans('resetting.reset.submit', array(), 'OPUserBundle'),
                            'new_password' => 'password',
                            'new_password_confirmation' => 'confirm'
                        ]
                    ],
                ],
                'title'       => 'Reset your password',
                'description' => $description, 
                'locale'      => $request->getLocale()
            ]
        );
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
