<?php

namespace OP\UserBundle\Controller\Api;

use FOS\RestBundle\Controller\Annotations,
    OP\SocialBundle\Firebase\Firebase,
    FOS\RestBundle\Controller\Annotations\Get,
    FOS\RestBundle\Controller\Annotations\Post,
    OP\UserBundle\Security\UserProvider,
    FOS\RestBundle\Controller\FOSRestController,
    FOS\RestBundle\Routing\ClassResourceInterface,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Component\HttpFoundation\RedirectResponse,
    FOS\RestBundle\Controller\Annotations\RouteResource,
    Symfony\Component\HttpFoundation\Request,
    Firebase\Auth\Token\Exception\InvalidToken;


/**
 * @RouteResource("user", pluralize=false)
 */
class ApiSecurityController extends FOSRestController implements ClassResourceInterface
{

    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }

    /**
    * @Get("/login")
    *
    */
    public function getAction()
    {
            return 'eeeee';
    }


    /**
    * @Post("/login_check")
    *
    */
    public function checkAction()
    {
    	return 'eeeee';
        // route handled by Lexik JWT Authentication Bundle
        throw new \DomainException('You should never see this');
    }

    /**
	* @Post("/logout")
	*
	*/
    public function logoutAction(Request $request) {

    	$session = $request->getSession();
        $isMobile = $session->get('isMobile');
    	// $session->invalidate();
        // echo $request->headers->get('content_type');
        // die();

    	if('html' === $request->headers->get('content_type')) {
            $url =  $this->generateUrl($isMobile ? 'mobile_homepage' : 'homepage');
            $response = new RedirectResponse($url);
        } else {

    		$response = new JsonResponse(['status'=> 'success']);
    		// $event    = new AuthenticationSuccessEvent(['token' => $jwt], $user, $response);
            // $this->dispatcher->dispatch(Events::AUTHENTICATION_SUCCESS, $event);
            
    	}

    	return $response;
    }


    /**
    * @Post("/firebase/auth")
    *
    */
    public function firebaseAuthAction(Request $request, Firebase $firebase) {

        $auth     = $firebase->getAuth();
        $session  = $request->getSession();
        $fireUser  = null;

        if('application/json' === $request->headers->get('content_type')) {
            $idToken = $request->request->all()['token'];
            $response = new JsonResponse();
            $response->setData(array(true));
        } else {
            $url = '/';
            $idToken = $request->request->all()['token']; //TODO
            $response = new RedirectResponse($url);            
        }

        try {
            $verifiedIdToken = $firebase->getAuth()->verifyIdToken($idToken);
        } catch (InvalidToken $e) {
            // echo $e->getMessage();
        }

        $uid = $verifiedIdToken->getClaim('sub');
        $fireUser = $auth->getUser($uid);

        $fireUser ? $session->set('fireUser', $fireUser) : $session->set('fireUser', $fireUser);

        return $response;
    }
}