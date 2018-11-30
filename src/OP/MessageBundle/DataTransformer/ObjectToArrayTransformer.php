<?php

namespace OP\MessageBundle\DataTransformer;

use OP\UserBundle\Security\UserProvider,
    JMS\Serializer\SerializationContext,
    Doctrine\ODM\MongoDB\DocumentManager,
    OP\MediaBundle\Construct\ImageConstructor,
    OP\UserBundle\Repository\OpinionUserManager,
    Symfony\Component\HttpFoundation\RequestStack,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;

/**
 * Description of ObjectToArrayTranformer
 * @author CEDRICK
 */
class ObjectToArrayTransformer 
{
        /**
     * services convert images object to array 
     * @var type 
     */
    protected $container, $dm, $request, $um, $user_provider,
              $img_construct, $participantProvider, $fileBaseUrl;


    public function __construct(Container $container, RequestStack $request, DocumentManager $dm, OpinionUserManager $um, ImageConstructor $img_construct, $fileBaseUrl, UserProvider $user_provider) {
        $this->dm               = $dm;
        $this->um               = $um;
        $this->request          = $request->getCurrentRequest();
        $this->container        = $container;
        $this->user_provider    = $user_provider;
        $this->img_construct    = $img_construct;
        $this->fileBaseUrl     = $fileBaseUrl;
    }

    public function messageToArray($db_m){          
        $mes['id']          = (String)$db_m['_id'];
        $mes['body']        = $db_m['body'];
        $mes['createdAt']   = $db_m['createdAt']->{'sec'};
        $mes['threadId']    = (String)$db_m['thread']['$id'];
        $mes['sender']      = $this->getAuthor((string)$db_m['sender']['$id']);
        $mes['images']      = $this->getImages($db_m);

        return $mes;
    }

    public function messageObjectToArray($db_m){         
        $mes['id']          = $db_m->getId();
        $mes['createdAt']   = $db_m->getCreatedAt()->getTimestamp();
        $mes['body']        = $db_m->getBody();
        $mes['threadId']    = $db_m->getThread()->getId();
        $mes['sender']      = $this->getAuthor($db_m->getSender()->getId());
        $mes['images']      = $this->getImages($db_m);

        return $mes;
    }

    public function responseToArray($db_r){          
        $res['id']          = (String)$db_r['_id'];
        $res['content']     = $db_r['content'];
        $res['questionId']  = $db_r['documentValid'];
        $res['createdAt']   = $db_r['createdAt']->{'sec'};
        $res['images']      = $this->getImages($db_r);
        $res['author']      = $this->getAuthor((string)$db_r['author']['$id']);

        return $res;
    }

    public function responseObjectToArray($db_r){         
        $res['id']          = $db_r->getId();
        $res['createdAt']   = $db_r->getCreatedAt()->getTimestamp();
        $res['content']     = $db_r->getContent();
        $res['questionId']  = $db_r->getDocumentValid();
        $res['images']      = $this->getImages($db_r);
        $res['author']      = $this->getAuthor($db_r->getAuthor()->getId());

        return $res;
    }

    public function questionToArray($quest) {
        $q['id']            = (string)$quest['_id'];
         $q['refer']        = isset($quest['photo']) ? 'photo' : 'post';
        $q['postId']        = isset($quest['photo']) ? (string)$quest['photo']['$id']
                                                     : (string)$quest['post']['$id'];
        $q['participants']  = $this->getParticipants($quest);
        $q['createdBy']     = $this->getAuthor((string)$quest['createdBy']['$id']);

        return $q;
    }

    public function threadToArray($thread) {
        $t['id']            = (string)$thread['_id'];
        $t['participants']  = $this->getParticipants($thread);          
        $t['createdBy']     = $this->getAuthor((string)$thread['createdBy']['$id']);

        return $t;
    }

