<?php

namespace OP\UserBundle\Security;

use Predis\Client as Redis;


class OnlineUsers
{
    /* time to consider user online */
    private $minutes = 5, $redis;

    public function  __construct(Redis $redis){
        $this->redis = $redis;
    }

    public function online() {
        /* current hour and minute */
        $now = time();
        $min = date("i",$now);
        $hor = date("G",$now);
        /* redis keys to union, based on last $minutes */
        $keys = array();
        for($i = $min ; $i >= $min - $this->minutes; $i--) {
            $keys[] = "online:".$hor.":".$i; // define the key
        }
        $scmd = $this->redis->createCommand("sunion",$keys); // create the union with desired keys
        $online = $this->redis->executeCommand($scmd); // issue the sunion and grab the result
        
        return $online ; // array of online usernames
    }

    public function ping($user) {
        /* current hour:minute to make up the redis key */
        $now  = time();
        $min  = date("G:i",$now);
        $key  = "online:".$min;
        $this->redis->sadd($key, $user); // add the user to the set
        $ttl = $this->redis->ttl($key) ; // check if key has an expire
        if($ttl == -1) { // if it do not have, set it to $minutes + 1
            $this->redis->expire($key, ($this->minutes + 1) * 60);
        }
        return $this ;
    }
}
?>