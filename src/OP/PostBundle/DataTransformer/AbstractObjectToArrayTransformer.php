<?php

namespace OP\PostBundle\DataTransformer;

use OP\UserBundle\Security\UserProvider,
    Doctrine\ODM\MongoDB\DocumentManager,
    OP\MediaBundle\Construct\ImageConstructor,
    OP\UserBundle\Repository\OpinionUserManager,
    OP\SocialBundle\SeveralClass\DateTransformer,
    Symfony\Component\HttpFoundation\RequestStack,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;

/**
 * Description of BaseObjectToArrayTransformer
 *
 * @author CEDRICK
 */
abstract class AbstractObjectToArrayTransformer
{
    /**
     * services convert images object to array 
     * @var type 
     */
    protected $container, $dm, $request, $um, $user_provider,
              $img_construct, $participantProvider, $date_trans;


    public function __construct(Container $container, RequestStack $request, DocumentManager $dm, OpinionUserManager $um, ImageConstructor $img_construct, DateTransformer $date_trans, UserProvider $user_provider) {
        $this->dm               = $dm;
        $this->um               = $um;
        $this->request          = $request->getCurrentRequest();
        $this->container        = $container;
        $this->date_trans       = $date_trans;
        $this->user_provider    = $user_provider;
        $this->img_construct    = $img_construct;
    }
    
    /**
    * @protected Function isUpdate
    * @param $document
    * @return bool
    */
    protected function isUpdated($document) : bool {
        return $document['updateAt'] ?? false;
    }
    
    /**
    * @protected Function getAuthor
    * @param $id
    * @return Array
    */
    protected function getAuthor($id)
    {
        $u  = $this->um->findDefaultUserById($id);

        return [
            'id'        => (String)$u['_id'],
            'username'  => $u['username'],
            'firstname' => $u['firstname'] ?? '',
            'lastname'  => $u['lastname'] ?? '',
            'profile_pic'=> $this->user_provider->getProfilePic($u)
        ];
    }
    
    /**
    * Function getEditors
    * @param array ids
    * @return array
    */
    protected function getEditors($arg, $side)
    {
        $editors = [];
        if(gettype($arg) == 'object') {
            if($side == 'editors') {
                $db_editors =  $arg->getEditors() ?? [];
            } else if($side == 'lefteditors') {
                $db_editors = $arg->getLeftEditors() ?? [];
            } else if($side == 'righteditors') {
                $db_editors = $arg->getRightEditors() ?? [];
            }
        } 
        else {
            if($side == 'editors') {
                $db_editors = $arg['editors'] ?? [];
            } else if($side == 'lefteditors') { 
                $db_editors = $arg['leftEditors'] ?? [];
            } else if($side == 'righteditors') {
                $db_editors = $arg['rightEditors'] ?? [];
            }         
        }
        
        foreach($db_editors as $db_editor){      
            $editors[] = $this->getAuthor(!is_object($db_editor) ? 
                         (string)$db_editor['$id'] : $db_editor->getId());
        }
        return $editors;
    }

    /**
    * @protected Function getVideos
    * @param object || array  $arg
    * @return array
    */
    protected function checkReference($arg){
        if(gettype($arg)== 'object') {
            if($arg->getPost())                 return 'post';
            else if($arg->getPhoto())           return 'photo';
            else if($arg->getLeftComment())     return 'left';
            else if($arg->getRightComment())    return 'right';
        } else {
            if(isset($arg['post']))             return 'post';
            else if(isset($arg['photo']))        return 'photo';
            else if(isset($arg['leftComment']))  return 'left';
            else if(isset($arg['rightComment'])) return 'right';
        }
    }
    
    /**
    * @protected Function getVideos
    * @param object || array  $arg
    * @return array
    */
    protected function getVideos($arg){
        if(gettype($arg)== 'object') {
            $videos_refs = $arg->getVideos() ?? [];
        } else {
            $videos_refs = $arg['videos'] ?? [];
        }
        $ids = [];
        foreach($videos_refs as $video_ref){
            $ids [] = !is_object($video_ref) ?  (string)$video_ref['$id'] : $video_ref->getId();
        }
        $videos = $this->dm->getRepository('OP\MediaBundle\Document\Video')->findCvideos($ids);
        return $this->img_construct->videosToArray($videos);
    }

