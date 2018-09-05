<?php
namespace OP\UserBundle\Controller;

use FOS\UserBundle\FOSUserEvents,
    FOS\UserBundle\Event\FormEvent,
    OP\SocialBundle\SeveralClass\Order,
    FOS\UserBundle\Model\UserInterface,
    OP\SocialBundle\SeveralClass\FlushHelper,
    FOS\UserBundle\Event\FilterUserResponseEvent,
    FOS\UserBundle\Event\GetResponseUserEvent,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Symfony\Component\HttpFoundation\Request,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Method,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    Symfony\Component\HttpFoundation\RedirectResponse,
    Symfony\Component\HttpFoundation\StreamedResponse,
    OP\UserBundle\Repository\OpinionUserManager,
    Symfony\Component\Security\Core\Exception\AccessDeniedException;


class SearchController extends Controller
{

    public function loadUsersAction($name, OpinionUserManager $uMan)
    {
        $dbUsers = $uMan->loadUsers($name);
        $datas = [];
        foreach ($dbUsers as $dbUser) {
            $user['userId'] = $dbUser->getId();
            $user['username'] = $dbUser->getUsername();
            $user['firstname'] = $dbUser->getFirstname();
            $user['lastname'] = $dbUser->getLastname();
            $user['pic_path'] = '/opinion/web/'.$dbUser->getProfilePic()->getWebPath();
            $datas [] = $user;
        }

        $response = new JsonResponse();
        return $response->setData(array('users'=>$datas));
    }

    public function loadOnlineUsersAction(OpinionUserManager $uMan)
    {
        // $dbUsers = $uMan->lessUserSuggest($this->_getUser());
        // $datas = [];

        // $online_manager = $this->get('op_user.online_users');
        // $serializer = $this->container->get('jms_serializer');
        // $onlines = $online_manager->online();
        // $users = [];
        // foreach ($onlines as $online) {
        //     $users[] = $serializer->deserialize($online, 'OP\UserBundle\Document\User', 'json');
        // }

        // foreach ($users as $g_user) {
        //     $user['userId']     = $g_user->getId();
        //     $user['username']   = $g_user->getUsername();
        //     $user['firstname']  = $g_user->getFirstname();
        //     $user['lastname']   = $g_user->getLastname();
        //     $user['pic_path']   = $g_user->getProfilePic() ? '\/opinion/'.$g_user->getProfilePic()->getWebPath() 
        //                                                  : "/images/favicon.ico";           
        //     $datas []           = $user;
        // }

        // $response = new JsonResponse();
        // return $response->setData(array('users'=>$datas));
    }

    /* find less users to suggest in home page   */
    public function lessUserSuggestAction(Request $request, OpinionUserManager $uMan)
    {
        $helper = new FlushHelper();
        
        return new StreamedResponse (function() use ($helper, $request, $uMan){
            $auth_user = $this->_getUser();
            $user_suggests = $uMan->lessUserSuggest($auth_user);
            $dm     = $this->dm;
            $repos  = $dm->getRepository('\OP\UserBundle\Document\Invitation\Invitation');
            $datas  = [];
            foreach ($user_suggests as $user_suggest) {
                $user['userId'] = $user_suggest->getId();
                $user['username'] = $user_suggest->getUsername();
                $user['firstname'] = $user_suggest->getFirstname();
                $user['lastname'] = $user_suggest->getLastname();
                $invitations = $repos->findRelatedInvitations($user_suggest->getId(), false);
                //test the suggest user have some invitation then detect its sender or receider
                if($invitations){
                    foreach($invitations as $invitation){
                        $user['invitation']['exist'] = true;
                        $user['invitation']['id'] = $invitation->getId();
                        $user['invitation']['receiver_id'] = $invitation->getReceiver()->getId();
                        $user['invitation']['sender_id'] = $invitation->getSender()->getId();
                    }
                }else{
                    $user['invitation']['id'] = '';
                    $user['invitation']['exist'] = false;
                }
                //if the user that have'nt the profile picture
                if($user_suggest->getProfilePic()===null){
                    $user['pic_path'] = '';
                }else{
                    $user['pic_path'] = '/opinion/web/'.$user_suggest->getProfilePic()->getWebPath();
                }
                $datas [] = $user;
            }
            $suggest = $this->renderView('OPUserBundle:Profile:suggestion_home.html.twig', array('users'=> $datas));
            $sugg_js = file_get_contents('http://127.0.0.1/opinion/web/js/user/home-user-suggest.js');
            $helper->outPlaceholder($suggest, 'u_sugg_co', $sugg_js);
        });
    }
    
    public function getFriendsOrFollowersAction(OpinionUserManager $uMan){
        
        $dbUsers = $uMan->friendsOrFollowers();
        $datas = [];
        foreach ($dbUsers as $dbUser) {
            $user['userId'] = $dbUser->getId();
            $user['username'] = $dbUser->getUsername();
            $user['firstname'] = $dbUser->getFirstname();
            $user['lastname'] = $dbUser->getLastname();
            $user['pic_path'] = $dbUser->getProfilePic() ? '/opinion/web/'.$dbUser->getProfilePic()
                                                                                ->getWebPath() : "/opinion/web/images/favicon.ico";           
            $datas [] = $user;
        }

        $response = new JsonResponse();
        return $response->setData(array('users'=>$datas));
    }
}
