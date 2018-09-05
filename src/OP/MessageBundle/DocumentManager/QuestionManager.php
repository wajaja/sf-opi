<?php

namespace OP\MessageBundle\DocumentManager;

use OP\MediaBundle\Document\Image,
    OP\MessageBundle\Document\Question,
    OP\MessageBundle\Document\Response,
    OP\UserBundle\Security\UserProvider,
    Doctrine\ODM\MongoDB\Query\Builder,
    Doctrine\ODM\MongoDB\DocumentManager,
    OP\MessageBundle\Model\ParticipantInterface,
    Symfony\Component\HttpFoundation\RequestStack;

/**
 * Default MongoDB ThreadManager.
 */
class QuestionManager
{
     /**
     * @var DocumentManager
     */
    protected $dm, $image, $class, $request, $uploader,
              $repository, $userProvider;

    /**
     * Constructor.
     *
     * @param DocumentManager $dm
     * @param string          $class
     * @param string          $metaClass
     * @param Uploader        $uploader
     */
    public function __construct(DocumentManager $dm, $class, $uploader, 
        UserProvider $userProvider, RequestStack $request)
    {
        $this->dm             = $dm;
        $this->repository     = $dm->getRepository($class);
        $this->class          = $dm->getClassMetadata($class)->name;
        $this->uploader       = $uploader;
        $this->userProvider   = $userProvider;
        $this->request        = $request->getCurrentRequest();
    }

    protected function publishImages($imagesIds){
        $repo = $this ->dm->getRepository('OP\MediaBundle\Document\Image');

        foreach ($imagesIds as $id) {
            $image = $repo->findOneBy(array('id' => $id));
            if($image)
                $image->setPublished(true);
        }
    }

    /**
     * Saves a message
     *
     * @param Oresponse $response
     * @param Boolean $andFlush Whether to flush the changes (default true)
     */
    public function saveResponse(Response $response, $andFlush = true)
    {
        $this->request->getSession()->start();

        $questionId = $this->request->get('questionId'); //important !!!!!
        if($questionId == null) {
            $question = $this->createQuestion();
        } else {
            $question = $this->dm->getRepository('OPMessageBundle:Question')->find($questionId);
            if (!$question) return; //$response->setData(array('post'=>null));   
        }


        $contents   = $this->request->request->all();       
        $data       = json_decode($this->request->getContent(), true);        
        $content    =   !$this->request->getFormat('application/json') ? 
                            $contents['response']['content']: $data['content'];

        $response->setQuestion($question);
        $response->setContent($content);
        $response->setdocumentValid($question->getId());  //set the value

        //add imageId(s) to post if exist
        $response = $this->addXhrImageIds($response, 'galleryquestion');
        // $response = $this->addImage($response);

        $this->dm->persist($response);
        $this->dm->flush();
    }

    /**
     * Finds a thread by its ID
     *
     * @return ThreadInterface or null
     */
    public function findQuestionById($id)
    {
        return $this->repository->find($id);
    }

    /**
     * Saves a question
     *
     * @param Oquestion $question
     * @param Boolean $andFlush Whether to flush the changes (default true)
     */
    public function createQuestion()
    {
        $user       = $this->getAuthenticatedUser();
        $postId     = $this->request->get('postId');
        $refer      = $this->request->get('refer');

        if($refer === 'photo') {
            $post = $this->dm->getRepository('OPMediaBundle:Image')->find($postId);
        } else {
            $post = $this->dm->getRepository('OPPostBundle:Post')->find($postId);
        }
        if (!$post) return; //$response->setData(array('post'=>null));

        $question = new Question();
        $refer === 'post' ? $question->setPost($post) :  $question->setPhoto($post);
        $question->setCreatedBy($user);
        $question->addParticipant($user);
        $question->addParticipant($post->getAuthor());

        $post->incrementQuestioners();
        $post->doQuestionersIds($user->getId(), 'push');
        $this->dm->persist($question);

        return $question;
    }

    /**
     * Deletes a question
     * This is not participant deletion but real deletion
     *
     * @param Oquestion $question the thread to delete
     */
    public function deleteQuestion(Question $question)
    {
        $this->dm->remove($question);
        $this->dm->flush();
    }

    /**
     * Returns the fully qualified comment thread class name
     *
     * @return string
     */
    public function getClass()
    {
        return $this->class;
    }

    private function addXhrImageIds(Response $response, $galleryDir){  
        $postId     = $this->request->get('postId');
        $questionId = $this->request->get('questionId');
        $session    = $this->request->getSession();
        $manager    = $this->uploader->get($galleryDir);
        $files      = $manager->getFiles();
        $imagesIds  = array_values((array)$session->get('_'.$galleryId)); //list of persisted 

        if(!$questionId) {
            $dirId  = 'galleryquestion'.'_'.$postId;
        } else if($questionId == $response->getQuestion()->getId()) {
            $dirId  = 'galleryquestion'.'_'.$questionId;
        }

        if ($session->has($dirId)) {
            $uploadedFiles = $session->get($dirId);
            foreach ($uploadedFiles as $originalName => $filename) {
                $files->files()->name($filename);
            }
        }

        $files = $manager->uploadFiles(iterator_to_array($files));
        $response->setImagesIds($imagesIds);
        $this->publishImages($imagesIds);      //set publish to true for each image
        $session->set('_'.$dirId, []);  //remove images ids in session
        return $response;
    }

    /**
     * Performs denormalization tricks
     *
     * @param Oquestion $question
     */
    protected function denormalize(Question $question)
    {
        $this->doParticipants($question);
    }

    /**
     * Ensures that the thread participants are up to date
     */
    protected function doParticipants(Question $question)
    {
        foreach ($question->getResponses() as $response) {
            $question->addParticipant($response->getAuthor());
        }
    }

    /**
     * Gets the current authenticated user
     * @see::OPMEssageBundle participantprovider
     * @return ParticipantInterface
     */
    protected function getAuthenticatedUser()
    {
        return $this->userProvider->getHydratedUser();
    }
}