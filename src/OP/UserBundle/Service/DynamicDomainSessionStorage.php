<?php

namespace OP\PostBundle\Topic;

use Symfony\Component\HttpFoundation\Session\Storage\MemcachedSessionHandler;

/**
 * DynamicDomainSessionStorage.
 *
 * @author Julien Devouassoud
 */
class DynamicDomainSessionStorage extends MemcachedSessionHandler
{
     /**
     * setOptions.
     *
     * {@inheritDoc}
     */
    public function setOptions(array $options)
    {   
        if(isset($_SERVER['HTTP_HOST'])) {
            $domain = substr($_SERVER['HTTP_HOST'], strpos($_SERVER['HTTP_HOST'], '.'));

            $options["cookie_domain"] = $domain;
        } 
        return parent::setOptions($options);
    }
}