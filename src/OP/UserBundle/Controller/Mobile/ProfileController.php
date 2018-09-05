<?php

namespace OP\UserBundle\Controller\Mobile;

use FOS\UserBundle\FOSUserEvents,
    FOS\UserBundle\Event\FormEvent,
    FOS\UserBundle\Model\UserInterface,
    OP\UserBundle\Security\UserProvider,
    OP\SocialBundle\SeveralClass\ReactJS,
    OP\SocialBundle\SeveralClass\FlushHelper,
    Symfony\Component\HttpFoundation\Request,
    FOS\UserBundle\Event\GetResponseUserEvent,
    FOS\UserBundle\Event\FilterUserResponseEvent,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Component\HttpFoundation\RedirectResponse,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Symfony\Component\HttpFoundation\StreamedResponse,
    Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * Controller managing the user profile
 *
 * @author Christophe Coevoet <stof@notk.org>
 */
class ProfileController extends Controller
{
    /**
     * Show the user
     */
    public function showAction(Request $request, UserProvider $uProvider)
    {
        $helper = new FlushHelper();
        return new StreamedResponse (function() use ($helper, $request){
            $request->getSession()->start();
            $username = str_replace('/', '', $request->getPathInfo());
            $s_user = $this->get('fos_user.user_manager')->findUserByUsername($username);         //find user
            if (!is_object($s_user) || !$s_user instanceof UserInterface) {
                throw new AccessDeniedException('This user does not have access to this section.');
            }

            $user=$this->_getUser(); 
            if (!is_object($user) || !$user instanceof UserInterface) {
                throw new AccessDeniedException('This user does not have access to this section.');
            }
            $description = 'The MDN Learning Area aims to provide complete beginners to the Web with all they need to know to get started with developing web sites and applications.';
            $top =$this->renderView('::base.html.twig', array('title'=>$s_user->getFirstname(), 'description'=>$description));
            $helper->out($top);

            $home = $this->renderView('OPUserBundle:Profile:home.html.twig');
            $homejs = file_get_contents('http://opinion/app/user/home.js');
            $helper->outPlaceholder($home, 'h_cont', $homejs);
            sleep(1);
            
            $userInfo = $this->renderView('OPUserBundle:Profile:profile-head.html.twig', array('thisUser'=> $s_user));
            $userInfoScript='';
            $helper->outPlaceholder($userInfo, '_0', $userInfoScript);
            sleep(1);
            
            $menu = $this->renderView('OPUserBundle:Profile:sticky-menu.html.twig', array('thisUser' =>$s_user));
            $menu_js = file_get_contents('http://opinion/app/user/stickyMenu.js');
            $helper->outPlaceholder($menu, '_01', $menu_js);
            sleep(1);

            $h_store = $this->renderView('OPUserBundle:Profile:home-store.html.twig', array('thisUser' =>$s_user));
            $h_store_js = '';
            $helper->outPlaceholder($h_store, '_02', $h_store_js);
            sleep(1);
            
            $details = $this->renderView('OPUserBundle:Profile:details.html.twig', array('thisUser'=> $s_user));
            $details_js = file_get_contents('http://opinion/app/user/details.js');
            $helper->outPlaceholder($details, '_3', $details_js);
            sleep(1);
            
            $about = $this->renderView('OPUserBundle:Profile:small-about.html.twig', array('thisUser'=>$s_user, 'infos'=>$this->userInfo($username)));
            $about_js = '';
            $helper->outPlaceholder($about, 'in_detail_about', $about_js);
            
            $ng_view = $this->renderView('OPUserBundle:Profile:ng-view.html.twig');
            $ng_view_js = '';
            $helper->outPlaceholder($ng_view, '_03', $ng_view_js);
            sleep(1);
            
            $interest = $this->renderView('OPUserBundle:Profile:small-interest.html.twig', array('thisUser'=>$s_user));
            $interest_js = '';
            $helper->outPlaceholder($interest, 'in_detail_interst', $interest_js);
            sleep(1);
            
            $pform = $this->createForm(PostType::class, new Post());
            $form = $this->renderView('OPSocialBundle:Home:form.html.twig', array('pform'=> $pform->createView(), 'user'=>$user));
            $post_form_js = file_get_contents('http://opinion/app/post/post-form.js');
            $helper->outPlaceholder($form, '_1', $post_form_js);
            sleep(2);
            
            $photos = $this->renderView('OPUserBundle:Profile:small-photos-view.html.twig', 
                array('thisUser'=>$s_user, 'photos'=>$this->returnImages($s_user->getId())));
            $photo_js = file_get_contents('http://opinion/app/media/small-photo.js');
            $helper->outPlaceholder($photos, 'show_usr_plus_pic', $photo_js);
            sleep(1);
            
            $friends = $this->renderView('OPUserBundle:Profile:small-friends-list.html.twig', 
                                          array('thisUser'=>$s_user, 
                                                'followers'=>$this->getFollowers($username, $uProvider),
                                                'followeds'=>$this->getFolloweds($username, $uProvider),
                                                'friends' =>$this->getFriends($username, $uProvider)
                                                )
                                        );
            $friend_js = '';
            $helper->outPlaceholder($friends, 'show_usr_plus_ff', $friend_js);
            sleep(1);
            
            
            $online = $this->renderView('OPUserBundle:Profile:online_block.html.twig');
            $online_js= file_get_contents('http://opinion/app/user/online.js');
            $helper->outPlaceholder($online, '_2', $online_js);
            sleep(2);
            
//            $renderNews = $this->renderView('OPSocialBundle:Home:renderNews.html.twig');
//            $newsScript = '';
//            $helper->outPlaceholder($renderNews, '_5', $newsScript);
//            sleep(2);
//            
//            $bottom = $this->renderView('OPSocialBundle::bottom.html.twig');
//            echo $bottom;
        });
    }

