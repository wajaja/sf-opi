<?php

namespace OP\SocialBundle\ModelManager;

use OP\SocialBundle\Document\Notification;

/**
 * Description of NotificationManager
 *
 * @author CEDRICK
 */
class NotificationManager
{

    /**
     * create an notification for all users have subscribed to this one
     * @param Post $post
     * @return type
     */
    public function postNotif(\OP\PostBundle\Document\Post $post){
        $date  = new \DateTime(null, new \DateTimeZone("UTC"));
        $notification = $this->notification->setPost($post)
                                        ->setUrl($post->getId())
                                        ->setRefer('post')
                                        ->setAuthor($post->getAuthor())
                                        ->setSender($post->getAuthor());
        $this->doEnsureNotificationMetadataExists($notification);
        $notification->denormalize();

        //persist notification
        $this->dm->persist($notification);
        // $this->stream->notify($notification, 'post');
        $this->dm->flush();
        return $notification;
    }

    /**
     * create notification for users have shared same post
     * @param Pshare $pshare
     * @return type
     */
    public function shareNotif(\OP\PostBundle\Document\Share $share, $refer){
        //if not comment_notification exist
        if($refer === 'photo') {
            $post = $share->getPhoto();
        } else {
            $post = $share->getPost();
        }
        if(!$post->getShareNotification()){
            $notification = $this->notification->setShare($share)
                                        ->setUrl($post->getId())
                                        ->setRefer($refer)
                                        ->setAuthor($post->getAuthor())
                                        ->setSender($share->getAuthor());
            $this->doEnsureNotificationMetadataExists($notification);
            $notification->denormalize();

            //persist notification
            $this->dm->persist($notification);
            $this->dm->flush();
        }else{
            $notification = $post->getShareNotification()
                                 ->setSender($share->getAuthor());
            $this->doEnsureNotificationMetadataExists($notification);

            $notification->doEnsureUnreadForOthersParticipant($share->getAuthor());
            $notification->denormalize();
            $this->dm->flush($notification);
        }

        // $this->stream->notify($notification 'share');
        return $notification;
    }

    /**
     * create notification for comment document for same post have been created
     * @param Comment $comment
     * @return type
     */
    public function leftNotif(\OP\PostBundle\Document\LeftComment $comment){
        $post = $comment->getPost();
        $date  = new \DateTime(null, new \DateTimeZone("UTC"));
        if(!$post->getLeftNotification()){
            $notification = $this->notification->setLeftComment($comment)
                                        ->setUrl($post->getId())
                                        ->setRefer('post')
                                        ->setAuthor($post->getAuthor())
                                        ->setSender($comment->getAuthor());
            $this->doEnsureNotificationMetadataExists($notification);

            $notification->denormalize();

            //persist notification
            $this->dm->persist($notification);
            $post->setLeftNotification($notification);

            $this->dm->flush();
        }else{
            $notification = $post->getLeftNotification()
                                 ->setLastParticipantActivityDate($date)
                                 ->setSender($comment->getAuthor());
            $this->doEnsureNotificationMetadataExists($notification);

            $notification->doEnsureUnreadForOthersParticipant($comment->getAuthor());
            // $notification->setTs($date->getTimestamp());
            $notification->denormalize();
            $this->dm->flush($notification);
        }
        // $this->stream->notify($notification, 'leftcomment');
        return $notification;
    }

    /**
     * create notification for comment document for same post have been created
     * @param Comment $comment
     * @return type
     */
    public function rightNotif(\OP\PostBundle\Document\RightComment $comment){
        $post = $comment->getPost();
        $date  = new \DateTime(null, new \DateTimeZone("UTC"));
        if(!$post->getRightNotification()){
            $notification = $this->notification->setRightComment($comment)
                                        ->setUrl($post->getId())
                                        ->setRefer('post')
                                        ->setAuthor($post->getAuthor())
                                        ->setSender($comment->getAuthor());
            $this->doEnsureNotificationMetadataExists($notification);

            $notification->denormalize();

            //persist notification
            $this->dm->persist($notification);
            $post->setLeftNotification($notification);

            $this->dm->flush();
        }else{
            $notification = $post->getRightNotification()
                                 ->setLastParticipantActivityDate($date)
                                 ->setSender($comment->getAuthor());
            $this->doEnsureNotificationMetadataExists($notification);

            $notification->doEnsureUnreadForOthersParticipant($comment->getAuthor());
            // $notification->setTs($date->getTimestamp());
            $notification->denormalize();
            $this->dm->flush($notification);
        }
        // $this->stream->notify($notification, 'rightcomment');
        return $notification;
    }

