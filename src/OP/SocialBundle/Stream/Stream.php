<?php

namespace OP\SocialBundle\Stream;

use OP\SocialBundle\Document\Notification,
	Symfony\Component\HttpFoundation\RequestStack,
	Symfony\Component\DependencyInjection\ContainerInterface as Container;

class Stream 
{

	protected $client, $request, $container;

    //set cancert path to avoid the following exception
    //https://stackoverflow.com/questions/21187946/curl-error-60-ssl-certificate-issue-self-signed-certificate-in-certificate-cha
    public function __construct(Container $container, RequestStack $requestStack, string $getStreamKey, string $getStreamToken){
        $this->container = $container;
        $this->request   = $requestStack->getCurrentRequest();
        //10.0 instead of 3.0 because we are in dev mode
        //TODO configure mode by using: $this->container->getParameter('kernel.environment');
        $this->client 	 = new \GetStream\Stream\Client($getStreamKey, $getStreamToken, 'v1.0', '', 10.0);
        $this->client->setLocation('us-east');
    }

    // For the feed group 'user' and user id 'userId' get the feed
    public function getUserFeed($userId) {
		return $this->client->feed('user', $userId);
    }


    // For the feed group 'user' and user id 'userId' get the feed
    public function getGlobalFeed() {
		return $this->client->feed('user', '_global');
    }

    // Let Jessica's flat feed follow Eric's feed
    public function follow($userId, $targetId, $demand) {
    	$aggregated = $this->client->feed('timeline_aggregated', $userId);
    	$aggregated->followFeed('user', $targetId);

    	$feed = $this->client->feed('timeline', $userId);
		$feed->follow('user', $targetId /*,0*/); //third arg means: follow feed without copying the activities

		$notif = $this->client->feed('notification', $targetId);
    	$notif->addActivity([
    		'actor'=> $userId, 
    		'verb'=> 'follow', 
    		'object'=> $demand->getId()
    	]);
    }

    //list followers
    public function followers($userId) {
    	$feed = $this->client->feed('timeline', $userId);
    	return $feed->followers(0, 30);
    }

    // Retrieve 10 feeds followed by $userFeed1
    public function following($userId) {
    	$feed = $this->client->feed('timeline', $userId);
    	return $feed->following(0, 30);
    }

    // Let Jessica's flat feed follow Eric's feed
    public function unfollow($userId, $targetId) {
    	// $aggregated = $this->client->feed('timeline_aggregated', $userId);
    	// $aggregated->unfollowFeed('user', $targetId)

    	$feed = $this->client->feed('timeline', $userId);
		//third arg means; Stop following feed  but keep history of activities:
		$feed->unfollow('user', $targetId /*, true*/ ); 
    }

    // Let Jessica's flat feed follow Eric's feed
    public function addFriend($userId, $targetId) {
    	$aggregated1 = $this->client->feed('timeline_aggregated', $userId);
    	$aggregated1->followFeed('user', $targetId);

    	$feed1 = $this->client->feed('timeline', $userId);
		$feed1->follow('user', $targetId);

		$aggregated2 = $this->client->feed('timeline_aggregated', $targetId);
    	$aggregated2->followFeed('user', $userId);

    	$feed2 = $this->client->feed('timeline', $targetId);
		$feed2->follow('user', $userId);
    }

    // For the feed group 'user' and user id 'userId' get the feed
    public function getUserTimeline($userId) {
    	$session = $this->request->getSession();
        $feed    = $this->client->feed('user', 'eric'); // ok no connexion issue
        $timeline = $session->get('timeline');
        if($timeline && gettype($timeline) === 'array') {
            $last_id = $timeline[count($timeline) - 1]['id'];
            // Get 5 activities with id less than the given UUID (Faster - Recommended!)
            $options = ['id_lte' => $last_id];
            $results = $feed->getActivities(0, 5, $options)['results'];
        } else {
            $results = $feed->getActivities(0, 5)['results'];  
        }

        if(!count($results))
            return null;

    	$session->set('timeline', $results);
		return $results;
    }


    /* Note on Aggregated Feeds: When using id_lte to paginate an aggregated feed, 
    * use the ID of the group that is returned from the API. 
    * Using an ID of an individual activity within the group will not work and result in an error.
    */
    public function getUserAggregated($userId) {
    	$session = $this->request->getSession();
    	$feed 	 = $this->client->feed('timeline_aggregated', $userId);
    	$activities = $session->get('timeline_aggregated');
    	if($activities && gettype($activities) === 'array') {
            $last_id = $activities[count($activities) - 1]['id'];
            // Get 5 activities with id less than the given UUID (Faster - Recommended!)
            $options = ['id_lte' => $last_id];
            $activities = $feed->getActivities(0, 5, $options)['results'];
    	} else {
            $activities = $feed->getActivities(0, 5, $options);
    	}

    	$session->set('timeline_aggregated', $activities);
	return $activities;
    }

    /**
    Stream makes it easy to add follow suggestions to your app. Simply make the API call shown below to retrieve a list of follow suggestions.
    By default the follow suggestions are based on a standardized graph analysis algorithm. Our data science team can work with you to create a customized algorithm for your app. Contact sales@getstream.io to learn more.
    */
    public function followSuggestion($id) {
    	$suggestions = $this->client->personalization->get('follow_recommendations', [
            'user_id' => $id,
            'source_feed_slug' => 'timeline',
            'target_feed_slug' => 'user',
        ]);
    	return $suggestions;
    }

