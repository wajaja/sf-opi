<?php
// src/OP/UserBundle/EventListener/PasswordResettingListener.php
// depuis la documentation EventListener
namespace OP\UserBundle\EventListener;

use FOS\UserBundle\FOSUserEvents,
    FOS\UserBundle\Event\FormEvent,
    FOS\UserBundle\Event\GetResponseUserEvent,
    FOS\UserBundle\Event\FilterUserResponseEvent,
    Symfony\Component\HttpFoundation\RedirectResponse,
    Symfony\Component\EventDispatcher\EventSubscriberInterface,
    Symfony\Component\Routing\Generator\UrlGeneratorInterface;

/**
 * Listener responsible to change the redirection at the end of the password resetting
 */
class ResettingListener extends AbstractUserListener implements EventSubscriberInterface
{

    /**
     * {@inheritDoc}
     */
    public static function getSubscribedEvents()
    {
        return array(
            FOSUserEvents::RESETTING_RESET_SUCCESS => 'onPasswordResettingSuccess',
            FOSUserEvents::RESETTING_RESET_COMPLETED => 'onPasswordResettingCompleted',

            FOSUserEvents::RESETTING_SEND_EMAIL_CONFIRM => 'onSendEmailRessettingConfirm',
            FOSUserEvents::RESETTING_SEND_EMAIL_COMPLETED => 'onSendEmailRessettingCompleted'
        );
    }

    public function onPasswordResettingSuccess(FormEvent $event)
    {
        $url = $this->router->generate('homepage');

        $event->setResponse(new RedirectResponse($url));
    }

    public function onPasswordResettingCompleted(FilterUserResponseEvent $event)
    {
        $url = $this->router->generate('homepage');

        $event->setResponse(new RedirectResponse($url));
    }

    public function onSendEmailRessettingConfirm(GetResponseUserEvent $event)
    {
        $url = $this->router->generate('homepage');

        $event->setResponse(new RedirectResponse($url));
    }

    public function onSendEmailRessettingConpleted(GetResponseUserEvent $event)
    {
        $url = $this->router->generate('homepage');

        $event->setResponse(new RedirectResponse($url));
    }

    public function onSendEmailRessettingCompleted(GetResponseUserEvent $event) {

    }
}