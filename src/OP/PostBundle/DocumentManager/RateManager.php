<?php
namespace OP\PostBundle\DocumentManager;

use OP\PostBundle\Document\Rate;

/**
 */
class RateManager extends AbstractManager
{
    /**
     * @param Comment $comment
     * @param Boolean $andFlush Whether to flush the changes (default true)
     */    
    public function saveRate(Rate $rate)
    {
        $type   = $this->request->query->get('type');
        $refId  = $this->request->query->get('objId');
        $userId = $this->getAuthenticatedUser()->getId();

        $rate->setType($type);
        $rate->setRefValid($refId);

        if($type === 'post') $rate = $this->ratePost($rate, $refId, 'add');
        if($type === 'leftcomment') $rate = $this->rateLeftComment($rate, $refId, 'add');
        if($type === 'rightcomment') $rate = $this->rateRightComment($rate, $refId, 'add');

        $this->dm->persist($rate);
        $this->dm->flush();
    }

    /**
     * This is not participant deletion but real deletion
     * @param Plike $clike the  to delete
     */
    public function updateRate(Rate $rate)
    {
        $type   = $rate->getType();
        $refId  = $rate->getRefValid();

        $this->request->getSession()->start();
        $contents   = $this->request->request->all();       
        $data       = json_decode($this->request->getContent(), true);        
        $value      =   !$this->request->getFormat('application/json') ? 
                            $contents['rate']['rate']: $data['rate'];

        if($type === 'post') $rate = $this->ratePost($rate, $refId, 'update');
        if($type === 'leftcomment') $rate = $this->rateLeftComment($rate, $refId, 'update');
        if($type === 'rightcomment') $rate = $this->rateRightComment($rate, $refId, 'update');

        $rate->setRate($value);

        $this->dm->flush();
    }

    /**
     * @param Comment $comment
     * @param Boolean $andFlush Whether to flush the changes (default true)
     */    
    public function deleteRate(Rate $rate)
    {
        $type   = $rate->getType();
        $refId  = $rate->getRefValid();

        if($type === 'post') $rate = $this->ratePost($rate, $refId, 'delete');
        if($type === 'leftcomment') $rate = $this->rateLeftComment($rate, $refId, 'delete');
        if($type === 'rightcomment') $rate = $this->rateRightComment($rate, $refId, 'delete');

        $this->dm->remove($rate);
        $this->dm->flush();
    }

    protected function ratePost($rate, $refId, $how) {

        $post       = $this->getPost($refId);
        $userId     = $this->getAuthenticatedUser()->getId();
        $rateValue  = $rate->getRate();
        $totalRate  = $post->getTotalRate();
        $session    = $this->request->getSession();

        if(!$session->isStarted()) $session->start();
        if($how === 'add') {
            $post->incrementLikers();
            $post->setTotalRate($totalRate + $rateValue);
            $post->doLikersIds($userId, 'push');
            $rate->setPost($post);
        } 
        else if($how === 'update') {            
            $diff = $totalRate - $session->get('prevRateValue');
            $post->setTotalRate($diff + $rateValue);
            $rate->setRate($this->newRate());
        } 
        else {
            $post->decrementLikers();
            $post->setTotalRate($totalRate - $rate->getRate());
            $post->doLikersIds($userId, 'pull');
        }
        return $rate;
    }

    protected function rateLeftComment($rate, $refId, $how) {

        $comment    = $this->getLeftComment($refId);
        $userId     = $this->getAuthenticatedUser()->getId();
        $rateValue  = $rate->getRate();
        $totalRate  = $comment->getTotalRate();
        $session    = $this->request->getSession();

        if(!$session->isStarted()) $session->start();
        if($how === 'add') {
            $comment->incrementLikers();
            $comment->setTotalRate($totalRate + $rateValue);
            $comment->doLikersIds($userId, 'push');
            $rate->setLeftComment($comment);
        } 
        else if($how === 'update') {            
            $diff = $totalRate - $session->get('prevRateValue');
            $comment->setTotalRate($diff + $rateValue);
            $rate->setRate($this->newRate());
        } 
        else {
            $comment->decrementLikers();
            $comment->setTotalRate($totalRate - $rate->getRate());
            $comment->doLikersIds($userId, 'pull');
        }
        return $rate;
    }

    protected function rateRightComment($rate, $refId, $how) {
        $comment    = $this->getRightComment($refId);
        $userId     = $this->getAuthenticatedUser()->getId();
        $rateValue  = $rate->getRate();
        $totalRate  = $comment->getTotalRate();
        $session    = $this->request->getSession();

        if(!$session->isStarted()) $session->start();
        if($how === 'add') {
            $comment->incrementLikers();
            $comment->setTotalRate($totalRate + $rateValue);
            $comment->doLikersIds($userId, 'push');
            $rate->setRightComment($comment);
        } 
        else if($how === 'update') {            
            $diff = $totalRate - $session->get('prevRateValue');
            $comment->setTotalRate($diff + $rateValue);
            $rate->setRate($this->newRate());
        } 
        else {
            $comment->decrementLikers();
            $comment->doLikersIds($userId, 'pull');
            $comment->setTotalRate($totalRate - $rate->getRate());
        }
        return $rate;
    }

    protected function newRate() {
        $contents   = $this->request->request->all();       
        $data       = json_decode($this->request->getContent(), true);        
        $value      =   !$this->request->getFormat('application/json') ? 
                            $contents['rate']['rate']: $data['rate'];
        return $value;
    }

    protected function getPost($id) {
        $ref = $this->dm->getRepository('OPPostBundle:Post')->find($id);
        if (!$ref) return null; //return error
        return $ref;
    }

    protected function getLeftComment($id) {
        $ref = $this->dm->getRepository('OPPostBundle:LeftComment')->find($id);
        if (!$ref) return null; //return error
        return $ref;
    }

    protected function getRightComment($id) {
        $ref = $this->dm->getRepository('OPPostBundle:RightComment')->find($id);
        if (!$ref) return null; //return error
        return $ref;
    }
}
