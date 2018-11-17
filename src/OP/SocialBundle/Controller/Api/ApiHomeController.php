<?php

// /src/AppBundle/Controller/RestProfileController.php

namespace OP\SocialBundle\Controller\Api;

use FOS\RestBundle\Controller\FOSRestController;

/**
 */
class ApiHomeController extends FOSRestController
{

    // /**
    //  * Note: Could be refactored to make     of the User Resolver in Symfony 3.2 onwards
    //  * more at : http://symfony.com/blog/ew-in-symfony-3-2-user-value-resolver-for-controllers
    //  */
    // public function getAction(Request $request, $username)
    // {
    //     $dm = $this->getDocumentManager();
    //     $posts = $dm->getRepository('OPPostBundle:Post')
    //                 ->singleFirstPosts();

    //     $user = $this->_getUser();
    //     /** @var $userManager \FOS\UserBundle\Model\UserManagerInterface */
    //     $userManager = $this->container->get('security.token_storage')->getToken()->getCredentials();  //$this->get('op_user.user_manager')->simpleUserByUsername($username);
    //     //$user = $userManager->getFirstname();
    //     return '$userManager';
    // }

    // /**
    //  * @Annotations\Get("/posts/")
    //  *
    //  *
    //  * Note: Could be refactored to make     of the User Resolver in Symfony 3.2 onwards
    //  * more at : http://symfony.com/blog/new-in-symfony-3-2-user-value-resolver-for-controllers
    //  */
    // public function getPostsAction(Request $request, $username)
    // {
    //     $dm = $this->getDocumentManager();
    //     $posts = $dm->getRepository('OPPostBundle:Post')
    //                 ->singleFirstPosts();

    //     $response = new JsonResponse();
    //     return $response->setData(array("posts" => $posts));
        
    // }


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