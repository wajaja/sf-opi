<?php

namespace OP\SocialBundle\SeveralClass;
use OP\SocialBundle\SeveralClass\NoteBaseConstructor as BaseConstructor;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * Description of NoteContructor
 *
 * @author CEDRICK
 */
class NoteConstructor extends BaseConstructor
{
     public function __construct(\OP\SocialBundle\SeveralClass\DateTransformer $transformer, TokenStorageInterface $tokenStorage){
        $this->transformer = $transformer;
        $this->tokenStorage = $tokenStorage;
    }    
    /**
     * @param \OP\SocialBundle\Document\Notification $document
     */
    public function getPostNote(\OP\SocialBundle\Document\Notification $document){
        $notif['id'] = $document->getId();
        $notif['link'] = 'post/'.$document->getPost()->getId();
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
        $notif['content'] = 'post';
        
        return $notif;
    }

    /**
     * @param \OP\SocialBundle\Document\Notification $document
     */
    public function getCommentNote(\OP\SocialBundle\Document\Notification $document){
        $notif['id'] = $document->getId();
        $notif['link'] = 'posts/'.$document->getPost()->getId().'/comments#'
                                .$document->getComment()->getId();
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
        $notif['content'] = 'comment';
        
        return $notif;
    }
    
    /**
     * @param \OP\SocialBundle\Document\Notification $document
     */
    public function getPshareNote(\OP\SocialBundle\Document\Notification $document){
        $notif['id'] = $document->getId();
        $notif['link'] = 'post/pshare/'.$document->getPshare()->getId();
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
        $notif['content'] = 'pshare';
        
        return $notif;
    }
    
    /**
     * @param \OP\SocialBundle\Document\Notification $document
     */
    public function getUnderCommentNote(\OP\SocialBundle\Document\Notification $document){
        $notif['id'] = $document->getId();
        $notif['link'] = 'post/'.$document->getPost()->getId().'#'
                                .$document->getComment()->getId().'#'
                                .$document->getUndercomment()->getId();
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
        $notif['content'] = 'undercomment';
        
        return $notif;
    }
    
    /**
     * @param \OP\SocialBundle\Document\Notification $document
     */
    public function getPlikeNote(\OP\SocialBundle\Document\Notification $document){
        $notif['id'] = $document->getId();
        $notif['link'] = 'post/'.$document->getPostId()->getId();
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
        $notif['content'] = 'plike';
        
        return $notif;
    }
    
    /**
     * @param \OP\SocialBundle\Document\Notification $document
     */
    public function getClikeNote(\OP\SocialBundle\Document\Notification $document){
        $notif['id'] = $document->getId();
        $notif['link'] = 'post/'.$document->getPost()->getId().'#'.$document->getComment()->getId();
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
        $notif['content'] = 'clike';
        
        return $notif;
    }
    
    /**
     * @param \OP\SocialBundle\Document\Notification $document
     */
    public function getUlikeNote(\OP\SocialBundle\Document\Notification $document){
        $notif['id'] = $document->getId();
        $notif['link'] = 'post/'.$document->getPost()->getId().'#'
                                       .$document->getComment()->getId().'#'.$document->getUndercomment()->getId();
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
        $notif['content'] = 'ulike';
        
        return $notif;
    } 
}
