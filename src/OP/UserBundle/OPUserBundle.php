<?php

namespace OP\UserBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle,
	Symfony\Component\DependencyInjection\ContainerBuilder,
	OP\UserBundle\DependencyInjection\Compiler\WebsocketAuthenticationProviderCompilerPass;

class OPUserBundle extends Bundle
{
    public function build(ContainerBuilder $container)
    {
        parent::build($container);

        $container->addCompilerPass(new WebsocketAuthenticationProviderCompilerPass());
        // $container->compile();
    }
}
