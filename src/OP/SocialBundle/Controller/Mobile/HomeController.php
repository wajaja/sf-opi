<?php
namespace OP\SocialBundle\Controller\Mobile;

use OP\PostBundle\Form\PostType,
    OP\PostBundle\Document\Post,
    Symfony\Component\HttpFoundation\Request,
    OP\SocialBundle\SeveralClass\FlushHelper,
    Symfony\Component\HttpFoundation\StreamedResponse,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Method,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Template,
    Symfony\Component\HttpFoundation\Session\Session,
    Symfony\Component\Security\Core\Exception\AuthenticationException,
    Symfony\Component\Security\Core\Security;

/**
 * Home controller.
 *
 * @Route("")
 */
class HomeController extends Controller
{
    /**
     * home
     *
     * @Route("/", name="mobile_homepage" )
     *
     * @return array
     */
    public function indexAction(Request $request)
    {
        $session = $request->getSession();
        $session->isStarted() ?: $session->start();

        $news           = [];
        $description    = 'Welcome to opinion';
        $title          = 'Opinion';
        return  $this->render(
                'OPSocialBundle:Mobile:base.html.twig', 
                array(
                    'news'          => $news,
                    'title'         => $title, 
                    'description'   => $description, 
                    'post_form'     => $this->getPostForm($request),
                )
            );
    }
    

    /**
     * @param Request $request
     *
     * @return Response
     */
    private function getPostForm(Request $request)
    {
        return $this->createForm(PostType::class, new Post());
    }

    private function goHomePage($helper, $request)
    {
        $description = 'Opinion Home page, news list';
        // $top =$this->renderView('::base.html.twig', array('title'=>'Opinion', 'description'=>$description));
        // $helper->out($top);

        // $home = $this->renderView('OPSocialBundle:Home:home.html.twig');
        // $homejs = file_get_contents('http://opinion/app/social/home.js');
        // $helper->outPlaceholder($home, 'h_cont', $homejs);
        // sleep(1);
        // $user=$this->_getUser();
        // $pform = $this->createForm(PostType::class, new Post());
        // $form = $this->renderView('OPSocialBundle:Home:form.html.twig', array('pform'=> $pform->createView(), 'user'=>$user));
        $post_form = file_get_contents('http://opinion/app/post/post-form.js');
        $helper->outPlaceholder($form, '_1', $post_form);
        sleep(2);

        $helper->outPlaceholder($this->getNewsView(), '_5', $this->getNewsScripts());
        sleep(2);

       $profScript = file_get_contents('http://opinion/app/user/mini-profile.js');
       $min_prof = $this->renderView('OPUserBundle:Profile:mini_profile.html.twig', array('user'=> $user));
       $helper->outPlaceholder($min_prof, '_3', $profScript);
       sleep(2);

        $online = $this->renderView('OPUserBundle:Profile:online_block.html.twig');
        $online_js= file_get_contents('http://opinion/app/user/online.js');
        $react_users = '';
        $online_script = $online_js.' '.$react_users;
        $helper->outPlaceholder($online, '_8', $online_script);
        sleep(2);


        // $datas = $this->getUserSuggestion($request, $user);
        // $suggest = $this->renderView('OPUserBundle:Profile:suggestion_home.html.twig', array('users'=> $datas));
        // $sugg_js = file_get_contents('http://opinion/app/user/home-user-suggest.js');
        // $helper->outPlaceholder($suggest, 'u_sugg_co', $sugg_js);
        // sleep(1);

        // $h_foot = $this->renderView('OPSocialBundle:Home:h-foo.html.twig');
        // $h_foot_js =''; // file_get_contents('http://opinion/app/user/home-user-suggest.js');
        // $helper->outPlaceholder($h_foot, 'o-foot-ab-cont', $h_foot_js);
        // sleep(2);

        // $list_fr_suggs = $this->getFreindsNewsSuggestion();
        // $fri_nws_html = $this->renderView('OPSocialBundle:Home:fri-sugg-news.html.twig', array('list_fr_suggs'=>$list_fr_suggs));
        // $fri_js = file_get_contents('http://opinion/app/social/fri-sugg-news.js');
        // $helper->outPlaceholder($fri_nws_html, 'pop_sugg_ctry', $fri_js);
        // sleep(2);
            
        //    $list_pbc_suggs = $this->getPublicSuggestion();
        //    $pub_nws_html = $this->renderView('OPSocialBundle:Home:pbc-sugg-news.html.twig',  array('list_pbc_suggs'=>$list_pbc_suggs));
        //    $pub_nws_js = file_get_contents('http://opinion/app/social/pbc-sugg-news.js');
        //    $helper->outPlaceholder($pub_nws_html, 'pop_sugg_wld', $pub_nws_js);
            
//            $renderSuggNews = $this->renderView('OPSocialBundle:Home:renderSuggNews.html.twig');
//            $r_sugg_js =''; // file_get_contents('http://opinion/app/user/home-user-suggest.js');
//            $helper->outPlaceholder($renderSuggNews, 'pop_sugg_ctry', $r_sugg_js);
//            sleep(2);
//            $quik_story = $this->renderView('OPSocialBundle:Home:quik-story-graph.html.twig');
//            $quik_story_js = file_get_contents('http://opinion/app/social/quik-story.js');
//            $helper->outPlaceholder($quik_story, 'q-time', $quik_story_js);

            $bottom = $this->renderView('OPSocialBundle::bottom.html.twig');
            echo $bottom;
    }
    
