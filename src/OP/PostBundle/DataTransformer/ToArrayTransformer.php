<?php

namespace OP\PostBundle\DataTransformer;

/**
 * Description of ObjectToArrayTranformer
 *
 * @author CEDRICK
 */
class ToArrayTransformer extends ObjectToArrayTransformer
{

    public function commentToArray($c_obj)
    {
        $c['id']          = (string)$c_obj['_id'];
        $c['content']     = $c_obj['content'];
        $c['createdAt']   = $c_obj['createdAt']->{'sec'};
        $c['postValid']   = $c_obj['postValid'];
        $c['nbUnders']    = isset($c_obj['nbUnders']) ? $c_obj['nbUnders'] : 0;
        $c['nbLikers']    = $c_obj['nbLikers'];
        $c['total_rate']  = $c_obj['total_rate'];
        $c['images']      = $this->getImages($c_obj);
        $c['updated']     = $this->isUpdated($c_obj);     
        $c['isMasked']    = $this->isMaskedForUser($c_obj['maskersForUserIds']);
        $c['favorite']    = $this->isFavoriteForUser($c_obj['favoritesForUserIds']);
        $c['author']      = $this->getAuthor((string)$c_obj['author']['$id']);
        $c['liked']       = $this->isLiker($c['id'], 'comment', 'like');
        $c['unders']      = $this->countUnderComments($c['id']);
        $c['refer']       = $this->checkReference($c_obj);
        $c['updateAt']    = isset($c_obj['updateAt']) ? $c_obj['updateAt']->{'sec'} : null;
        return $c;
    }

    public function postToArray($_p)
    {
        $p['refer']          = 'post';            
        $p['isMainPost']     = $_p['isMainPost'];
        $p['objectType']     = $_p['objectType'];
        $p['videos']         = $this->getVideos($_p);
        $p['nbAllies']        = isset($_p['nbAllies']) ? $_p['nbAllies'] : 0;
        $p['hasSecret']      = $this->hasSecret($_p);
        $p['participants']   = $this->getParticipants($_p);
        $p['comments']       = [];
        $p['editors']        = $this->getEditors($_p, 'editors');
        $p['questionIds']    = $this->getQuestionsInfo((string)$_p['_id']);
        $p['favorite']       = $this->isFavoriteForUser($_p['favoritesForUserIds']);
        $p['mainAllie']      = isset($_p['mainAllie']) ? $_p['mainAllie'] : null;
        $p['nbQuestioners']  = isset($_p['nbQuestioners']) ? $_p['nbQuestioners'] : 0; 
        foreach ($this->commonPostData($_p) as $k => $v) {
            $p[$k]  = $v;
        }
        return $p;
    }

    private function commonPostData($_p) {
        $userId             = $this->getAuthenticatedUser()->getId();
        $p['isMasked']      = $this->isMaskedForUser($_p['maskersForUserIds']);
        $p['liked']         = $this->isLiker((string)$_p['_id'], 'post', 'like');
        $p['isUpdated']     = $this->isUpdated($_p);
        $p['confidence']    = $_p['confidence'];
        $p['targetMap']     = isset($_p['targetMap']) ? $_p['targetMap'] : null;
        $p['updateAt']      = isset($_p['updateAt']) ? $_p['updateAt']->{'sec'} : null;
        $p['nbLikers']      = $_p['nbPlikers'];
        $p['images']        = $this->getImages($_p);
        $p['videos']        = $this->getVideos($_p);
        $p['id']            = (string)$_p['_id'];
        $p['type']          = $_p['type'];
        $p['content']       = $_p['content'];;
        $p['createdAt']     = $_p['createdAt']->{'sec'};
        $p['publishedAt']   = $_p['publishedAt']->{'sec'};
        $p['author']        = $this->getAuthor((string)$_p['author']['$id']);
        return $p;
    }

