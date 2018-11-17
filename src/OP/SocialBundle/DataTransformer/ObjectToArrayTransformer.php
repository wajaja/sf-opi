<?php

namespace OP\SocialBundle\DataTransformer;

use OP\UserBundle\Security\UserProvider,
    Doctrine\ODM\MongoDB\DocumentManager,
    OP\MediaBundle\Construct\ImageConstructor,
    OP\UserBundle\Repository\OpinionUserManager,
    Symfony\Component\HttpFoundation\RequestStack,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;

/**
 * Description of BaseObjectToArrayTransformer
 *
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


    public function __construct(Container $container, RequestStack $request, DocumentManager $dm, OpinionUserManager $um, ImageConstructor $img_construct, UserProvider $user_provider) {
        $this->dm               = $dm;
        $this->um               = $um;
        $this->request          = $request->getCurrentRequest();
        $this->container        = $container;
        $this->user_provider    = $user_provider;
        $this->img_construct    = $img_construct;
    }


    public function tranformNotofication($o) {
        if($o->getPost()) 
            $data = $this->getPostNotif($o);

        else if($o->getComment()) 
            $data = $this->getCommentNotif($o);

        else if($o->getUnderComment()) 
            $data = $this->getUnderCommentNotif($o);

        else if($o->getLeftComment() || $o->getRightComment()) 
            $data = $this->getSideNotif($o);

        else if($o->getRate()) 
            $data = $this->getRateNotif($o);

        else if($o->getLike()) 
            $data = $this->getLikeNotif($o);
        else $data = [];

        return $data;
    }

    protected function getPostNotif($o) {
        // return [];
        try {
            
            $authorId     = $o->getAuthor()->getId();
            $senderId     = $o->getSender()->getId();
            $metadata     = $o->getMetadataForParticipant($this->getUser());


            if($o->getRefer() === 'post') {
                $url   = "/posts/{$o->getUrl()}?l_ref=notif&p_type=post";
                if($o->getLastActivityType() === 'allieCreated') 
                    $type = 'notification.post.allie.create';
                else
                    $type = 'notification.post.main.create'; //not used right now
            } else {
                $url   = "/posts/{$o->getUrl()}?l_ref=notif&p_type=opinion&o_order={$o->getPost()->getOpinionOrder()}";
                if($o->getLastActivityType() === 'allieCreated')
                    $type = 'notification.opinion.allie.create';
                else
                    $type = 'notification.opinion.main.create';
            }

            $url    = "/posts/{$o->getUrl()}?l_ref=notif&p_type={$o->getRefer()}&o_order={$o->getPost()->getOpinionOrder()}";

            return [
                'url'           => $url,
                'type'          => $type,
                'id'            => $o->getId(),
                'unreadCount'   => $metadata->getNbUnreads(),
                'author'        => $this->getAuthor($authorId),
                'lastUser'      => $this->getAuthor($senderId),
                'isRead'        => $o->isReadByParticipant($this->getUser()),
                'timeAgo'       => $o->getLastParticipantActivityDate()->getTimestamp(),
                'nbAllies'      => $o->getPost()->getNbAllies()
            ];
        }
        //catch any error due to not founded document 
        catch (\Exception $e) {
            return [];
        }
    }

    protected function getSideNotif($o) {

        try {
            
            $userId     = $this->getUser()->getId();
            $authorId   = $o->getAuthor()->getId();
            $senderId   = $o->getSender()->getId();
            $metadata   = $o->getMetadataForParticipant($this->getUser());
            $side       = $o->getLeftComment() ? $o->getLeftComment() : $o->getRightComment();
            
            if($authorId === $userId)
                $type = 'notification.side.to_author';
            else
                $type = 'notification.side.to_user';

            $url    = "/posts/{$o->getUrl()}?l_ref=notif&p_type=opinion&o_order={$side->getOpinionOrder()}&s_name={$side->getSideName()}";

            return [
                'type'          => $type,
                'id'            => $o->getId(),
                'url'           => $url,
                'href'          => $side->getId(),
                'sidename'      => $side->getSideName(),
                'title'         => $side->getOpinionTitle(),
                'postOrder'     => $side->getOpinionOrder(),
                'unreadCount'   => $metadata->getNbUnreads(),
                'author'        => $this->getAuthor($authorId),
                'lastUser'      => $this->getAuthor($senderId),
                'lastSider'     => $this->getAuthor($senderId),
                'isRead'        => $o->isReadByParticipant($this->getUser()),
                'timeAgo'          => $o->getLastParticipantActivityDate()->getTimestamp()
            ];
        } catch (\Exception $e) {
            return [];
        }
    }

    protected function getCommentNotif($o) {

        try {
            $comment     = $o->getComment();
            $userId      = $this->getUser()->getId();
            $authorId    = $o->getAuthor()->getId();
            $senderId    = $o->getSender()->getId();
            $metadata    = $o->getMetadataForParticipant($this->getUser());
            $left        = $o->getLeftComment();
            $right       = $o->getRightComment();
            $postOrder   = 0;
            $sidename    = '';
            $title       = '';

            if($comment->getLeftComment() || $comment->getRightComment()) {
                if($left) {
                    $postOrder  = $left->getOpinionOrder();
                    $sidename   = $left->getSideName();
                    $title      = $left->getOpinionTitle();
                } else {
                    $postOrder  = $right->getOpinionOrder();
                    $sidename   = $right->getSideName();
                    $title      = $right->getOpinionTitle();
                }

                if($authorId === $userId)
                    $type = 'notification.side.comment.to_author';
                else if($senderId === $userId)
                    $type = 'notification.side.comment.from_author';
                else 
                    $type = 'notification.side.comment.to_user';

                $url    = "/posts/{$o->getUrl()}?l_ref=notif&p_type=opinion&o_order={$postOrder}&s_name={$sidename}&c_id={$comment->getId()}";

            } else if ($comment->getPhoto()) { 
                if($authorId === $userId)
                    $type = 'notification.photo.comment.to_author';
                else if($senderId === $userId) 
                    $type = 'notification.photo.comment.from_author';
                else
                    $type = 'notification.photo.comment.to_user';

                $url  = "/pictures/{$o->getUrl()}?l_ref=notif&c_id={$comment->getId()}";
            } else {
                if($authorId === $userId)
                    $type = 'notification.post.comment.to_author';
                else if($senderId === $userId) 
                    $type = 'notification.post.comment.from_author';
                else
                    $type = 'notification.post.comment.to_user';

                $url    = "/posts/{$o->getUrl()}?l_ref=notif&p_type=post&c_id={$comment->getId()}";
            }

            return [
                'type'           => $type,
                'title'          => $title,
                'sidename'       => $sidename,
                'postOrder'      => $postOrder,
                'id'             => $o->getId(),
                'url'            => $url,
                'href'           => $comment->getId(),
                'unreadCount'    => $metadata->getNbUnreads(),
                'author'         => $this->getAuthor($authorId),
                'lastUser'       => $this->getAuthor($senderId), //TODO serializer
                'lastSider'      => $this->getAuthor($senderId),
                'isRead'         => $o->isReadByParticipant($this->getUser()),
                'timeAgo'           => $o->getLastParticipantActivityDate()->getTimestamp()
            ];
        } catch (\Exception $e) {
            return [];
        }
    }

    protected function getUnderCommentNotif($o) {

        try {
            
            $reply    = $o->getUnderComment();
            $comment  = $reply->getComment();
            $userId     = $this->getUser()->getId();
            $authorId   = $o->getAuthor()->getId();
            $senderId   = $o->getSender()->getId();
            $metadata   = $o->getMetadataForParticipant($this->getUser());

            if($post = $comment->getPost()) {
                $url = "/posts/{$post->getId()}?l_ref=notif&p_type=post&c_id={$comment->getId()}&u_id={$reply->getId()}";
            } 
            else if($photo = $comment->getPost()) {
                $url = "/pictures/{$photo->getId()}?l_ref=notif&c_id={$comment->getId()}&u_id={$reply->getId()}";
            } else {
                $url = '/';
            }

            if($authorId === $userId)
                $type = 'notification.reply.to_author';
            else if($senderId === $userId) 
                $type = 'notification.reply.from_author';
            else
                $type = 'notification.reply.to_user';
            
            return [
                'type'      => $type,
                'id'        => $o->getId(),
                'url'       => $url,
                'href'      => $reply->getId(),
                'author'    => $this->getAuthor($authorId),
                'lastUser'  => $this->getAuthor($senderId),
                'unreadCount' => $metadata->getNbUnreads(),
                'isRead'    => $o->isReadByParticipant($this->getUser()),
                'timeAgo'      => $o->getLastParticipantActivityDate()->getTimestamp()
            ];
        } catch (\Exception $e) {
            return [];
        }
    }


    protected function getRateNotif($o) {

        try {
            
            $userId      = $this->getUser()->getId();
            $rate        = $o->getRate();
            $authorId    = $o->getAuthor()->getId();
            $senderId    = $o->getSender()->getId();
            $metadata    = $o->getMetadataForParticipant($this->getUser());

            if($authorId === $userId)
                $type = 'notification.rate.to_author';
            else if($senderId === $userId) 
                $type = 'notification.rate.from_author';
            else
                $type = 'notification.rate.to_user';

            if($post = $rate->getPost()) {
                $url = "/posts/{$post->getId()}?l_ref=notif&p_type=opinion";
            } 
            else if($right = $rate->getRightcomment()) {
                $url = "/posts/{$right->getPost()->getId()}?l_ref=notif&p_type=opinion&o_order={$right->getOpinionOrder()}&s_name={$right->getSideName()}";
            }
            else if($left = $rate->getLeftcomment()) {
                $url = "/posts/{$left->getPost()->getId()}?l_ref=notif&p_type=opinion&o_order={$left->getOpinionOrder()}&s_name={$left->getSideName()}";
            }
            else if($photo = $rate->getPhoto()) {
                $url = "/pictures/{$photo->getId()}?l_ref=notif";
            } else {
                $url = '/';
            }

            return [
                'type'     => $type,
                'id'       => $o->getId(),
                'url'      => $url,
                'author'   => $this->getAuthor($authorId),
                'lastUser' => $this->getAuthor($senderId),
                'unreadCount' => $metadata->getNbUnreads(),
                'isRead'   => $o->isReadByParticipant($this->getUser()),
                'timeAgo'     => $o->getLastParticipantActivityDate()->getTimestamp()
            ];
        } catch (\Exception $e) {
            return [];
        }
    }

    protected function getLikeNotif($o) {
        // return [];
        try {
            
            $like      = $o->getLike();
            $userId    = $this->getUser()->getId();
            $authorId  = $o->getAuthor()->getId();
            $senderId  = $o->getSender()->getId();
            $metadata  = $o->getMetadataForParticipant($this->getUser());

            if($like->getLeftComment() || $like->getRightComment()) {
                if($authorId === $userId)
                    $type = 'notification.legal.to_author';
                else if($senderId === $userId) 
                    $type = 'notification.legal.from_author';
                else
                    $type = 'notification.legal.to_user';
            } else { 
                if($authorId === $userId)
                    $type = 'notification.like.to_author';
                else if($senderId === $userId) 
                    $type = 'notification.like.from_author';
                else
                    $type = 'notification.like.to_user';
            }

            $url = $this->getLikeUrl($like);

            return [
                'type'      => $type,
                'id'        => $o->getId(),
                'url'       => $url,
                'author'    => $this->getAuthor($authorId),
                'lastUser'  => $this->getAuthor($senderId),
                'unreadCount' => $metadata->getNbUnreads(),
                'lastSider'   => $this->getAuthor($senderId),
                'isRead'      => $o->isReadByParticipant($this->getUser()),
                'timeAgo'        => $o->getLastParticipantActivityDate()->getTimestamp()
            ];
        } catch (\Exception $e) {
            return [];
        }
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
            'profile_pic'=> $this->user_provider->getProfilePic(
                !isset($u['profilePic']) ?: (String)$u['profilePic']['$id']
            )
        ];
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

    protected function getImages($arg) : array {
        if(gettype($arg)== 'object') {
            $images_refs = $arg->getImages() ?? [];
        } else {
            $images_refs = $arg['images'] ?? [];
        }
        
        $ids = [];
        foreach($images_refs as $id){
            $ids[] = $id;
        }
        $images = $this->dm->getRepository('OP\MediaBundle\Document\Image')->findCphotos($ids);        
        return $this->img_construct->imagesToArray($images);
    }

    protected function getLikeUrl($like) {

        if($post = $like->getPost()) {
            $url = "/posts/{$post->getId()}?l_ref=notif&p_type={$post->getType()}";
        } 
        else if($right = $like->getRightComment()) {
            $url = "/posts/{$right->getPost()->getId()}?l_ref=notif&p_type=opinion&o_order={$right->getOpinionOrder()}&s_name={$right->getSideName()}";
        }
        else if($left = $like->getLeftComment()) {
            $url = "/posts/{$left->getPost()->getId()}?l_ref=notif&p_type=opinion&o_order={$left->getOpinionOrder()}&s_name={$left->getSideName()}";
        }
        else if($comment = $like->getComment()) {
            if($post = $comment->getPost()) {
                if($post->getType() === 'post')
                    $url = "/posts/{$post->getId()}?l_ref=notif&p_type=post";
                else 
                    $url = "/posts/{$post->getId()}?l_ref=notif&p_type=opinion&o_order={$post->getOpinionOrder()}";
            }

            else if ($photo = $comment->getPhoto()) {
                $url = "/pictures/{$photo->getId()}?l_ref=notifI&c_id={$comment->getId()}";
            }
            else if($right = $like->getRightComment()) {
                $url = "/posts/{$right->getPost()->getId()}?l_ref=notif&p_type=opinion&o_order={$right->getOpinionOrder()}&s_name={$right->getSideName()}";
            }            
            else if($left = $like->getLeftComment()) {
                $url = "/posts/{$left->getPost()->getId()}?l_ref=notif&p_type=opinion&o_order={$left->getOpinionOrder()}&s_name={$left->getSideName()}";
            }
        }
        else if($photo = $like->getPhoto()) {
            $url = "/pictures/{$photo->getId()}?l_ref=notif";
        } else {
            $url = '/';
        }

        return $url;
    }

    /**
     * Gets the current authenticated user
     * @see::OPMEssageBundle participantprovider
     * @return ParticipantInterface
     */
    protected function getUser()
    {
        return $this->user_provider->getHydratedUser();
    }
}
