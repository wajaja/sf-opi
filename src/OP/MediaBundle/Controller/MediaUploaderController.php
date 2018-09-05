<?php

namespace OP\MediaBundle\Controller;

use SocketIO\Emitter,
    Symfony\Component\HttpFoundation\Request,
    OP\MediaBundle\Controller\AbstractController,
    OP\MediaBundle\Uploader\Response\MediaUploaderResponse,
    Symfony\Component\HttpFoundation\File\Exception\UploadException;


class MediaUploaderController extends AbstractController
{
    public function upload()
    {
        $request = $this->container->get('request');
        $response = new MediaUploaderResponse();
        
        $files = $this->getFiles($request->files);
        
        foreach ($files as $file) {
            $this->handleUpload($file, $response, $request);
        }
        return $this->createSupportedJsonResponse($response->assemble());
    }    
    
    //socket part
    public function indexAction(Request $request)
    {
        $notification = 'A message has been received by the server!<br />';
 
        // Handling form	
        $form = $this->createFormBuilder()->getForm();
        $form->handleRequest($request);
 
        // If form valid
        if ($form->isValid()) {
 
            // Calling PHP Redis from global namespace
            $redis = new \Redis();
 
            // Connecting on localhost and port 6379
            $redis->connect('127.0.0.1', '6379');
 
            // Creating Emitter
            $emitter = new Emitter($redis);
 
            // Emit a notification on channel 'notification'
            $emitter->emit('notification', $notification);
 
            // Returning status via JsonResponse
            $response = new JsonResponse();
            $response->setData(array(
                'notification' => $notification
            ));
 
            return $response;
 
        }
 
        return $this->render('AcmeAcmeBundle:Default:index.html.twig', array(
            'form' => $form->createView()
        ));
    }

}
