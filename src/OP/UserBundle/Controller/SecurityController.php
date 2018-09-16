<?php

namespace OP\UserBundle\Controller;

use Symfony\Component\HttpFoundation\Request,
    Symfony\Component\Security\Core\Security,
    Symfony\Component\Security\Csrf\CsrfTokenManagerInterface,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Symfony\Component\Translation\TranslatorInterface,
    Symfony\Component\Security\Core\SecurityContextInterface,
    Symfony\Component\Security\Core\Exception\AuthenticationException;


class SecurityController extends Controller
{

     protected $translator, $tokenMan;

    public function __construct(TranslatorInterface $trans, CsrfTokenManagerInterface $tokenMan) {
        $this->tokenMan  = $tokenMan;
        $this->translator = $trans;
    }


    public function loginAction(Request $request)
    {

        $session    = $request->getSession();
        $description = 'Login Opinion';
        $loginKeys   = $this->getLoginKeys($request);
        return  $this->render('OPUserBundle:Security:login.html.twig', [
                               'initialState'  => [
                                    'App'         => [
                                        'sessionId' => $session->getId()
                                    ],
                                    'Login'  => [
                                        'trans'     => $loginKeys['trans'],
                                        'action'    => 'api/login_check',
                                        'flashBag'   => $loginKeys['flashBag'],
                                        'csrf_token' => $loginKeys['csrf_token'],
                                        'server_error'  => $loginKeys['error'],
                                        'last_username' => $loginKeys['last_username']
                                    ]
                                ],
                                'title'       => 'Login',
                                'description' => $description, 
                                'locale'      => $request->getLocale()
                            ]
                        );
    }

    /**
     * @param Request $request
     *
     * @return Response
     */
    public function getLoginKeys(Request $request)
    {
        /** @var $session Session */
        $session = $request->getSession();

        $authErrorKey = Security::AUTHENTICATION_ERROR;
        $lastUsernameKey = Security::LAST_USERNAME;

        // get the error if any (works with forward and redirect -- see below)
        if ($request->attributes->has($authErrorKey)) {
            $error = $request->attributes->get($authErrorKey);
        } elseif (null !== $session && $session->has($authErrorKey)) {
            $error = $session->get($authErrorKey);
            $session->remove($authErrorKey);
        } else {
            $error = null;
        }

        if (!$error instanceof AuthenticationException) {
            $error = null; // The value does not come from the security component.
        }

        // last username entered by the user
        $lastUsername = (null === $session) ? '' : $session->get($lastUsernameKey);

        $csrfToken = $this->tokenMan->getToken('authenticate')->getValue();

        return  [
            'error' => $error,
            'trans' => $this->getTrans(),
            'flashBag' => $this->getFlashBag($request),
            'csrf_token' => $csrfToken,
            'last_username' => $lastUsername,
            "hasPreviousSession" => $request->hasPreviousSession()
        ];
    }

    private function getTrans() {
        $tr = $this->translator;
        return [
            "username" => $tr->trans('security.login.username', array(), 'FOSUserBundle'),
            "password" => $tr->trans('security.login.password', array(), 'FOSUserBundle'),
            "submit" => $tr->trans('security.login.submit', array(), 'FOSUserBundle'),
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
     * Renders the login template with the given parameters. Overwrite this function in
     * an extended controller to provide additional data for the login template.
     *
     * @param array $data
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    protected function renderLogin(array $data)
    {
        return $this->render('OPUserBundle:Security:login_content.html.twig', $data);
    }

    public function checkAction()
    {
        return $this->forward('OPMessageBundle:Message:index');
        throw new \RuntimeException('You must configure the check path to be handled by the firewall using form_login in your security firewall configuration.');
    }

    public function logoutAction()
    {
        throw new \RuntimeException('You must activate the logout in your security firewall configuration.');
    }
}