    public function opinionToArray($_p)
    {
        $p['nbLeftComments'] = isset($_p['nbLeftcomments']) ? 
                                     $_p['nbLeftcomments'] : 0;
        $p['nbRightComments'] = isset($_p['nbRightcomments']) ? 
                                      $_p['nbRightcomments'] : 0;
        $p['type']           = $_p['type'];
        $p['content']        = $_p['content'];             
        $p['nbRates']        = $_p['nbPlikers'];
        $p['totalRate']      = $_p['total_rate'];
        $p['isMainPost']     = $_p['isMainPost'];
        $p['id']             = (string)$_p['_id'];
        $p['objectType']     = $_p['objectType'];
        $p['timelineId']     = isset($_p['timelineId']) ? $_p['timelineId'] : (string)$_p['author']['$id'];
        $p['timelineType']   = isset($_p['timelineType']) ? $_p['timelineType'] : 'user';
        $p['nbAllies']       = isset($_p['nbAllies']) ? $_p['nbAllies'] : 0;
        $p['createdAt']      = $_p['createdAt']->{'sec'};
        $p['publishedAt']    = $_p['publishedAt']->{'sec'};
        $p['videos']         = $this->getVideos($_p);
        $p['images']         = $this->getImages($_p);
        $p['isUpdated']      = $this->isUpdated($_p);
        $p['secret']         = $this->hasSecret($p['id']);
        $p['rate']           = $this->getPostRate($p['id']);
        $p['rightEditors']   = $this->getEditors($_p, 'righteditors');
        $p['leftEditors']    = $this->getEditors($_p, 'lefteditors');
        $p['liked']          = $this->isLiker($p['id'], 'post', 'rate');
        $p['author']         = $this->getAuthor((string)$_p['author']['$id']);
        $p['isMasked']       = $this->isMaskedForUser($_p['maskersForUserIds']);
        $p['favorite']       = $this->isFavoriteForUser($_p['favoritesForUserIds']);
        $p['title']          = isset($_p['title']) ? $_p['title'] : null;
        $p['opinionOrder']   = isset($_p['opinionOrder']) ? $_p['opinionOrder'] : null;
        $p['updateAt']       = isset($_p['updateAt']) ? $_p['updateAt']->{'sec'} : null;
        return $p;
    }

    public function postChildToArray($_p)
    {
        $p['type']        = $_p['type'];
        $p['content']     = $_p['content'];             
        $p['isMainPost']  = $_p['isMainPost'];
        $p['nbLikers']    = $_p['nbPlikers'];
        $p['opinionOrder']= $_p['opinionOrder'];
        $p['id']          = (string)$_p['_id'];
        $p['createdAt']   = $_p['createdAt']->{'sec'};
        $p['videos']      = $this->getVideos($_p);
        $p['images']      = $this->getImages($_p);
        $p['isUpdated']   = $this->isUpdated($_p);
        $p['hasSecret']   = $this->hasSecret($_p);
        $p['liked']       = $this->isLiker($p['id'], 'post', 'like');
        $p['author']      = $this->getAuthor((string)$_p['author']['$id']);
        $p['mainAllieId'] = (string)$_p['mainAllie']['$id'];
        $p['updateAt']   = isset($_p['updateAt']) ? $_p['updateAt']->{'sec'} : null;
        $p['nbLeftComments'] = isset($_p['nbLeftcomments']) ? $_p['nbLeftcomments'] : 0;
        $p['nbRightComments'] = isset($_p['nbRightcomments']) ? $_p['nbRightcomments'] : 0;
        return $p;
    }

    public function underCommentToArray($c_obj)
    {
        $userId = $this->getAuthenticatedUser()->getId();
        $c['type']        = 'undercomment';
        $c['id']          = (string)$c_obj['_id'];
        $c['content']     = $c_obj['content'];
        $c['createdAt']   = $c_obj['createdAt']->{'sec'};
        $c['commentValid']= $c_obj['commentValid'];
        $c['liked']       = $this->isLiker($c['id'], 'undercomment', 'like');
        $c['nbLikers']    = $c_obj['nbLikers'];
        $c['updateAt']    = isset($c_obj['updateAt']) ? $c_obj['updateAt']->{'sec'} : null;
        $c['isMasked']    = $this->isMaskedForUser($c_obj['maskersForUserIds']);//$c_obj->is_maskersForUser($userId);
        $c['author']      = $this->getAuthor((string)$c_obj['author']['$id']);
        $c['images']      = $this->getImages($c_obj);
        return $c;        
    }
    
    public function opinionCommentToArray($c_obj, $side)
    {
        $c['id']          = (string)$c_obj['_id'];
        $c['side']        = $side;
        $c['opinionOrder']= $c_obj['opinionOrder'];
        $c['order']       = $c_obj['order'];
        $c['content']     = $c_obj['content'];
        $c['createdAt']   = $c_obj['createdAt']->{'sec'};
        $c['postValid']   = $c_obj['postValid'];
        $c['nbLegals']    = $c_obj['nbLegals'];
        $c['images']      = $this->getImages($c_obj);
        $c['updated']     = $this->isUpdated($c_obj);     
        $c['isMasked']    = $this->isMaskedForUser($c_obj['maskersForUserIds']);
        $c['favorite']    = $this->isFavoriteForUser($c_obj['favoritesForUserIds']);
        $c['author']      = $this->getAuthor((string)$c_obj['author']['$id']);
        $c['legal']       = $this->isLiker($c['id'], $side, 'like');
        $c['updateAt']    = isset($c_obj['updateAt']) ? $c_obj['updateAt']->{'sec'} : null;
        return $c;
    }

    public function likeToArray($like) {
        
    }
}