    private function goWelcomePage($helper, $request)
    {
        $session = $request->getSession();
        if (class_exists('\Symfony\Component\Security\Core\Security')) {
            $authErrorKey = Security::AUTHENTICATION_ERROR;
            $lastUsernameKey = Security::LAST_USERNAME;
        } else {
            // BC for SF < 2.6
            $authErrorKey = SecurityContextInterface::AUTHENTICATION_ERROR;
            $lastUsernameKey = SecurityContextInterface::LAST_USERNAME;
        }

        //  get the error if any (works with forward and redirect -- see below)
        if ($request->attributes->has($authErrorKey)) {
            $error = $request->attributes->get($authErrorKey);
        } elseif (null !== $session && $session->has($authErrorKey)) {
            $error = $session->get($authErrorKey);
            $session->remove($authErrorKey);
        } else {
            $error = null;
        }

        if (!$error instanceof AuthenticationException) {
            $error = null; // The value does not come from the security component.
        }

        // last username entered by the user
        $lastUsername = (null === $session) ? '' : $session->get($lastUsernameKey);


        if ($this->has('security.csrf.token_manager')) {
            $csrfToken = $this->get('security.csrf.token_manager')->getToken('authenticate')->getValue();
        } else {
            // BC for SF < 2.4
            $csrfToken = $this->has('form.csrf_provider')
                ? $this->get('form.csrf_provider')->generateCsrfToken('authenticate')
                : null;
        }       
        
        $description = "Welcome To opinion";
        $top =$this->renderView('::base.html.twig', array('title'=>'Welcome to Opinion',
                                                          'description'=>$description,
                                                          'last_username' => $lastUsername,
                                                          'error' => $error,
                                                          'csrf_token' => $csrfToken));
        
        $helper->out($top);
        sleep(2);
        
        $register_view = $this->registerView($request);
        $register_js = file_get_contents('http://opinion/app/social/pbc-sugg-news.js');
        $helper->outPlaceholder($register_view, 'wlc_register_ctnr', $register_js);
                
        $bottom = $this->renderView('OPSocialBundle:Welcome:bottom.html.twig');
        echo $bottom;
    }