    protected function getImages($arg){
        if(gettype($arg)== 'object') {
            $ids = $arg->getImagesIds() ?? [];
        } else {
            $ids = $arg['images_ids'] ?? [];
        }

        $images = $this->dm->getRepository('OP\MediaBundle\Document\Image')
                          ->findCphotos($ids);
        return $this->img_construct->imagesToArray($images);
    }
    
    protected function getParticipants($arg)
    {
        if(gettype($arg) == 'object') {
            $db_participants = $arg->getParticipants() ?? []; 
        } else {
            $db_participants = $arg['participants'] ?? [];
        }
        $participants = [];
        foreach($db_participants as $db_participant){      
            $participants[] = $this->getAuthor(!is_object($db_participant) ? 
            (string)$db_participant['$id'] : $db_participant->getId());
        }

        return $participants;
    }

    protected function getPostRate($post_id)
    {
        $userId = $this->getAuthenticatedUser()->getId();
        $repo = $this->dm->getRepository('OP\PostBundle\Document\Rate');
        if($like = $repo->findRate($post_id, $userId)){
            $rating = $like['rate'];
        } else {
            $rating = 0;
        }
        return $rating;
    }

    public function countUnderComments($comment_id)
    {
        $under_repo = $this->dm->getRepository('OPPostBundle:UnderComment');
        $under_repo->countForCommentId($comment_id);
    }
    
    protected function getQuestionsInfo($post_id)
    {
        $question = [];
        $question['private_info'] = $this
            ->privateQuestionInfo($this->getAuthenticatedUser()->getId(), $post_id);
        $question['public_info'] = $this->publicQuestionInfo($post_id);

        return $question;
    }
    
    protected function privateQuestionInfo($user_id, $post_id) {
        return $this->dm->getRepository('OP\MessageBundle\Document\Question')
                    ->countPrivateQuestion($user_id, $post_id);
    }
    
    protected function publicQuestionInfo($post_id) {
        return $this->dm->getRepository('OP\MessageBundle\Document\Question')
                    ->countPublicQuestion($post_id);
    }
    
    protected function isMaskedForUser($users_ids) {
        foreach ($users_ids as $user_id){
            if($user_id === $this->getAuthenticatedUser()->getId()){
                return true;
            }        
        }
        return false;
    }
    
    protected function isFavoriteForUser($users_ids) {
        foreach ($users_ids as $user_id){
            if($user_id === $this->getAuthenticatedUser()->getId()){
                return true;
            }        
        }
        return false;
    }
    
    protected function getGaps($publishedAt_sec) {
        $now = new \Datetime(null, new \DateTimeZone("UTC"));
        return $publishedAt_sec - $now->getTimeStamp();
    }

    protected function getPublishedAt($gaps) {
        $now = new \Datetime(null, new \DateTimeZone("UTC"));
        return $this->date_trans->timestampTransform($now->getTimeStamp() - abs($gaps));
    }

    protected function getPostAllies($arg)
    {
        if(gettype($arg) == 'object') {
            $refs = $arg->getAllies() ?? []; 
        } else {
            $refs = $arg['allies'] ?? [];            
        }
        $posts = [];
        //TODO set Performance
        foreach($refs as $ref){
            $post = $this->dm
                    ->getRepository('OP\PostBundle\Document\Post')
                    ->findSimplePostById(!is_object($ref) ? (string)$ref['$id'] : $ref->getId());
            $posts [] = $this->postToArray($post);
        }
        return $posts;
    }

    /**
     * Gets the current authenticated user
     * @see::OPMEssageBundle participantprovider
     * @return ParticipantInterface
     */
    protected function getAuthenticatedUser()
    {
        return $this->user_provider->getHydratedUser();
    }
}
