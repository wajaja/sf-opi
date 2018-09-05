<?php

namespace OP\PostBundle\Notification;

use Predis\Client as Redis;

class RealTimePost
{
	private $redis;

	public function __construct(Redis $redis){
		$this->redis 	= $redis;
	}

	public function subscribe()
	{

	}

	public function publish($channel, $message){
		$this->redis->publish($channel, $message); // send message to channel 1.
	}
}