<?php

namespace OP\PostBundle\Provider;

use OP\SocialBundle\Document\News,
    OP\PostBundle\DocumentManager\PostManager,
    Symfony\Component\HttpFoundation\RequestStack,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;

abstract class BasePostProvider
{
    protected $request, $container, $dm,
              $postManager, $news;

    public function __construct(RequestStack $requestStack, Container $container, PostManager $postManager, /*AuthorizerInterface $authorizer*/ News $news, \Doctrine\ODM\MongoDB\DocumentManager $dm)
    {
        $this->request      = $requestStack->getCurrentRequest();
        $this->container    = $container;
        $this->dm           = $dm;
        $this->postManager  = $postManager;
        $this->news         = $news;
    }
    
    /**
     * Returns the DocumentManager
     *
     * @return DocumentManager
     */
    protected function getDocumentManager()
    {
        return $this->dm;
    }
    
}
