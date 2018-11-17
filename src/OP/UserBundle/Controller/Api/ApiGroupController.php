<?php

namespace OP\UserBundle\Controller\Api;

use FOS\UserBundle\FOSUserEvents,
    FOS\UserBundle\Event\FormEvent,
    FOS\UserBundle\Event\GroupEvent,
    FOS\RestBundle\Controller\Annotations,
    OP\UserBundle\FormHandler\NewFormHandler,
    Symfony\Component\HttpFoundation\Request,
    OP\UserBundle\DocumentManager\GroupManager,
    OP\UserBundle\Security\UserProvider,
    FOS\RestBundle\Controller\FOSRestController,
    FOS\UserBundle\Event\FilterGroupResponseEvent,
    Symfony\Component\HttpFoundation\JsonResponse,
    FOS\RestBundle\Routing\ClassResourceInterface,
    JMS\Serializer\SerializerInterface,
    Symfony\Component\HttpFoundation\RedirectResponse,
    FOS\RestBundle\Controller\Annotations\RouteResource,
    Symfony\Component\EventDispatcher\EventDispatcherInterface;

/**
 * @RouteResource("registration", pluralize=false)
 */
class ApiGroupController extends FOSRestController implements ClassResourceInterface
{

    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }

    /**
     * @Annotations\Post("/groups/new")
     */
    public function newAction(Request $request, NewFormHandler $handler, EventDispatcherInterface $dispatcher, GroupManager $groupManager, SerializerInterface $serializer)
    {
        /** @var $groupManager \FOS\UserBundle\Model\GroupManagerInterface */
        /** @var $formFactory \FOS\UserBundle\Form\Factory\FactoryInterface */
        $formFactory = $this->get('fos_user.group.form.factory');
        /** @var $dispatcher \Symfony\Component\EventDispatcher\EventDispatcherInterface */
        $group      = $groupManager->createGroup(''); //create group with empty name

        $dispatcher->dispatch(FOSUserEvents::GROUP_CREATE_INITIALIZE, new GroupEvent($group, $request));

        $form       = $formFactory->createForm(['csrf_protection' => false]);
        $response   = new JsonResponse([false]);
        $contentType= $request->headers->get('Content-Type');

        if('application/x-www-form-urlencoded' === $contentType)
            $response = new RedirectResponse($this->generateUrl('fos_user_group_new'));

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
                     $response = new JsonResponse(['group'=>$serializer->toArray($group)]);
                }  
            }

            $dispatcher->dispatch(FOSUserEvents::GROUP_CREATE_COMPLETED, new FilterGroupResponseEvent($group, $request, $response));  //add default pic
            //!!! update after default profilePic added
            $groupManager->updateGroup($group);
        }
        
        return $response;
    }

    /**
     * @Annotations\Put("/groups/edit/{id}")
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
     * @Annotations\Delete("/groups/delete/{id}")
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
     * @Annotations\Get("/groups/list")
     */
    public function listAction(Request $request, GroupManager $gMan, SerializerInterface $serializer)
    {
        $user   = $this->_getUser();
        $datas  = $gMan->memberGroups($user, [], 10);
        $groups = [];
        foreach ($datas as $data) {
            $groups[] = $serializer->toArray($data);
        }

        return new JsonResponse($groups);
    }

    /**
     * @Annotations\Get("/groups/public")
     */
    public function publicAction(Request $request, GroupManager $gMan, SerializerInterface $serializer)
    {
        $user   = $this->_getUser();
        $datas  = $gMan->publicGroups($user, [], 10);
        $groups = [];
        foreach ($datas as $data) {
            $groups[] = $serializer->toArray($data);
        }

        return new JsonResponse($groups);
    }

    /**
     * @Annotations\Get("/groups/show/{id}")
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

    public function _getUser()
    {
        return $this->user_provider->getHydratedUser();
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