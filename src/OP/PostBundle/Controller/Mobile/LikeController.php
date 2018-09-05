<?php

namespace OP\PostBundle\Controller;

use OP\PostBundle\Document\Like,
    OP\PostBundle\Form\LikeType,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Method,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    OP\PostBundle\FormHandler\NewPostFormHandler,
    OP\SocialBundle\DocumentManager\NotificationManager,
    Symfony\Component\EventDispatcher\EventDispatcherInterface,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * Like controller.
 *
 * @Route("/like")
 */
class LikeController extends Controller
{
    
    /**
     * Creates a new Like document.
     ** @Method("POST")
     * @Route("/create/{id}", name="like_create", options={"expose"=true})
     * @Template("OPSocialBundle:Home:new.html.twig")
     *
     * @param string $id The document ID
     * @param Request $request
     *
     * @return
     */
    public function createAction($id, Request $request, NewPostFormHandler $formHandler, EventDispatcherInterface $dispatcher, NotificationManager $notifMan)
    {
        //$response = new JsonResponse();
        $like = new Like();
        if('POST'==$request->getMethod()){
            $post = $this->getDocumentManager()->getRepository('OPPostBundle:Post')->find($id);
            if (!$post) {
                $response = new JsonResponse();
                return $response->setData(array('response'=>array('msg'=>'Unable to find Post', 'status'=>false))); //return error
            }
            $like->setPostId($post);  
            $like->setPostValid($post->getId());                   //set the value
        }
        
        $likeForm = $this->createForm(LikeType::class, $like);        
        if($request->isXmlHttpRequest()){                           //process data througt methode
            $response = new JsonResponse();
            if($like = $formHandler->process($likeForm, false)){
                $notifMan->likeNotif($like);          //create some notification for all users subscribed
                return $response->setData(array('response'=>array('status'=>true, 
                                                'nb_likes'=>$post->getNbLikers(),
                                                'data_rat'=>$post->getTotalRate(),
                                                'data_ttl_rat'=>$post->getNbLikers()*50)));
            }else{
                return $response->setData(array('response'=>array('status'=>false)));
            }
        }else{
            if($like = $formHandler->process($likeForm, false)){
                $notifMan->likeNotif($like);
                return $this->redirect('/opinion/web/app_dev.php/');
            }else{
                return $this->render('OPPostBundle:Like:new_like.html.twig',
                                    array('likeForm'=>$likeForm->createView(), 'user'=>$this->_getUser()));
            }
        }
    }
    
    /**
     * update Clike document.
     ** @Method("POST")
     * @Route("/update/{id}", name="update_like", options={"expose"=true})
     * @Template("OPSocialBundle:Home:new.html.twig")
     *
     * @param string $id The document ID
     * @param Request $request
     *
     * @return
     */
    public function updateAction($id, Request $request)
    {
        //$response = new JsonResponse();
        $user = $this->_getUser();
        $dm = $this->getDocumentManager();
        $post = $dm->getRepository('OPPostBundle:Post')->find($id);
        $like = $dm->getRepository('OPPostBundle:Like')->findLikeForUserId($user, $post);

        if('POST'== $request->getMethod()){
            if (!$post) {
                $response = new JsonResponse();
                return $response->setData(array('response'=>array('msg'=>'Unable to find Comment', 'status'=>false))); //return error
            }
            $post->setTotalRate($post->getTotalRate() - $like->getRate());
        }

        $likeForm = $this->createForm(LikeType::class, $like);
        if($request->isXmlHttpRequest()){                           //process data througt methode
            $response = new JsonResponse();
            if($like = $formHandler->process($likeForm, true)){
                return $response->setData(array('response'=>array('status'=>true,
                                                'data_rat'=>$post->getTotalRate())));
            }else{
                return $response->setData(array('response'=>array('status'=>false)));
            }
        }else{
            if($like = $formHandler->process($likeForm, true)){
                return $this->redirect('/opinion/web/app_dev.php/');
            }else{
                return $this->render('OPPostBundle:Clike:new_clike.html.twig',
                                    array(  'clikeForm'=>$likeForm->createView(), 'user'=>$this->_getUser()));
            }
        }
    }
    
    /**
     * update Clike document.
     ** @Method("GET")
     * @Route("/list/{id}", name="list_like", options={"expose"=true})
     * @param string $id The document ID
     * @param Request $request
     *
     * @return
     */
    public function listAction($id, Request $request)
    {
        //$response = new JsonResponse();
        $user = $this->_getUser();
        $dm = $this->getDocumentManager();
        $post = $dm->getRepository('OPPostBundle:Post')->find($id);
        $likes = $dm->getRepository('OPPostBundle:Like')->findListLikeForPostId($post);
//        echo var_dump($likes);
//        die();
        if($request->isXmlHttpRequest()){                           //process data througt methode
            $response = new JsonResponse();
            return $response->setData(array('response'=> $this->renderView('OPPostBundle:Like:list_like.html.twig',
                                            array('post' => $post, 'likes'=>$likes))));
        }else{
            return $this->render('OPPostBundle:Like:list_like.html.twig', array('likes'=>$likes,'post' => $post));
        }
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
