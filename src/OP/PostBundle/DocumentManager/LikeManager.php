<?php
namespace OP\PostBundle\DocumentManager;

use OP\PostBundle\Document\Like;

/**
 */
class LikeManager extends AbstractManager
{
    /**
     * @param Comment $comment
     * @param Boolean $andFlush Whether to flush the changes (default true)
     */    
    public function saveLike(Like $like)
    {

        $all    = $this->request->request->all();
        $refer   = $all['params']['refer'];
        $postId  = $all['params']['postId'];
        $userId = $this->getAuthenticatedUser()->getId();

        $like->setType($refer);
        $like->setRefValid($postId);

        if($refer === 'post')
            $data = $this->likePost($like, $postId, 'add');
        else if($refer === 'picture') 
            $data = $this->likePhoto($like, $postId, 'add');
        else if($refer === 'comment') 
            $data = $this->likeComment($like, $postId, 'add');
        else if($refer === 'undercomment') 
            $data = $this->likeUnderComment($like, $postId, 'add');
        else if($refer === 'left') 
            $data = $this->likeLeft($like, $postId, 'add');
        else if($refer === 'right')
            $data = $this->likeRight($like, $postId, 'add');
        else
            $data = [];

        $this->dm->persist($data['like']);
        $this->dm->flush();
        return $data;
    }

    /**
     * @param Comment $comment
     * @param Boolean $andFlush Whether to flush the changes (default true)
     */    
    public function deleteLike(Like $like)
    {
        $refer   = $like->getType();
        $postId  = $like->getRefValid();

        if($refer === 'post')
            $data = $this->likePost($like, $postId, 'delete');
        else if($refer === 'picture') 
            $data = $this->likePhoto($like, $postId, 'delete');
        else if($refer === 'comment') 
            $data = $this->likeComment($like, $postId, 'delete');
        else if($refer === 'undercomment') 
            $data = $this->likeUnderComment($like, $postId, 'delete');
        else if($refer === 'left') 
            $data = $this->likeLeft($like, $postId, 'delete');
        else if($refer === 'right')
            $data = $this->likeRight($like, $postId, 'delete');
        else
            $data = [];;

        $this->dm->remove($data['like']);
        $this->dm->flush();
        return $data;
    }

    protected function likeRight($like, $refId, $how) {
        $post   = $this->getRight($refId);
        $userId = $this->getAuthenticatedUser()->getId();
        if($how === 'add') {
            $post->incrementLegals();
            $post->doLegalsIds($userId, 'push');
            $like->setRightComment($post);
        } else {
            $post->decrementLegals();
            $post->doLegalsIds($userId, 'pull');
        }
        return array('like'=>$like, 'data'=> $this->transformer->rightLikeData($post));;
    }

    protected function likeLeft($like, $refId, $how) {
        $post   = $this->getLeft($refId);
        $userId = $this->getAuthenticatedUser()->getId();
        if($how === 'add') {
            $post->incrementLegals();
            $post->doLegalsIds($userId, 'push');
            $like->setLeftComment($post);
        } else {
            $post->decrementLegals();
            $post->doLegalsIds($userId, 'pull');
        }
        return array('like'=>$like, 'data'=>$this->transformer->leftLikeData($post));;
    }

    protected function likePost($like, $refId, $how) {
        $post   = $this->getPost($refId);
        $userId = $this->getAuthenticatedUser()->getId();
        if($how === 'add') {
            $post->incrementLikers();
            $post->doLikersIds($userId, 'push');
            $like->setPost($post);
        } else {
            $post->decrementLikers();
            $post->doLikersIds($userId, 'pull');
        }
        return array('like'=>$like, 'data'=> $this->transformer->postLikeData($post));;
    }

    protected function likePhoto($like, $refId, $how) {
        $photo       = $this->getPhoto($refId);
        $userId      = $this->getAuthenticatedUser()->getId();
        $transformer = $this->container->get('op_media.to_array.transformer');
        if($how === 'add') {
            $photo->incrementLikers();
            $photo->doLikersIds($userId, 'push');
            $like->setPhoto($photo);
        } else {
            $photo->decrementLikers();
            $photo->doLikersIds($userId, 'pull');
        }
        return array('like'=>$like, 'data'=>$transformer->photoLikeData($photo));
    }

    protected function likeComment($like, $refId, $how) {
        $comment = $this->getComment($refId);
        $userId  = $this->getAuthenticatedUser()->getId();
        if($how === 'add') {
            $comment->incrementLikers();
            $comment->doLikersIds($userId, 'push');
            $like->setComment($comment);
        } else {
            $comment->decrementLikers();
            $comment->doLikersIds($userId, 'pull');
        }
        return array('like'=>$like, 'data'=> $this->transformer->commentLikeData($comment));
    }

    protected function likeUnderComment($like, $refId, $how) {
        $comment = $this->getUnderComment($refId);
        $userId  = $this->getAuthenticatedUser()->getId();
        if($how === 'add') {
            $comment->incrementLikers();
            $comment->doLikersIds($userId, 'push');
            $like->setUnderComment($comment);
        } else {
            $comment->decrementLikers();
            $comment->doLikersIds($userId, 'pull');
        }
        return array('like'=>$like, 'data'=>$this->transformer->undercommentLikeData($comment));
    }
    
    /**
     * This is not participant deletion but real deletion
     * @param Plike $clike the  to delete
     */
    public function updateClike(Clike $clike)
    {
        $this->dm->flush();
    }

    protected function getPost($id) {
        $ref = $this->dm->getRepository('OPPostBundle:Post')->find($id);
        if (!$ref) return null; //return error
        return $ref;
    }

     protected function getPhoto($id) {
        $ref = $this->dm->getRepository('OPMediaBundle:Image')->find($id);
        if (!$ref) return null; //return error
        return $ref;
    }

    protected function getComment($id) {
        $ref = $this->dm->getRepository('OPPostBundle:Comment')->find($id);
        if (!$ref) return null; //return error
        return $ref;
    }

    protected function getLeft($id) {
        $ref = $this->dm->getRepository('OPPostBundle:LeftComment')->find($id);
        if (!$ref) return null; //return error
        return $ref;
    }

    protected function getRight($id) {
        $ref = $this->dm->getRepository('OPPostBundle:RightComment')->find($id);
        if (!$ref) return null; //return error
        return $ref;
    }

    protected function getUnderComment($id) {
        $ref = $this->dm->getRepository('OPPostBundle:UnderComment')->find($id);
        if (!$ref) return null; //return error
        return $ref;
    }
}
