<?php

namespace OP\UserBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\ContainerBuilder,
	Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface,
    Symfony\Component\HttpFoundation\RequestStack,
    Symfony\Component\DependencyInjection\ContainerInterface,
    Symfony\Component\DependencyInjection\Reference;

/**
 * Class OverrideServiceCompilerPass
 * @package Shopmacher\IsaBodyWearBundle\DependencyInjection\Compiler
 */
class WebsocketAuthenticationProviderCompilerPass implements CompilerPassInterface
{

    /**
     * Overwrite project specific services
     * @param ContainerBuilder $container
     */
    public function process(ContainerBuilder $container)
    {
        $defAuthService = $container
        				->getDefinition('gos_web_socket.websocket_authentification.provider'); 
        // $defAuthService ->setAbstract(true);

        // $defAuthService ->setClass('OP\UserBundle\Security\WebsocketAuthenticationProvider');
        
        // $defAuthService ->addArgument(new Reference('request_stack'));
        // $defAuthService ->addArgument(new Reference('service_container'));
        // // $defAuthService ->addArgument(new Reference('op_user.user_provider'));
        //  $up = $container->get('service_container');

        //  $defAuthService->addMethodCall(
        //     'setUserProvider',
        //     array(new Reference($up, ContainerInterface::NULL_ON_INVALID_REFERENCE, false))
        // );
    }
}