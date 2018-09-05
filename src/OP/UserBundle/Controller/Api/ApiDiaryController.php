<?php
namespace OP\UserBundle\Controller\Api;

use FOS\RestBundle\Controller\Annotations,
    Nelmio\ApiDocBundle\Annotation as Doc,
    OP\UserBundle\Security\UserProvider,
    Symfony\Component\HttpFoundation\Request,
    FOS\UserBundle\Event\GetResponseUserEvent,
    FOS\RestBundle\Controller\FOSRestController,
    FOS\UserBundle\Event\FilterUserResponseEvent,
    FOS\RestBundle\Routing\ClassResourceInterface,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\SocialBundle\DataTransformer\ObjectToArrayTransformer,
    Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * @Annotations\RouteResource("notifications", pluralize=false)
 */
class ApiDiaryController extends FOSRestController implements ClassResourceInterface
{

    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }
    
    /**
     * @Annotations\Get("/diary/{forUserId}/{year}/{month}")
     *
     * @return Integer
     */
    public function monthAction(Request $request, $forUserId, $year, $month)
    {
        $m          = substr("0".$month, -2);
        $res        = new JsonResponse();
        $strDate    = $year.'-'.$m.'-'.'01';
        $interval   = new \DateInterval('P1M');
        $fromDate   = new \DateTime($strDate, new \DateTimeZone("UTC"));
        $toDate     = new \DateTime($strDate, new \DateTimeZone("UTC"));
        $toDate->add($interval);
        $userId     = $this->_getUser()->getId();
        $friendIds  = $request->getSession()->get('friends_ids');
        $posts      = $this->getPostByDateForUserId($fromDate, $toDate, $friendIds);
        $notifs     = $this->getNotifByDateForUserId($fromDate, $toDate, $userId);
        $diaries    = $this->getDiaryByDateForUserId($fromDate, $toDate, $userId);

        return  $res->setData(
                    array('diaries'=>$diaries, 'notifs'=>$notifs, 'posts'=> $posts)
                );
    }

    /**
     * @Annotations\Get("/diary/{forUserId}/{year}/{month}/{day}")
     *
     * @return Integer
     */
    public function dayAction(Request $request, $forUserId, $year, $month, $day, ObjectToArrayTransformer $transformer)
    {
        $res        = new JsonResponse();
        $d          = substr("0".$day, -2);
        $m          = substr("0".$month, -2);
        $strDate    = $year.'-'.$m.'-'.$d;
        $interval   = new \DateInterval('P1D');
        $fromDate   = new \DateTime($strDate, new \DateTimeZone("UTC"));
        $toDate     = new \DateTime($strDate, new \DateTimeZone("UTC"));
        $toDate->add($interval);
        $userId     = $this->_getUser()->getId();
        $friendIds  = $request->getSession()->get('friends_ids');
        $posts      = $this->getDayPost($fromDate, $toDate, $friendIds);
        $notifs     = $this->getDayNotif($fromDate, $toDate, $userId, $transformer);
        $diaries    = $this->getDayDiary($fromDate, $toDate, $userId);

        return  $res->setData(
                    array('diaries'=>$diaries, 'notifs'=>$notifs, 'posts'=> $posts)
                );
    }

    public function _getUser()
    {
        return $this->user_provider->getHydratedUser();
    }

    protected function getPostByDateForUserId($fromDate, $toDate, $friends_ids) 
    {
        $posts    = [];
        $repo     = $this->getDocumentManager()->getRepository('OPPostBundle:Post');
        foreach ($friends_ids as $id) {
            $posts[] = $repo->findPostByDateForUserId($fromDate, $toDate, $id);
        }
        return $posts;
    }

    protected function getNotifByDateForUserId($fromDate, $toDate, $userId){
        $datas      = [];
        $repo       = $this->getDocumentManager()
                           ->getRepository('OPSocialBundle:Notification');
        $notifs   = $repo->findNotifByDateForUserId($fromDate, $toDate, $userId);
        foreach ($notifs as $n) {
            $d           = [];
            $d['userId'] = $userId;
            $d['id']     = (string)$n['_id'];
            $d['date']   = $n['lastParticipantActivityDate']->sec;
            $datas[]     = $d;
        }
        return $datas;
    }

    protected function getDayPost($fromDate, $toDate, $userId){
        $datas      = [];
        // $repo       = $this->getDocumentManager()
        //                    ->getRepository('OPSocialBundle:Notification');
        // $notifs   = $repo->findNotifByDateForUserId($fromDate, $toDate, $userId);
        // foreach ($notifs as $n) {
        //     $d           = [];
        //     $d['userId'] = $userId;
        //     $d['id']     = (string)$n['_id'];
        //     $d['date']   = $n['lastParticipantActivityDate']->sec;
        //     $datas[]     = $d;
        // }
        return $datas;
    }

    protected function getDayNotif($fromDate, $toDate, $userId, $transf){
        $datas      = [];
        $repo       = $this->getDocumentManager()
                           ->getRepository('OPSocialBundle:Notification');
        $notifs     = $repo->findDayNotifs($fromDate, $toDate, $userId);
        foreach ($notifs as $n) {
            $datas[] = $transf->tranformNotofication($n);
        }
        return $datas;
    }

    protected function getDayDiary($fromDate, $toDate, $userId){
        $datas      = [];
        // $repo       = $this->getDocumentManager()
        //                    ->getRepository('OPSocialBundle:Notification');
        // $notifs   = $repo->findNotifByDateForUserId($fromDate, $toDate, $userId);
        // foreach ($notifs as $n) {
        //     $d           = [];
        //     $d['userId'] = $userId;
        //     $d['id']     = (string)$n['_id'];
        //     $d['date']   = $n['lastParticipantActivityDate']->sec;
        //     $datas[]     = $d;
        // }
        return $datas;
    }

    protected function getDiaryByDateForUserId($fromDate, $toDate, $userId){
        $repo       = $this->getDocumentManager()
                           ->getRepository('OPUserBundle:Diary');
        $diaries  = $repo->findDiaryByDateForUserId($fromDate, $toDate, $userId);
        return $diaries;
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