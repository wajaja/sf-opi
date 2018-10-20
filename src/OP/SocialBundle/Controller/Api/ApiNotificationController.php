<?php
namespace OP\SocialBundle\Controller\Api;

use FOS\RestBundle\Controller\Annotations,
    Nelmio\ApiDocBundle\Annotation as Doc,
    OP\UserBundle\Security\UserProvider,
    Symfony\Component\HttpFoundation\Request,
    FOS\UserBundle\Event\GetResponseUserEvent,
    OP\UserBundle\Repository\OpinionUserManager,
    FOS\RestBundle\Controller\FOSRestController,
    FOS\UserBundle\Event\FilterUserResponseEvent,
    FOS\RestBundle\Routing\ClassResourceInterface,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\SocialBundle\DocumentManager\NotificationManager,
    Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * @Annotations\RouteResource("notifications", pluralize=false)
 */
class ApiNotificationController extends FOSRestController implements ClassResourceInterface
{

    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }

    /**
    * @Annotations\Get("/notifications/load")
    *
    */
    public function loadNotificationsActions(Request $request, NotificationManager $notifMan) {
        $res        = new JsonResponse();
        $query      = $request->query;
        $user       = $this->_getUser();
        $initIds    = $query->get('initIds') ? $query->get('initIds') : [];
        $limit      = $query->get('limit') ? $query->get('limit') : 10;
        $datas      = $notifMan->loadNotifications($user, $initIds, $limit);

        return $res->setData(array('datas' => $datas));
    }

    /**
     * @Annotations\Get("/notifications/alert/show")
     *
     * @return Integer
     */
    public function getAlertAction(Request $request)
    {
        $response = new JsonResponse();
        // Instantiate a new client
        $client = new \GetStream\Stream\Client('sewzt6y5y29n', 'c4bdc5xpez98f5vb4pfdu7myg2zsax5ykahuem2thkmsm7d5e9ddztskjwcwdhk8');
        $nbNotes = 3;

        return  $nbNotes;
    }

     /**
     * @Annotations\Put("/notifications/read/{id}")
     *
     */
    public function readAction(Request $request, $id)
    {
        $user   = $this->_getUser();
        $dm     = $this->getDocumentManager();
        $notif  = $dm->getRepository('OPSocialBundle:Notification')->find($id);
        $notif->setIsReadByParticipant($user, true);
        $dm->flush();

        return $response = new JsonResponse(true);
    }

    /**
     * @Annotations\Put("/notifications/unread/{id}")
     *
     */
    public function unreadAction(Request $request, $id)
    {
        $user   = $this->_getUser();
        $dm     = $this->getDocumentManager();
        $notif  = $dm->getRepository('OPSocialBundle:Notification')->find($id);
        $notif->setIsReadByParticipant($user, false);
        $dm->flush();

        return $response = new JsonResponse(true);
    }

    /**
    * @Annotations\Get("/notifications/alert/hide")
    */
    public function hideAlertAction(Request $request, OpinionUserManager $userManager) {
         $client = new \GetStream\Stream\Client('sewzt6y5y29n', 'c4bdc5xpez98f5vb4pfdu7myg2zsax5ykahuem2thkmsm7d5e9ddztskjwcwdhk8');
        //make all as seens
        $this->updateLastView($userManager);
        return  new JsonResponse(['success' => true]);
    }

    /**
     * Lists all Message documents.
     *
     * @Annotations\Get("/notifications/alert/get")
     * @return array
     */
    public function getNotificationsAction(Request $request)
    {
        //start session and set the $lastUrl value under Session storage
        //TODO: connecting to Stream 
         $client = new \GetStream\Stream\Client('sewzt6y5y29n', 'c4bdc5xpez98f5vb4pfdu7myg2zsax5ykahuem2thkmsm7d5e9ddztskjwcwdhk8');
        $notes = [];
        return $notes;
    }

    /**
    * Shortcut to throw a AccessDeniedException($message) if the user is not authenticated
    * @param String $message The message to display (default:'warn.user.notAuthenticated')
    */
    protected function forwardIfNotAuthenticated($message='warn.user.notAuthenticated'){
        if (!is_object($this->_getUser())) {
            throw new AccessDeniedException($message);
        }
    }

    protected function updateLastView($userManager) {
        $user = $this->_getUser();
        $lastReading = new \Datetime(null, new \DateTimeZone("UTC"));
        $user->setLastNotificationView($lastReading);
        $userManager->updateUser($user);
    }

    public function _getUser()
    {
        return $this->user_provider->getHydratedUser();
    }

    /**
     * Returns the DocumentManager
     *
     * @return DocumentManager
     */
    private function getDocumentManager()
    {
        return $this->dm;
    }
}