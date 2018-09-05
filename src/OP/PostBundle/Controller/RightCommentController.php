<?php

namespace OP\PostBundle\Controller;

use OP\MediaBundle\Document\Image,
    OP\PostBundle\Document\RightComment,
    OP\PostBundle\Form\RightCommentType,
    OP\SocialBundle\Document\Notification,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Component\HttpFoundation\File\UploadedFile,
    Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Method,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;


/**
 * RightComment controller.
 *
 * @Route("/rightcomment")
 */
class RightCommentController extends Controller
{
    /**
     * Lists all RightComment documents.
     *
     * @Route("/", name="rightcomment")
     * @Template()
     *
     * @return array
     */
    public function indexAction()
    {
        $dm = $this->getDocumentManager();

        $documents = $dm->getRepository('OPPostBundle:RightComment')->findAll();

        return array('documents' => $documents);
    }

    /**
     * Displays a form to create a new RightComment document.
     *
     * @Route("/new", name="rightcomment_new")
     * @Template()
     *
     * @return array
     */
    public function newAction()
    {
        $document = new RightComment();
        $form = $this->createForm(RightCommentType::class, $document);

        return array(
            'document' => $document,
            'form'     => $form->createView()
        );
    }

    /**
     * Lists all Comment documents.
     *
     * @Route("/{id}", name="list_right_comments")
     *
     *
     * @return array
     */
    public function listCommentsAction($id)
    {
        $dm = $this->getDocumentManager();
        $opinionId = $dm->getRepository('OPPostBundle:Opinion')->find($id);

        //Get list of Comments
        $listComments = $opinionId->getRightComments();
        return $this->render('OPPostBundle:RightComment:listcomments.html.twig', array('listComments'=>$listComments));
    }

    /**
     * Creates a new Comment document.
     *
     * @Route("/create/{id}", name="rightcomment_create")
     * @Method("POST")
     * @Template("OPSocialBundle:Home:news.html.twig")
     *
     * @param Request $request The request object
     * @param string $id       The document ID
     *
     * @return array
     */
    public function createAction($id, Request $request)
    {
        $author = $this->_getUser();                                            //Get the Current UserId

        $dm = $this->getDocumentManager();                                   //find the PostId in the DB
        $opinionId = $dm->getRepository('OPPostBundle:Opinion')->find($id);
        $opinionValid = $opinionId->getId();                                      // field who validate the data

        $rComment = new RightComment(); $image = new Image();                 //instatiate the objects
        $rComment->setOpinionValid($opinionValid);                              //set the value
        $rComment->setOpinionId($opinionId);
        $rCommentForm = $this->createForm(RightCommentType::class, $rComment);
        //$rCommentForm->handleRequest($request);

        if('POST'=== $request->getMethod()){
            if($request->isXmlHttpRequest()){
                $contents = $request->request->all();                       //get all content by request
                $submittedContent = $contents['content'];                       //content Value
                $submittedOpinionId = $contents['opinionId'];                         //the value under postId in the submitted data form
                $submittedOpinionValid = $contents['opinionValid'];                   //the value under postValid in the submitted data form

                $path = '';
                $originalFiles = $request->files;                               //get the uploaded Files by the request
                foreach($originalFiles as $file){
                    if (($file instanceof UploadedFile) && ($file->getError() == '0')) {
                        if (($file->getSize() < 2000000000)) {

                            $originalName = $file->getClientOriginalName();         //original name
                            $name_array = explode('.', $originalName);              //explode the $originalName String
                            $file_type = $name_array[sizeof($name_array) - 1];      //get extension of file by sizeof function
                            $valid_filetypes = array('jpg', 'jpeg', 'bmp', 'png');  //declared the valid types

                            if (in_array(strtolower($file_type), $valid_filetypes)){
                                $path = md5(uniqid()).'.'.$file->guessExtension(); $size = $file->getSize();  //set the path and size
                                $image->setPath($path);
                                $image->setSize($size);
                                $image->setDirectory('gallery');

                                $file->move($image->getUploadRootDir(), $image->path);  //move file
                                //$dm->persist($image);                                     //persist image
                                $rComment->addImage($image);                             //add the file to comment
                                unset($file);                                               //unset file
                            }
                            else{
                              $status = 'failed'; $message = 'Invalid File Type';
                            }
                        }
                        else{
                            $status = 'failed'; $message = 'Size exceeds limit';
                        }
                    }
                    else{
                        $status = 'failed';  $message = 'File Error';
                    }
                }
                $rComment->setContent($submittedContent);                                //setting the commenrt content
                $rComment->setAuthor($author);
                $dm->persist($rComment);

                //add notification
                $notifId = $dm->getRepository('OPSocialBundle:Notification')->notificationByContentId($opinionValid);

                //first notification
                if(!$notifId>0){
                    $oringinalAuthor = $opinionId->getAuthor();
                    $notif = new Notification();
                    $notif->setIsRead(false);
                    $notif->setType('rightComment');
                    $notif->addParticipant($author);
                    $notif->setAuthor($oringinalAuthor);
                    $notif->setContent('opinion');
                    $notif->setContentId($opinionValid);
                    $dm->persist($notif);
                    $dm->flush();
                }
                //else add some more then add participants from latest
                else{
                    //if opinion have somme notification get only the participants;
                    // then insert in new notification object
                    $oringinalAuthor = $opinionId->getAuthor();
                    $notif = new Notification();
                    $notif->setIsRead(false);
                    $notif->setType('rightComment');
                    $participant = [];
                    $parts = [];
                    $authorUsername = $author->getUsername();
                    //loop in notifId from the database; then getUsername
                    foreach ($notifId as $noti) {
                        $partics = $noti->getParticipants();
                        foreach ($partics as $partic) {
                            $participant = $partic->getUsername();
                            $parts[] = $participant;
                            $notif->addParticipant($partic);
                        }
                    }
                    //theck if author exist from the latest notification
                    if(in_array($authorUsername, $parts)){
                        $notif->setAuthor($oringinalAuthor);
                        $notif->setContent('opinion');
                        $notif->setContentId($opinionValid);
                        $dm->persist($notif);
                        $dm->flush();
                    }else{
                        $notif->addParticipant($author);
                        $notif->setAuthor($oringinalAuthor);
                        $notif->setContent('opinion');
                        $notif->setContentId($opinionValid);
                        $dm->persist($notif);
                        $dm->flush();                         //addParticipant
                    }
                }
                return new JsonResponse(array('contenu'=>$contents));
            }else{
                return new JsonResponse(array('contenu'=>'rien'));
            }
        }
        return $this->render('OPPostBundle:RightComment:newRcomment.html.twig',
                                    array('rCommentForm'=>$rCommentForm->createView(), 'opinionValid'=>$opinionValid));
    }

