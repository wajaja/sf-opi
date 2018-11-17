<?php

namespace OP\MediaBundle\Controller\Api;

use FOS\RestBundle\Controller\Annotations\{Put, Post as PostMethod, Get, RouteResource};
use Symfony\Component\HttpFoundation\Request,
    OP\MediaBundle\Construct\ImageConstructor,
    OP\UserBundle\Security\UserProvider,
    FOS\RestBundle\Controller\FOSRestController,
    FOS\RestBundle\Routing\ClassResourceInterface,
    Symfony\Component\HttpFoundation\JsonResponse;

/**
 * @RouteResource("uploader", pluralize=false)
 */
class ApiUploaderController extends FOSRestController implements ClassResourceInterface
{

    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }

    protected function reset($session, $filename, $galleryId) {

        if($session->has($galleryId)) {
            $orphanNames= $session->get($galleryId);
            $orphanIds= $session->get('_'.$galleryId);

            unset($orphanNames[$filename]);
            unset($orphanIds[$filename]);

            $session->set($galleryId, $orphanNames);
            $session->set('_'.$galleryId, $orphanIds);
        }
    }

    /**
     * Remove An image from gallery by id in qq instance
     * @PostMethod("/_gal_img/delete")
     *
     * @return array
     */
    public function removeInGalleryImageAction(Request $request)
    {
        $filename   = $request->get('filename');
        $session    = $request->getSession();

        $this->reset($session, $filename, 'galleryimage');

        return new JsonResponse(['confirm'=>$filename]);
    }

    /**
     * Remove An image from gallery by id in qq instance
     *  @PostMethod("/_gal_post/delete")
     *
     * @return array
     */
    public function removeInGalleryPostAction(Request $request)
    {
        $session    = $request->getSession();
        $filename   = $request->request->get('filename');
        $unique     = $request->request->get('unique');
        $galleryId  = 'gallerypost'.'_'.$unique;

        $this->reset($session, $filename, $galleryId);
        return new JsonResponse(['confirm'=>$filename]);
    }

    /**
     * Remove An image from gallery by id in qq instance
     *  @PostMethod("/_gal_post_edit/delete")
     *
     * @return array
     */
    public function removeInGalleryPostEditAction(Request $request)
    {
        $all        = $request->request->all();
        
        $filename   = $all['params']['filename'];
        $postId     = $all['params']['postId'];
        $session    = $request->getSession();
        $galleryId  = 'gallerypostedit'.'_'.$postId;
        
        $this->reset($session, $filename, $galleryId);
        return new JsonResponse(['confirm'=>$filename]);
    }

    /**
     * Remove An image from gallery by id in qq instance
     *  @PostMethod("/_gal_add_post/delete")
     *
     * @return array
     */
    public function removeInGalleryAddPostAction(Request $request)
    {
        $all = $request->request->all();
        
        $filename   = $all['params']['filename'];
        $postId     = $all['params']['postId'];
        $session    = $request->getSession();
        $galleryId  = 'galleryaddpost'.'_'.$postId;
        
        $this->reset($session, $filename, $galleryId);
        return new JsonResponse(['confirm'=>$filename]);
    }

    /**
     * Remove An image from gallery by id in qq instance
     *  @PostMethod("/_gal_comment/delete")
     *
     * @return array
     */
    public function removeInGalleryCommentAction(Request $request)
    {
        $all = $request->request->all();
        
        $filename   = $all['params']['filename'];
        $postId     = $all['params']['postId'];
        $session    = $request->getSession();
        $galleryId  = 'gallerycomment'.'_'.$postId;
        
        $this->reset($session, $filename, $galleryId);
        return new JsonResponse(['confirm'=>$filename]);
    }

    /**
     * Remove An image from gallery by id in qq instance
     *  @PostMethod("/_gal_comment_edit/delete")
     *
     * @return array
     */
    public function removeInGalleryCommentEditAction(Request $request)
    {
        $all        = $request->request->all();
        $session    = $request->getSession();
        $filename   = $all['params']['filename'];
        //$postId     = $all['params']['postId'];
        $commentId  = $all['params']['commentId'];
        $galleryId  = 'gallerycommentedit'.'_'.$commentId;

        $this->reset($session, $filename, $galleryId);
        return new JsonResponse(['confirm'=>$filename]);
    }

    /**
     * Remove An image from gallery by id in qq instance
     *  @PostMethod("/_gal_left/delete")
     *
     * @return array
     */
    public function removeInGalleryLeftAction(Request $request)
    {
        $all = $request->request->all();
        
        $filename   = $all['params']['filename'];
        $postId     = $all['params']['postId'];
        $session    = $request->getSession();
        $galleryId  = 'galleryleft'.'_'.$postId;

        $this->reset($session, $filename, $galleryId);
        return new JsonResponse(['confirm'=>$filename]);
    }

    /**
     * Remove An image from gallery by id in qq instance
     *  @PostMethod("/_gal_left_edit/delete")
     *
     * @return array
     */
    public function removeInGalleryLeftEditAction(Request $request)
    {
        $all = $request->request->all();
        
        $filename   = $all['params']['filename'];
        //$postId     = $all['params']['postId'];
        $commentId  = $all['params']['leftId'];
        $session    = $request->getSession();
        $galleryId  = 'galleryleftedit'.'_'.$commentId;

        $this->reset($session, $filename, $galleryId);
        return new JsonResponse(['confirm'=>$filename]);
    }

    /**
     * Remove An image from gallery by id in qq instance
     *  @PostMethod("/_gal_right/delete")
     *
     * @return array
     */
    public function removeInGalleryRightAction(Request $request)
    {
        $all = $request->request->all();
        
        $filename   = $all['params']['filename'];
        $postId     = $all['params']['postId'];
        $session    = $request->getSession();
        $galleryId  = 'galleryright'.'_'.$postId;

        $this->reset($session, $filename, $galleryId);
        return new JsonResponse(['confirm'=>$filename]);
    }

    /**
     * Remove An image from gallery by id in qq instance
     *  @PostMethod("/_gal_right_edit/delete")
     *
     * @return array
     */
    public function removeInGalleryRightEditAction(Request $request)
    {
        $all = $request->request->all();
        
        $filename   = $all['params']['filename'];
        //$postId     = $all['params']['postId'];
        $commentId  = $all['params']['rightId'];
        $session    = $request->getSession();
        $galleryId  = 'galleryrightedit'.'_'.$commentId;

        $this->reset($session, $filename, $galleryId);
        return new JsonResponse(['confirm'=>$filename]);
    }

    /**
     * Remove An image from gallery by id in qq instance
     *  @PostMethod("/_gal_undercomment/delete")
     *
     * @return array
     */
    public function removeInGalleryUnderCommentAction(Request $request)
    {
        $all = $request->request->all();
        
        $filename   = $all['params']['filename'];
        $commentId  = $all['params']['commentId'];
        $session    = $request->getSession();
        $galleryId  = 'galleryundercomment'.'_'.$commentId;

        $this->reset($session, $filename, $galleryId);
        return new JsonResponse(['confirm'=>$filename]);
    }

    /**
     * Remove An image from gallery by id in qq instance
     *  @PostMethod("/_gal_undercomment_edit/delete")
     *
     * @return array
     */
    public function removeInGalleryUnderCommentEditAction(Request $request)
    {
        $all = $request->request->all();
        
        $filename   = $all['params']['filename'];
        // $commentId  = $all['params']['commentId'];
        $replyId    = $all['params']['replyId'];
        $session    = $request->getSession();
        $galleryId = 'galleryundercommentedit'.'_'.$replyId;
        
        $this->reset($session, $filename, $galleryId);
        return new JsonResponse(['confirm'=>$filename]);
    }

    /**
     * Remove An image from gallery by id in qq instance
     * @PostMethod("/_gal_msg/delete")
     *
     * @return array
     */
    public function removeInGalleryMessageAction(Request $request)
    {
        $filename   = $request->get('filename');
        $threadId   = $request->get('threadId');
        $session    = $request->getSession();
        //$orphans    = $session->get('');
        $galleryId  = 'gallerymessage'.'_'.$threadId;
        
        $this->reset($session, $filename, $galleryId);
        return new JsonResponse(['confirm'=>$filename]);
    }

    /**
     * Remove An image from gallery by id in qq instance
     *  @PostMethod("/_gal_question/delete")
     *
     * @return array
     */
    public function removeInGalleryQuestionAction(Request $request)
    {
        $all = $request->request->all();
        $filename   = $all['params']['filename'];
        $postId     = $all['params']['postId'];
        $questionId = $all['params']['questionId'];
        $session    = $request->getSession();

        if($questionId == null) {
            $galleryId  = 'galleryquestion'.'_'.$postId;
        } else {
            $galleryId  = 'galleryquestion'.'_'.$questionId;
        }
        
        $this->reset($session, $filename, $galleryId);
        return new JsonResponse(['confirm'=>$filename]);
    }

    /**
     * Remove An image from gallery by id in qq instance
     *  @PostMethod("/_gal_msg_doc/delete")
     *
     * @return array
     */
    public function removeInGalleryMessageDocAction(Request $request)
    {
        $all = $request->request->all();
        // 
        $response = new JsonResponse();
        $filename   = $all['params']['filename'];
        $threadId = $all['params']['threadId'];
        $session   = $request->getSession();

        if($threadId === null) {
            $galleryId  = 'gallerymessage'.'_'.$postId;
        } else {
            $galleryId  = 'galleryquestion'.'_'.$questionId;
        }
        
        $this->reset($session, $filename, $galleryId);
        return new JsonResponse(['confirm'=>$filename]);
    }

     /**
     * Remove An image from gallery by id in qq instance
     *  @Get("/_image_from_cache/")
     *
     * @return array
     */
    public function getImageFromCacheAction(Request $request)
    {
        $res  = new JsonResponse();
        $data = $this->getPathFromCache($request);
        //Define your file path based on the cache one
        if($data === null)
            return $res->setData(array('src'=> null));
        
        $filename = $this->container->getParameter('kernel.cache_dir') . $data['filePath'];
        try {
            $imageData  = base64_encode(file_get_contents($filename));
            $src  = 'data:'. mime_content_type($filename). ';base64,'.$imageData;
        } catch (\Exception $e) {
            $src = null;
        }

        return $res->setData(array('image' => $data['image'], 'src'=>$src));
    }

    protected function getPathFromCache($request, ImageConstructor $construct) {
        $filename   = $request->query->get('filename');
        $galleryDir = $request->query->get('galleryDir');
        $sessionId  = $request->getSession()->getId();

        $dm         = $this->getDocumentManager();
        $image      = $dm->getRepository('OPMediaBundle:Image')
                          ->findImageByPath($filename);
        if (!$image) return null;

        return [
            'image' => $construct->imageToArray($image),
            'filePath' => '/uploader/orphanage/'. $sessionId . '/' . $galleryDir. '/'. $filename
        ];
    }

    /**
     * Returns the DocumentManager
     *
     * @return DocumentManager
     */
    private function getDocumentManager()
    {
        return $this->dm;
    }
}
