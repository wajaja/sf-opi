<?php
namespace OP\UserBundle\EventListener;

/* this class notifid when the user as connected or disconnected
*/

use Gos\Bundle\WebSocketBundle\Event\ClientEvent;
use Gos\Bundle\WebSocketBundle\Event\ClientErrorEvent;
use Gos\Bundle\WebSocketBundle\Event\ServerEvent;
use Gos\Bundle\WebSocketBundle\Event\ClientRejectedEvent;

class UserClientEventListener
{
    /**
     * Called whenever a client connects
     *
     * @param ClientEvent $event
     */
    public function onClientConnect(ClientEvent $event)
    {
        $conn = $event->getConnection();

        echo $conn->resourceId . " connected" . PHP_EOL;
    }

    /**
     * Called whenever a client disconnects
     *
     * @param ClientEvent $event
     */
    public function onClientDisconnect(ClientEvent $event)
    {
        $conn = $event->getConnection();

        echo $conn->resourceId . " disconnected" . PHP_EOL;
    }

    /**
     * Called whenever a client errors
     *
     * @param ClientErrorEvent $event
     */
    public function onClientError(ClientErrorEvent $event)
    {
        $conn = $event->getConnection();
        $e = $event->getException();

        echo "connection error occurred: " . $e->getMessage() . PHP_EOL;
    }

    /**
     * Called whenever server start
     *
     * @param ServentEvent $event
     */
    public function onServerStart(ServerEvent $event)
    {
    	$event = $event->getEventLoop();

        echo 'Server was successfully started !'. PHP_EOL;
    }

    /**
     * Called whenever client is rejected by application
     *
     * @param ClientRejectedEvent $event
     */
	public function onClientRejected(ClientRejectedEvent $event)
    {
    	$origin = $event->getOrigin;

		echo 'connection rejected from '. $origin . PHP_EOL;
    }
}
