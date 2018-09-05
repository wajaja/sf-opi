<?php

namespace OP\MediaBundle\DocumentManager;

use Pagerfanta\Pagerfanta,
    FOS\UserBundle\FOSUserEvents,
    OP\UserBundle\Document\User,
    OP\MediaBundle\Document\Image,
    FOS\UserBundle\Event\FormEvent,
    Pagerfanta\Adapter\ArrayAdapter,
    OP\MediaBundle\Document\EveryWhere,
    Doctrine\ODM\MongoDB\DocumentManager as Manager,
    Symfony\Component\HttpFoundation\Request,
    OP\MediaBundle\Construct\ImageConstructor,
    FOS\UserBundle\Event\GetResponseUserEvent,
    FOS\RestBundle\Controller\FOSRestController,
    OP\UserBundle\Repository\OpinionUserManager,
    FOS\UserBundle\Event\FilterUserResponseEvent,
    FOS\RestBundle\Routing\ClassResourceInterface,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Component\HttpFoundation\RequestStack,
    Symfony\Component\HttpFoundation\File\UploadedFile,
    OP\MediaBundle\ModelManager\PictureManager as BaseManager,
    Symfony\Component\Security\Core\Exception\AccessDeniedException,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;

/**
* 
*/
class PictureManager extends BaseManager
{

	protected $dm, $request, $container, $user_manager;
	
	public function __construct(Manager $dm, Container $container, RequestStack $req, OpinionUserManager $uMan) {
        $this->dm       = $dm;
        $this->request  = $req->getCurrentRequest();
        $this->container= $container;
        $this->user_manager = $uMan;
    }

	/**
     * Add New Cover
     * @param Image $picture
     * @param String $path
     * @param String $crop_path
     * @return Image
     */
    public function loadProfileImages(User $user, $initIds=[], $limit = 10, ImageConstructor $construct)
    {
        $repo        = $this->dm->getRepository('OPMediaBundle:Image');
        $images      = $repo->loadImages($user, $initIds, $limit);

        return $construct->imagesToArray($images);
    }

    /**
     * Add New Cover
     * @param Image $picture
     * @param String $path
     * @param String $crop_path
     * @return Image
     */
    public function loadPaginateUserImages(User $user, $page=1, $limit = 10, ImageConstructor $construct)
    {
        $images      = [];
        $repo        = $this->dm->getRepository('OPMediaBundle:Image');
        // $serializer  = $this->container->get('jms_serializer');
        $results     = $repo->loadImages($user, $page, $limit);
        //paginate
        $adapter = new ArrayAdapter($results);
        $pager   = new Pagerfanta($adapter);
        $pager->setMaxPerPage($limit);
        $pager->setCurrentPage((string)$page);

        return $construct->imagesToArray($pager->getCurrentPageResults());; //array_values($pager->getCurrentPageResults()); //$constructor->imagesToArray($pager->getCurrentPageResults());
    }

    public function createEveryWhere($photoId, User $user) {
        $data = $this->getEveryWhereData();
        $ever = new EveryWhere();

        $ever->setCharCode($data['char_code'])
             ->setRectX($data['rect_x'])
             ->setRectY($data['rect_y'])
             ->setScaleX($data['scale_x'])
             ->setScaleY($data['scale_y'])
             ->setPhotoId($photoId)
             ->setCreatedBy($user);

        return $this->saveEveryWhere($ever);
    }

    /**
     * Processes the form with the request
     *
     * @param Form $form
     * @param Bool $update  
     * @return Message|false the sent message if the form is bound and valid, false otherwise
     */
    public function getEveryWhereData()
    {
        //request method
        if (!in_array($this->request->getMethod(), ['POST', 'PUT', 'PATCH'])) {
            return false;
        }

        //handle and bind form data from json object
        if($this->request->getFormat('application/json')) {            
            $data = json_decode($this->request->getContent(), true);
            // $this->request->request->replace(is_array($data) ? $data : array());
            return $data;
        }
        return false;
    }

    /**
     * @param Comment $comment
     * @param Boolean $andFlush Whether to flush the changes (default true)
     */    
    public function saveEveryWhere(EveryWhere $ever)
    {
        $this->dm->persist($ever);
        $this->dm->flush();

        return $ever;
    }

    /**
     * This is not participant deletion but real deletion
     * @param Plike $clike the  to delete
     */
    public function updateEveryWhere(EveryWhere $ever)
    {
        $data = $this->getEveryWhereData();

        $ever->setCharCode($data['char_code'])
             ->setRectX($data['rect_x'])
             ->setRectY($data['rect_y'])
             ->setScaleX($data['scale_x'])
             ->setScaleY($data['scale_y'])
             ->setUpdatedAt(new \Datetime(null, new \DateTimeZone("UTC")));
        $this->dm->flush();

        return $ever;
    }

    /**
     * @param Comment $comment
     * @param Boolean $andFlush Whether to flush the changes (default true)
     */    
    public function deleteEveryWhere(EveryWhere $ever)
    {
        $this->dm->remove($ever);
        $this->dm->flush();
    }

    protected function newEveryWhere() {
        $contents   = $this->request->request->all();       
        $data       = json_decode($this->request->getContent(), true);        
        $value      =   !$this->request->getFormat('application/json') ? 
                            $contents['rate']['rate']: $data['rate'];
        return $value;
    }

    protected function getPost($id) {
        $ref = $this->dm->getRepository('OPPostBundle:Post')->find($id);
        if (!$ref) return null; //return error
        return $ref;
    }
}