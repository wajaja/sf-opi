<?php

namespace OP\UserBundle\Controller;

use FOS\UserBundle\{FOSUserEvents, Event\FilterGroupResponseEvent, Event\FormEvent, Event\GroupEvent, Event\GetResponseGroupEvent, Model\GroupInterface, Form\Factory\FactoryInterface};
use Symfony\Component\HttpFoundation\{Request, Response, RedirectResponse};
use Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Symfony\Component\EventDispatcher\EventDispatcherInterface,
    OP\MessageBundle\DocumentManager\MessageManager,
    OP\MessageBundle\DocumentManager\ThreadManager,
    OP\UserBundle\Security\UserProvider,
    OP\UserBundle\DocumentManager\GroupManager,
    OP\UserBundle\DocumentManager\InvitationManager,
    OP\SocialBundle\DocumentManager\NotificationManager,
    Symfony\Component\HttpKernel\Exception\NotFoundHttpException;


/**
 * RESTful controller managing group CRUD.
 *
 */
class GroupController extends Controller
{
    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }
    
    /**
     * Show all groups.
     */
    public function indexAction(Request $request, MessageManager $msgMan, ThreadManager $threadMan, GroupManager $groupManager, InvitationManager $invitMan, NotificationManager $notiMan)
    {

        $session  = $request->getSession();
        if($token = $session->get('access_token')) {
            $serializer = $this->get('jms_serializer');
            $user       = $this->_getUser();
            $datas      = $groupManager->memberGroups($user, [], 10);
            $groups     = [];

            foreach ($datas as $data) {
                $groups[] = $serializer->toArray($data);
            }

            return $this->render('OPUserBundle:Group:list.html.twig', [
                // We pass an array as props
                'initialState' => [
                    'App'         => [
                        'sessionId'    => $session->getId()
                    ],
                    'User'        => [
                        'user'      => $serializer->toArray($user)
                    ],
                    'Auth'         => [
                        'token'    => $token,
                        'data'      => $session->get('_authData')
                    ],
                    'Groups' => [
                        'list' => $groups,
                        'loading' => false,
                        'groups'   => [],
                    ],
                    'Notification' => [
                        'nbAlerts'  => $notiMan->countAlerts($user),
                    ],
                    'Invitation'   => [
                        'nbAlerts'  =>  $invitMan->countAlerts($user),
                    ],
                    'Message'      => [
                        'nbAlerts'  =>  $msgMan->countAlerts($user),
                        'threadsIds' => $threadMan->findParticipantInboxThreadsIds($user)
                    ],
                    'Users'        => [
                        'defaults'  => $invitMan->loadDefaultUsers($user, []),
                        'onlines'   => []
                    ],
                    'Invitation'    => [],
                ],
                'title'         => "Groups",
                'description'   => "find your group list or create new group", 
                'locale'        => $request->getLocale(),
            ]);
            
        } else {
            return $this->redirect($this->generateUrl('fos_user_security_login'));
        }
    }

    /**
     * Show one group.
     *
     * @param string $id
     *
     * @return Response
     */
    public function showAction(Request $request, $id, MessageManager $msgMan, ThreadManager $threadMan, GroupManager $groupManager, InvitationManager $invitMan, NotificationManager $notiMan)
    {
        $session    = $request->getSession();
        if($token = $session->get('access_token')) {
            $groups     = [];
            $data       = $this->findGroupBy('id', $id);
            $serializer = $this->get('jms_serializer');
            $user       = $this->_getUser();
            $title      = 'create new group';

            if(gettype($data) === 'object')
                $title = $data->getName();

            
            $groups = [
                'list' => [],
                'loading' => false,
                'groups'   => [
                    $id => [
                        'group'    => $serializer->toArray($data),
                        'photos'   => [],
                        'newsRefs' => []
                    ]
                ],
            ];


            return $this->render('OPUserBundle:Group:groupName.html.twig', [
                // We pass an array as props
                'initialState' => [
                    'App'         => [
                        'sessionId'    => $session->getId()
                    ],
                    'User'        => [
                        'user'      => $serializer->toArray($user)
                    ],
                    'Auth'         => [
                        'token'    => $token,
                        'data'      => $session->get('_authData')
                    ],
                    'Groups' => $groups,
                    'Notification' => [
                        'nbAlerts'  => $notiMan->countAlerts($user),
                    ],
                    'Invitation'   => [
                        'nbAlerts'  =>  $invitMan->countAlerts($user),
                    ],
                    'Message'      => [
                        'nbAlerts'  =>  $msgMan->countAlerts($user),
                        'threadsIds' => $threadMan->findParticipantInboxThreadsIds($user)
                    ],
                    'Users'        => [
                        'defaults'  => $invitMan->loadDefaultUsers($user, []),
                        'onlines'   => []
                    ],
                    'NewsFeed'     => [ ],
                    'Invitation'    => [],
                ],
                'title'         => $title,
                'description'   => 'groupName', 
                'locale'        => $request->getLocale(),
            ]);
            
        } else {
            return $this->redirect($this->generateUrl('fos_user_security_login'));
        }
    }

    /**
     * Edit one group, show the edit form.
     *
     * @param Request $request
     * @param string  $groupName
     *
     * @return Response
     */
    public function editAction(Request $request, $groupName)
    {
        $group = $this->findGroupBy('name', $groupName);

        /** @var $dispatcher EventDispatcherInterface */
        $dispatcher = $this->get('event_dispatcher');

        $event = new GetResponseGroupEvent($group, $request);
        $dispatcher->dispatch(FOSUserEvents::GROUP_EDIT_INITIALIZE, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }

        /** @var $formFactory FactoryInterface */
        $formFactory = $this->get('fos_user.group.form.factory');

        $form = $formFactory->createForm();
        $form->setData($group);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            /** @var $groupManager \FOS\UserBundle\Model\GroupManagerInterface */
            $groupManager = $this->get('fos_user.group_manager');

            $event = new FormEvent($form, $request);
            $dispatcher->dispatch(FOSUserEvents::GROUP_EDIT_SUCCESS, $event);

            $groupManager->updateGroup($group);

            if (null === $response = $event->getResponse()) {
                $url = $this->generateUrl('fos_user_group_show', array('groupName' => $group->getName()));
                $response = new RedirectResponse($url);
            }

            $dispatcher->dispatch(FOSUserEvents::GROUP_EDIT_COMPLETED, new FilterGroupResponseEvent($group, $request, $response));

            return $response;
        }

        return $this->render('@FOSUser/Group/edit.html.twig', array(
            'form' => $form->createView(),
            'group_name' => $group->getName(),
        ));
    }

    /**
     * Show the new form.
     *
     * @param Request $request
     *
     * @return Response
     */
    public function newAction(Request $request, MessageManager $msgMan, ThreadManager $threadMan, GroupManager $groupManager, InvitationManager $invitMan, NotificationManager $notiMan)
    {
        $session    = $request->getSession();
        if($token   = $session->get('access_token')) {
            $serializer = $this->get('jms_serializer');
            $user       = $this->_getUser();

            return $this->render('OPUserBundle:Group:new.html.twig', [
                // We pass an array as props
                'initialState' => [
                    'App'         => [
                        'sessionId'    => $session->getId()
                    ],
                    'User'        => [
                        'user'      => $serializer->toArray($user)
                    ],
                    'Auth'         => [
                        'token'    => $token,
                        'data'      => $session->get('_authData')
                    ],
                    'Groups' => [
                        'loading' => false,
                        'list' => [],
                    ],
                    'Notification' => [
                        'nbAlerts'  => $notiMan->countAlerts($user),
                    ],
                    'Invitation'   => [
                        'nbAlerts'  =>  $invitMan->countAlerts($user),
                    ],
                    'Message'      => [
                        'nbAlerts'  =>  $msgMan->countAlerts($user),
                        'threadsIds' => $threadMan->findParticipantInboxThreadsIds($user)
                    ],
                    'Users'        => [
                        'defaults'  => $invitMan->loadDefaultUsers($user, []),
                        'onlines'   => []
                    ],
                    'NewsFeed'     => [ ],
                    'Invitation'    => [],
                ],
                'title'         => "new Group",
                'description'   => 'create new group', 
                'locale'        => $request->getLocale(),
            ]);
            
        } else {
            return $this->redirect($this->generateUrl('fos_user_security_login'));
        }
    }

    /**
     * Delete one group.
     *
     * @param Request $request
     * @param string  $groupName
     *
     * @return RedirectResponse
     */
    public function deleteAction(Request $request, $groupName)
    {
        $group = $this->findGroupBy('name', $groupName);
        $this->get('fos_user.group_manager')->deleteGroup($group);

        $response = new RedirectResponse($this->generateUrl('fos_user_group_list'));

        /** @var $dispatcher \Symfony\Component\EventDispatcher\EventDispatcherInterface */
        $dispatcher = $this->get('event_dispatcher');
        $dispatcher->dispatch(FOSUserEvents::GROUP_DELETE_COMPLETED, new FilterGroupResponseEvent($group, $request, $response));

        return $response;
    }

    public function _getUser()
    {
        return $this->user_provider->getHydratedUser();
    }

    /**
     * Find a group by a specific property.
     *
     * @param string $key   property name
     * @param mixed  $value property value
     *
     * @throws NotFoundHttpException if user does not exist
     *
     * @return GroupInterface
     */
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
}
