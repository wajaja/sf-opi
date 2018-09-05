<?php

use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

namespace OP\SocialBundle\SeveralClass;

/**
 * Description of SuggestionConstructor
 *
 * @author CEDRICK
 */
class SuggestionConstructor 
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
    
    public function __construct(\OP\SocialBundle\SeveralClass\DateTransformer $transformer, TokenStorageInterface $tokenStorage){
        $this->transformer = $transformer;
        $this->tokenStorage = $tokenStorage;
    }    
    
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
    public function getOpinionSuggest(\OP\SocialBundle\Document\Notification $document){
        $date = new \DateTime();
        $actualTs = $date->getTimestamp();
        $notif['id'] = $document->getId();
        $notif['link'] = 'opinion/'.$document->getOpinion()->getId();
        $notif['date'] = $this->transformer->timestampTransform($actualTs, $document->getTs());
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
}
