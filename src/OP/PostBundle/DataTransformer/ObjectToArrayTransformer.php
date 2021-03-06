<?php

namespace OP\PostBundle\DataTransformer;

/**
 * Description of ObjectToArrayTranformer
 *
 * @author CEDRICK
 */
class ObjectToArrayTransformer extends AbstractObjectToArrayTransformer
{
    public function postObjectToArray($_p)
    {
        $userId               = $this->getAuthenticatedUser()->getId();
        $p['nbQuestioners']= $_p->getNbQuestioners();
        $p['nbAllies']     = $_p->getNbAllies();
        $p['mainAllie']    = $_p->getMainAllie();
        $p['isMainPost']   = $_p->getIsMainPost();
        $p['hasSecret']    = $_p->is_questioner($userId);
        $p['objectType']   = $_p->getObjectType();
        $p['videos']       = $this->getVideos($_p);          
        $p['editors']      = $this->getEditors($_p, 'editors');
        $p['participants'] = $this->getParticipants($_p);
        foreach ($this->commonPostData($_p) as $k=> $v) {
            $p[$k] = $v;
        }      
        $p['comments']     = [];
        return $p;
    }

    public function opinionObjectToArray($_p)
    {
        $p['nbLeftComments']= $_p->getNbLeftcomments() ?? 0;
        $p['nbRightComments']= $_p->getNbRightcomments() ?? 0;
        $p['rate']         = $this->getPostRate($_p->getId());
        $p['totalRate']    = $_p->getTotalRate();
        $p['nbAllies']     = $_p->getNbAllies();
        $p['nbRates']      = $_p->getNbPLikers();    
        $p['title']        = $_p->getTitle();
        $p['objectType']   = $_p->getObjectType();
        $p['videos']       = $this->getVideos($_p);
        $p['opinionOrder'] = $_p->getOpinionOrder();          
        $p['publishedAt']  = $_p->getPublishedAt()->getTimestamp();
        $p['leftEditors']  = $this->getEditors($_p, 'lefteditors');
        $p['rightEditors'] = $this->getEditors($_p, 'righteditors');
        foreach ($this->commonPostData($_p) as $k=> $v) {
            $p[$k] = $v;
        }      
        $p['comments']     = [];
        return $p;
    }

    public function shareObjectToArray($_p)
    {
        $p                 = [];
        $p['objectType']   = $_p->getObjectType();
        $p['post']         = $this->commonPostData($this->findPost($_p->getId()));
        foreach ($this->commonPostData($_p) as $k=> $v) {
            $p[$k] = $v;
        }
        return $p;
    }

    private function commonPostData($_p) {
        $userId            = $this->getAuthenticatedUser()->getId();
        return [
            'isMasked'  => $this->isMaskedForUser($_p->getMaskersForUserIds()),
            'liked'     => $_p->is_liker($userId),
            'isUpdated' => $_p->isUpdated(),
            'updateAt'  => $_p->getUpdateAt(),
            'nbLikers'  => $_p->getNbPLikers(),
            'images'    => $this->getImages($_p),
            'confidence'=> $_p->getConfidence(),
            'targetMap' => $_p->getTargetMap(),
            'id'        => $_p->getId(),
            'type'      => $_p->getType(),
            'timelineId'   => $_p->getTimelineId() ?? $_p->getAuthor()->getId(),
            'timelineType' => $_p->getTimelineType() ?? 'user',
            'content'      => $_p->getContent(),
            'createdAt'    => $_p->getCreatedAt()->getTimestamp(),
            'publishedAt'  => $_p->getPublishedAt()->getTimestamp(),
            'author'       => $this->getAuthor($_p->getAuthor()->getId())
        ];
    }
    
    public function commentObjectToArray($c_obj)
    {
        $userId                = $this->getAuthenticatedUser()->getId();
        $c['id']         = $c_obj->getId();
        $c['updated']    = $c_obj->isUpdated();
        $c['updateAt']   = $c_obj->isUpdated() ? $c_obj->getUpdateAt()->getTimestamp() : null;
        $c['createdAt']  = $c_obj->getCreatedAt()->getTimestamp();
        $c['content']    = $c_obj->getContent();
        $c['postValid']  = $c_obj->getPostValid();
        $c['liked']      = $c_obj->is_liker($userId);
        $c['nbUnders']   = $c_obj->getNbUnders();
        $c['nbLikers']   = $c_obj->getNbLikers();
        $c['total_rate'] = $c_obj->getTotalRate();
        $c['unders']     = $this->getUnders($c_obj->getId());
        $c['favorite']   = $c_obj->is_favoritesForUser($userId);
        $c['isMasked']   = $c_obj->is_maskersForUser($userId);
        $c['refer']      = $c_obj->getPhoto() ? 'photo' : 'post';
        $c['author']     = $this->getAuthor($c_obj->getAuthor()->getId());
        $c['images']     = $this->getImages($c_obj);
        return $c;            
    }
    
    public function underCommentObjectToArray($c_obj)
    {
        $userId= $this->getAuthenticatedUser()->getId();
        $c['type']       = 'undercomment';
        $c['id']         = $c_obj->getId();
        $c['updated']    = $c_obj->isUpdated();
        $c['liked']      = $this->isLiker($c['id'], 'undercomment', 'like');
        $c['content']    = $c_obj->getContent();
        $c['commentValid']= $c_obj->getCommentValid();
        $c['createdAt']  = $c_obj->getCreatedAt()->getTimestamp();
        $c['updateAt']   = $c_obj->isUpdated() ? $c_obj->getUpdatedAt()->getTimestamp() : null;
        $c['isMasked']   = $c_obj->is_maskersForUser($userId);
        $c['author']     = $this->getAuthor($c_obj->getAuthor()->getId());
        $c['images']     = $this->getImages($c_obj);
        return $c;        
    }

