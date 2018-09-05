<?php

namespace OP\UserBundle\Controller\Api;

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
 * @RouteResource("registration", pluralize=false)
 */
class ApiGroupController extends FOSRestController implements ClassResourceInterface
{

    /**
     * @Annotations\Post("/groups/new")
     */
    public function newAction(Request $request, NewFormHandler $handler, EventDispatcherInterface $dispatcher, GroupManager $groupManager)
    {
        /** @var $groupManager \FOS\UserBundle\Model\GroupManagerInterface */
        /** @var $formFactory \FOS\UserBundle\Form\Factory\FactoryInterface */
        $formFactory = $this->get('fos_user.group.form.factory');
        /** @var $dispatcher \Symfony\Component\EventDispatcher\EventDispatcherInterface */
        $group      = $groupManager->createGroup(''); //create group with empty name

        $dispatcher->dispatch(FOSUserEvents::GROUP_CREATE_INITIALIZE, new GroupEvent($group, $request));

        $form       = $formFactory->createForm(['csrf_protection' => false]);
        $contentType= $request->headers->get('Content-Type');
        $form->setData($group);
        if($group   = $handler->process($form, false)) {      
            $event  = new FormEvent($form, $request);
            $dispatcher->dispatch(FOSUserEvents::GROUP_CREATE_SUCCESS, $event);
            // $this->notify($post);

            if (null === $response = $event->getResponse()) {
                if('application/x-www-form-urlencoded' === $contentType) {
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
        } else {
            // if('application/x-www-form-urlencoded' === $contentType) {
            //     $url = $this->generateUrl('fos_user_group_show', array('groupId' => $group->getId()));
            //     $response = new RedirectResponse($url);
            // } else {
            //     $response   = new JsonResponse();
            //     $serializer = $this->get('jms_serializer');
            //     $response->setData(array('group'=>$serializer->toArray($group)));
            // }  
        }

        return $this->render('@FOSUser/Group/new.html.twig', array(
            'form' => $form->createView(),
        ));
    }

    /**
     * @Annotations\Post("/groups/{id}")
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
     * @Annotations\Delete("/groups/{id}")
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
     * @Annotations\Get("/groups/{id}")
     */
    public function showAction(Request $request, $id)
    {
        $response   = new JsonResponse();
        $data       = $this->findGroupBy('id', $id);
        $serializer = $this->get('jms_serializer');
        $user       = $this->_getUser();

        return $response->setData(array('group' => $serializer->toArray($data)));
    }

    /**
    * @Annotations\Get("/check_email")
    *
    * @return Integer
    */
    public function checkEmailAction(Request $request, OpinionUserManager $uManager)
    {
        $res     = new JsonResponse();
        $email   = $request->query->get('email');
        $session = $request->getSession();
        $session->isStarted() ?: $session->start();

        return $res->setData(array('status'=> $request->getBasePath()));
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