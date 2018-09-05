<?php

namespace OP\SocialBundle\Controller;

use Symfony\Component\HttpFoundation\Request,
    Symfony\Component\Security\Core\Security,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Method,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Template,
    Symfony\Component\Security\Core\Exception\AuthenticationException,
    Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
/**
 * Description of SessionController
 * 
 * @Route("/session")
 */
class SessionController extends Controller
{
    
    /**
     * 
     * @Route("/info", name="session_info")
     * @Method("GET")
     * @Template()
     *
     *  return session
     * @return array
     */
    public function infoAction(Request $request)
    {
        $session = $request->getSession();
        $response = new JsonResponse();
        return $response->setData(array('sessionId'=>$session->getId()));
    }
    //put your code here
}
