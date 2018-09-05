<?php

namespace OP\SocialBundle\Controller;

use OP\SocialBundle\SeveralClass\Order,
    OP\UserBundle\Security\UserProvider,
    JMS\Serializer\SerializerInterface,
    OP\SocialBundle\Document\Notification,
    OP\SocialBundle\Form\NotificationType,
    Symfony\Component\HttpFoundation\Request,
    OP\SocialBundle\SeveralClass\DateTransformer,
    OP\SocialBundle\SeveralClass\NoteConstructor,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\MessageBundle\DocumentManager\ThreadManager,
    OP\MessageBundle\DocumentManager\MessageManager,
    OP\UserBundle\DocumentManager\InvitationManager,
    OP\SocialBundle\DocumentManager\NotificationManager,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Method,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * Notification controller.
 *
 * @Route("/notifications")
 */
class NotificationController extends Controller
{

    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }


    /**
     * Lists all Notification documents.
     *
     * @Route("/", name="notification")
     * @Template()
     *
     * @return array
     */
    public function indexAction(Request $request, ThreadManager $threadMan, MessageManager $msgMan, NotificationManager $notifMan, InvitationManager $invitMan, SerializerInterface $serializer)
    {
        $documents = $this->getDocumentManager()->getRepository('OPSocialBundle:Notification')->findAll();
        $session   = $request->getSession();
        if($token  = $session->get('access_token')) {
            $description    = 'Opinion Home page, news list';
            $user           = $this->_getUser();

            return $this->render('OPSocialBundle:Notification:index.html.twig', [
                // We pass an array as props
                'initialState'  => [
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
                    'Notification' => [
                        'nbAlerts'  => $notifMan->countAlerts($user),
                        'notifications' => $notifMan->loadNotifications($user, [], 20)
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
                'title'         => 'Notification',
                'description'   => 'notifications list', 
                'locale'        => $request->getLocale(),
            ]);
            
        } else {
            return $this->redirect($this->generateUrl('fos_user_security_login'));
        }
            
    }

    /**
     * Displays a form to create a new Notification document.
     *
     * @Route("/new", name="notification_new")
     * @Template()
     *
     * @return array
     */
    public function newAction()
    {
        $document = new Notification();
        $form = $this->createForm(new NotificationType(), $document);

        return array(
            'document' => $document,
            'form'     => $form->createView()
        );
    }

    /**
     * Creates a new Notification document.
     *
     * @Route("/create", name="notification_create")
     * @Method("POST")
     * @Template("OPSocialBundle:Notification:new.html.twig")
     *
     * @param Request $request
     *
     * @return array
     */
    public function createAction(Request $request)
    {
        $document = new Notification();
        $form     = $this->createForm(new NotificationType(), $document);
        $form->bind($request);

        if ($form->isValid()) {
            $dm = $this->getDocumentManager();
            $dm->persist($document);
            $dm->flush();

            return $this->redirect($this->generateUrl('notification_show', array('id' => $document->getId())));
        }

        return array(
            'document' => $document,
            'form'     => $form->createView()
        );
    }

    /**
     * Finds and displays a Notification document.
     *
     * @Route("/{id}/show", name="notification_show")
     * @Template()
     *
     * @param string $id The document ID
     *
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If document doesn't exists
     */
    public function showAction($id)
    {
        $dm = $this->getDocumentManager();

        $document = $dm->getRepository('OPSocialBundle:Notification')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find Notification document.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return array(
            'document' => $document,
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Displays a form to edit an existing Notification document.
     *
     * @Route("/{id}/edit", name="notification_edit")
     * @Template()
     *
     * @param string $id The document ID
     *
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If document doesn't exists
     */
    public function editAction($id)
    {
        $dm = $this->getDocumentManager();

        $document = $dm->getRepository('OPSocialBundle:Notification')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find Notification document.');
        }

        $editForm = $this->createForm(new NotificationType(), $document);
        $deleteForm = $this->createDeleteForm($id);

        return array(
            'document'    => $document,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Edits an existing Notification document.
     *
     * @Route("/{id}/update", name="notification_update")
     * @Method("POST")
     * @Template("OPSocialBundle:Notification:edit.html.twig")
     *
     * @param Request $request The request object
     * @param string $id       The document ID
     *
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If document doesn't exists
     */
    public function updateAction(Request $request, $id)
    {
        $dm = $this->getDocumentManager();

        $document = $dm->getRepository('OPSocialBundle:Notification')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find Notification document.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm   = $this->createForm(new NotificationType(), $document);
        $editForm->bind($request);


        if ($editForm->isValid()) {
            $dm->persist($document);
            $dm->flush();

            return $this->redirect($this->generateUrl('notification_edit', array('id' => $id)));
        }

        return array(
            'document'    => $document,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Deletes a Notification document.
     *
     * @Route("/{id}/delete", name="notification_delete")
     * @Method("POST")
     *
     * @param Request $request The request object
     * @param string $id       The document ID
     *
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If document doesn't exists
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->bind($request);

        if ($form->isValid()) {
            $dm = $this->getDocumentManager();
            $document = $dm->getRepository('OPSocialBundle:Notification')->find($id);

            if (!$document) {
                throw $this->createNotFoundException('Unable to find Notification document.');
            }

            $dm->remove($document);
            $dm->flush();
        }

        return $this->redirect($this->generateUrl('notification'));
    }

    private function createDeleteForm($id)
    {
        return $this->createFormBuilder(array('id' => $id))
            ->add('id', 'hidden')
            ->getForm()
        ;
    }

    /**
     * Returns the DocumentManager
     *
     * @return DocumentManager
     */
    private function getDocumentManager()
    {
        return $this->dm;
    }

    public function _getUser()
    {
        return $this->user_provider->getHydratedUser();
    }
}
