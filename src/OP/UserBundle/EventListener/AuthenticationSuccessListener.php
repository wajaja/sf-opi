<?php
// src/AppBundle/EventListener/JWTCreatedListener.php

namespace OP\UserBundle\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent,
	Symfony\Component\HttpFoundation\RequestStack;

/**
*  
*/
class AuthenticationSuccessListener
{
	
	/**
	* @var RequestStack
	*/
	private $request;

	/**
	* @param RequestStack $requestStack
	*/
	public function __construct(RequestStack $requestStack)
	{
		$this->request = $requestStack->getCurrentRequest();
	}

	/**
	 * @param AuthenticationSuccessEvent $event
	 */
	public function onAuthenticationSuccessResponse(AuthenticationSuccessEvent $event)
	{
	    $data = $event->getData();
	    $user = $event->getUser();

	    if (!$user instanceof UserInterface) {
	        return;
	    }

	    $data['data'] = array(
	        'roles' => $user->getRoles(),
	    );

	    $event->setData($data);
	}
}