<?php
namespace OP\SocialBundle\Controller;

use OP\SocialBundle\Document\NewSuggestion,
    Symfony\Component\HttpFoundation\Request,
    OP\SocialBundle\SeveralClass\FlushHelper,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Component\HttpFoundation\StreamedResponse,
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
        $helper = new FlushHelper();

        return new StreamedResponse (function()  use   ($helper, $request){
            $list_fr_suggs = $this->getFreindsNewsSuggestion();
            $fri_nws_html = $this->renderView('OPSocialBundle:Home:fri-sugg-news.html.twig', array('list_fr_suggs'=>$list_fr_suggs));
            $fri_js = file_get_contents('http://127.0.0.1/opinion/web/js/social/fri-sugg-news.js');
            $helper->outPlaceholder($fri_nws_html, 'pop_sugg_ctry', $fri_js);

            $list_pbc_suggs = $this->getPublicSuggestion();
            $fri_nws_html = $this->renderView('OPSocialBundle:Home:pbc-sugg-news.html.twig',  array('list_pbc_suggs'=>$list_pbc_suggs));
            $fri_js = file_get_contents('http://127.0.0.1/opinion/web/js/social/pbc-sugg-news.js');
            $helper->outPlaceholder($fri_nws_html, 'pop_sugg_wld', $fri_js);
        });
    }

    public function getFreindsNewsSuggestion(){
        //find all friends news suggestion from database
        $fri_nws_suggs = $this->get('doctrine_mongodb.public')->getManager()->getRepository('OPSocialBundle:Notification')->findAll();
        //$constructor = $this->container->get('op_social.notification_constructor');
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

    public function getPublicSuggestion(){
        //find all friends news suggestion from database
        $pbc_suggs = $this->get('doctrine_mongodb.public')->getManager()->getRepository('OPSocialBundle:Notification')->findAll();
        $constructor = $this->container->get('op_social.notification_constructor');
        $list_pbc_suggs = [];
        foreach ($pbc_suggs as $pbc_sugg) {
            if($target = $pbc_sugg->getOpinion()){
                $list_pbc_suggs[] = $constructor->getOpinionNote($pbc_sugg);
            }elseif($target = $pbc_sugg->getPost()){
                $list_pbc_suggs[] = $constructor->getPostNote($pbc_sugg);
            }elseif($target = $pbc_sugg->getComment()){
                $list_pbc_suggs[] = $constructor->getCommentNote($pbc_sugg);
            }elseif($target = $pbc_sugg->getOshare()){
                $list_pbc_suggs[] = $constructor->getOshareNote($pbc_sugg);
            }elseif($target = $pbc_sugg->getLeftcomment()){
                $list_pbc_suggs[] = $constructor->getLeftcommentNote($pbc_sugg);
            }elseif($target = $pbc_sugg->getRightcomment()){
                $list_pbc_suggs[] = $constructor->getRightcommentNote($pbc_sugg);
            }elseif($target = $pbc_sugg->getPshare()){
                $list_pbc_suggs[] = $constructor->getPshareNote($pbc_sugg);
            }else{
                //do nothing
            }
        }
        return $list_pbc_suggs;
    }
}
