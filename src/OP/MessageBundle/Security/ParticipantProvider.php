<?php

namespace OP\MessageBundle\Security;

use OP\UserBundle\Repository\OpinionUserManager,
    OP\MessageBundle\Model\ParticipantInterface,
    Symfony\Component\Security\Core\Exception\AccessDeniedException,
    Lexik\Bundle\JWTAuthenticationBundle\Encoder\DefaultEncoder,
    Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * Provides the authenticated participant
 */
class ParticipantProvider implements ParticipantProviderInterface
{
    /**
     * The security context
     *
     * @var authorizerChekerInterface
     */
    protected $tokenStorage, $userManager, $encoder;

    public function __construct(TokenStorageInterface $tokenStorage, DefaultEncoder  $encoder, OpinionUserManager $userManager)
    {
        $this->tokenStorage = $tokenStorage;
        $this->encoder      = $encoder;
        $this->userManager  = $userManager;
    }

    /**
     * Gets the current authenticated user
     * @see::OPMEssageBundle participantprovider
     * @return ParticipantInterface
     */
    public function getAuthenticatedUser()
    {
        $credentials = $this->container->get('security.token_storage')->getToken()->getCredentials();
        $data = $this->container->get('lexik_jwt_authentication.encoder.default')->decode($credentials);
        $username = $data['username'];

        return $this->container->get('fos_user.user_manager')->findUserByUsername($username);
    }

    /**
     * Gets the current authenticated user
     *
     * @return ParticipantInterface
     */
    public function getAuthenticatedParticipant()
    {
        $credentials = $this->tokenStorage->getToken()->getCredentials();
        $data = $this->encoder->decode($credentials);
        $username = $data['username'];

        $participant = $this->userManager->findUserByUsername($username);

        if (!$participant instanceof ParticipantInterface) {
            throw new AccessDeniedException('Must be logged in with a ParticipantInterface instance');
        }

        return $participant;
    }
}
