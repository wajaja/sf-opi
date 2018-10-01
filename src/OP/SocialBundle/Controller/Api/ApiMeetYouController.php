<?php

namespace OP\SocialBundle\Controller\Api;

use FOS\UserBundle\FOSUserEvents,
    FOS\UserBundle\Event\FormEvent,
    FOS\UserBundle\Event\GroupEvent,
    FOS\UserBundle\Model\GroupInterface,
    FOS\RestBundle\Controller\Annotations,
    Nelmio\ApiDocBundle\Annotation as Doc,
    OP\UserBundle\FormHandler\NewFormHandler,
    Symfony\Component\HttpFoundation\Request,
    OP\UserBundle\Repository\OpinionUserManager,
    FOS\UserBundle\Event\GetResponseUserEvent,
    OP\UserBundle\DocumentManager\GroupManager,
    FOS\RestBundle\Controller\FOSRestController,
    FOS\UserBundle\Event\FilterGroupResponseEvent,
    FOS\UserBundle\Form\Factory\FactoryInterface,
    Symfony\Component\HttpFoundation\JsonResponse,
    FOS\RestBundle\Routing\ClassResourceInterface,
    Symfony\Component\HttpFoundation\RedirectResponse,
    FOS\RestBundle\Controller\Annotations\RouteResource,
    Symfony\Component\Routing\Generator\UrlGeneratorInterface,
    Symfony\Component\EventDispatcher\EventDispatcherInterface,
    Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * @RouteResource("meetyou")
 */
class ApiMeetYouController extends FOSRestController implements ClassResourceInterface
{

    /**
     * @Annotations\Post("/meetyou/new")
     */
    public function newAction(Request $request, NewFormHandler $handler, EventDispatcherInterface $dispatcher, GroupManager $groupManager)
    {
        
        /** @var $dispatcher \Symfony\Component\EventDispatcher\EventDispatcherInterface */
        $meetMan      = $this->meetManager; //create group with empty name

        // $dispatcher->dispatch(OPSocialEvents::MEETGROUP_CREATE_INITIALIZE, new GroupEvent($group, $request));

        if($meetyou   = $meetMan->process($request, false)) {
            // $event  = new FormEvent($form, $request);
            // $dispatcher->dispatch(OPSocialEvents::MEET_CREATE_SUCCESS, $event);
            // $this->notify($post);

            if (null === $response = $event->getResponse()) {
                $url = $this->generateUrl('fos_user_group_show', array('groupId' => $group->getId()));
                $response = new RedirectResponse($url);
            } else {
                $response   = new JsonResponse();
                $serializer = $this->get('jms_serializer');
                $response->setData(array('group'=>$serializer->toArray($group)));
            }  
        }

        $dispatcher->dispatch(FOSUserEvents::GROUP_CREATE_COMPLETED, new FilterGroupResponseEvent($group, $request, $response));  //add default pic
        //!!! update after default profilePic added
        $groupManager->updateGroup($group);

        return $response;
    }

    /**
     * @Annotations\Post("/meetyou/{id}")
     */
    public function editAction(Request $request, $id)
    {
        $group = $this->findGroupBy('name', $id);

        /** @var $dispatcher EventDispatcherInterface */
        $dispatcher = $this->get('event_dispatcher');

        $event = new GetResponseGroupEvent($group, $request);
        $dispatcher->dispatch(FOSUserEvents::GROUP_EDIT_INITIALIZE, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }

        /** @var $formFactory FactoryInterface */
        $formFactory = $this->get('fos_user.group.form.factory');

        $form       = $formFactory->createForm(['csrf_protection' => false]);
        if('application/x-www-form-urlencoded' === $contentType) { 
            $form->setData($group);
            $form->handleRequest($request);
        } else {
            $data    = json_decode($request->getContent(), true);
            $form->setData($group);
            $request->request->replace(is_array($data) ? $data : array());
            $form->submit($data);
        }

        if ($form->isSubmitted() && $form->isValid()) {
            /** @var $groupManager \FOS\UserBundle\Model\GroupManagerInterface */
            $groupManager = $this->get('fos_user.group_manager');
            $event        = new FormEvent($form, $request);
            $dispatcher->dispatch(FOSUserEvents::GROUP_EDIT_SUCCESS, $event);

            if (null === $response = $event->getResponse()) {
                $url = $this->generateUrl('fos_user_group_show', array('groupName' => $group->getName()));
                $response = new RedirectResponse($url);
            }

            $dispatcher->dispatch(FOSUserEvents::GROUP_EDIT_COMPLETED, new FilterGroupResponseEvent($group, $request, $response));
            $groupManager->updateGroup($group);

            return $response;
        }

        return $this->render('@FOSUser/Group/edit.html.twig', array(
            'form' => $form->createView(),
            'group_name' => $group->getName(),
        ));
    }

    /**
     * @Annotations\Delete("/meetyou/{id}")
     */
    public function deleteAction(Request $request, $id)
    {
        $group = $this->findGroupBy('id', $id);
        $this->get('fos_user.group_manager')->deleteGroup($group);

        $response = new RedirectResponse($this->generateUrl('fos_user_group_list'));

        /** @var $dispatcher \Symfony\Component\EventDispatcher\EventDispatcherInterface */
        $dispatcher = $this->get('event_dispatcher');
        $dispatcher->dispatch(FOSUserEvents::GROUP_DELETE_COMPLETED, new FilterGroupResponseEvent($group, $request, $response));

        return $response;
    }

    /**
     * @Annotations\Get("/meetyou/{id}")
     */
    public function showAction(Request $request, $id)
    {
        $response   = new JsonResponse();
        $data       = $this->findGroupBy('id', $id);
        $serializer = $this->get('jms_serializer');
        $user       = $this->_getUser();

        return $response->setData(array('group' => $serializer->toArray($data)));
    }

    protected function findGroupBy($key, $value)
    {
        if (!empty($value)) {
            $group = $this->get('fos_user.group_manager')->{'findGroupBy'.ucfirst($key)}($value);
        }

        if (empty($group)) {
            // throw new NotFoundHttpException(sprintf('The group with "%s" does not exist for value "%s"', $key, $value));
            $group = [];
        }

        return $group;
    }

    /**
     * Returns the DocumentManager
     * @return DocumentManager
     */
    private function getDocumentManager()
    {
        return $this->dm;
    }
}