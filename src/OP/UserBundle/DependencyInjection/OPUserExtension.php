<?php

namespace OP\UserBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\DependencyInjection\Loader;

/**
 * This is the class that loads and manages your bundle configuration
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html}
 */
class OPUserExtension extends Extension
{
    /**
     * {@inheritdoc}
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);

        $loader = new Loader\YamlFileLoader($container, new FileLocator(__DIR__.'/../Resources/config'));
        $loader->load('services.yml');
        
        $container->setParameter('op_user.refresh_token.ttl', $config['ttl']);
        $container->setParameter('op_user.refresh_token.ttl_update', $config['ttl_update']);
        $container->setParameter('op_user.refresh_token.security.firewall', $config['firewall']);
        $container->setParameter('op_user.refresh_token.user_provider', $config['user_provider']);


        // $container->compile();
    }
}
