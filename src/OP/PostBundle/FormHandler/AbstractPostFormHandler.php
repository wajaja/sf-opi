<?php

namespace OP\PostBundle\FormHandler;

use OP\PostBundle\DocumentManager\{
    LikeManager, RateManager, PostManager, LeftManager, RightManager, ShareManager,
    CommentManager, UnderCommentManager
};
use Symfony\Component\Form\Form,
    OP\PostBundle\Composer\Composer,
    Symfony\Component\HttpFoundation\RequestStack,
    OP\MessageBundle\Security\ParticipantProviderInterface,
    OP\UserBundle\DataTransformer\UsernameToUserTransformer,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;

/**
 * Handles messages forms, from binding request to sending the message
 */
abstract class AbstractPostFormHandler
{
    protected $author, $request, $composer, $container,
              $postManager, $likeManager, $userTransformer,
              $shareManager, $commentManager, $rateManager,
              $underCommentManager, $participantProvider,
              $LeftManager, $rightManager;

    public function __construct(RequestStack $req, PostManager $pm, CommentManager $cm,  Composer $composer, UnderCommentManager $ucm, LikeManager $lm, ShareManager $sm,RateManager $rm,  ParticipantProviderInterface $pp, UsernameToUserTransformer $ut, Container $container, LeftManager $lcm, RightManager $rcm)
    {
        $this->request  = $req->getCurrentRequest();
        $this->composer = $composer;
        $this->container    = $container;
        $this->postManager  = $pm;
        $this->likeManager  = $lm;
        $this->rateManager  = $rm;
        $this->shareManager = $sm;
        $this->leftManager  = $lcm;
        $this->rightManager = $rcm;
        $this->commentManager   = $cm;
        $this->userTransformer  = $ut;
        $this->underCommentManager = $ucm;
        $this->participantProvider = $pp;
    }

    /**
     * Processes the form with the request
     *
     * @param Form $form
     * @param Bool $update  
     * @return Message|false the sent message if the form is bound and valid, false otherwise
     */
    public function process(Form $form, $update)
    {
        //request method
        if (!in_array($this->request->getMethod(), ['POST', 'PUT', 'PATCH'])) {
            return false;
        }

        //handle and bind form data from json object
        if($this->request->getFormat('application/json')) {            
            $data = json_decode($this->request->getContent(), true);
            $this->request->request->replace(is_array($data) ? $data : array());
            $form->submit($data);
            return $this->processValidForm($form, $update);
        }

        //handle request if not json data
        $form->handleRequest($this->request);
        
        if($form->isValid()) {
            return $this->processValidForm($form, $update);
        }

        return false;
    }

    /**
     * Processes the valid form, sends the message
     *
     * @param Form $form
     * @param Boolean $update
     * @return MessageInterface the sent message
     */
    public function processValidForm(Form $form, $update)
    {
        if($form->getName()==='post'){
            $document = $this->composePost($form->getData(), $update);
            !$update ?  $this->postManager->savePost($document, 'gallerypost') :
                        $this->postManager->updatePost($document, 'gallerypost');         

        }
        elseif($form->getName()==='comment'){
            $document = $this->composeComment($form->getData(), $update);
            !$update ?  $this->commentManager->saveComment($document) :
                        $this->commentManager->updateComment($document);           

        }
        elseif($form->getName()==='under_comment'){
            $document = $this->composeUnderComment($form->getData(), $update);
            !$update ?  $this->underCommentManager->saveUnderComment($document) : 
                        $this->underCommentManager->updateUnderComment($document);           

        }
        elseif($form->getName() ==='share'){
            $document = $this->composeShare($form->getData(), $update);
            !$update ?  $this->shareManager->saveShare($document) :
                        $this->shareManager->updateShare($document);          

        }
        elseif($form->getName() ==='like'){
            $document = $this->composeLike($form->getData(), $update);
            !$update ?  $document = $this->likeManager->saveLike($document) :
                        $document = $this->likeManager->deleteLike($document);
            
        }
        elseif($form->getName()==='rate'){
            $document = $this->composeRate($form->getData(), $update);
            !$update ?  $this->rateManager->saveRate($document) :
                        $this->rateManager->updateRate($document);    
        }
        elseif($form->getName()==='left'){
            $document = $this->composeLeft($form->getData(), $update);
            !$update ?  $this->leftManager->saveComment($document) :
                        $this->leftManager->updateComment($document);    
        }
        elseif($form->getName()==='right'){
            $document = $this->composeRight($form->getData(), $update);
            !$update ?  $this->rightManager->saveComment($document) :
                        $this->rightManager->updateComment($document);    
        }
        else {/**do nothing */
        }

        return $document;
    }

    /**
     * Composes a message from the form data
     *
     * @param $post
     * @return MessageInterface the composed message ready to be sent
     */
    abstract protected function composePost(\OP\PostBundle\Document\Post $post, $update);

    /**
     * Composes a message from the form data
     *
     * @param $post
     * @return MessageInterface the composed message ready to be sent
     */
    abstract protected function composeShare(\OP\PostBundle\Document\Share $share, $update);

    /**
     * Composes a comment from the form data
     *
     * @param $comment
     * @return MessageInterface the composed message ready to be sent
     */
    abstract protected function composeComment(\OP\PostBundle\Document\Comment $comment, $update);

    /**
     * Composes a comment from the form data
     *
     * @param $comment
     * @return MessageInterface the composed message ready to be sent
     */
    abstract protected function composeLeft(\OP\PostBundle\Document\LeftComment $comment, $update);

    /**
     * Composes a comment from the form data
     *
     * @param $comment
     * @return MessageInterface the composed message ready to be sent
     */
    abstract protected function composeRight(\OP\PostBundle\Document\RightComment $comment, $update);

    /**
     * Composes a message from the form data
     *
     * @param $post
     * @return MessageInterface the composed message ready to be sent
     */
    abstract protected function composeUnderComment(\OP\PostBundle\Document\UnderComment $undercomment, $update);

    /**
     * Composes a message from the form data
     *
     * @param $post
     * @return MessageInterface the composed message ready to be sent
     */
    abstract protected function composeLike(\OP\PostBundle\Document\Like $like, $update);

    /**
     * Composes a message from the form data
     *
     * @param $post
     * @return MessageInterface the composed message ready to be sent
     */
    abstract protected function composeRate(\OP\PostBundle\Document\Rate $rate, $update);

    /**
     * Gets the current authenticated user
     * @see::OPMEssageBundle participantprovider
     * @return ParticipantInterface
     */
    protected function getAuthentificatedUser()
    {
        $credentials = $this->container->get('security.token_storage')->getToken()->getCredentials();
        $data = $this->container->get('lexik_jwt_authentication.encoder.default')->decode($credentials);
        $username = $data['username'];

        return $this->container->get('fos_user.user_manager')->findUserByUsername($username);
    }

    //test if content has html
    function isHtml($string)
    {
        if ( $string != strip_tags($string) )
        {
            return true; // Contains HTML
        }
        return false; // Does not contain HTML
    }

    //TODO detect device
}
