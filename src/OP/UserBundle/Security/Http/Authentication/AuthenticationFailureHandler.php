<?php

namespace OP\UserBundle\Security\Http\Authentication;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationFailureEvent,
    Lexik\Bundle\JWTAuthenticationBundle\Events,
    Lexik\Bundle\JWTAuthenticationBundle\Response\JWTAuthenticationFailureResponse,
    Symfony\Component\EventDispatcher\EventDispatcherInterface,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\RedirectResponse,
    Symfony\Component\Routing\Router,
    Symfony\Component\Security\Core\Exception\AuthenticationException,
    Symfony\Component\Security\Http\Authentication\AuthenticationFailureHandlerInterface;


/**
 * AuthenticationFailureHandler.
 *
 * @author Dev Lexik <dev@lexik.fr>
 */
class AuthenticationFailureHandler implements AuthenticationFailureHandlerInterface
{
    /**
     * @var EventDispatcherInterface
     */
    protected $dispatcher;

    /**
    *
    */
    protected $router;

    /**
     * @param EventDispatcherInterface $dispatcher
     */
    public function __construct(EventDispatcherInterface $dispatcher, Router $router)
    {
        $this->dispatcher   = $dispatcher;
        $this->router       = $router;
    }

    /**
     * {@inheritdoc}
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $e)
    {
        //$session = $request->getSession();

        if($request->headers->get('Content-Type') !== 'application/json') {
            $route      = $this->router->generate('fos_user_security_login');
            $response   = new RedirectResponse($route);    //we will redirect user to referer
            $event      = new AuthenticationFailureEvent($e, new JWTAuthenticationFailureResponse());
            $this->dispatcher->dispatch(Events::AUTHENTICATION_FAILURE, $event);
        } else {
            $event      = new AuthenticationFailureEvent($e, new JWTAuthenticationFailureResponse());
            $this->dispatcher->dispatch(Events::AUTHENTICATION_FAILURE, $event);
            $response = $event->getResponse();
        }

        return $response;     
    }
}
