<?php
namespace OP\PostBundle\DocumentManager;

use Emojione\Emojione,
    OP\MediaBundle\Document\Image,
    OP\SocialBundle\Stream\Stream,
    OP\UserBundle\Security\UserProvider,
    Doctrine\ODM\MongoDB\DocumentManager,
    OP\PostBundle\DataTransformer\ToArrayTransformer,
    Symfony\Component\HttpFoundation\RequestStack,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;

/**
 */
abstract class AbstractManager
{
    protected $dm, $uploader, $document, $image, $container, $stream,  
              $request, $orphan_video, $userProvider, $transformer;

    /**
     * Constructor.
     * @param DocumentMananger $dm
     */
    public function __construct(RequestStack $request, DocumentManager $dm, $uploader, Image $image, $v_upl, UserProvider $userProvider, Container $cont, ToArrayTransformer $transformer, Stream $stream)
    {
        $this->request       = $request->getCurrentRequest();
        $this->dm            = $dm;
        $this->container     = $cont;
        $this->orphan_video  = $v_upl;
        $this->image         = $image;
        $this->stream        = $stream;
        $this->uploader      = $uploader;
        $this->transformer   = $transformer;
        $this->userProvider  = $userProvider;
    }

    public function buildHTML($content) {
        if(gettype($content) === 'string')
            return Emojione::toImage($content);
        else 
            return $content;
    }

    protected function publishImages($imagesIds){
        $repo = $this ->dm->getRepository('OP\MediaBundle\Document\Image');

        foreach ($imagesIds as $id) {
            $image = $repo->findOneBy(array('id' => $id));
            if($image)
                $image->setPublished(true);
        }
    }

    /**
     * Gets the current authenticated user
     * @see::OPMEssageBundle participantprovider
     * @return ParticipantInterface
     */
    protected function getAuthenticatedUser()
    {
        return $this->userProvider->getHydratedUser();
    }
}
