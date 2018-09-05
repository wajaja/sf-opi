<?php 

namespace OP\UserBundle\Security\Http\Authentication


use Symfony\Component\HttpFoundation\Request,
	Symfony\Component\Routing\Router,
	Symfony\Component\HttpFoundation\RedirectResponse,
	Symfony\Component\DependencyInjection\ContainerInterface as Container;

/**
* 
*/
class LogoutSuccessHandler
{

	protected $router, $container;
	
	public function __construct($Router $router, Container $container) {
		$this->router = $router;
	}

	public function onLogoutSuccess(Request $request) {
		$referer_url = $request->headers->get('referer');
		$response = new RedirectResponse($referer_url);

		return $response;
	}
}