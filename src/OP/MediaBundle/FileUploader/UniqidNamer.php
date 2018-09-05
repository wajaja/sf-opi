<?php
namespace OP\MediaBundle\FileUploader;

use Symfony\Component\HttpFoundation\File\UploadedFile,
    OP\MediaBundle\Document\Image,
    OP\UserBundle\Security\UserProvider,
    Doctrine\ODM\MongoDB\DocumentManager,
    Symfony\Component\HttpFoundation\RequestStack;


/**
 * Description of UniqidNamer
 *
 * @author CEDRICK
 */
class UniqidNamer 
{

	private $request, $dm, $userProvider;

	public function __construct(RequestStack $requestStack, DocumentManager $dm, UserProvider $userProvider)
	{
		$this->request = $requestStack->getCurrentRequest();
        $this->dm      = $dm;
        $this->userProvider = $userProvider;
	}

    public function name(UploadedFile $file)
    {
        //rename uploaded file
        /** store originalName for deletion usage 
        * and fineuploader uploaded files
        * @see:: UploadListener
        */
        $filename = sprintf('%s.%s', md5(uniqid()), $file->guessExtension());
        $request  = $this->request;
        $name     = [];
    	$session  = $request->getSession();
        if(!$session->isStarted()) $session->start(); 	
    	$dir = $session->get('galleryType');


        if($dir === 'gallerypost') {
            $unique = $request->request->get('unique');
            $dir_id = 'gallerypost'.'_'.$unique;
            $this->setSessionData($session, $dir, $dir_id, $file, $filename);
        } 

        //concat gallerypostedit with postId like: gallerypostedit_2adh6j827863
        else if ($dir === 'gallerypostedit') {
            $postId  = $request->request->get('postId');
            $dir_id = 'gallerypostedit'.'_'.$postId;

            $this->setSessionData($session, $dir, $dir_id, $file, $filename);
        }
        else if ($dir == 'galleryaddpost') {
            $postId  = $this->request->request->get('postId');
            $dir_id = 'galleryaddpost'.'_'.$postId;
            
            $this->setSessionData($session, $dir, $dir_id, $file, $filename);
        }
        else if ($dir === 'galleryaddpostedit') {
            $postId  = $this->request->request->get('postId');
            $dir_id = 'galleryaddpostedit'.'_'.$postId;
            
            $this->setSessionData($session, $dir, $dir_id, $file, $filename);
        }

        //concat gallerypostedit with postId like: gallerypostedit_2adh6j827863
        else if ($dir === 'gallerycomment') {
            $postId  = $this->request->request->get('postId');
            $dir_id = 'gallerycomment'.'_'.$postId;

            $this->setSessionData($session, $dir, $dir_id, $file, $filename);
        }
        //concat gallerypostedit with postId like: gallerypostedit_2adh6j827863
        else if ($dir === 'gallerycommentedit') {
            $commentId = $this->request->request->get('commentId');
            $dir_id   = 'gallerycommentedit'.'_'.$commentId;
            
            $this->setSessionData($session, $dir, $dir_id, $file, $filename);
        }

        else if ($dir === 'galleryleftcomment') {
            $postId    = $this->request->request->get('postId');
            $dir_id   = 'galleryleftcomment'.'_'.$postId;

            $this->setSessionData($session, $dir, $dir_id, $file, $filename);
        }
        //concat gallerypostedit with postId like: gallerypostedit_2adh6j827863
        else if ($dir === 'galleryleftcommentedit') {
            $commentId = $this->request->request->get('commentId');
            $dir_id   = 'galleryleftcommentedit'.'_'.$commentId;
            
            $this->setSessionData($session, $dir, $dir_id, $file, $filename);
        }

        else if ($dir === 'galleryrightcomment') {
            $postId    = $this->request->request->get('postId');
            $dir_id   = 'galleryrightcomment'.'_'.$postId;

            $this->setSessionData($session, $dir, $dir_id, $file, $filename);
        }
        //concat gallerypostedit with postId like: gallerypostedit_2adh6j827863
        else if ($dir === 'galleryrightcommentedit') {
            $commentId = $this->request->request->get('commentId');
            $dir_id   = 'galleryrightcommentedit'.'_'.$commentId;
            
            $this->setSessionData($session, $dir, $dir_id, $file, $filename);
        }

        //concat gallerypostedit with postId like: gallerypostedit_2adh6j827863
        else if ($dir === 'galleryundercomment') {
            $commentId = $this->request->request->get('commentId');
            $dir_id   = 'galleryundercomment'.'_'.$commentId;

            $this->setSessionData($session, $dir, $dir_id, $file, $filename);
        }
        
        else if ($dir === 'galleryundercommentedit') {
            $replyId  = $this->request->request->get('replyId');
            $dir_id  = 'galleryundercommentedit'.'_'.$replyId;
            
            $this->setSessionData($session, $dir, $dir_id, $file, $filename);
        }

        else if ($dir === 'galleryquestion') {
            $postId     = $this->request->request->get('postId');
            $questionId = $this->request->request->get('questionId');
            if(!$questionId)
                $dir_id = 'galleryquestion'.'_'.$postId;
            else
                $dir_id = 'galleryquestion'.'_'.$questionId;

            $this->setSessionData($session, $dir, $dir_id, $file, $filename);
        }
        else if ($dir === 'galleryimage') {

        }

        else if ($dir === 'gallerymessage') {
            $threadId     = $this->request->request->get('threadId');
            $uniqueString = $this->request->request->get('uniqueString');
            if($threadId)
                $dir_id  = 'gallerymessage'.'_'.$threadId;
            else
                $dir_id  = 'gallerymessage'.'_'.$uniqueString;

            $this->setSessionData($session, $dir, $dir_id, $file, $filename);
        } 

        else if ($dir === 'gallerymsgdoc') {
            $threadId     = $this->request->request->get('threadId');
            $uniqueString = $this->request->request->get('uniqueString');
            if(!$threadId)
                $dir_id  = 'gallerymsgdoc'.'_'.$threadId;
            else
                $dir_id  = 'gallerymsgdoc'.'_'.$uniqueString;
            
            $this->setSessionData($session, $dir, $dir_id, $file, $filename);
        } 
        else {

        }

        return $filename;
    }

    protected function setSessionData($session, $dir, $dir_id, $file, $filename) {
        //get galleryDir created or updated in onPreUpload
        $name = $session->get($dir_id);         
        /**** push new key in array
         then set dir_id for new file in session ****/
        $name[$filename] = $file->getClientOriginalName();  
        $session->set($dir_id, $name);

        //flush in database 
        $image = new Image();
        $image  ->setPath($filename)
                ->setSize($file->getSize())
                ->setPublished(false)
                ->setDirectory($dir) //$galleryDir
                ->setAuthor($this->getUser())
                ;
        $this->dm->persist($image);
        $this->dm->flush();

        //get persisted gallery ids created or updated in onPreUpload
        $_name   = $session->get('_'.$dir_id);
        /**** push new id in array
         then set dir_id for new doctrine document in session ****/
        $_name[$filename] = $image->getId();
        $session->set('_'.$dir_id, $_name); //set array of image ids under session
    }

    /**
     * Gets the current authenticated user
     * @see::OPMEssageBundle participantprovider
     * @return ParticipantInterface
     */
    protected function getUser()
    {
        return $this->userProvider->getHydratedUser();
    }

}
