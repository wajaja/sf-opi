<?php

namespace OP\SocialBundle\WebSocket;

use Predis;

class PredisHelper 
{
	
	private $redis;

	public function __construct() {
		$this->redis = new Predis\Client('tcp://127.0.0.1:6379');
	}

	public function publish($channel, $payload) {
		echo "string";
		$this->redis->pubSubLoop($channel, function ($event) {
	        echo $date_time." Received message `{$event->payload}` from {$event->channel}.";
	        
	        // foreach ($this->wsclients as $wsclient) {
	        //   $wsclient->send($event->payload);
	        // }
	      });
		// die();
		$this->redis->publish($channel, $payload);
	}
}