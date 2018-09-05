<?php

namespace OP\PostBundle\Controller;

use OP\PostBundle\Document\Rate,
    OP\PostBundle\Form\RateType,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\PostBundle\FormHandler\NewPostFormHandler,
    OP\SocialBundle\DocumentManager\NotificationManager,
    Symfony\Component\EventDispatcher\EventDispatcherInterface,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Method,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;



/**
 * Rate controller.
 * @Route("/rate")
 */
class RateController extends Controller
{


    /**
     * Creates a new Rate document.
     ** @Method("POST")
     * @Route("/create/{id}", name="create_rate", options={"expose"=true})
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
        $rate = new Rate();
        if('POST'== $request->getMethod()){
            $comment = $this->getDocumentManager()->getRepository('OPPostBundle:Comment')->find($id);
            if (!$comment) {
                $response = new JsonResponse();
                return $response->setData(array('response'=>array('msg'=>'Unable to find Comment', 'status'=>false))); //return error
            }
            $rate->setCommentId($comment);
            $rate->setCommentValid($comment->getId());             //set the value
        }

        $rateForm = $this->createForm(RateType::class, $rate);
        if($request->isXmlHttpRequest()){                           //process data througt methode
            $response = new JsonResponse();
            if($rate = $formHandler->process($rateForm, false)){				
                $notifMan->rateNotif($rate);          //create some notification for all users subscribed
                return $response->setData(array('response'=>array('status'=>true,
                                                'data_rat'=>$comment->getTotalRate())));
            }else{
                return $response->setData(array('response'=>array('status'=>false)));
            }
        }else{
            if($rate = $formHandler->process($rateForm, false)){
                $notifMan->rateNotif($rate);
                return $this->redirect('/opinion/web/app_dev.php/');
            }else{
                return $this->render('OPPostBundle:Rate:new_rate.html.twig',
                                    array(  'rateForm'=>$rateForm->createView(), 'user'=>$this->_getUser()));
            }
        }
    }

    /**
     * update Rate document.
     ** @Method("POST")
     * @Route("/update/{id}", name="update_rate", options={"expose"=true})
     * @Template("OPSocialBundle:Home:new.html.twig")
     *
     * @param string $id The document ID
     * @param Request $request
     *
     * @return
     */
    public function updateAction($id, Request $request, NewPostFormHandler $formHandler, EventDispatcherInterface $dispatcher)
    {
        //$response = new JsonResponse();
        $user = $this->_getUser();
        $dm = $this->getDocumentManager();
        $comment = $dm->getRepository('OPPostBundle:Comment')->find($id);
        $rate = $dm->getRepository('OPPostBundle:Rate')->findLikeForUserId($user, $comment);

        if('POST'== $request->getMethod()){
            if (!$comment) {
                $response = new JsonResponse();
                return $response->setData(array('response'=>array('msg'=>'Unable to find Comment', 'status'=>false))); //return error
            }
            $comment->setTotalRate($comment->getTotalRate() - $rate->getRate());
        }

        $rateForm = $this->createForm(RateType::class, $rate);
        if($request->isXmlHttpRequest()){                           //process data througt methode
            $response = new JsonResponse();
            if($rate = $formHandler->process($rateForm, true)){
                return $response->setData(array('response'=>array('status'=>true,
                                                'rate_id'=>$rate->getId())));
            }else{
                return $response->setData(array('response'=>array('status'=>false)));
            }
        }else{
            if($rate = $formHandler->process($rateForm, true)){
                return $this->redirect('/opinion/web/app_dev.php/');
            }else{
                return $this->render('OPPostBundle:Rate:new_rate.html.twig',
                                    array(  'rateForm'=>$rateForm->createView(), 'user'=>$this->_getUser()));
            }
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
