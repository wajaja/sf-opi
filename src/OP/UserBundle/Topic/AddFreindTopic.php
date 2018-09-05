<?php

namespace OP\UserBundle\Topic;

use Gos\Bundle\WebSocketBundle\Topic\TopicInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Wamp\Topic;
use Gos\Bundle\WebSocketBundle\Router\WampRequest;
use Symfony\Component\HttpFoundation\JsonResponse;

class AddFreindTopic implements TopicInterface
{
    /**
     * This will receive any Subscription requests for this topic.
     *
     * @param ConnectionInterface $connection
     * @param Topic $topic
     * @param WampRequest $request
     * @return void
     */
    public function onSubscribe(ConnectionInterface $connection, Topic $topic, WampRequest $request)
    {
        //this will broadcast the message to ALL subscribers of this topic.
        $topic->broadcast(['msg' => $connection->resourceId . " has joined " . $topic->getId()]);

        /* Send a message to all the connections in this topic.
            $exclude and $include work with Wamp Session ID available through $connection->WAMP->sessionId
        */
        // Topic::broadcast($msg, array $exclude = array(), array $eligible = array());

        /*$request->getRouteName() Will give the mathed route name
        $request->getRoute() will give RouteInterface object.
        $request->getAttributes() will give ParameterBag
        For example, your channel pattern is chat/user/{room}, user subscribe to chat/user/room1

        $request->getAttributes()->get('room'); will return room1. You can look step3 who explain how pubsub router work.
        $topic->getId() will return the subscribed channel e.g : chat/user/room1
        */

        //** @var ConnectionInterface $client **/    to iterate over topic
            // foreach ($topic as $client) {
            //     //Do stuff ...
            // }
        //

        // Send the message only  to the current client
        // $connection->event($topic->getId(), ['msg' => 'lol']);

        //count the current subscribers
        //count($topic)
    }

    /**
     * This will receive any UnSubscription requests for this topic.
     *
     * @param ConnectionInterface $connection
     * @param Topic $topic
     * @param WampRequest $request
     * @return void
     */
    public function onUnSubscribe(ConnectionInterface $connection, Topic $topic, WampRequest $request)
    {
        //this will broadcast the message to ALL subscribers of this topic.
        $topic->broadcast(['msg' => $connection->resourceId . " has left " . $topic->getId()]);
    }


    /**
     * This will receive any Publish requests for this topic.
     *
     * @param ConnectionInterface $connection
     * @param Topic $topic
     * @param WampRequest $request
     * @param $event
     * @param array $exclude
     * @param array $eligible
     * @return mixed|void
     */
    public function onPublish(ConnectionInterface $connection, Topic $topic, WampRequest $request, $event, array $exclude, array $eligible)
    {
        /*
            $topic->getId() will contain the FULL requested uri, so you can proceed based on that

            if ($topic->getId() === 'acme/channel/shout')
               //shout something to all subs.
        */

        $topic->broadcast([
                            'msg' => 'dadadadadadada',
        ]);
        // $response = new JsonResponse();
        // return $response->setData(array('ceci' =>'ce deja  fait'));
    }

    /**
    * Like RPC is will use to prefix the channel
    * @return string
    */
    public function getName()
    {
        return 'addfreind.topic';
    }
}
