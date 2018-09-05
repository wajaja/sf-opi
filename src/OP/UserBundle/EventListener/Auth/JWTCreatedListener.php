<?php
// src/AppBundle/EventListener/JWTCreatedListener.php

namespace OP\UserBundle\EventListener\Auth;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent,
	Symfony\Component\HttpFoundation\RequestStack;

/**
*  
*/
class JWTCreatedListener
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
	* @param JWTCreatedEvent $event
	*
	* @return void
	*/
	public function onJWTCreated(JWTCreatedEvent $event)
	{
		$request 	= $this->request;
		$expiration = new \DateTime('+7 day');
	    $expiration->setTime(2, 0, 0);

		$payload        = $event->getData();
		$payload['ip']  = $request->getClientIp(); 		// Add client ip to the encoded payload
	    $payload['exp'] = $expiration->getTimestamp();  // Override token expiration date

		$event->setData($payload);
	}
}