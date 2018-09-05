<?php

namespace OP\MediaBundle\FormHandler;

use Symfony\Component\Form\Form,
    OP\PostBundle\Document\Post,
    OP\PostBundle\Composer\Composer,
    OP\PostBundle\DocumentManager\PostManager,
    OP\MessageBundle\Model\ParticipantInterface,
    Symfony\Component\HttpFoundation\RequestStack,
    OP\MessageBundle\Security\ParticipantProviderInterface;

/**
 * Handles messages forms, from binding request to sending the message
 */
abstract class AbstractGalleryFormHandler
{
    protected $request, $composer, $author,
              $participantProvider, $postManager;

    public function __construct(RequestStack $request, PostManager $postManager, Composer $composer,
                                ParticipantProviderInterface $participantProvider)
    {
        $this->request = $request->getCurrentRequest();
        $this->composer = $composer;
        $this->postManager = $postManager;
        $this->participantProvider = $participantProvider;
    }

    /**
     * Processes the form with the request
     *
     * @param Form $form
     * @return Message|false the sent message if the form is bound and valid, false otherwise
     */
    public function process(Form $form, $update)
    {
//         return true;
        if ('POST' !== $this->request->getMethod()) {
            return false;
        }
        $data       = $request->request->all();
        $title      = $data['gallery_title'];

        $form->getData()->getTitle()->setValue($title);
        $form->getData()->getObjectType()->setValue('gallery');
        $form->getData()->getType()->setValue('basic');
        

        return $this->processForm($form, $update);
    }

    /**
     * Processes the valid form, sends the message
     *
     * @param Form $form
     * @return MessageInterface the sent message
     */
    public function processValidForm(Form $form, $update)
    {
        $document = $this->composePost($form->getData(), $update);
        if(!$update){
             $this->postManager->savePost($document, 'galleryimage');
        }else{
             $this->postManager->updatePost($document, 'galleryimage');
        }
        return $document;
    }

    /**
     * Composes a message from the form data
     *
     * @param $post
     * @return MessageInterface the composed message ready to be sent
     */
    abstract protected function composePost(Post $post, $update);    

    /**
     * Gets the current authenticated user
     * @see::OPMEssageBundle participantprovider
     * @return ParticipantInterface
     */
    protected function getAuthentificatedUser()
    {
        return $this->participantProvider->getAuthenticatedParticipant();
    }
}