    /**
    *
    *
    */
    public function getUserInfosAction(Request $request)
    {

        $infos = [];
        $str_path = explode('/', $request->getPathInfo());
        $username = $str_path[1];

        $um = $this->get('op_user.user_manager');
        $userInfos = $um->simpleUserByUsername($username);

        $infos = [];
        $um = $this->get('op_user.user_manager');
        $user = $um->simpleUserByUsername($username);

        $infos ['username'] = $user['username'];
        $infos ['email']    = $user['email'];
        $infos ['gender']   = $user['gender'];
        if(isset($user['contacts'])){
            foreach ($user['contacts'] as $key => $value) {
                $infos[$key] = $value;
            }
        }
        if(isset($user['about'])){
            foreach ($user['contacts'] as $key => $value) {
                $infos[$key] = $value;
            }
        }
        $response = new JsonResponse();
        return $response->setData(array('infos'=>$infos));
    }
    
    protected function userInfo($username)
    {
        $infos = [];
        $um = $this->get('op_user.user_manager');
        $user = $um->simpleUserByUsername($username);
        $infos ['username'] = $user['username'];
        $infos ['email']    = $user['email'];
        $infos ['gender']   = $user['gender'];
        if(isset($user['contacts'])){
            foreach ($user['contacts'] as $key => $value) {
                $infos[$key] = $value;
            }
        }  
        return $infos;
    }

    protected function othersInfo($username)
    {
        $infos = [];
        $um = $this->get('op_user.user_manager');
        $user = $um->simpleUserByUsername($username);
        if(isset($user['address'])){
            foreach ($user['address'] as $key => $value) {
                if($key == "firstCell" || $key == "")
                $infos[$key] = $value;
            }
        }        
        return $infos;
    }

    public function getCoverImageAction()
    {
        $user = $this->_getUser();
        $coverPath = $user->getCoverPic() ? '\/opinion/' . $user->getCoverPic()->getWebPath()
                                      : '';
        $coverId = $user->getCoverPic() ? $user->getCoverPic()->getId() : '';
        $response = new JsonResponse();

        return $response->setData(array('webPath'=>$coverPath, 'imageId'=>$coverId));
    }

    public function getProfileImageAction()
    {
        $user = $this->_getUser();
        $picPath = $user->getProfilePic() ? '\/opinion/' . $user->getProfilePic()->getWebPath()
                                      : '';
        $picId = $user->getProfilePic() ? $user->getProfilePic()->getId() : '';
        $response = new JsonResponse();

        return $response->setData(array('webPath'=>$picPath, 'imageId'=>$picId));
    }