    /**
    * Analytic:::
    * Users tend to engage with emails, even when they aren't engaged with your app. 
    * Thus, it's important to track how they interact with your emails.
	* Tracking clicks in emails works via redirects. 
	* You can use our client libraries to generate a redirect link.
    */
    public function emailTracking() {
    	// the url to redirect to
        $targetUrl = 'http://my.application.com/page/';

        $impression = [
          'content_list' => ['tweet:34349698', 'tweet:34349699', 'tweet:34349697'],
          'feed_id' => 'flat:tommaso',
          'location' => 'profile_page',
          'user_data' => ['id' => 'bubbles'],
          'label' => 'impression',
        ];

        $engagement = [
            'content' => 'tweet:34349698',
            'feed_id' => 'flat:tommaso',
            'location' => 'profile_page',
            'user_data' => ['id' => 'frank'],
            'label' => 'click',
        ];

        $events = [$impression, $engagement];
        $trackingUrl = $this->client->createRedirectUrl($targetUrl, $events);

        // when the user opens the tracking url in their browser gets redirected to the target url
        // the events are added to our analytics platform
    }

    //source::https://gist.github.com/tbarbugli/3d43136edb5dcf9bf98b
    public function notify(Notification $notif, $verb) {
    	$senderId = $notif->getSender()->getId();
    	$feed 	  = $this->client->feed("user", $senderId);
    	$date  	  = \DateTime(null, new \DateTimeZone("UTC"));
        $date->setTimestamp($notif->getLastParticipantActivityDate());

        $to = [];
        foreach ($notif->getParticipants() as $u) {
            if($u->getId() !== $senderId()) {
                $to[] = "notification:{$u->getId()}";
            }
        }

    	$data = [
            'actor' 	 => "user:{$senderId}",
            'verb' 		 => $verb,
            "foreign_id" => "note:{$notif->getId()}",
            'time' 		 => $date->format(DateTime::ISO8601),
            'object' 	 => "{$verb}:{$notif->{'get'.ucfirst($verb)}()->getId()}", //verb:12
            'to' 		 => $to,
        ];

	$feed->addActivity($data);
    }

    public function notifyParticipant($post) {
        $authorId = $post['author']['id'];
        $feed     = $this->client->feed("user", $authorId);
        $date     = \DateTime(null, new \DateTimeZone("UTC"));
        $date->setTimestamp($post['createdAt']);

        $to = [];
        foreach ($post['participant'] as $u) {
            if($u['id'] !== $authorId()) {
                $to[] = "notification:{$u['id']}";
            }
        }

        $data = [
            'actor'      => "user:{$authorId}",
            'verb'       => 'participant',
            "foreign_id" => "participant:{$post['id']}",
            'time'       => $date->format(DateTime::ISO8601),
            'object'     => "post:{$post['id']}", //verb:12
            'to'         => $to,
        ];

        $feed->addActivity($data);
    }

    public function notifyLeftEditors($post) {
        $authorId = $post['author']['id'];
        $feed     = $this->client->feed("user", $authorId);
        $date     = \DateTime(null, new \DateTimeZone("UTC"));
        $date->setTimestamp($post['createdAt']);

        $to = [];
        foreach ($post['leftEditors'] as $u) {
            if($u['id'] !== $authorId()) {
                $to[] = "notification:{$u['id']}";
            }
        }

        $data = [
            'actor'      => "user:{$authorId}",
            'verb'       => 'participant',
            "foreign_id" => "leftEditors:{$post['id']}",
            'time'       => $date->format(DateTime::ISO8601),
            'object'     => "post:{$post['id']}", //verb:12
            'to'         => $to,
        ];

        $feed->addActivity($data);
    }

    public function notifyRightEditors($post) {
        $authorId = $post['author']['id'];
        $feed     = $this->client->feed("user", $authorId);
        $date     = \DateTime(null, new \DateTimeZone("UTC"));
        $date->setTimestamp($post['createdAt']);

        $to = [];
        foreach ($post['rightEditors'] as $u) {
            if($u['id'] !== $authorId()) {
                $to[] = "notification:{$u['id']}";
            }
        }

        $data = [
            'actor'      => "user:{$authorId}",
            'verb'       => 'participant',
            "foreign_id" => "rightEditors:{$post['id']}",
            'time'       => $date->format(DateTime::ISO8601),
            'object'     => "post:{$post['id']}", //verb:12
            'to'         => $to,
        ];

        $feed->addActivity($data);
    }

    public function notifyEditors($post) {
        $authorId = $post['author']['id'];
        $feed     = $this->client->feed("user", $authorId);
        $date     = \DateTime(null, new \DateTimeZone("UTC"));
        $date->setTimestamp($post['createdAt']);

        $to = [];
        foreach ($post['editors'] as $u) {
            if($u['id'] !== $authorId()) {
                $to[] = "notification:{$u['id']}";
            }
        }

        $data = [
            'actor'      => "user:{$authorId}",
            'verb'       => 'participant',
            "foreign_id" => "editors:{$post['id']}",
            'time'       => $date->format(DateTime::ISO8601),
            'object'     => "post:{$post['id']}", //verb:12
            'to'         => $to,
        ];

        $feed->addActivity($data);
    }

    public function getNotifications($userId) {
    	# Reading a notification feed is very similar
        $feed = $this->client->feed('notification', $userId);
        $notifications = $feed->get(0, 10)['results'];
        return $notifications;
    }
}