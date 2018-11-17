<?php 
namespace OP\MediaBundle\EventListener;

use Doctrine\ODM\MongoDB\DocumentManager,
    Oneup\UploaderBundle\Event as UploaderEvent,
    Oneup\UploaderBundle\Uploader\Exception\ValidationException;

class UploadListener
{

    /**
     * @var DocumentManager
     */
    private $dm;

    public function __construct(DocumentManager $dm)
    {
        $this->dm = $dm;
    }

    public function onPreUpload(UploaderEvent\PreUploadEvent $event)
    {
        $req     = $event->getRequest();
        $type    = $event->getType();
        $session = $req->getSession();
        $session->set('galleryType', $type); //for storing filename
        $session->set('_galleryType', '_'.$type); //to get persisted gallery ids 
    }

    public function onPostUpload(UploaderEvent\PostUploadEvent $event)
    {
        $req = $event->getRequest();
        $type = $event->getType();
        $file = $event->getFile();
        $response = $event->getResponse();
        $session = $req->getSession();
        //
        $response['filename'] = $file->getFilename();
        // $response->setSuccess(false);
        // $response->setError($msg);
    }

    public function onPostPersist(UploaderEvent\PostPersistEvent $event)
    {
        // $req = $event->getRequest();
        // $type = $event->getType();
        // $session = $req->getSession();
        // echo $postPersistEvent;
        // $emptyArr = [];
        // if(!$session->isStarted()) 
        //     $session->start();
        // $session->set($type, $emptyArr);
        // $session->set('_'.$type, $emptyArr); //remove all ObjectId for photo stored in session
    }

    public function onValidate(UploaderEvent\ValidationEvent $event)
    {
        // // $config  = $event->getConfig();
        // // $file    = $event->getFile();
        // $type    = $event->getType();
        // $pathName = $event->getFile()->getClientOriginalName();
        // $req = $event->getRequest();

        // $session = $req->getSession();

        // $session->set('gallery', $pathName);

        // // do some validations
        // throw new ValidationException('Sorry! Always false.');
    }
}