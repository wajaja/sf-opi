<?php

namespace OP\SocialBundle\SeveralClass;

use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * Description of NotificationConstructor
 * @author CEDRICK
 */
class NoteBaseConstructor 
{
    /**
     * @var type 
     */
    protected $tokenStorage;
    
    /**
     * date transformer 
     * @var type 
     */
    protected $transformer;
    
    /**
     *  the authentificated user
     * @var type 
     */
    protected $user;
    
    /**
     * Gets the current authenticated user
     *
     * @return ParticipantInterface
     */
    public function getAuthenticatedUser()
    {
        $user = $this->tokenStorage->getToken()->getUser();

        if (!$user instanceof \OP\UserBundle\Document\User) {
            throw new AccessDeniedException('Must be logged in with a ParticipantInterface instance');
        }
        return $user;
    }
    
    /** 
     * @param \OP\SocialBundle\Document\Notification $document
     */
    public function getOpinionNote(\OP\SocialBundle\Document\Notification $document){
        $notif['id'] = $document->getId();
        $notif['link'] = 'opinion/'.$document->getOpinion()->getId();
        $notif['date'] = $this->transformer->timestampTransform($document->getTs()->sec);
        $partics = $document->getParticipants();
            foreach ($partics as $partic) {
                $participants ['firstname'] = $partic->getFirstname();
                $participants ['lastname'] = $partic->getLastname();
                $participants ['username'] = $partic->getUsername();
            }
            $notif['participants'] = $participants;
        if($this->getAuthenticatedUser()->getId()=== $document->getAuthor()->getId()){
            $notif['author']['firstname'] = 'self';
            $notif['author']['lastname'] = 'self';
            $notif['author']['username'] = $this->getAuthenticatedUser();
        }else{
            $notif['author']['firstname'] = $document->getAuthor()->getFirstname();
            $notif['author']['lastname'] = $document->getAuthor()->getLastname();
            $notif['author']['username'] = $document->getAuthor()->getUsername();
        }
        $notif['lastPartcipant'] = $document->getLastParticipant();
        $notif['content'] = 'opinion';
        
        return $notif;
    }
    
    /**
     * 
     * @param \OP\SocialBundle\Document\Notification $document
     */
    public function getOshareNote(\OP\SocialBundle\Document\Notification $document){
        $notif['id'] = $document->getId();
        $notif['link'] = 'opinion/oshare'.$document->getOshare()->getId();
        $notif['date'] = $this->transformer->timestampTransform($document->getTs()->sec);
        $partics = $document->getParticipants();
            foreach ($partics as $partic) {
                $participants ['firstname'] = $partic->getFirstname();
                $participants ['lastname'] = $partic->getLastname();
                $participants ['username'] = $partic->getUsername();
            }
            $notif['participants'] = $participants;
        if($this->getAuthenticatedUser()->getId()=== $document->getAuthor()->getId()){
            $notif['author']['firstname'] = 'self';
            $notif['author']['lastname'] = 'self';
            $notif['author']['username'] = $this->getAuthenticatedUser();
        }else{
            $notif['author']['firstname'] = $document->getAuthor()->getFirstname();
            $notif['author']['lastname'] = $document->getAuthor()->getLastname();
            $notif['author']['username'] = $document->getAuthor()->getUsername();
        }
        $notif['lastPartcipant'] = $document->getLastParticipant();
        $notif['content'] = 'oshare';
        
        return $notif;
    }
    
    /** 
     * @param \OP\SocialBundle\Document\Notification $document
     */
    public function getLeftCommentNote(\OP\SocialBundle\Document\Notification $document){
        $notif['id'] = $document->getId();
        $notif['link'] = 'opinion/'.$document->getOpinion()->getId().'#'.$document->getLeftcomment()->getId();
        $notif['date'] = $this->transformer->timestampTransform($document->getTs()->sec);
        $partics = $document->getParticipants();
            foreach ($partics as $partic) {
                $participants ['firstname'] = $partic->getFirstname();
                $participants ['lastname'] = $partic->getLastname();
                $participants ['username'] = $partic->getUsername();
            }
            $notif['participants'] = $participants;
        if($this->getAuthenticatedUser()->getId()=== $document->getAuthor()->getId()){
            $notif['author']['firstname'] = 'self';
            $notif['author']['lastname'] = 'self';
            $notif['author']['username'] = $this->getAuthenticatedUser();
        }else{
            $notif['author']['firstname'] = $document->getAuthor()->getFirstname();
            $notif['author']['lastname'] = $document->getAuthor()->getLastname();
            $notif['author']['username'] = $document->getAuthor()->getUsername();
        }
        $notif['lastPartcipant'] = $document->getLastParticipant();
        $notif['content'] = 'leftcomment';
        
        return $notif;
    }
    
    /**
     * @param \OP\SocialBundle\Document\Notification $document
     */
    public function getRightCommentNote(\OP\SocialBundle\Document\Notification $document){
        $notif['id'] = $document->getId();
        $notif['link'] = 'opinion/'.$document->getOpinion()->getId().'#'.$document->getRightcomment()
                                                                                  ->getId();
        $notif['date'] = $this->transformer->timestampTransform($document->getTs()->sec);
        $partics = $document->getParticipants();
            foreach ($partics as $partic) {
                $participants ['firstname'] = $partic->getFirstname();
                $participants ['lastname'] = $partic->getLastname();
                $participants ['username'] = $partic->getUsername();
            }
            $notif['participants'] = $participants;
        if($this->getAuthenticatedUser()->getId()=== $document->getAuthor()->getId()){
            $notif['author']['firstname'] = 'self';
            $notif['author']['lastname'] = 'self';
            $notif['author']['username'] = $this->getAuthenticatedUser();
        }else{
            $notif['author']['firstname'] = $document->getAuthor()->getFirstname();
            $notif['author']['lastname'] = $document->getAuthor()->getLastname();
            $notif['author']['username'] = $document->getAuthor()->getUsername();
        }
        $notif['lastPartcipant'] = $document->getLastParticipant();
        $notif['content'] = 'rightcomment';
        
        return $notif;
    }
    
