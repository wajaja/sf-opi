<?php

namespace OP\SocialBundle\Controller;

use Symfony\Component\HttpFoundation\Request,
    OP\SocialBundle\SeveralClass\FlushHelper,
    OP\SocialBundle\Provider\NewsProvider,
    Symfony\Component\HttpFoundation\StreamedResponse,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Method,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * Home controller.
 *
 * @Route("/news/")
 */
class NewsController extends Controller
{
    /**
     * renderNews
     *
     * @Route("/", name="op_social_news")
     * @Method("GET")
     * @Template()
     *
     * @return array
     */
    public function getNewsAction(Request $request, NewsProvider $news_provider)
    {    
        $listNews = $news_provider->loadNews();
        $helper = new FlushHelper();
        return new StreamedResponse(function() use ($request, $helper, $listNews){
            $request->getSession()->start();
            $top =$this->renderView('::base.html.twig', array('title'=>'News'));
            $helper->out($top);
            
            $helper->outPlaceholder($this->getNewsView(), '_5', $this->getNewsScripts());
            sleep(2);
            $this->render('OPSocialBundle:Home:news_page.html.twig', 
                                  array('listNews'=> $listNews, 
                                        'user'=>$this->_getUser()));
        });
        
    }
    
    protected function getNewsView()
    {
         /**@var $news provider */
        $news_provider = $this->container
                              ->get('op_social.news_provider');       
        $listNews = $news_provider->loadNews();
        $newsView = $this->renderView('OPSocialBundle:Home:news.html.twig', 
                                  array('listNews'=> $listNews, 
                                        'user'=>$this->_getUser()));
        return $newsView;
    }
}
