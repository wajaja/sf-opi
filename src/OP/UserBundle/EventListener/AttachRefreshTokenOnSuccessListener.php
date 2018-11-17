<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
namespace OP\UserBundle\EventListener;

use OP\UserBundle\ModelManager\RefreshTokenManagerInterface,
    OP\UserBundle\Request\RequestRefreshToken,
    Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent,
    Symfony\Component\Security\Core\User\UserInterface,
    Symfony\Component\Validator\Validator\ValidatorInterface,
    Symfony\Component\HttpFoundation\RequestStack;

/**
 * Description of AttachRefreshTokenOnSuccessListener
 *
 * @author CEDRICK
 */
class AttachRefreshTokenOnSuccessListener 
{
    protected $userRefreshTokenManager, $ttl,
              $validator, $requestStack;

    public function __construct(RefreshTokenManagerInterface $refreshTokenManager, $ttl, ValidatorInterface $validator, RequestStack $requestStack)
    {
        $this->refreshTokenManager = $refreshTokenManager;
        $this->ttl = $ttl;
        $this->validator = $validator;
        $this->requestStack = $requestStack;
    }

    public function attachRefreshToken(AuthenticationSuccessEvent $event)
    {
        $data = $event->getData();
        $user = $event->getUser();
        $request = $this->requestStack->getCurrentRequest();

        if (!$user instanceof UserInterface) {
            return;
        }

        $refreshTokenString = RequestRefreshToken::getRefreshToken($request);

        if ($refreshTokenString) {
            $data['refresh_token'] = $refreshTokenString;
        } else {
            $datetime = new \DateTime();
            $datetime->modify('+'.$this->ttl.' seconds');

            $refreshToken = $this->refreshTokenManager->create();
            $refreshToken->setUsername($user->getUsername());
            $refreshToken->setRefreshToken();
            $refreshToken->setValid($datetime);

            $valid = false;
            while (false === $valid) {
                $valid = true;
                $errors = $this->validator->validate($refreshToken);
                if ($errors->count() > 0) {
                    foreach ($errors as $error) {
                        if ('refreshToken' === $error->getPropertyPath()) {
                            $valid = false;
                            $refreshToken->setRefreshToken();
                        }
                    }
                }
            }

            $this->refreshTokenManager->save($refreshToken);
            $data['refresh_token'] = $refreshToken->getRefreshToken();
        }

        $event->setData($data);
    }
}
