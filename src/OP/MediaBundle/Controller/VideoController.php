<?php

namespace OP\MediaBundle\Controller;

use OP\MediaBundle\Document\Video,
    OP\MediaBundle\Form\VideoType,
    OP\PostBundle\Document\Post,
    OP\PostBundle\Document\Comment,
    OP\PostBundle\Form\CommentType,
    JMS\Serializer\SerializerInterface,
    OP\UserBundle\Security\UserProvider,
    OP\UserBundle\DocumentManager\InvitationManager,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\MessageBundle\DocumentManager\ThreadManager,
    OP\MessageBundle\DocumentManager\MessageManager,
    OP\SocialBundle\DocumentManager\NotificationManager,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Method,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * Image controller.
 *
 * @Route("/videos")
 */
class VideoController extends Controller
{

    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }
    
    /**
     * Lists all Image documents.
     *
     * @Route("/", name="videos_list")
     * @Template()
     *
     * @return array
     */
    public function indexAction(Request $request, ThreadManager $threadMan, MessageManager $messMan, NotificationManager $notifMan, SerializerInterface $serializer, InvitationManager $invitMan)
    {
        $session  = $request->getSession();
        if($token = $session->get('access_token')) {
            $video  = $similar = [];
            $user   = $this->_getUser();
            $postId = $request->query->get('post_id');
            $dm     = $this->getDocumentManager();
            $videos = $dm->getRepository('OP\MediaBundle\Document\Video')->findAll();
            
            return $this->render('OPMediaBundle:Video:index.html.twig', [
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
                    'Videos' => [
                        'videos' => $this->videosToArray($videos),
                        'loading'=> false,
                        'similar' => $similar
                    ],
                    'Notification' => [
                        'nbAlerts'  => $notifMan->countAlerts($user),
                    ],
                    'Invitation'   => [
                        'nbAlerts'  =>  $invitMan->countAlerts($user),
                    ],
                    'Message'      => [
                        'nbAlerts'  =>  $messMan->countAlerts($user),
                        'threadsIds' => $threadMan->findParticipantInboxThreadsIds($user)
                    ],
                    'Users'        => [
                        'defaults'  => $invitMan->loadDefaultUsers($user, []),
                        'onlines'   => []
                    ],
                    'NewsFeed'     => [
                        'news'      => []
                    ],
                    'Invitation'    => [],
                ],
                'title'         => "My videos",
                'description'   => 'video show', 
                'locale'        => $request->getLocale(),
            ]);
        } else {
            return $this->redirect($this->generateUrl('fos_user_security_login'));
        }
    }

    /**
     * Finds and displays a Post post.
     *
     * @Route("/{id}", name="picture_show")
     * @Method("GET")
     * @Template()
     *
     * @param string $id The post ID
     * @param Request $request The request object
     *
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If post doesn't exists
     */
    public function showAction(Request $request, $id, ThreadManager $threadMan, MessageManager $messMan, NotificationManager $notifMan, SerializerInterface $serializer, InvitationManager $invitMan)
    {
        $session  = $request->getSession();
        if($token = $session->get('access_token')) {
            $video      = $similar = [];
            $user       = $this->_getUser();
            $postId     = $request->query->get('post_id');
            $dm         = $this->getDocumentManager();
            $data      = $dm->getRepository('OP\MediaBundle\Document\Video')
                            ->findOneBy(array('id' => $id));
            if ($data) {
                $video = $this->videoToArray($data);
            }
            
            return $this->render('OPMediaBundle:Video:show.html.twig', [
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
                    'Videos' => [
                        'videos' => [
                            $video['id'] => $video,
                        ],
                        'loading'=> false,
                        'similar' => $similar
                    ],
                    'Notification' => [
                        'nbAlerts'  => $notifMan->countAlerts($user),
                    ],
                    'Invitation'   => [
                        'nbAlerts'  =>  $invitMan->countAlerts($user),
                    ],
                    'Message'      => [
                        'nbAlerts'  =>  $messMessage->countAlerts($user),
                        'threadsIds' => $threadMan->findParticipantInboxThreadsIds($user)
                    ],
                    'Users'        => [
                        'defaults'  => $invitMan->loadDefaultUsers($user, []),
                        'onlines'   => []
                    ],
                    'NewsFeed'     => [
                        'news'      => []
                    ],
                    'Invitation'    => [],
                ],
                'title'         => "{$video['name']}",
                'description'   => 'video show', 
                'locale'        => $request->getLocale(),
            ]);
        } else {
            return $this->redirect($this->generateUrl('fos_user_security_login'));
        }
    }

    protected function videoToArray($vid)
    {
        $serializer = $this->container->get('jms_serializer');
        $path       = explode('.', $vid->getPath())[0];

        return [
            'id'  => $vid->getId(),
            'source' => 'http://opinion.com/optube/uploads/videos/' . $path,
            'name'  => $vid->getName(),
            'createdAt' => $vid->getCreatedAt()->getTimeStamp(),
            'author' => $serializer->toArray($vid->getAuthor())
        ];
    }

    protected function videosToArray($datas) {
        $videos = [];

        foreach ($datas as $data) {
            $videos[] = $this->videoToArray($data);
        }

        return $videos;
    }

    /**
     * Edits an existing Image document.
     *
     * @Route("/{id}/update", name="image_update")
     * @Method("POST")
     * @Template("OPMediaBundle:Image:edit.html.twig")
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

        $document = $dm->getRepository('OPMediaBundle:Image')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find Image document.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm   = $this->createForm(ImageType::class, $document);
        $editForm->handleRequest($request);
        
        //if the form is submitted separately
        //if($form->isSubmitted()){
        if ($editForm->isValid()) {
            $dm->persist($document);
            $dm->flush();

            return $this->redirect($this->generateUrl('image_edit', array('id' => $id)));
        }

        return array(
            'document'    => $document,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Deletes a Image document.
     *
     * @Route("/{id}/delete", name="image_delete")
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
        $form->handleRequest($request);
        
//        if($form->isSubmitted()){
        if ($form->isValid()) {
            $dm = $this->getDocumentManager();
            $document = $dm->getRepository('OPMediaBundle:Image')->find($id);

            if (!$document) {
                throw $this->createNotFoundException('Unable to find Image document.');
            }

            $dm->remove($document);
            $dm->flush();
        }

        return $this->redirect($this->generateUrl('image'));
    }

    private function createDeleteForm($id)
    {
        return $this->createFormBuilder(array('id' => $id))
            ->add('id', 'hidden')
            ->getForm()
        ;
    }

    protected function getPostForPhoto($id) {
        $dm       = $this->getDocumentManager();
        return    $dm->getRepository('OPPostBundle:Post')->getPostForPhoto($id);
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
