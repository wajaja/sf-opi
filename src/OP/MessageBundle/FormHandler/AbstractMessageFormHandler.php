<?php

namespace OP\MessageBundle\FormHandler;

use OP\MessageBundle\DocumentManager\{ThreadManager, MessageManager, QuestionManager};
use Emojione\Emojione,
    Symfony\Component\Form\Form,
    OP\MessageBundle\Document\Response,
    OP\MessageBundle\Sender\SenderInterface,
    OP\MessageBundle\FormModel\AbstractMessage,
    OP\MessageBundle\Composer\ComposerInterface,
    OP\MessageBundle\Model\ParticipantInterface,
    Symfony\Component\HttpFoundation\RequestStack,
    OP\MessageBundle\Security\ParticipantProviderInterface,
    OP\UserBundle\DataTransformer\UsernameToUserTransformer,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;

/**
 * Handles messages forms, from binding request to sending the message
 */
abstract class AbstractMessageFormHandler
{
    protected $request, $composer, $container, $sender, $participantProvider,
              $threadManager, $messageManager, $questionManager, $userTransformer;

    public function __construct(RequestStack $request, ComposerInterface $composer, SenderInterface $sender, QuestionManager $question_manager, ParticipantProviderInterface $participantProvider, ThreadManager $thread_manager, MessageManager $message_manager,
        UsernameToUserTransformer $userTransformer, Container $container)
    {
        $this->sender               = $sender;
        $this->request              = $request->getCurrentRequest();
        $this->container            = $container;
        $this->composer             = $composer;
        $this->threadManager        = $thread_manager;
        $this->userTransformer      = $userTransformer;
        $this->questionManager      = $question_manager;
        $this->messageManager       = $message_manager;
        $this->participantProvider  = $participantProvider;
    }

    /**
     * Processes the form with the request
     *
     * @param Form $form
     * @return Message|false the sent message if the form is bound and valid, false otherwise
     */
    public function processSecret(Form $form, $response=null)
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
            return $this->processValidForm($form, null);
            // echo $a;
        }
        
        //handle request if not json data
        $form->handleRequest($this->request);
        if($form->isValid()) {
            return $this->processValidForm($form, null);
        }

        return false;
    }

    /**
     * Processes the form with the request
     *
     * @param Form $form
     * @return Message|false the sent message if the form is bound and valid, false otherwise
     */
    public function processMessage(Form $form, $thread = null)
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
            return $this->processValidForm($form, $thread);
            // echo $a;
        }

        //handle request if not json data
        $form->handleRequest($this->request);
        if($form->isValid()) {
            return $this->processValidForm($form, $thread);
        }

        return false;
    }

    /**
     * Processes the valid form, sends the message
     *
     * @param Form $form
     * @return MessageInterface the sent message
     */
    public function processValidForm(Form $form, $thread)
    {
        if($form->getName() === 'thread_message') {
            // return MessageInterface $message
            $message = $this->composeThread($form->getData(), null);
            // persist 
            $document = $this->sender->send($message);
        }

        else if($form->getName() === 'reply_message') {
            $message = $this->composeMessage($form->getData(), $thread);
            $document = $this->sender->send($message);
        }

        elseif($form->getName() === 'secret') {

            $response = $this->composeResponse($form->getData(), null);
            $document = $this->questionManager->saveResponse($response);           

        }
        else {/**do nothing */}

        return $document;
    }

    public function buildHTML($content) {
        return Emojione::toImage($content);
    }

    /**
     * Composes a message from the form data
     *
     * @param AbstractMessage $message
     * @return MessageInterface the composed message ready to be sent
     */
    abstract protected function composeThread(AbstractMessage $message, $thread = null);

    /**
     * Composes a message from the form data
     *
     * @param AbstractMessage $message
     * @return MessageInterface the composed message ready to be sent
     */
    abstract protected function composeMessage(AbstractMessage $message, $thread = null);

    /**
     * Composes a message from the form data
     *
     * @param AbstractMessage $message
     * @return MessageInterface the composed message ready to be sent
     */
    abstract protected function composeResponse(Response $response, $thread = null);

    /**
     * Gets the current authenticated user
     * @see::OPMEssageBundle participantprovider
     * @return ParticipantInterface
     */
    protected function getAuthenticatedUser()
    {
        $credentials = $this->container->get('security.token_storage')->getToken()->getCredentials();
        $data = $this->container->get('lexik_jwt_authentication.encoder.default')->decode($credentials);
        $username = $data['username'];

        return $this->container->get('fos_user.user_manager')->findUserByUsername($username);
    }
}
