<?php

namespace OP\PostBundle\Listener;

use OP\PostBundle\Event as Events,
    OP\SocialBundle\Stream\Stream,
    Symfony\Component\HttpFoundation\RequestStack,
    OP\PostBundle\DataTransformer\ToArrayTransformer,
    Gos\Bundle\WebSocketBundle\DataCollector\PusherDecorator,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;

/**
* 
*/
class PostListener
{

    private $post, $comment, $undercomment, $container, $pusher,
            $request, $transformer, $stream;

    public function __construct(RequestStack $request, Container $container, ToArrayTransformer $transformer, Stream $stream, PusherDecorator $pusher)
    {
        $this->container    = $container;
        $this->transformer  = $transformer;
        $this->stream       = $stream;
        $this->pusher       = $pusher;
        $this->request      = $request->getCurrentRequest();
    }

    public function onPostCreate(Events\PostEvent $event)
    {
        $data    = $event->getData();
        $user_id = (string)$data['author']['id'];
        $session = $this->request->getSession();
        $session->set('gallerypost', []); 	//reset uploaded filename in session;
        // $data  		= $this->transformer->postObjectToArray($post)

        //Pusher maner
        try {
            $this->pusher->push(
                ['data'=> $data], 'post_topic', ['user_id' => $user_id]
            );
        } catch (Exception $e) { }
        ////Redis to send post to all follower
        // $this->streamPost($data, $user_id); //TODO Async
        // if(isset($data['participants']) && count($data['participants']))
        // 	$this->stream->notifyParticipant($data);

        // if(isset($data['leftEditors']) && count($data['leftEditors']))
        // 	$this->stream->notifyLeftEditors($data);

        // if(isset($data['rightEditors']) && count($data['rightEditors']))
        // 	$this->stream->notifyRightEditors($data);
        
        // if(isset($data['editors']) && count($data['editors']))
        // 	$this->stream->notifyEditors($data);
    }

    public function onShareCreate(Events\ShareEvent $event)
    {
        $data 	= $event->getData();
        $session = $this->request->getSession();
        // $data  		= $this->transformer->postObjectToArray($post)
        try {
            $this->pusher->push(
                ['data'=> $data], 'share_topic', ['user_id' => $data['author']]
            );
        } catch (Exception $e) { }
        //Redis to send post to all followers
    }

    public function onPostUpdate(Events\PostEvent $event)
    {
        $post    = $event->getPost();
        $user_id =  (string)$post['author']['id'];
        //$feed    = $this->stream->getUserFeed($user_id);

        $this->updateStreamPost($post, $user_id);
    }

    public function onPostDelete(Events\PostEvent $event)
    {
        $post = $event->getPost();
        $user_id =  (string)$post['author']['id'];
        $feed   = $this->stream->getUserFeed($user_id);
//            $now    = new \DateTime(null, new \DateTimeZone("UTC"));

        // Remove an activity by its id
        // $Feed->removeActivity('e561de8f-00f1-11e4-b400-0cc47a024be0');

        // Remove the activity by referencing the foreign_id you provided:
        $feed->removeActivity("post:{$post['id']}", true);
    }

    public function onPostAllieCreate(Events\PostEvent $event)
    {
        $post = $event->getPost();
    }

    public function onLeftCreate(Events\LeftEvent $event)
    {
        $data 	= $event->getData();
        //$session = $this->request->getSession();
        try {
            $this->pusher->push(
                ['data' => $data], 'left_topic', ['allie_id' => $data['postValid']]
            );
        } catch (Exception $e) { }
        //Redis to send post to all followers
    }

    public function onLeftUpdate(Events\LeftEvent $event)
    {
        // $data 		= $event->getData();
        // $session    = $this->request->getSession();
        // $data  		= $this->transformer->commentObjectToArray($comment)
        // $pusher     = $this->container->get('gos_web_socket.wamp.pusher');
        //$session->set('gallerycomment', []); 	//reset uploaded filename in session;
        // $pusher->push(
        // 	['data' => $data], 'left_topic', ['post_id' => $data['postValid'], 
        // 										 'refer'=>$data['refer']]
        // );
        //Redis to send post to all followers
    }

    public function onRightCreate(Events\RightEvent $event)
    {
        $data   = $event->getData();
//            $session = $this->request->getSession();
        // $data  = $this->transformer->commentObjectToArray($comment);
        try {
            $this->pusher->push(
                    ['data' => $data], 'right_topic', ['allie_id' => $data['postValid']]
            );
        } catch (Exception $e) { }
        //Redis to send post to all followers

    }

    public function onRightUpdate(Events\RightEvent $event)
    {
        // $data 		= $event->getData();
        // $session    = $this->request->getSession();
        // $data  		= $this->transformer->commentObjectToArray($comment);
        // $pusher     = $this->container->get('gos_web_socket.wamp.pusher');
        //$session->set('gallerycomment', []); 	//reset uploaded filename in session;
        // $pusher->push(
        // 	['data' => $data], 'comment_topic', ['post_id' => $data['postValid'], 
        // 										 'refer'=>$data['refer']]
        // );
        //Redis to send post to all followers

    }

