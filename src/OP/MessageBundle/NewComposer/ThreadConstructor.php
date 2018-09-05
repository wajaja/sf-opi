<?php
namespace OP\MessageBundle\NewComposer;

use OP\SocialBundle\SeveralClass\DateTransformer;

/**
 * Description of ThreadConstructor
 * @author CEDRICK
 */
class ThreadConstructor 
{
    
    /**
     * return array with date
     * @var type array
     */
    private $dateTransformer;
    
    /*
     * provider to get the authentificated user
     */
    private $provider;


    public  function __construct(DateTransformer $date_transformer, \OP\MessageBundle\Security\ParticipantProvider $provider) {
        $this->dateTransformer = $date_transformer;
        $this->provider = $provider;
    }
    
    //the constructor of threads
    public function navbarThreadsConstructor($db_threads)
    {
        $date = new \DateTime(null, new \DateTimeZone("UTC"));
        $threads = [];
        $thread = [];
        foreach($db_threads as $db_thread){
            $thread['id'] = $db_thread->getId();
            $thread['lastMessage']['date'] = $this->dateTransformer
                                                  ->timestampTransform(
                                                    $date->getTimestamp(), 
                                                    $db_thread->getLastMessage()->getCreatedAt()->getTimestamp());
            $thread['lastMessage']['author'] = $db_thread->getLastMessage()->getSender()->getFirstname().' '.
                                               $db_thread->getLastMessage()->getSender()->getLastname();
            if(count($db_thread->getLastMessage()->getImages())){
                $thread['lastMessage']['images'] = true;
            }else{
                $thread['lastMessage']['images'] = false;
            }
            //@TODO get number of unReaded message for participant 
            $thread['isRead']   = $db_thread->isReadByParticipant($this->provider->getAuthenticatedParticipant());
            $thread['lastMessage']['body'] = $db_thread->getLastMessage()->getBody();
            $thread['participants'] = $db_thread->getOtherParticipants($this->provider->getAuthenticatedParticipant()); //OtherParticipants($this->provider->getAuthenticatedParticipant());
            $thread['createdBy'] = $db_thread->getCreatedBy()->getUsername();
            $threads [] = $thread; 
        }
        return $threads;
    }
}
