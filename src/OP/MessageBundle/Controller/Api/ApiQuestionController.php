<?php
namespace OP\MessageBundle\Controller\Api;

use OP\MessageBundle\Document\Question,
    OP\MessageBundle\Document\Response,
    OP\MessageBundle\Form\ResponseType,
    OP\MessageBundle\Event\ResponseEvent,
    OP\MessageBundle\Event\OPMessageEvents,
    FOS\RestBundle\Controller\Annotations,
    OP\UserBundle\Security\UserProvider,
    Symfony\Component\HttpFoundation\Request,
    FOS\RestBundle\Controller\Annotations\Get,
    FOS\RestBundle\Controller\Annotations\Put,
    FOS\RestBundle\Controller\Annotations\Patch,
    FOS\RestBundle\Controller\Annotations\Post as PostMethod,
    FOS\RestBundle\Controller\FOSRestController,
    FOS\RestBundle\Routing\ClassResourceInterface,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\MessageBundle\DocumentManager\ThreadManager,
    OP\MessageBundle\FormHandler\MessageFormHandler,
    FOS\RestBundle\Controller\Annotations\RouteResource,
    OP\MessageBundle\DataTransformer\ObjectToArrayTransformer,
    Symfony\Component\EventDispatcher\EventDispatcherInterface;

/*
 */
class ApiQuestionController extends FOSRestController implements ClassResourceInterface
{
    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }
    
    /**
     * Lists all follows Post posts.
     * @Get("/questions/load/{postId}")
     *
     * @return Integer
     */
    public function loadQuestionsAction(Request $request, $postId, ObjectToArrayTransformer $transformer)
    {
        $res         = new JsonResponse();
        $dm          = $this->getDocumentManager();
        $refer       = $request->query->get('refer');
        $list        = $dm->getRepository('OPMessageBundle:Question')
                             ->findQuestionsForAuthor($postId, $this->_getUser()->getId(), $refer);
        
        if(!$list) return $res->setData(array('questions'=>[]));

        $questions = [];
        foreach ($list as $q) {
            $questions[] = $transformer->questionToArray($q);
        }
        return $res->setData(array('questions'=>$questions));
    }

    /**
     * Lists all follows Post posts.
     * @Get("/secrets/load/{postId}")
     *
     * @return Integer
     */
    public function loadResponsesAction(Request $request, $postId, ObjectToArrayTransformer $transformer)
    {
        $res            = new JsonResponse();
        $dm             = $this->getDocumentManager();
        $db_res         = $dm->getRepository('OPMessageBundle:Response')
                             ->findResponsesByQuestionId($postId);
        $responses = [];
        foreach ($db_res as $db_r) {
            $responses[] = $transformer->responseToArray($db_r);
        }
        return $res->setData(array('responses'=>$responses));
    }

    /**
     * Lists all follows Post posts.
     * @Get("/questions/find")
     *
     * @return Integer
     */
    public function findAction(Request $request, ObjectToArrayTransformer $transformer)
    {
        $res            = new JsonResponse();
        $user           = $this->_getUser();
        $dm             = $this->getDocumentManager();
        $postId         = $request->query->get('postId');
        $refer          = $request->query->get('refer');
        $question       = $dm->getRepository('OPMessageBundle:Question')
                             ->findQuestionForUser($postId, $user->getId(), $refer);

        if(!$question) return $res->setData(array('question'=>null));

        $db_res         = $dm->getRepository('OPMessageBundle:Response')
                             ->findResponsesByQuestionId((String)$question['_id']);
        $responses = [];
        foreach ($db_res as $db_r) {
            $responses[] = $transformer->responseToArray($db_r);
        }

        return $res->setData(
                        array('question'=>$transformer->questionToArray($question), 
                              'responses'=>$responses
                              )
                        );
    }

    /**
     * Creates a new Post post.
     *
     * @PostMethod("/secrets/create")
     *
     * @return object
     */
    public function createAction(Request $request, MessageFormHandler $formHandler, EventDispatcherInterface $dispatcher, ObjectToArrayTransformer $transformer)
    {

        // $res       = new JsonResponse();
        $form      = $this->createForm(ResponseType::class, new Response());
        if($secret = $formHandler->processSecret($form, false)) {
            $dispatcher->dispatch(OPMessageEvents::RESPONSE_SEND, new ResponseEvent($secret));
            return new JsonResponse([$transformer->responseObjectToArray($secret)]);
        }
        else { 
            return new JsonResponse(['response'=>null]); 
        }
    }


    /**
     * Finds a Post post.
     *
     * @Get("/questions/show/{id}")
     *
     * @param string $id The post ID
     * @param Request $request The request object
     *
     * @return object
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If post doesn't exists
     */
    public function showAction(Request $request, $id, ObjectToArrayTransformer $transformer)
    {
        $dm             = $this->getDocumentManager();
        $question       = $dm->getRepository('OPMessageBundle:Question')
                             ->simpleFindById($id);
        if (!$question) 
            return new JsonResponse([
                "error" => [
                    "errors"=> [
                        [
                            "domain"=> "global",
                            "reason"=> "notFound",
                            "message"=> "Not Found"
                        ]
                    ],
                    "code"=> 404,
                    "message"=> "Not Found"
                ]
            ]);

        return new JsonResponse(['question'=>$transformer->questionToArray($question)]);
    }

    /**
     * Deletes a Post post.
     *
     * @PostMethod("/secrets/remove/{id}")
     *
     * @param Request $request The request object
     * @param string $id       The post ID
     *
     * @return array
     *
     * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException If post doesn't exists
     */
    public function removeAction(Request $request, $id)
    {
        $res    = new JsonResponse();
        $dm     = $this->getDocumentManager();
        $com    = $dm->getRepository('OPPostBundle:Response')->find($id);
        if (!$com) {
            throw $this->createNotFoundException('Unable to find Post post.');
        }
        $dm->remove($com);
        $dm->flush();
        return $res->setData(array('data'=>true));
    }

    private function getStreamClient() {
        return new \GetStream\Stream\Client('sewzt6y5y29n', 'c4bdc5xpez98f5vb4pfdu7myg2zsax5ykahuem2thkmsm7d5e9ddztskjwcwdhk8');
    }

    public function _getUser()
    {
        return $this->user_provider->getHydratedUser();
    }

    /**
    * Convert array objects from database in 
    * single array of ids
    *@param array Users $objects
    */
    public function objectsToIds($objects)
    {
        $ids = [];
        foreach ($objects as $object) {
            $ids[] = $object->getId();
        }
        return $ids;
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