    public function opinionCommentObjectToArray($c_obj, $side)
    {
        $userId                = $this->getAuthenticatedUser()->getId();
        $c['id']         = $c_obj->getId();
        $c['side']       = $side;
        $c['opinionOrder']= $c_obj->getOpinionOrder();
        $c['order']      = $c_obj->getOrder();
        $c['updated']    = $c_obj->isUpdated();
        $c['updateAt']   = $c_obj->isUpdated() ? $c_obj->getUpdateAt()->getTimestamp() : null;
        $c['createdAt']  = $c_obj->getCreatedAt()->getTimestamp();
        $c['content']    = $c_obj->getContent();
        $c['postValid']  = $c_obj->getPostValid();
        $c['legal']      = $c_obj->is_legal($userId);
        $c['nbLegals']   = $c_obj->getNbLegals();
        $c['favorite']   = $c_obj->is_favoritesForUser($userId);
        $c['isMasked']   = $c_obj->is_maskersForUser($userId);
        $c['author']     = $this->getAuthor($c_obj->getAuthor()->getId());
        $c['images']     = $this->getImages($c_obj);
        return $c;            
    }

    public function postChildObjectToArray($_p)
    {
        $p['id']         = $_p->getId();
        $p['type']       = $_p->getType();
        $p['isUpdated']  = $_p->isUpdated();
        $p['content']    = $_p->getContent();             
        $p['nbLikers']   = $_p->getNbPLikers();
        $p['isMainPost'] = $_p->getIsMainPost();
        $p['opinionOrder']= $_p->getOpinionOrder();
        $p['videos']     = $this->getVideos($_p);
        $p['images']     = $this->getImages($_p);
        $p['hasSecret']  = $this->hasSecret($_p);
        $p['mainAllieId']= $_p->getMainAllie()->getId();
        $p['createdAt']  = $_p->getCreatedAt()->getTimestamp();
        $p['liked']      = $this->isLiker($p['id'], 'post', 'like');
        $p['author']     = $this->getAuthor($_p->getAuthor()->getId());
        $p['updateAt']   = null !== $_p->getUpdateAt() ? 
                                 $_p->getUpdateAt()->getTimestamp(): null;
        $p['nbLeftComments']= $_p->getNbLeftcomments() ?? 0;
        $p['nbRightComments']= $_p->getNbRightcomments() ?? 0;
        return $p;
    }

    public function getComments($post_id)
    {   
        $comments= [];
        $results=  $this->dm->getRepository('OPPostBundle:Comment')->findRecentComments($post_id);
        foreach ($results as $result) {
            $comments[]= $this->commentToArray($result);
        }
        return $comments;
    }

    public function getUnders($com_id)
    {
        return $this->dm->getRepository('OPPostBundle:UnderComment')->findUnderIds($com_id);
    }

    public function isLiker($docId, $type, $likeType)
    {
        $userId= $this->getAuthenticatedUser()->getId();
        if($likeType=== 'rate') 
            $repo  = $this->dm->getRepository('OP\PostBundle\Document\Rate');   
        else
            $repo  = $this->dm->getRepository('OP\PostBundle\Document\Like');

        if($type== 'post') 
            return $repo->findPostLiker($docId, $userId) ?? false;
        else if($type== 'comment')
            return $repo->findCommentLiker($docId, $userId) ?? false;
        else if($type== 'leftcomment')
            return $repo->findLeftLiker($docId, $userId) ?? false;
        else if($type== 'rightcomment') 
            return $repo->findRightLiker($docId, $userId) ?? false;
        else if($type== 'undercomment') 
            return $repo->findUnderCommentLiker($docId, $userId) ?? false;
    }

    public function hasSecret($p)
    {
        $userId= $this->getAuthenticatedUser()->getId();
        $questioners_ids= $p['questioners_ids'] ?? [];
        foreach ($questioners_ids as $questioner_id){
            if($questioner_id=== $userId){
                return true;
            }
        }
        return false;
    }

    public function leftLikeData($obj)
    {
        return[
            'id'    => $obj->getId(),
            'refer' => 'left',
            'nbLegals' => $obj->getNbLegals(),
            'liked'    => $obj->is_legal($this->getAuthenticatedUser()->getId()),
        ];
    }

    public function rightLikeData($obj) : array {
        return[
            'id'    => $obj->getId(),
            'refer' => 'right',
            'nbLegals' => $obj->getNbLegals(),
            'liked'    => $obj->is_legal($this->getAuthenticatedUser()->getId()),
        ];
    }

    public function postLikeData($obj)
    {
        return[
            'id'    => $obj->getId(),
            'refer' => 'post',
            'nbLikers' => $obj->getNbPLikers(),
            'liked'    => $obj->is_legal($this->getAuthenticatedUser()->getId()),
        ];
    }

    public function commentLikeData($obj)
    {
        return[
            'id'    => $obj->getId(),
            'refer' => 'comment',
            'nbLikers' => $obj->getNbLikers(),
            'liked'    => $obj->is_legal($this->getAuthenticatedUser()->getId()),
        ];
    }

    public function undercommentLikeData($obj)
    {
        return [
            'id' => $obj->getId(),
            'refer' => 'undercomment',
            'liked' => $obj->is_liker($this->getAuthenticatedUser()->getId()),
            'nbLikers' => $obj->getNbLikers()
        ];
    }

    private function findPost($id)
    {
        return $this->dm->getRepository('OP\PostBundle\Document\Post')->find($id);
    }
}
