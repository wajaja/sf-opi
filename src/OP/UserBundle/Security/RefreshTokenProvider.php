<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
namespace OP\UserBundle\Security;

use Symfony\Component\Security\Core\User\UserProviderInterface,
    Symfony\Component\Security\Core\User\User,
    Symfony\Component\Security\Core\User\UserInterface,
    Symfony\Component\Security\Core\Exception\UnsupportedUserException,
    OP\UserBundle\ModelManager\RefreshTokenManagerInterface,
    OP\UserBundle\Model\RefreshTokenInterface;

/**
 * Description of RefreshTokenProvider
 * 
 * @author CEDRICK
 */
class RefreshTokenProvider implements UserProviderInterface
{
    protected $refreshTokenManager, $customUserProvider;

    public function __construct(RefreshTokenManagerInterface $refreshTokenManager)
    {
        $this->refreshTokenManager = $refreshTokenManager;
    }

    public function setCustomUserProvider(UserProviderInterface $customUserProvider)
    {
        $this->customUserProvider = $customUserProvider;
    }

    public function getUsernameForRefreshToken($token)
    {
        $refreshToken = $this->refreshTokenManager->get($token);

        if ($refreshToken instanceof RefreshTokenInterface) {
            return $refreshToken->getUsername();
        }

        return;
    }

    public function loadUserByUsername($username)
    {
        if ($this->customUserProvider != null) {
            return $this->customUserProvider->loadUserByUsername($username);
        } else {
            return new User(
                $username,
                null,
                array('ROLE_USER')
            );
        }
    }

    public function refreshUser(UserInterface $user)
    {
        if ($this->customUserProvider != null) {
            return $this->customUserProvider->refreshUser($user);
        } else {
            throw new UnsupportedUserException();
        }
    }

    public function supportsClass($class)
    {
        if ($this->customUserProvider != null) {
            return $this->customUserProvider->supportsClass($class);
        } else {
            return 'Symfony\Component\Security\Core\User\User' === $class;
        }
    }
}
