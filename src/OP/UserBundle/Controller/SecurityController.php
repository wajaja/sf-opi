<?php

namespace OP\UserBundle\Controller;

use Symfony\Component\HttpFoundation\Request,
    Symfony\Component\Security\Core\Security,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Symfony\Component\Security\Core\SecurityContextInterface,
    Symfony\Component\Security\Core\Exception\AuthenticationException;


class SecurityController extends Controller
{
    public function loginAction(Request $request)
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

        $csrfToken = $this->has('security.csrf.token_manager')
            ? $this->get('security.csrf.token_manager')->getToken('authenticate')->getValue()
            : null;

        $description = 'Login Opinion';

        return $this->renderLogin(
                        array(
                            'last_username' => $lastUsername,
                            'error'         => $error,
                            'csrf_token'    => $csrfToken,
                            'description'   => $description,
                            'title'         => 'Login',
                            'token' => $session->getId()
                        )
                    );
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
        return $this->render('OPUserBundle:Security:login.html.twig', $data);
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