    /**
     * create notification for comment document for same post have been created
     * @param Comment $comment
     * @return type
     */
    public function commentNotif(\OP\PostBundle\Document\Comment $comment, $refer){
        //if not comment_notification exist
        if($refer === 'photo') {
            $post = $comment->getPhoto();
        } else if($refer === 'leftcomment') {
            $post = $comment->getLeftComment();
        } else if($refer === 'rightcomment') {
            $post = $comment->getRightComment();
        } else {
            $post = $comment->getPost();
        }

        $date  = new \DateTime(null, new \DateTimeZone("UTC"));
        if(!$post->getCommentNotification()){
            $notification = $this->notification->setComment($comment)
                                        ->setUrl($post->getId())
                                        ->setRefer($refer)
                                        ->setAuthor($post->getAuthor())
                                        ->setSender($comment->getAuthor());
            $this->doEnsureNotificationMetadataExists($notification);

            $notification->denormalize();

            //persist notification
            $this->dm->persist($notification);
            $post->setCommentNotification($notification);

            $this->dm->flush();
        }else{
            $notification = $post->getCommentNotification()
                                 ->setLastParticipantActivityDate($date)
                                 ->setSender($comment->getAuthor());
            $this->doEnsureNotificationMetadataExists($notification);

            $notification->doEnsureUnreadForOthersParticipant($comment->getAuthor());
            // $notification->setTs($date->getTimestamp());
            $notification->denormalize();
            $this->dm->flush($notification);
        }
        // $this->stream->notify($notification, 'comment');
        return $notification;
    }

    /**
     * ccreate or update if exist same plike notification
     * @param Plike $plike
     * @return type
     */
    public function likeNotif(\OP\PostBundle\Document\Like $like, $refer){
        //if not comment_notification exist
        if($refer === 'photo') {
            $post = $like->getPhoto();
        } 
        else if($refer === 'comment') {
            $post = $like->getComment();
        }
        else if($refer === 'undercomment') {
            $post = $like->getUnderComment();
        }
        else {
            $post = $like->getPost();
        }

        //if not comment_notification exist
        $date  = new \DateTime(null, new \DateTimeZone("UTC"));
        if($post !== null) {
            if(!$post->getLikeNotification()){
                $notification = $this->notification->setLike($like)
                                            ->setUrl($post->getId())
                                            ->setRefer($refer)
                                            ->setAuthor($post->getAuthor())
                                            ->setSender($like->getAuthor());
                $this->doEnsureNotificationMetadataExists($notification);
                $notification->denormalize();

                //persist notification
                $this->dm->persist($notification);
                $post->setLikeNotification($notification);
                $this->dm->flush();
            }else{
                $notification = $post->getLikeNotification()
                                     ->setLastParticipantActivityDate($date)
                                     ->setSender($like->getAuthor());
                $this->doEnsureNotificationMetadataExists($notification);

                $notification->doEnsureUnreadForOthersParticipant($like->getAuthor());
                // $notification->setTs($date->getTimestamp());
                $notification->denormalize();
                $this->dm->flush($notification);
            }
            // $this->stream->notify($notification, 'like');
            return $notification;
        }        
    }

    /**
     * ccreate or update if exist same plike notification
     * @param Plike $plike
     * @return type
     */
    public function prateNotif(\OP\PostBundle\Document\Rate $rate){
        //if not notification exist
        $date  = new \DateTime(null, new \DateTimeZone("UTC"));
        if(!$rate->getPost()->getRateNotification()){
            $notification = $this
                                ->notification->setRate($rate)
                                ->setSender($rate->getAuthor())
                                ->setUrl($rate->getPost()->getId())
                                ->setAuthor($rate->getPost()->getAuthor());
            $this->doEnsureNotificationMetadataExists($notification);
            $notification->denormalize();

            //persist notification
            $this->dm->persist($notification);
            $rate->getPost()->setRateNotification($notification);
            $this->dm->flush();
        }else{
            $notification = $rate
                                ->getPost()->getRateNotification()
                                ->setSender($rate->getAuthor())
                                ->setLastParticipantActivityDate($date);
            $this->doEnsureNotificationMetadataExists($notification);

            $notification->doEnsureUnreadForOthersParticipant($rate->getAuthor());
            // $notification->setTs($date->getTimestamp());
            $notification->denormalize();
            $this->dm->flush($notification);
        }
        // $this->stream->notify($notification, 'rate');
        return $notification;
    }