    /**
     * Finds and displays a RightComment document.
     *
     * @Route("/{id}/show", name="rightcomment_show")
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

        $document = $dm->getRepository('OPPostBundle:RightComment')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find RightComment document.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return array(
            'document' => $document,
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Displays a form to edit an existing RightComment document.
     *
     * @Route("/{id}/edit", name="rightcomment_edit")
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

        $document = $dm->getRepository('OPPostBundle:RightComment')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find RightComment document.');
        }

        $editForm = $this->createForm(RightCommentType::class, $document);
        $deleteForm = $this->createDeleteForm($id);

        return array(
            'document'    => $document,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Edits an existing RightComment document.
     *
     * @Route("/{id}/update", name="rightcomment_update")
     * @Method("POST")
     * @Template("OPPostBundle:RightComment:edit.html.twig")
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

        $document = $dm->getRepository('OPPostBundle:RightComment')->find($id);

        if (!$document) {
            throw $this->createNotFoundException('Unable to find RightComment document.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm   = $this->createForm(RightCommentType::class, $document);
        $editForm->handleRequest($request);

        //        if ($form->isSubmitted()){
        if ($editForm->isValid()) {
            $dm->persist($document);
            $dm->flush();

            return $this->redirect($this->generateUrl('rightcomment_edit', array('id' => $id)));
        }

        return array(
            'document'    => $document,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Deletes a RightComment document.
     *
     * @Route("/{id}/delete", name="rightcomment_delete")
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

        //        if ($form->isSubmitted()){
        if ($form->isValid()) {
            $dm = $this->getDocumentManager();
            $document = $dm->getRepository('OPPostBundle:RightComment')->find($id);

            if (!$document) {
                throw $this->createNotFoundException('Unable to find RightComment document.');
            }

            $dm->remove($document);
            $dm->flush();
        }

        return $this->redirect($this->generateUrl('rightcomment'));
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
}