    public function getFreindsNewsSuggestion(){
        //find all friends news suggestion from database
        $fri_nws_suggs = $this->getDocumentManager()
                              ->getRepository('OPSocialBundle:Notification')
                              ->findSimpleFriendsNotes($this->getFriendsIds());
        // $constructor = $this->container
        //                     ->get('op_social.notification_constructor');
        $list_fr_suggs = [];
        foreach ($fri_nws_suggs as $fri_nws_sugg) {
            if($target = $fri_nws_sugg->getOpinion()){ 
                $list_fr_suggs[] = $constructor->getOpinionNote($fri_nws_sugg);
            }elseif($target = $fri_nws_sugg->getPost()){
                $list_fr_suggs[] = $constructor->getPostNote($fri_nws_sugg);
            }elseif($target = $fri_nws_sugg->getComment()){
                $list_fr_suggs[] = $constructor->getCommentNote($fri_nws_sugg);
            }elseif($target = $fri_nws_sugg->getOshare()){
                $list_fr_suggs[] = $constructor->getOshareNote($fri_nws_sugg);
            }elseif($target = $fri_nws_sugg->getLeftcomment()){
                $list_fr_suggs[] = $constructor->getLeftcommentNote($fri_nws_sugg);
            }elseif($target = $fri_nws_sugg->getRightcomment()){
                $list_fr_suggs[] = $constructor->getRightcommentNote($fri_nws_sugg);
            }elseif($target = $fri_nws_sugg->getPshare()){
                $list_fr_suggs[] = $constructor->getPshareNote($fri_nws_sugg);
            }else{
                //do nothing
            }
        }
        return $list_fr_suggs;
    }
    
    private function getNewsScripts()
    {
        $loadsharjs = file_get_contents('http://opinion/app/social/jquery-loading-share.js');
        $cformjs = file_get_contents('http://opinion/app/post/comment-form.js');
        $rlformjs = file_get_contents('http://opinion/app/opinion/right-left-comment-form.js');
        $rlcommentjs = file_get_contents('http://opinion/app/opinion/right-left-comment.js');
        $jqueryUI = file_get_contents('http://opinion/app/social/news.js');
        $postjs = file_get_contents('http://opinion/app/post/post.js');
        $opinionjs = file_get_contents('http://opinion/app/opinion/opinion.js');
        $commentjs = file_get_contents('http://opinion/app/post/comment.js');
        $likejs = file_get_contents('http://opinion/app/post/like.js');
        $form_questionJs = file_get_contents('http://opinion/app/message/question-form.js');
        $questionJs = file_get_contents('http://opinion/app/message/question.js');
        $shareJs = file_get_contents('http://opinion/app/post/post-share.js');
        $imageJs = file_get_contents('http://opinion/app/post/image.js');
        $post_editJs = file_get_contents('http://opinion/app/post/rate-like.js');
        $rateJs     = file_get_contents('http://opinion/app/post/post-edit.js');
        $under_formJs = file_get_contents('http://opinion/app/post/under-comment-form.js');
        $under_comJs = file_get_contents('http://opinion/app/post/under-comment.js');
        $newsScripts = $cformjs.' '.$postjs.' '.$opinionjs.' '.$loadsharjs.' '.$form_questionJs.' '
                    .$rlformjs.' '.$rlcommentjs.' '.$jqueryUI.' '.$commentjs.' '.$likejs.' '.$questionJs
                    .' '.$shareJs.' '.$imageJs.' '.$post_editJs.' '.$rateJs.' '.$under_formJs.' '.$under_comJs;
        
        return $newsScripts;
    }
    
    private function getNewsView()
    {
        /**@var $news provider */
        //$news_provider = $this->container->get('op_social.news_provider');       
        $listNews = []; //$news_provider->loadNews();

        $newsView = $this->renderView('OPSocialBundle:Home:news.html.twig', 
                                  array('listNews'=> $listNews, 
                                        'user'=>$this->_getUser()));
        return $newsView;
    }
    
    protected function getUserSuggestion($request, $userManager){
        $auth_user = $this->_getUser();
        $user_suggests = $UserManager->lessUserSuggest($auth_user);
        $dm = $this->getDocumentManager();
        $repos = $dm->getRepository('\OP\UserBundle\Document\Invitation\Invitation');
        $datas = [];
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
        return $datas;
    }
    
    public function getFriendsIds()
    {
        $friends = $this->container->get('op_user.user_manager')
                        ->selectFriends($this->_getUser()->getUsername());
        $friends_ids = [];
        foreach($friends as $friend){
            if(is_object($friend)){
                $friends_ids[] = (string)$friend->{'$id'};
            }            
        }
        return $friends_ids;
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