    public function threadObjectToArray($object) {
        $user   = $this->getAuthenticatedUser();
        $th = [];

        try {
            $th = [
                'id'                => $object->getId(),
                'metadata'          => $this->getThreadMetadata($object),
                'lastMessage'       => $this->getThreadLastMessage($object),
                'lastMessageDate'   => $object->getLastMessageDate()->getTimestamp(),
                'isReadByParticipant'=> $object->isReadByParticipant($user),
                'createdAt'         => $object->getCreatedAt()->getTimestamp(),
                'otherParticipants' => $this->getOtherParticipants($object, $user),
            ];
        } catch (Exception $e) {
            
        }
        return $th;
    }

    protected function getThreadMetadata($thread) {
        $data       = [];
        $serializer = $this->container->get('jms_serializer');
        foreach ($thread->getMetadata() as $m) {
            $data[] = [
                'id' => $m->getId(),
                'isDeleted' => $m->getIsDeleted(),
                // 'lastMessageDate' => $m->getLastMessageDate()->getTimestamp(),
                'participant' => $this->serializeUser($m->getParticipant())
            ];
        }
        return $data;
    }

    protected function getMessageMetadata($message) {
        $data       = [];
        $serializer = $this->container->get('jms_serializer');
        foreach ($message->getMetadata() as $m) {
            $data[] = [
                'id' => $m->getId(),
                'isRead' => $m->getIsRead(),
                'isReadAt' => $m->getIsReadAt()->getTimestamp(),
                'participant' => $this->serializeUser($m->getParticipant())
            ];
        }
        return $data;
    }

    protected function serializeUser($user) {

        $serializer = $this->container->get('jms_serializer');
        $context    = new SerializationContext();
        $groups     = array('Detail');
        $context->setSerializeNull(true);
        $context->setGroups($groups);
        return  $serializer->toArray($user, $context);
    }

    protected function getOtherParticipants($thread, $user) {
        $data       = [];
        $serializer = $this->container->get('jms_serializer');
        foreach ($thread->getOtherParticipants($user) as $u) {
            $context    = new SerializationContext();
            $groups     = array('Detail');
            $context->setSerializeNull(true);
            $context->setGroups($groups);
            $data[] = $serializer->toArray($u, $context);
        }
        return $data;
    }

    protected function getThreadLastMessage($thread) {
        $message = $thread->getLastMessage();

        return $this->messageObjectToArray($message);
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
    * @protected Function getVideos
    * @param object || array  $arg
    * @return array
    */
    protected function getVideos($arg) : array {
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
    
    /**
     * Function getImages
     * @param type $arg
     * @return array
     */
    protected function getImages($arg) : array {
        if(gettype($arg) === 'object') {
            $ids = $arg->getImagesIds() ?? [];
        } else {
            $ids = $arg['images_ids'] ?? [];
        }
        
        $imgs = $this->dm
                     ->getRepository('OP\MediaBundle\Document\Image')
                     ->findcPhotos($ids);
        
        return $this->img_construct
                    ->imagesToArray($imgs);
    }

    public function getImagesForFirebase($obj){
        $ids  = $obj->getImagesIds() ?? [];
        $imgs = $this->dm
                     ->getRepository('OP\MediaBundle\Document\Image')
                     ->findcPhotos($ids);
        
        return $this->img_construct
                    ->imagesToArray($imgs);
    }

    protected function getParticipants($arg)
    {
        if(gettype($arg) == 'object') {
            $db_participants = $arg->getParticipants() ?? []; 
        } else {
            $db_participants = $arg['participants'] ?? [];
        }
        
        $participants = $ids = [];
        foreach($db_participants as $db_p){
            $ids[] = !is_object($db_p) ? (string)$db_p['$id'] : $db_p->getId();
        }
        
        $users = $this->um->findCUsersById($ids);
        foreach($users as $u){
            $participants[] = [
                'id'        => (String)$u['_id'],
                'username'  => $u['username'],
                'firstname' => $u['firstname'] ?? '',
                'lastname'  => $u['lastname'] ?? '',
                'profile_pic'=> $this->getProfilePic($u)
            ];
        }
        return $participants;
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
