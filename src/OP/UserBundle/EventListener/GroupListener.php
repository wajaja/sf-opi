<?php

namespace OP\UserBundle\EventListener;

use FOS\UserBundle\FOSUserEvents,
    FOS\UserBundle\Event\FormEvent,
    FOS\UserBundle\Event\FilterGroupResponseEvent,
    Symfony\Component\HttpFoundation\RequestStack,
    Symfony\Component\EventDispatcher\EventSubscriberInterface,
    Symfony\Component\HttpFoundation\RedirectResponse,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\MediaBundle\DocumentManager\PictureManager,
    Symfony\Component\Routing\Generator\UrlGeneratorInterface,
    Symfony\Component\EventDispatcher\EventDispatcherInterface,
    Symfony\Component\DependencyInjection\ContainerInterface as Container,
    Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;

/**
 * Listener responsible to change the redirection at the end of the password resetting
 */
class GroupListener implements EventSubscriberInterface
{

    private $router, $request,
            $dispatcher, $jwtManager, $container;

    public function __construct(UrlGeneratorInterface $router, RequestStack $request, EventDispatcherInterface $dispatcher, Container $container)
    {
        $this->router     = $router;
        $this->dispatcher = $dispatcher;
        $this->request    = $request->getCurrentRequest();
        $this->container  = $container;
    }

    /**
     * {@inheritdoc}
     */
    public static function getSubscribedEvents()
    {

        return array(
            //If you don't onGroupSuccess to -10, ``EmailConfirmationListener`` 
            //will be called earlier and you will be redirected to
            //``fos_user_registration_check_email`` route.
            FOSUserEvents::GROUP_CREATE_SUCCESS => [
                ['onGroupSuccess', -10],
            ],
            // FOSUserEvents::GROUP_CREATE_FAILURE => 'onGroupFaillure',
            FOSUserEvents::GROUP_CREATE_COMPLETED => 'onGroupCompleted',
            FOSUserEvents::GROUP_EDIT_SUCCESS => 'onGroupEditSuccess',
        );
    }

    public function onGroupCompleted(FilterGroupResponseEvent $event, PictureManager $pic_man) {
        $group       = $event->getGroup();
        // $request    = $event->getRequest();
        $defaultPic = $pic_man->provideDefaultAvatar($group);
        $group->setAvatar($defaultPic);
    }

    public function onGroupSuccess(FormEvent $event) {
        $request    = $event->getRequest();
        $session    = $request->getSession();
        $contentType= $request->headers->get('Content-Type');
    }

    public function onGroupFaillure(FormEvent $event)
    {
        $session  = $this->request->getSession();
        $flashBag = $session->getFlashBag();
        $form     = $event->getForm();

        foreach ($form->all() as $field => $value) {
            //add error message for every field in group form
            if((String)$value->getErrors() !== "") {
                $flashBag->add(
                    'group.'.$field,
                    (String)$value->getErrors()
                );
            }
        }

        if('application/x-www-form-urlencoded' === $this->request->headers->get('Content-Type')) {
            $url = $this->router->generate('fos_user_group_new');
            $response   = new RedirectResponse($url);
        } else {
            $response   = new JsonResponse();
            $response->setData(array('errors'=> $this->getErrorMessages($form)));
        }

        $event->setResponse($response);
    }

     public function onGroupEditSuccess(FormEvent $event) {

        $group      = $event->getGroup();
        $request    = $event->getRequest();
        $session    = $request->getSession();
        $response   = $event->getResponse();
        $contentType= $request->headers->get('Content-Type');

        if('application/x-www-form-urlencoded' === $contentType) {
            $url = $this->router->generate('fos_user_group_show', array('groupName' => $group->getName()));
            $response = new RedirectResponse($url);
        } else {
            $response   = new JsonResponse();
            $serializer = $this->container->get('jms_serializer');
            $response->setData(array('group'=>$serializer->toArray($group)));
        }

        $event->setResponse($response);
    }

    private function getErrorMessages(\Symfony\Component\Form\Form $form) {
        $errors = array();

        foreach ($form->getErrors() as $key => $error) {
            if ($form->isRoot()) {
                $errors['#'][] = $error->getMessage();
            } else {
                $errors[] = $error->getMessage();
            }
        }

        foreach ($form->all() as $child) {
            if (!$child->isValid()) {
                $errors[$child->getName()] = $this->getErrorMessages($child);
            }
        }

        return $errors;
    }
}