    public function onCommentCreate(Events\CommentEvent $event)
    {
        $data 	 = $event->getData();
        //$session = $this->request->getSession();
        // $data = $this->transformer->commentObjectToArray($comment);
        try {
            $pusher     = $this->container->get('gos_web_socket.wamp.pusher');
            $pusher->push(
                ['data' => $data], 'comment_topic', ['post_id' => $data['postValid'], 'refer'=>$data['refer']]
            );
        } catch (Exception $e) { }
        //Redis to send post to all followers
    }

    public function onCommentUpdate(Events\CommentEvent $event)
    {
        $data   = $event->getData();
        $session = $this->request->getSession();
        // $data = $this->transformer->commentObjectToArray($comment);
        try {
            $pusher     = $this->container->get('gos_web_socket.wamp.pusher');
            $pusher->push(
                    ['data' => $data], 'comment_topic', ['post_id' => $data['postValid'], 
                                                                                             'refer'=>$data['refer']]
            );
        } catch (Exception $e) { }
        //Redis to send post to all followers
    }

    public function onUnderCreate(Events\UnderCommentEvent $event)
    {
        $data = $event->getData();
        // $session = $this->request->getSession();
        // $data  = $this->transformer->commentObjectToArray($comment);
        try {
            $this->pusher->push(
                    ['data' => $data], 'undercomment_topic', ['comment_id' => $data['commentId']]
            );
        } catch (Exception $e) { }
    }

    public function onUnderUpdate(Events\UnderCommentEvent $event)
    {
            // $data 		= $event->getData();
            // $session    = $this->request->getSession();
//       // $data  		= $this->transformer->commentObjectToArray($comment);
            // $pusher     = $this->container->get('gos_web_socket.wamp.pusher');
//       //$session->set('gallerycomment', []); 	//reset uploaded filename in session;
            // $pusher->push(
            // 	['data' => $data], 'undercomment_topic', ['comment_id' => $data['commentId']]
            // );
    }

    public function onLike(Events\LikeEvent $event)
    {
        $data = $event->getData();
        try {
            $this->pusher->push(
               ['data' => $data], 'like_topic', ['post_id' => $data['id'], 'refer'   => $data['refer']]
            );
        } catch (Exception $e) { }
        //Redis to send post to all followers
    }

    public function onUnLike(Events\LikeEvent $event)
    {
        $data = $event->getData();
        try {
            $this->pusher->push(
                ['data' => $data], 'like_topic', ['post_id' => $data['id'], 'refer'   => $data['refer']]
            );
        } catch (Exception $e) { }
        //Redis to send post to all followers

    }

    public function onRateCreate(Events\RateEvent $event)
    {
        $data = $event->getData();
        try {
            $this->pusher->push(
                ['data' => $data], 'rate_topic', ['post_id' => $data['id'], 'refer' => $data['refer']]
            );
        } catch (Exception $e) { }
        //Redis to send post to all followers

    }

    public function onRateUpdate(Events\RateEvent $event)
    {
        $data = $event->getData();
        try {
            $this->pusher->push(
                ['data' => $data], 'rate_topic', ['post_id' => $data['id'], 'refer'   => $data['refer']]
            );
        } catch (Exception $e) { }
        //Redis to send post to all followers
    }

    public function onRateDelete(Events\RateEvent $event)
    {
        $data = $event->getData();
        try {
            $this->pusher->push(
                ['data' => $data], 'rate_topic', ['post_id' => $data['id'], 'refer'   => $data['refer']]
            );
        } catch (Exception $e) { }
        //Redis to send post to all followers
    }

    protected function streamPost($post, $userId) {
        $feed  = $this->stream->getUserFeed($userId);
        $date  = new \DateTime(null, new \DateTimeZone("UTC"));
        $date->setTimestamp($post['createdAt']);

        //addActivity to Stream	
        // Add an Activity; message is a custom field - tip: you can add unlimited custom fields!
        $data = [
            "actor"       => "user:{$userId}",
            "foreign_id"  => "post:{$post['id']}",
            "object"      => "post:{$post['id']}",
            'time'        => $date->format(\DateTime::ISO8601),
            "target"      => "{$post['timelineType']}:{$post['timelineId']}",
            "verb"        => $post['type'] ? "post_created" : "opinion_created"
        ];
        $feed->addActivity($data);

        // if($post['confidence'] === 'public') {
        // 	$this->stream->getGlobalFeed()->addActivity($data);
        // }
    }

    protected function updateStreamPost($post, $userId) {
        $feed = $this->stream->getUserFeed($userId);
        $date  = new \DateTime(null, new \DateTimeZone("UTC"));
        $date->setTimestamp($post['createdAt']);

        //addActivity to Stream	
        // Add an Activity; message is a custom field - tip: you can add unlimited custom fields!
        $data = [
          "foreign_id" 	=> "post:{$post['id']}", //required
          'time' 		=> $date->format(\DateTime::ISO8601), //required 
        ];

        $feed->updateActivities($data);

        // if($post['confindence'] === 'public') {
        // 	$this->stream->getGlobalFeed()->addActivity($data);
        // }
    }
}