<?php

namespace OP\UserBundle\FormHandler;

use Symfony\Component\Form\Form,
    OP\UserBundle\Document\Group,
    OP\UserBundle\DocumentManager\GroupManager,
    OP\UserBundle\DocumentManager\SettingManager,
    Symfony\Component\HttpFoundation\RequestStack,
    OP\MessageBundle\Security\ParticipantProviderInterface,
    OP\UserBundle\DataTransformer\UsernameToUserTransformer,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;

/**
 * Handles messages forms, from binding request to sending the message
 */
abstract class AbstractFormHandler
{
    protected $author, $request, $container,
              $settingManager, $groupManager, $userTransformer,
              $participantProvider;

    public function __construct(RequestStack $req, GroupManager $gm, SettingManager $sm, ParticipantProviderInterface $pp, UsernameToUserTransformer $ut, Container $container)
    {
        $this->request  = $req->getCurrentRequest();
        $this->groupManager  = $gm;
        $this->settingManager  = $sm;
        $this->userTransformer  = $ut;
        $this->participantProvider = $pp;
        $this->container    = $container;
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
        if($form->getName()==='group'){
            $document = $this->composeGroup($form->getData(), $update);
            !$update ?  $this->groupManager->saveGroup($document):
                        $this->groupManager->editGroup($document);         

        }
        return $document;
    }

    /**
     * Composes a message from the form data
     *
     * @param $post
     * @return MessageInterface the composed message ready to be sent
     */
    abstract protected function composeGroup(Group $group, $update);

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
}
