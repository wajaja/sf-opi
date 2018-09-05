<?php

namespace OP\UserBundle\Security;

use Gos\Bundle\WebSocketBundle\Client\ClientStorageInterface,
    Gos\Bundle\WebSocketBundle\Client\Exception\StorageException,
    Psr\Log\LoggerInterface,
    Ratchet\ConnectionInterface,
    Symfony\Component\HttpKernel\Log\NullLogger,
    Symfony\Component\Security\Core\Authentication\Token\AnonymousToken,
    Symfony\Component\Security\Core\Authentication\Token\TokenInterface,
    Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface,
    Symfony\Component\Security\Core\User\UserInterface,
    Gos\Bundle\WebSocketBundle\Client\Auth\WebsocketAuthenticationProvider as BaseAuth,
    Gos\Bundle\WebSocketBundle\Client\Auth\WebsocketAuthenticationProviderInterface,
    OP\UserBundle\Repository\OpinionUserManager,
    Symfony\Component\HttpFoundation\RequestStack,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;

class WebsocketAuthenticationProvider extends BaseAuth
{
    /**
     * @var SecurityContextInterface|TokenStorageInterface
     */
    protected $tokenStorage, $firewalls, $logger, $user_provider,
              $request, $um, $container, $clientStorage;

    /**
     * @param SecurityContextInterface|TokenStorageInterface $tokenStorage
     * @param array                    $firewalls
     * @param ClientStorageInterface   $clientStorage
     * @param LoggerInterface          $logger
     */
    public function __construct(
        TokenStorageInterface $tokenStorage,
        $firewalls = array(),
        ClientStorageInterface $clientStorage,
        Container $container,
        LoggerInterface $logger = null
        ) {

        $this->tokenStorage = $tokenStorage;
        $this->firewalls = $firewalls;
        $this->clientStorage = $clientStorage;
        $this->logger = null === $logger ? new NullLogger() : $logger;
        $this->container = $container;
    }

    /**
     * @param ConnectionInterface $connection
     *
     * @return TokenInterface
     */
    protected function getToken(ConnectionInterface $connection)
    {
        $token = null;

        if (isset($connection->Session) && $connection->Session) {
            foreach ($this->firewalls as $firewall) {
                if (false !== $serializedToken = $connection->Session->get('_security_' . $firewall, false)) {
                    /** @var TokenInterface $token */
                    $token = unserialize($serializedToken);
                    break;
                }
            }
        }

        if (null === $token) {
            $token = new AnonymousToken($this->firewalls[0], 'anon-' . $connection->WAMP->sessionId);
        }

        if ($this->tokenStorage->getToken() !== $token) {
            $this->tokenStorage->setToken($token);
        }

        return $token;
    }

    /**
     * @param ConnectionInterface $conn
     *
     * @return TokenInterface
     *
     * @throws StorageException
     * @throws \Exception
     */
    public function authenticate(ConnectionInterface $conn)
    {
        if (1 === count($this->firewalls) && 'ws_firewall' === $this->firewalls[0]) {
            $this->logger->warning(sprintf(
                    'User firewall is not configured, we have set %s by default',
                    $this->firewalls[0])
            );
        }

        $loggerContext = array(
            'connection_id' => $conn->resourceId,
            'session_id' => $conn->WAMP->sessionId,
        );

        $token = $this->getToken($conn);
        $user = $token->getUser();
        $username = $user instanceof UserInterface ? $user->getUsername() : $user;

        try {
            $identifier = $this->clientStorage->getStorageId($conn, $username);
        } catch (StorageException $e) {
            $this->logger->error(
                $e->getMessage(),
                $loggerContext
            );

            throw $e;
        }

        $loggerContext['storage_id'] = $identifier;
        $this->clientStorage->addClient($identifier, $token->getUser());
        $conn->WAMP->clientStorageId = $identifier;

        $this->logger->info(sprintf(
            '%s connected',
            $username
        ), $loggerContext);

        return $token;
    }
}
