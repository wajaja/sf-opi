<?php

namespace OP\MediaBundle\DataTransformer;

use OP\UserBundle\Security\UserProvider,
    Doctrine\ODM\MongoDB\DocumentManager,
    JMS\Serializer\SerializerInterface,
    OP\UserBundle\Repository\OpinionUserManager,
    Symfony\Component\HttpFoundation\RequestStack,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;

/**
 * Description of BaseObjectToArrayTransformer
 *
 * @author CEDRICK
 */
class ToArrayTransformer
{
    /**
     * services convert images object to array 
     * @var type 
     */
    protected $container, $dm, $request, $um, $user_provider,
              $participantProvider, $fileBaseUrl, $serializer;


    public function __construct(Container $container, RequestStack $request, DocumentManager $dm, OpinionUserManager $um, UserProvider $user_provider, $fileBaseUrl, SerializerInterface $serializer) {
        $this->dm               = $dm;
        $this->um               = $um;
        $this->request          = $request->getCurrentRequest();
        $this->container        = $container;
        $this->user_provider    = $user_provider;
        $this->fileBaseUrl     = $fileBaseUrl;
        $this->serializer      = $serializer;
    }

    public function photoToArray($ph, $post)
    {

        $ph_id = (string)$ph['_id'];
        $user  = $this->getAuthenticatedUser();
        $authorId = (string)$ph['author']['$id'];

        return [
            'id'        => $ph_id,
            'refer'     => 'photo',
            'path'      => $ph['path'],
            'dir'       => $ph['directory'],
            'content'   => $post ? $post['content'] : null,
            'imagesIds' => $post ? $post['images_ids'] : null,
            'postValid' => $post ? (string)$post['_id'] : null,
            'updated'   => $this->isUpdated($ph),
            'createdAt' => $ph['createdAt']->{'sec'},
            'author'    => $this->getAuthor($authorId),
            'hasSecret' => $this->hasSecret($user, $ph),
            'everywhere'=> $this->getUserEver($user, $ph_id),
            'liked'     => $this->isLiker($user, $ph_id, 'photo', 'like'),
            'nbLikers'  => $ph['nbLikers'] ?? 0,
            'webPath'   => $this->fileBaseUrl . '/uploads/'.$ph['directory'].'/'.$ph['path'],
            'nbComments'=> $ph['nbComments'] ?? 0,
            'updateAt'  => $ph['updateAt']->{'sec'} ?? null,
            'nbQuestioners' => $ph['nbQuestioners'] ?? 0
        ];
    }

    private function getUserEver($user, $ph_id) {
        $repo = $this->dm->getRepository('OP\MediaBundle\Document\EveryWhere');
        $ever = $repo->findOneBy(array('createdBy'=>$user, 'photoId' => $ph_id));

        if($ever) {
            return $this->serializer->toArray($ever);
        }
        return false;
    }

    public function photoLikeData($ph)
    {
        return [
            'id' => $ph->getId(),
            'refer' => 'picture',
            'nbLikers' => $ph->getNbLikers(),
            'liked' => $ph->is_liker($this->getAuthenticatedUser()->getId())
        ];
    }  

    public function commentToArray($ph)
    {
        $user = $this->getAuthenticatedUser();
        $authorId = (string)$ph['author']['$id'];

        return [
            'id'          => (string)$ph['_id'],
            'content'     => $ph['content'],
            'createdAt'   => $ph['createdAt']->{'sec'},
            'postValid'   => $ph['postValid'],
            'nbUnders'    => $ph['nbUnders'] ?? 0,
            'nbLikers'    => $ph['nbLikers'],
            'total_rate'  => $ph['total_rate'],
            'images'      => $this->getImages($ph),
            'updated'     => $this->isUpdated($ph),
            'isMasked'    => $this->isMaskedForUser($ph['maskersForUserIds']),
            'favorite'    => $this->isFavoriteForUser($ph['favoritesForUserIds']),
            'author'      => $this->getAuthor((string)$ph['author']['$id']),
            'liked'       => $this->isLiker((string)$ph['_id'], 'comment', 'like'),
            'unders'      => $this->countUnderComments((string)$ph['_id']),
            'post'        => (string)$ph['post']['$id'],
            'updateAt'    => $ph['updateAt']->{'sec'} ?? null
        ];
    }    
    
    /**
    * @protected Function isUpdate
    * @param $document
    * @return bool
    */
    protected function isUpdated($document)
    {
        if(!isset($document['updateAt'])) {
            return false;
        }
        return true;
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
            'profile_pic'=> $this->getProfilePic($u)
        ];
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
        $videos = [];
        foreach($videos_refs as $video_ref){
            $video = $this->dm->getRepository('OP\MediaBundle\Document\Video')
                ->findSimpleVideosById(!is_object($video_ref) ?  (string)$video_ref['$id'] : $video_ref->getId());
            $videos [] = $video;
        }
        return $this->img_construct->videosToArray($videos);
    }

    protected function getImages($arg){
        if(gettype($arg)== 'object') {
            $images_refs = null !== $arg->getImages() ? $arg->getImages() : [];
        } else {
            $images_refs = isset($arg['images']) ? $arg['images'] : [];
        }

        $images = [];
        foreach($images_refs as $image_ref){;
            $image = $this->dm->getRepository('OP\MediaBundle\Document\Image')
                ->findSimplePictureById(!is_object($image_ref) ? 
                (string)$image_ref['$id'] : $image_ref->getId());
            $images [] = $image;
        }
        return $this->img_construct->imagesToArray($images);
    }
    
    public function getProfilePic($user) {

        $id   = !isset($user['profilePic']) ? null : (String)$user['profilePic']['$id'];
        $mal  = $this->fileBaseUrl . '/uploads/gallery/a4a2139157426ca3e2b39af6b374c458.jpeg';
        $fem  = $this->fileBaseUrl . '/uploads/gallery/598616f0316b18de6d3a415c7f3c203b.jpeg';

        if(!$id || gettype($id) !== 'string') 
            return $user['gender'] === 'Male' ? $mal : $fem;

        $p      = $this ->dm
                        ->getRepository('OP\MediaBundle\Document\Image')
                        ->findOneBy(array('id' => $id));

        return $p->getWebPath();
    }
    
    protected function getUploadRootDir()
    {
        return __DIR__.'/../../../../web/uploads/';
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

    public function isLiker($user, $docId, $type, $likeType)
    {
        $userId = $user->getId();
        $repo   = $this->dm->getRepository('OP\PostBundle\Document\Like');

        if($type == 'photo') return $repo->findPhotoLiker($docId, $userId) ? true : false;
        if($type == 'video') return $repo->findVideoLiker($docId, $userId) ? true : false;
    }
    
    protected function isFavoriteForUser($users_ids) {
        foreach ($users_ids as $user_id){
            if($user_id === $this->getAuthenticatedUser()->getId()){
                return true;
            }        
        }
        return false;
    }

    public function hasSecret($user, $ph)
    {
        $userId = $user->getId();
        $questioners_ids = $ph['questioners_ids'] ?? [];
        foreach ($questioners_ids as $questioner_id){
            if($questioner_id === $userId){
                return true;
            }
        }
        return false;
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
