<?php
namespace OP\SocialBundle\Controller;

use Symfony\Component\HttpFoundation\Request,
    Symfony\Component\Security\Core\Security,
    Symfony\Component\HttpFoundation\Response,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Cache,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Method,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * Home controller.
 *
 * @Route("/")
 */
class TemplateController extends Controller
{
    /**
     *
     * @Route("/tpl/social/{templateName}.{_format}", name="get_social_static_template", 
     *         requirements={"_format": "html", "templateName": ".+"
     * })
     *
     * @Cache(expires="tomorrow")
     * @return array
     */
    public function getSocialStaticTemplateAction($templateName, $_format){
        $view = $this->renderView('OPSocialBundle:Static:'.$templateName.'.'.$_format.'.twig');
        return  new Response($view);
    }

     /**
     *
     * @Route("/tpl/user/{templateName}.{_format}", name="get_user_static_template", 
     *         requirements={"_format": "html", "templateName": ".+"
     * })
     *
     * @Cache(expires="tomorrow")
     * @return array
     */
    public function getUserStaticTemplateAction($templateName, $_format){
        $view = $this->renderView('OPUserBundle:Static:'.$templateName.'.'.$_format.'.twig');
        return new Response($view);
    }

     /**
     *
     * @Route("/tpl/post/{templateName}.{_format}", name="get_post_static_template", 
     *         requirements={"_format": "html", "templateName": ".+"
     * })
     *
     * @Cache(expires="tomorrow")
     * @return array
     */
    public function getPostStaticTemplateAction($templateName, $_format){
        $view = $this->renderView('OPPostBundle:Static:'.$templateName.'.'.$_format.'.twig');
        return new Response($view);
    }

     /**
     *
     * @Route("/tpl/media/{templateName}.{_format}", name="get_media_static_template", 
     *         requirements={"_format": "html", "templateName": ".+"
     * })
     *
     * @Cache(expires="tomorrow")
     * @return array
     */
    public function getMediaStaticTemplateAction($templateName, $_format){
        $view = $this->renderView('OPMediaBundle:Static:'.$templateName.'.'.$_format.'.twig');
        return new Response($view);
    }
}