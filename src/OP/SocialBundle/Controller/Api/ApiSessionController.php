<?php

namespace OP\SocialBundle\Controller\Api;

use FOS\RestBundle\Controller\Annotations,
    OP\UserBundle\Security\UserProvider,
    Nelmio\ApiDocBundle\Annotation as Doc,
    Symfony\Component\HttpFoundation\Request,
    FOS\RestBundle\Controller\FOSRestController,
    FOS\RestBundle\Routing\ClassResourceInterface,
    Symfony\Component\HttpFoundation\JsonResponse;

/**
 * @Annotations\RouteResource("session", pluralize=false)
 */
class ApiSessionController extends FOSRestController implements ClassResourceInterface
{
    
    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }

    /**
    * @Annotations\Get("/initialize")
    *
    * @return Integer
    */
    public function initAction(Request $request)
    {
        $res     = new JsonResponse();
        $session = $request->getSession();

        if(!$session->isStarted())
            $session->start();

        // $user    = $this->_getUser();
        // $session->set('friends_ids', $user->getMyFriendsIds());   //friends_ids in session
        // $session->set('blockeds_ids', $user->getBlockedsIds()); //blockeds_ids in session
        return $res->setData(
                    array(
                        'sessionId'=> $session->getId(),
                        'access_token' => $session->get('access_token'),
                        'refresh_token' => $session->get('refresh_token')
                    )
                );
    }

    
    
    public function _getUser()
    {
        return $this->user_provider->getHydratedUser();
    }
}
