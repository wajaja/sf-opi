<?php

namespace OP\SocialBundle\Http;

use OP\UserBundle\Document\Devices,
    OP\UserBundle\Security\DeviceDetector,
    Symfony\Component\HttpFoundation\RedirectResponse,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Component\EventDispatcher\EventDispatcherInterface,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\RequestStack,
    Symfony\Component\Routing\Generator\UrlGeneratorInterface,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;

/**
 * AuthenticationSuccessHandler.
 *
 * @author Dev Lexik <dev@lexik.fr>
 */
class RenderHandler implements AuthenticationSuccessHandlerInterface
{
    /**
     * @var JWTManager
     */
    protected $dispatcher, $router,
              $request, $deviceDetector, $container;

    /**
     * @param JWTManager               $jwtManager
     * @param EventDispatcherInterface $dispatcher
     */
    public function __construct(RequestStack $requestStack, EventDispatcherInterface $dispatcher, Container $container, DeviceDetector $device, UrlGeneratorInterface $router)
    {
        $this->dispatcher = $dispatcher;
        $this->request    = $requestStack->getCurrentRequest();
        $this->container  = $container;
        $this->deviceDetector = $device;
        $this->router     = $router;
    }

    public function send($data = [], $route_name = '', $route_params = [])
    {
        $request    = $this->request;
        $session    = $request->getSession();
        $referer    = $request->headers->get('referer');

        if('application/x-www-form-urlencoded' === $request->headers->get('Content-Type')) {
            $this->router->generate('blog', array(
                                        'page' => 2,
                                        'category' => 'Symfony',
                                    ));
                                    // /blog/2?category=Symfony

            $url      = $this->router->generate($route_name, $route_params);
            $response  = new RedirectResponse($redirectTo);
        } 
        else if('html' === $request->getRequestFormat()) {
            $this->router->generate('blog', array(
                                        'page' => 2,
                                        'category' => 'Symfony',
                                    ));
                                    // /blog/2?category=Symfony
            $url      = $this->router->generate($route_name, $route_params);
            $response  = new RedirectResponse($redirectTo);    //we will redirect user to referer
            
        } 
        else {
            $response = new JsonResponse(); //extend JsonResponse
        }

        ////manual user's login
        // $token = new UsernamePasswordToken($user, null, "main", $user->getRoles());
        // $this->container->get("security.token_storage")->setToken($token);
        return $response;
    }
}
