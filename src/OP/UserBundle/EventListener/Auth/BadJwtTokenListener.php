<?php

namespace OP\UserBundle\EventListener\Auth;

use Symfony\Component\HttpFoundation\JsonResponse,
    Lexik\Bundle\JWTAuthenticationBundle\Event\JWTInvalidEvent,
    Lexik\Bundle\JWTAuthenticationBundle\Event\JWTNotFoundEvent,
    Lexik\Bundle\JWTAuthenticationBundle\Event\JWTExpiredEvent,
    Lexik\Bundle\JWTAuthenticationBundle\Response\JWTAuthenticationFailureResponse;

/**
* 
*/
class BadJwtTokenListener
{
	
	/**
	 * @param JWTInvalidEvent $event
	 */
	public function onJWTInvalid(JWTInvalidEvent $event)
	{
	    $response = new JWTAuthenticationFailureResponse('Your token is invalid, please login again to get a new one', 403);

	    $event->setResponse($response);
	}

	/**
	 * @param JWTNotFoundEvent $event
	 */
	public function onJWTNotFound(JWTNotFoundEvent $event)
	{
	    $data = [
	        'status'  => '403 Forbidden',
	        'message' => 'Missing token',
	    ];

	    $response = new JsonResponse($data, 403);

	    $event->setResponse($response);
	}

	/**
	 * @param JWTExpiredEvent $event
	 */
	public function onJWTExpired(JWTExpiredEvent $event)
	{
	    /** @var JWTAuthenticationFailureResponse */
	    $response = $event->getResponse();

	    $response->setMessage('Your token is expired, please renew it.');
	}
}