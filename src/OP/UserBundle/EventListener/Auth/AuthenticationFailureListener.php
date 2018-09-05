<?php

namespace OP\UserBundle\EventListener\Auth;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationFailureEvent,
    Lexik\Bundle\JWTAuthenticationBundle\Response\JWTAuthenticationFailureResponse;

/**
* 
*/
class AuthenticationFailureListener
{
	
	/**
	 * @param AuthenticationFailureEvent $event
	 */
	public function onAuthenticationFailureResponse(AuthenticationFailureEvent $event)
	{
	    $data = [
	        'status'  => '401 Unauthorized',
	        'message' => 'Bad credentials, please verify that your username/password are correctly set',
	    ];

	    // $data = $event->getException()->getMessageKey();

	    $response = new JWTAuthenticationFailureResponse($data);

	    $event->setResponse($response);
	}
}