<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
namespace OP\UserBundle\Service;

use Symfony\Component\HttpFoundation\Request,
    Symfony\Component\Security\Core\Exception\AuthenticationException,
    OP\UserBundle\ModelManager\RefreshTokenManagerInterface,
    OP\UserBundle\Security\RefreshTokenAuthenticator,
    OP\UserBundle\Security\RefreshTokenProvider,
    OP\UserBundle\Security\Http\Authentication\AuthenticationSuccessHandler,
    OP\UserBundle\Security\Http\Authentication\AuthenticationFailureHandler;

/**
 * Description of RefreshToken
 *
 * @author CEDRICK
 */
class RefreshToken {
    
    private $authenticator, $provider, $successHandler,
            $failureHandler, $refreshTokenManager, $ttl,
            $ttlUpdate;

    public function __construct(RefreshTokenAuthenticator $authenticator, RefreshTokenProvider $provider, AuthenticationSuccessHandler $successHandler, AuthenticationFailureHandler $failureHandler, RefreshTokenManagerInterface $refreshTokenManager, $ttl, $providerKey, $ttlUpdate)
    {
        $this->authenticator = $authenticator;
        $this->provider = $provider;
        $this->successHandler = $successHandler;
        $this->failureHandler = $failureHandler;
        $this->refreshTokenManager = $refreshTokenManager;
        $this->ttl = $ttl;
        $this->providerKey = $providerKey;
        $this->ttlUpdate = $ttlUpdate;
    }

    /**
     * Refresh token.
     *
     * @param Request $request
     *
     * @return mixed
     *
     * @throws AuthenticationException
     */
    public function refresh(Request $request)
    {
        try {
            $preAuthenticatedToken = $this->authenticator->authenticateToken(
                    $this->authenticator->createToken($request, $this->providerKey), $this->provider, $this->providerKey
            );
        } catch (AuthenticationException $e) {
            return $this->failureHandler->onAuthenticationFailure($request, $e);
        }

        $refreshToken = $this->refreshTokenManager->get($preAuthenticatedToken->getCredentials());

        if (null === $refreshToken || !$refreshToken->isValid()) {
            return $this->failureHandler->onAuthenticationFailure($request, new AuthenticationException(
                            sprintf('Refresh token "%s" is invalid.', $refreshToken)
                            )
            );
        }

        if ($this->ttlUpdate) {
            $expirationDate = new \DateTime();
            $expirationDate->modify(sprintf('+%d seconds', $this->ttl));
            $refreshToken->setValid($expirationDate);

            $this->refreshTokenManager->save($refreshToken);
        }

        return $this->successHandler->onAuthenticationSuccess($request, $preAuthenticatedToken);
    }
}
