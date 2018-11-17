<?php
namespace OP\SocialBundle\Controller;

use Symfony\Component\HttpFoundation\Request,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Method,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * Home controller.
 *
 * @Route("/")
 */
class SuggestionController extends Controller
{
    /**
     * render pop sugg in home page
     *
     * @Route("/render-h-pop-sugg)", name="op_social_home_pop_sugg")
     * @Method("GET")
     * @Template()
     *
     * @return array
     */
    public function renderSuggNewsAction(Request $request)
    {
        
    }

    public function getFreindsNewsSuggestion(){
        
    }

    public function getPublicSuggestion(){
        
    }
}
