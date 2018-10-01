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
 * @Route("/places")
 */
class PlaceController extends Controller
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
        $place = $request->query->get('q');
        echo $place;
        die();
        $session   = $request->getSession();
        if($token  = $session->get('access_token')) {
            $description    = 'Opinion Home page, news list';
            $user           = $this->_getUser();

            return $this->render('OPSocialBundle:Place:index.html.twig', [
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
