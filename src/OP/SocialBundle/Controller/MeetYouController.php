<?php

namespace OP\SocialBundle\Controller;

use OP\UserBundle\Security\UserProvider,
    JMS\Serializer\SerializerInterface,
    Symfony\Component\HttpFoundation\Request,
    OP\SocialBundle\SeveralClass\DateTransformer,
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
 * @Route("/meetyou")
 */
class MeetYouController extends Controller
{

    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }


    /**
     * Lists all Notification documents.
     *
     * @Route("/", name="meetyou_home")
     * @Template()
     *
     * @return array
     */
    public function indexAction(Request $request, ThreadManager $threadMan, MessageManager $msgMan, NotificationManager $notifMan, InvitationManager $invitMan, SerializerInterface $serializer)
    {
        $session = $request->getSession();
        $token   = $session->get('access_token');
        $description  = 'Create Invitation for birthday party, conference ...';
        $user         = $token ? $this->_getUser() : null;

        return $this->render('OPSocialBundle:MeetYou:index.html.twig', [
            // We pass an array as props
            'initialState'  => [
                'App'         => [
                    'sessionId'    => $session->getId()
                ],
                'User'        => [
                    'user'      => $token ? $serializer->toArray($user) : null
                ],
                'Auth'         => [
                    'token'    => $token,
                    'data'      => $session->get('_authData')
                ],
                'Notification' => [
                    'nbAlerts'  => $token ? $notifMan->countAlerts($user) : 0
                    //,'notifications' => $notifMan->loadNotifications($user, [], 20)
                ],
                'Invitation'   => [
                    'nbAlerts'  =>   $token ? $invitMan->countAlerts($user) : 0
                ],
                'Message'      => [
                    'nbAlerts'  =>   $token ? $msgMan->countAlerts($user) : 0
                    //,'threadsIds' => $threadMan->findParticipantInboxThreadsIds($user)
                ],
                'Users'        => [
                    'defaults'  =>  $token ? $invitMan->loadDefaultUsers($user, []) : [],
                    'onlines'   => []
                ],
                'MeetYou'    => [
                    'availableImages'=> [],
                    'query'=> '',
                    'textAttrs' => [
                        'font' =>  'Georgia',
                        'fontSize' =>  17,
                        'color' =>  'black',
                        'bold' =>  true,
                        'italic' =>  true
                    ],
                    'filter' => 'none',
                    'selectedCardId' => "1_1",
                    'activePage' => 1
                    ,'pages' => [
                        [
                            'size'=> 'wide',
                            'text' => 'Invitation',
                            'selected' => 'selectedImage',
                            'cards' => [
                                [
                                    'id' => 1,
                                    'order' => 0,
                                    'type' => '', // image || edittex
                                    'textArr' => [],
                                    'url' => '',
                                    'content' => '',
                                    'unique' => '1-0' //1-0 page1-card0
                                ]
                            ]
                        ]
                    ]
                ],
            ],
            'title'         => 'MeetYou | best way to meet people',
            'description'   => $description, 
            'locale'        => $request->getLocale(),
        ]);
            
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
