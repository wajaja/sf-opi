<?php

namespace OP\MessageBundle\DataTransformer;

use OP\UserBundle\Security\UserProvider,
    JMS\Serializer\SerializationContext,
    Doctrine\ODM\MongoDB\DocumentManager,
    OP\MediaBundle\Construct\ImageConstructor,
    OP\UserBundle\Repository\OpinionUserManager,
    OP\SocialBundle\SeveralClass\DateTransformer,
    Symfony\Component\HttpFoundation\RequestStack,
    OP\MessageBundle\Security\ParticipantProviderInterface,
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

    public function messageToArray($db_m){          
        $mes['id']          = (String)$db_m['_id'];
        $mes['body']        = $db_m['body'];
        $mes['createdAt']   = $db_m['createdAt']->{'sec'};
        $mes['threadId']    = (String)$db_m['thread']['$id'];
        $mes['sender']      = $this->getAuthor((string)$db_m['sender']['$id']);;
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
        return [
            'id'                => $object->getId(),
            'metadata'          => $this->getThreadMetadata($object),
            'lastMessage'       => $this->getThreadLastMessage($object),
            'lastMessageDate'   => $object->getLastMessageDate()->getTimestamp(),
            'isReadByParticipant'=> $object->isReadByParticipant($user),
            'createdAt'         => $object->getCreatedAt()->getTimestamp(),
            'otherParticipants' => $this->getOtherParticipants($object, $user),
        ];
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
            'firstname' => isset($u['firstname']) ? $u['firstname'] : '',
            'lastname'  => isset($u['lastname']) ? $u['lastname'] : '',
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
            $videos_refs = null !== $arg->getVideos() ? $arg->getVideos() : [];
        } else {
            $videos_refs = isset($arg['videos']) ? $arg['videos'] : [];
        }
        $videos = [];
        foreach($videos_refs as $video_ref){
            $video = $this->dm->getRepository('OP\MediaBundle\Document\Video')
                ->findSimpleVideosById(!is_object($video_ref) ?  (string)$video_ref['$id'] : $video_ref->getId());
            $videos [] = $video;
        }
        return $this->img_construct->videoToArray($videos);
    }

    protected function getImages($arg){
        if(gettype($arg) === 'object') {
            $ids = null !== $arg->getImagesIds() ? $arg->getImagesIds() : [];
        } else {
            $ids = isset($arg['images_ids']) ? $arg['images_ids'] : [];
        }

        $images = [];
        $repo =  $this->dm->getRepository('OP\MediaBundle\Document\Image');
        foreach($ids as $id){;
            if(strlen($id) !== 24) {
                $image['id'] = null;
                $image['reason'] = 'some reason';
                $image['webPath'] = $this->img_construct->getRemovedImagePath();
            } else {
                $img = $repo->findPhotoById($id);
                if(!$img){
                    $image['id'] = null;
                    $image['reason'] = 'some reason';
                    $image['webPath'] = $this->img_construct->getRemovedImagePath();
                } else {
                    $image['id'] = (string)$img['_id'];
                    $image['webPath'] = 'http://opinion.com/uploads/'.$img['directory'].'/'.$img['path'];
                }
            }
            $images [] = $image;
        }
        return $images;
    }

    public function getImagesForFirebase($obj){
        $imgs = [];
        $ids  = null !== $obj->getImagesIds() ? $obj->getImagesIds() : [];
        $repo = $this->dm->getRepository('OP\MediaBundle\Document\Image');
        foreach($ids as $id){;
            $data = $repo->findPhotoById($id);
            $img = [
                'id' => (string)$data['_id'],
                'webPath' => 'http://opinion.com/uploads/'.$data['directory'].'/'.$data['path'],
            ];
            $imgs[] = $img;
        }

        return $imgs;
    }

    protected function getParticipants($arg)
    {
        if(gettype($arg) == 'object') {
            $db_participants = null !== $arg->getParticipants() ? $arg->getParticipants(): []; 
        } else {
            $db_participants = isset($arg['participants']) ? $arg['participants']: [];
        }
        $participants = [];
        foreach($db_participants as $db_participant){      
            $participants[] = $this->getAuthor(!is_object($db_participant) ? 
            (string)$db_participant['$id'] : $db_participant->getId());
        }

        return $participants;
    }

    public function getProfilePic($user) {

        $id   = !isset($user['profilePic']) ? null : (String)$user['profilePic']['$id'];
        $mal  = 'http://opinion.com/uploads/gallery/a4a2139157426ca3e2b39af6b374c458.jpeg';
        $fem  = 'http://opinion.com/uploads/gallery/598616f0316b18de6d3a415c7f3c203b.jpeg';

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
