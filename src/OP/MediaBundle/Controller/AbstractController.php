<?php

namespace OP\MediaBundle\Controller;

use Symfony\Component\HttpFoundation\File\UploadedFile,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\FileBag,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\MediaBundle\Uploader\Storage\StorageInterface,
    OP\MediaBundle\Uploader\Response\ResponseInterface,
    Symfony\Component\DependencyInjection\ContainerInterface,
    OP\MediaBundle\Uploader\ErrorHandler\ErrorHandlerInterface;

abstract class AbstractController
{
    protected $container;
    protected $storage;

    public function __construct(ContainerInterface $container, StorageInterface $storage, ErrorHandlerInterface $errorHandler, $type)
    {
        $this->errorHandler = $errorHandler;
        $this->container = $container;
        $this->storage = $storage;
    }

    abstract public function upload();

    public function progress()
    {
        $request = $this->container->get('request');
        $session = $this->container->get('session');

        $prefix = ini_get('session.upload_progress.prefix');
        $name   = ini_get('session.upload_progress.name');

        // assemble session key
        // ref: http://php.net/manual/en/session.upload-progress.php
        $key = sprintf('%s.%s', $prefix, $request->get($name));
        $value = $session->get($key);

        return new JsonResponse($value);
    }



    public function cancel()
    {
        $request = $this->container->get('request');
        $session = $this->container->get('session');

        $prefix = ini_get('session.upload_progress.prefix');
        $name   = ini_get('session.upload_progress.name');

        $key = sprintf('%s.%s', $prefix, $request->get($name));

        $progress = $session->get($key);
        $progress['cancel_upload'] = false;

        $session->set($key, $progress);

        return new JsonResponse(true);
    }


    /**
     *  Flattens a given filebag to extract all files.
     *
     *  @param bag The filebag to use
     *  @return array An array of files
     */
    protected function getFiles(FileBag $bag)
    {
        $files = array();
        $fileBag = $bag->all();
        $fileIterator = new \RecursiveIteratorIterator(new \RecursiveArrayIterator($fileBag), \RecursiveIteratorIterator::SELF_FIRST);

        foreach ($fileIterator as $file) {
            if (is_array($file) || null === $file) {
                continue;
            }

            $files[] = $file;
        }

        return $files;
    }

    /**
     *  This internal function handles the actual upload process
     *  and will most likely be called from the upload()
     *  function in the implemented Controller.
     *
     *  Note: The return value differs when
     *
     *  @param The file to upload
     *  @param response A response object.
     *  @param request The request object.
     */
    protected function handleUpload($file, ResponseInterface $response, Request $request)
    {
        // wrap the file if it is not done yet which can only happen
        // if it wasn't a chunked upload, in which case it is definitely
        // on the local filesystem.
        if (!($file instanceof FileInterface)) {
            $file = new FilesystemFile($file);
        }
        
        //$this->dispatchPreUploadEvent($file, $response, $request);

        // no error happend, proceed
        $namer = $this->container->get($this->config['namer']);     //getNamer service
        
        $name  = $namer->name($file);

        // perform the real upload
        $uploaded = $this->storage->upload($file, $name);

        //$this->dispatchPostEvents($uploaded, $response, $request);
    }

    /**
     * Creates and returns a JsonResponse with the given data.
     *
     * On top of that, if the client does not support the application/json type,
     * then the content type of the response will be set to text/plain instead.
     *
     * @param mixed $data
     *
     * @return JsonResponse
     */
    protected function createSupportedJsonResponse($data)
    {
        $request = $this->container->get('request');
        $response = new JsonResponse($data);
        $response->headers->set('Vary', 'Accept');

        if (!in_array('application/json', $request->getAcceptableContentTypes())) {
            $response->headers->set('Content-type', 'text/plain');
        }

        return $response;
    }
}