    public function getImagesAction()
    {
        $img_construct = $this->get('op_media.image_constructor');
        $userId = $this->_getUser()->getId();
        $images = $this->getDocumentManager()
                       ->getRepository('OPMediaBundle:Image')
                       ->findTenImagesForUserId($userId);

        $response = new JsonResponse();
        return $response->setData(array('images'=>$img_construct->imagesToArray($images)));
    }


    /**
     * Show the user
     */
    public function showAjaxAction($username)
    {
        $s_user = $this->get('fos_user.user_manager')->findUserByUsername($username);

        if (!is_object($s_user) || !$s_user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }
        $user = $this->_getUser();
        if (!is_object($user) || !$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        if ($s_user == $user){

            return new JsonResponse(array('message'=>'c\'est lui'));
        }else{
            return new JsonResponse(array('message'=>'ce n\'est lui'));
        }

    }

    /**
     * Edit the user
     */
    public function editAction(Request $request)
    {
        $user = $this->_getUser();
        if (!is_object($user) || !$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        /** @var $dispatcher \Symfony\Component\EventDispatcher\EventDispatcherInterface */
        $dispatcher = $this->get('event_dispatcher');

        $event = new GetResponseUserEvent($user, $request);
        $dispatcher->dispatch(FOSUserEvents::PROFILE_EDIT_INITIALIZE, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }

        /** @var $formFactory \FOS\UserBundle\Form\Factory\FactoryInterface */
        $formFactory = $this->get('fos_user.profile.form.factory');

        $form = $formFactory->createForm();
        $form->setData($user);

        $form->handleRequest($request);

        if ($form->isValid()) {
            /** @var $userManager \FOS\UserBundle\Model\UserManagerInterface */
            $userManager = $this->get('fos_user.user_manager');

            $event = new FormEvent($form, $request);
            $dispatcher->dispatch(FOSUserEvents::PROFILE_EDIT_SUCCESS, $event);

            $userManager->updateUser($user);

            if (null === $response = $event->getResponse()) {
                $url = $this->generateUrl('fos_user_profile_show');
                $response = new RedirectResponse($url);
            }

            $dispatcher->dispatch(FOSUserEvents::PROFILE_EDIT_COMPLETED, new FilterUserResponseEvent($user, $request, $response));

            return $response;
        }

        return $this->render('FOSUserBundle:Profile:edit.html.twig', array(
            'form' => $form->createView()
        ));
    }

    public function userOnlinesAction($userId){
        // $s_users = $this->get('fos_user.user_manager')->findBy(array('userId'=$userId));

        foreach ($s_users as $user) {
            if (!is_object($s_user) || !$s_user instanceof UserInterface) {
                throw new AccessDeniedException('This user does not have access to this section.');
            }else{

            }
        }


        $user = $this->_getUser();
        if (!is_object($user) || !$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        if ($s_user == $user){

            return new JsonResponse(array('message'=>'c\'est lui'));
        }else{
            return new JsonResponse(array('message'=>'ce n\'est lui'));
        }
    }

    protected function getFollowers($username, $uProvider)
    {
        $um = $this->get('op_user.user_manager');
        return $uProvider->getFollowers($uProvider->getFollowerIds($um->simpleUserByUsername($username)), 0, 8);
    }

    protected function getFolloweds($username, $uProvider)
    {
        $um = $this->get('op_user.user_manager');
        return $uProvider->getFolloweds($uProvider->getFollowedIds($um->simpleUserByUsername($username)), 0, 8);
    }

    protected function getFriends($username, $uProvider)
    {
        $um = $this->get('op_user.user_manager');
        return $uProvider->getFriends($uProvider->getFriendIds($um->simpleUserByUsername($username)), 0, 8);
    }
    
    protected function returnImages($userId)
    {   
        $img_construct = $this->get('op_media.image_constructor');
        $images = $this->getDocumentManager()
                       ->getRepository('OPMediaBundle:Image')
                       ->findTenImagesForUserId($userId);
        return $img_construct->imagesToArray($images);
    }
}