    /**
     * @param \OP\SocialBundle\Document\Notification $document
     */
    public function getOlikeNote(\OP\SocialBundle\Document\Notification $document){
        $notif['id'] = $document->getId();
        $notif['link'] = 'opinion/'.$document->getOpinion()->getId();
        $notif['date'] = $this->transformer->timestampTransform($document->getTs()->sec);
        $partics = $document->getParticipants();
            foreach ($partics as $partic) {
                $participants ['firstname'] = $partic->getFirstname();
                $participants ['lastname'] = $partic->getLastname();
                $participants ['username'] = $partic->getUsername();
            }
            $notif['participants'] = $participants;
        if($this->getAuthenticatedUser()->getId()=== $document->getAuthor()->getId()){
            $notif['author']['firstname'] = 'self';
            $notif['author']['lastname'] = 'self';
            $notif['author']['username'] = $this->getAuthenticatedUser();
        }else{
            $notif['author']['firstname'] = $document->getAuthor()->getFirstname();
            $notif['author']['lastname'] = $document->getAuthor()->getLastname();
            $notif['author']['username'] = $document->getAuthor()->getUsername();
        }
        $notif['lastPartcipant'] = $document->getLastParticipant();
        $notif['content'] = 'olike';
        
        return $notif;
    }
    
    /**
     * @param \OP\SocialBundle\Document\Notification $document
     */
    public function getOunlikeNote(\OP\SocialBundle\Document\Notification $document){
        $notif['id'] = $document->getId();
        $notif['link'] = 'opinion/'.$document->getOpinion()->getId();
        $notif['date'] = $this->transformer->timestampTransform($document->getTs()->sec);
        $partics = $document->getParticipants();
            foreach ($partics as $partic) {
                $participants ['firstname'] = $partic->getFirstname();
                $participants ['lastname'] = $partic->getLastname();
                $participants ['username'] = $partic->getUsername();
            }
            $notif['participants'] = $participants;
        if($this->getAuthenticatedUser()->getId()=== $document->getAuthor()->getId()){
            $notif['author']['firstname'] = 'self';
            $notif['author']['lastname'] = 'self';
            $notif['author']['username'] = $this->getAuthenticatedUser();
        }else{
            $notif['author']['firstname'] = $document->getAuthor()->getFirstname();
            $notif['author']['lastname'] = $document->getAuthor()->getLastname();
            $notif['author']['username'] = $document->getAuthor()->getUsername();
        }
        $notif['lastPartcipant'] = $document->getLastParticipant();
        $notif['content'] = 'ounlike';
        
        return $notif;
    }
    
    /**
     * @param \OP\SocialBundle\Document\Notification $document
     */
    public function getLlikeNote(\OP\SocialBundle\Document\Notification $document){
        $notif['id'] = $document->getId();
        $notif['link'] = 'opinion/'.$document->getOpinion()->getId().'#'.$document->getLeftcomment()->getId();
        $notif['date'] = $this->transformer->timestampTransform($document->getTs()->sec);
        $partics = $document->getParticipants();
            foreach ($partics as $partic) {
                $participants ['firstname'] = $partic->getFirstname();
                $participants ['lastname'] = $partic->getLastname();
                $participants ['username'] = $partic->getUsername();
            }
            $notif['participants'] = $participants;
        if($this->getAuthenticatedUser()->getId()=== $document->getAuthor()->getId()){
            $notif['author']['firstname'] = 'self';
            $notif['author']['lastname'] = 'self';
            $notif['author']['username'] = $this->getAuthenticatedUser();
        }else{
            $notif['author']['firstname'] = $document->getAuthor()->getFirstname();
            $notif['author']['lastname'] = $document->getAuthor()->getLastname();
            $notif['author']['username'] = $document->getAuthor()->getUsername();
        }
        $notif['lastPartcipant'] = $document->getLastParticipant();
        $notif['content'] = 'llike';
        
        return $notif;
    }
    
    /**
     * @param \OP\SocialBundle\Document\Notification $document
     */
    public function getRlikeNote(\OP\SocialBundle\Document\Notification $document){
        $notif['id'] = $document->getId();
        $notif['link'] = 'opinion/'.$document->getOpinion()->getId().'#'.$document->getRightcomment()
                                                                                  ->getId();
        $notif['date'] = $this->transformer->timestampTransform($document->getTs()->sec);
        $partics = $document->getParticipants();
            foreach ($partics as $partic) {
                $participants ['firstname'] = $partic->getFirstname();
                $participants ['lastname'] = $partic->getLastname();
                $participants ['username'] = $partic->getUsername();
            }
            $notif['participants'] = $participants;
        if($this->getAuthenticatedUser()->getId()=== $document->getAuthor()->getId()){
            $notif['author']['firstname'] = 'self';
            $notif['author']['lastname'] = 'self';
            $notif['author']['username'] = $this->getAuthenticatedUser();
        }else{
            $notif['author']['firstname'] = $document->getAuthor()->getFirstname();
            $notif['author']['lastname'] = $document->getAuthor()->getLastname();
            $notif['author']['username'] = $document->getAuthor()->getUsername();
        }
        $notif['lastPartcipant'] = $document->getLastParticipant();
        $notif['content'] = 'rlike';
        
        return $notif;
    }
}