    /**
     * ccreate or update if exist same plike notification
     * @param Plike $plike
     * @return type
     */
    public function lrateNotif(\OP\PostBundle\Document\Rate $rate){
        //if not comment_notification exist
        $date  = new \DateTime(null, new \DateTimeZone("UTC"));
        if(!$rate->getLeftcomment()->getRateNotification()){
            $notification = $this
                                ->notification->setRate($rate)
                                ->setUrl($rate->getLeftcomment()->getId())
                                ->setAuthor($rate->getLeftcomment()->getAuthor())
                                ->setSender($rate->getAuthor());
            $this->doEnsureNotificationMetadataExists($notification);
            $notification->denormalize();

            //persist notification
            $this->dm->persist($notification);
            $rate->getLeftcomment()->setRateNotification($notification);
            $this->dm->flush();
        }else{
            $notification = $rate
                                ->getLeftcomment()->getRateNotification()
                                ->setLastParticipantActivityDate($date)
                                ->setSender($rate->getAuthor());
            $this->doEnsureNotificationMetadataExists($notification);

            $notification->doEnsureUnreadForOthersParticipant($rate->getAuthor());
            // $notification->setTs($date->getTimestamp());
            $notification->denormalize();
            $this->dm->flush($notification);
        }
        // $this->stream->notify($notification, 'rate');
        return $notification;
    }

    /**
     * ccreate or update if exist same plike notification
     * @param Plike $plike
     * @return type
     */
    public function rrateNotif(\OP\PostBundle\Document\Rate $rate){
        //if not comment_notification exist
        $date  = new \DateTime(null, new \DateTimeZone("UTC"));
        if(!$rate->getRightcomment()->getRateNotification()){
            $notification = $this
                                ->notification->setRate($rate)
                                ->setUrl($rate->getRightcomment()->getId())
                                ->setAuthor($rate->getRightcomment()->getAuthor())
                                ->setSender($rate->getAuthor());
            $this->doEnsureNotificationMetadataExists($notification);
            $notification->denormalize();

            //persist notification
            $this->dm->persist($notification);
            $rate->getRightcomment()->setRateNotification($notification);
            $this->dm->flush();
        }else{
            $notification = $rate
                                ->getRightcomment()->getRateNotification()
                                ->setLastParticipantActivityDate($date)
                                ->setSender($rate->getAuthor());
            $this->doEnsureNotificationMetadataExists($notification);

            $notification->doEnsureUnreadForOthersParticipant($rate->getAuthor());
            // $notification->setTs($date->getTimestamp());
            $notification->denormalize();
            $this->dm->flush($notification);
        }
        // $this->stream->notify($notification, 'rate');
        return $notification;
    }

    /**
     * create clike notification
     * @param Clike $clike
     * @return type
     */
    public function clikeNotif(\OP\PostBundle\Document\Like $clike){
        //if not comment_notification exist
        $date  = new \DateTime(null, new \DateTimeZone("UTC"));
        if(!$clike->getComment()->getClikeNotification()){
            $notification = $this->notification->setClike($clike)
                                        ->setUrl($clike->getComment()->getId())
                                        ->setAuthor($clike->getComment()->getAuthor())
                                        ->setSender($clike->getAuthor());
            $this->doEnsureNotificationMetadataExists($notification);
            $notification->denormalize();

            //persist notification
            $this->dm->persist($notification);
            $clike->getComment()->setClikeNotification($notification);
            $this->dm->flush();
        }else{
            $notification = $clike->getComment()->getClikeNotification()
                                                ->setLastParticipantActivityDate($date)
                                                ->setSender($clike->getAuthor());
            $this->doEnsureNotificationMetadataExists($notification);

            $notification->doEnsureUnreadForOthersParticipant($clike->getAuthor());
            // $notification->setTs($date->getTimestamp());
            $notification->denormalize();
            $this->dm->flush($notification);
        }
        // $this->stream->notify($notification, 'like');
        return $notification;
    }

