<?php
namespace OP\SocialBundle\DocumentManager;

use OP\UserBundle\Document\User,
    OP\SocialBundle\Stream\Stream,
    Doctrine\ODM\MongoDB\DocumentManager,
    OP\SocialBundle\Document\Notification,
    OP\SocialBundle\DataTransformer\ObjectToArrayTransformer,
    OP\SocialBundle\ModelManager\NotificationManager as BaseManager,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;

/**
 * Description of NotificationManager
 * class that manage all about opinion's notifications
 * @author CEDRICK
 */
class NotificationManager extends BaseManager
{
    /**
     *
     * @var type
     */
    protected $dm, $container, $notification, $transformer;

    public function __construct(DocumentManager $dm, Notification $notification, Container $container, Stream $stream, ObjectToArrayTransformer $transformer) {
        $this->dm           = $dm;
        $this->stream       = $stream;
        $this->notification   = $notification;
        $this->container     = $container;
        $this->transformer = $transformer;
    }

    public function countAlerts(User $user) {
        $userId = $user->getId();
        $lastReadingDate = $user->getLastNotificationView();
        return $this->dm
            ->getRepository('OPSocialBundle:Notification')
            ->countAlerts($userId, $lastReadingDate);
    }

    public function loadNotifications(User $user, $initIds = [], $limit)
    {
        $notes  = [];
        $trans  = $this->transformer;
        $repo   = $this->dm->getRepository('OPSocialBundle:Notification');
        $datas  = $repo->loadNotifications($user, $initIds, $limit);

        foreach ($datas as $data) {
            if(!$data) 
                continue;
            else      
                $notes[] = $trans->tranformNotofication($data) ;
        }

        return $notes;
    }    
}
