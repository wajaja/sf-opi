<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
namespace OP\UserBundle\Security;

use OP\UserBundle\Request\RequestRefreshToken,
    Symfony\Component\Security\Core\Authentication\Token\TokenInterface,
    Symfony\Component\Security\Core\Exception\AuthenticationException,
    Symfony\Component\Security\Core\Authentication\Token\PreAuthenticatedToken,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\Security\Core\User\UserProviderInterface,
    Symfony\Component\Security\Http\Authentication\AuthenticationFailureHandlerInterface,
    Symfony\Component\HttpFoundation\Response;

if (interface_exists('Symfony\Component\Security\Http\Authentication\SimplePreAuthenticatorInterface')) {
    abstract class RefreshTokenAuthenticatorBase implements \Symfony\Component\Security\Http\Authentication\SimplePreAuthenticatorInterface
    {
    }
} else {
    abstract class RefreshTokenAuthenticatorBase implements \Symfony\Component\Security\Core\Authentication\SimplePreAuthenticatorInterface
    {
    }
}
/**
 * Description of RefreshTokenAuthenticator
 *
 * @author CEDRICK
 */
class RefreshTokenAuthenticator extends RefreshTokenAuthenticatorBase implements AuthenticationFailureHandlerInterface
{
    public function createToken(Request $request, $providerKey)
    {
        $refreshTokenString = RequestRefreshToken::getRefreshToken($request);

        return new PreAuthenticatedToken(
            '',
            $refreshTokenString,
            $providerKey
        );
    }

    public function authenticateToken(TokenInterface $token, UserProviderInterface $userProvider, $providerKey)
    {
        if (!$userProvider instanceof RefreshTokenProvider) {
            throw new \InvalidArgumentException(
                sprintf(
                    'The user provider must be an instance of RefreshTokenProvider (%s was given).',
                    get_class($userProvider)
                )
            );
        }

        $refreshToken = $token->getCredentials();
        $username = $userProvider->getUsernameForRefreshToken($refreshToken);

        if (!$username) {
            throw new AuthenticationException(
                sprintf('Refresh token "%s" does not exist.', $refreshToken)
            );
        }

        $user = $userProvider->loadUserByUsername($username);

        return new PreAuthenticatedToken(
            $user,
            $refreshToken,
            $providerKey,
            $user->getRoles()
        );
    }

    public function supportsToken(TokenInterface $token, $providerKey)
    {
        return $token instanceof PreAuthenticatedToken && $token->getProviderKey() === $providerKey;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        return new Response('Refresh token authentication failed.', 403);
    }
}