    /**
     * create or update leftcomment notification
     * @param LeftComment $leftcomment
     * @return type
     */
    public function leftCommentNotif(\OP\OpinionBundle\Document\LeftComment $leftcomment){
        $date  = new \DateTime(null, new \DateTimeZone("UTC"));
        if(!$leftcomment->getPost()->getLeftcommentNotification()){
            $notification = $this->notification->setLeftcomment($leftcomment)
                                        ->setUrl($leftcomment->getPost()->getId())
                                        ->setAuthor($leftcomment->getPost()->getAuthor())
                                        ->setSender($leftcomment->getAuthor());
            $this->doEnsureNotificationMetadataExists($notification);

            $notification->denormalize();

            //persist notification
            $this->dm->persist($notification);
            $this->dm->flush();
        }else{
            $notification = $leftcomment->getPost()->getLeftcommentNotification()
                                                    ->setLastParticipantActivityDate($date)
                                                    ->setSender($leftcomment->getAuthor());
            $this->doEnsureNotificationMetadataExists($notification);

            $notification->doEnsureUnreadForOthersParticipant($leftcomment->getAuthor());
            $notification->setTs($date->getTimestamp());
            $notification->denormalize();
            $this->dm->flush($notification);
        }
        // $this->stream->notify($notification, 'leftcomment');
        return $notification;
    }

    /**
     * create or update rightcomment notification
     * @param RightComment $rightcomment
     * @return type
     */
    public function rightCommentNotif(\OP\OpinionBundle\Document\RightComment $rightcomment){
        $date  = new \DateTime(null, new \DateTimeZone("UTC"));
        if(!$rightcomment->getPost()->getLeftcommentNotification()){
            $notification = $this->notification->setRightcomment($rightcomment)
                                        ->setUrl($rightcomment->getPost()->getId())
                                        ->setAuthor($rightcomment->getPost()->getAuthor())
                                        ->setSender($rightcomment->getAuthor());
            $this->doEnsureNotificationMetadataExists($notification);

            $notification->denormalize();

            //persist notification
            $this->dm->persist($notification);
            $this->dm->flush();
        }else{
            $notification = $rightcomment->getPost()->getRightcommentNotification()
                                                 ->setSender($rightcomment->getAuthor());
            $this->doEnsureNotificationMetadataExists($notification);

            $notification->doEnsureUnreadForOthersParticipant($rightcomment->getAuthor());
            $notification->denormalize();
            $this->dm->flush($notification);
        }
        // $this->stream->notify($notification, 'rightcomment');
        return $notification;
    }

    /**
     * create or update undercomment notificztion
     * @param UnderComment $undercomment
     * @return type
     */
    public function underCommentNotif(\OP\PostBundle\Document\UnderComment $undercomment) {
        //if not comment_notification exist
        $date  = new \DateTime(null, new \DateTimeZone("UTC"));
        if(!$undercomment->getComment()->getUnderCnotification()){
            $notification = $this->notification->setUndercomment($undercomment)
                                        ->setUrl($undercomment->getComment()->getId())
                                        ->setAuthor($undercomment->getComment()->getAuthor())
                                        ->setSender($undercomment->getAuthor());
            $this->doEnsureNotificationMetadataExists($notification);
            $notification->denormalize();

            //persist notification
            $this->dm->persist($notification);
            $undercomment->getComment()->setUnderCnotification($notification);
            $this->dm->flush();
        }else{
            $notification = $undercomment->getComment()->getUnderCnotification()
                                                        ->setLastParticipantActivityDate($date)
                                                        ->setSender($undercomment->getAuthor());
            $this->doEnsureNotificationMetadataExists($notification);

            $notification->doEnsureUnreadForOthersParticipant($undercomment->getAuthor());
            $notification->setTs($date->getTimestamp());
            $notification->denormalize();
            $this->dm->flush($notification);
        }
        // $this->stream->notify($notification, 'undercommment');
        return $notification;
    }

    /**
     * Ensures that the notification has metadata for each notification participant
     * And add actual sender to participant collection if not exist
     * @param Notification $notification
     */
    protected function doEnsureNotificationMetadataExists(Notification $notification)
    {
        if(!in_array($notification->getSender(), $notification->getParticipants()->toArray())){
            $notification->addParticipant($notification->getSender());
        }

        if(!in_array($notification->getAuthor(), $notification->getParticipants()->toArray())){
            $notification->addParticipant($notification->getAuthor());
        }

        foreach ($notification->getParticipants() as $participant) {
            if (!$meta = $notification->getMetadataForParticipant($participant)) {
                $meta = new \OP\SocialBundle\Document\NotificationMetadata();
                $meta->setParticipant($participant);
                $notification->addMetadata($meta);
            }
        }
    }
}
