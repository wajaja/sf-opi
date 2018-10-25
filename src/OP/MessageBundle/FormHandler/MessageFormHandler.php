<?php
namespace OP\MessageBundle\FormHandler;

use OP\MessageBundle\Document\Thread,
    OP\MessageBundle\Document\Response,
    OP\MessageBundle\FormModel\AbstractMessage,
    OP\MessageBundle\FormModel\NewThreadMessage;
/**
 * Form handler for multiple recipients support
 */
class MessageFormHandler extends AbstractMessageFormHandler
{
    /**
     * Composes a message from the form data
     *
     * @param AbstractMessage $message
     *
     * @return MessageInterface the composed message ready to be sent
     * @throws \InvalidArgumentException if the message is not a NewThreadMessage
     */
    public function composeThread(AbstractMessage $message, $thread = null)
    {
        if (!$message instanceof AbstractMessage) {
            throw new \InvalidArgumentException(sprintf('Message must be a NewThreadMultipleMessage instance, "%s" given', get_class($message)));
        }

        //handle message body in request
        $req        = $this->request;
        $uniqueStr  = $req->get('uniqueString');
        $all        = $req->request->all();       
        $data       = json_decode($req->getContent(), true);
        $body       = !$req->getFormat('application/json') ? 
                      $all['thread_message']['body']: $data['body'];

        $galleryId = 'gallerymessage_'.$uniqueStr;
        $galleryDocId = 'gallerymsgdoc_'.$uniqueStr;

        return $this->composer->newThread()
                    ->setUnique($message->getUnique())
                    ->setBody($this->buildHTML($body))
                    ->setSubject($message->getSubject())
                    ->addRecipients($message->getRecipients())
                    ->setSender($this->getAuthenticatedUser())
                    ->addImagesIds($this->messageManager->getXhrImagesIds($galleryId))
                    ->addDocumentsIds($this->messageManager->getXhrDocsIds($galleryDocId))
                    ->getMessage()
                    ;
    }


    /**
     * Composes a message from the form data
     *
     * @param AbstractMessage $message
     *
     * @return MessageInterface the composed message ready to be sent
     * @throws \InvalidArgumentException if the message is not a NewThreadMessage
     */
    public function composeMessage(AbstractMessage $message, $thread = null)
    {
        if (!$message instanceof AbstractMessage) {
            throw new \InvalidArgumentException(sprintf('Message must be a NewThreadMultipleMessage instance, "%s" given', get_class($message)));
        }

        $galleryId = 'gallerymessage_'.$thread->getId();
        $galleryDocId = 'gallerymsgdoc_'.$thread->getId();

        //handle message body in request
        $req        = $this->request;
        $all        = $req->request->all();       
        $data       = json_decode($req->getContent(), true);
        $body       = !$req->getFormat('application/json') ? 
                      $all['thread_message']['body']: $data['body'];

        return $this->composer->reply($thread)
                    ->setBody($this->buildHTML($body))
                    ->setUnique($message->getUnique())
                    ->setSender($this->getAuthenticatedUser())
                    ->addImagesIds($this->messageManager->getXhrImagesIds($galleryId))
                    ->addDocumentsIds($this->messageManager->getXhrDocsIds($galleryDocId))
                    ->getMessage()
                    ;
    }

     /**
     * Composes a response from the form data
     *
     * @param AbstractMessage $message
     * @return Response the composed message ready to be sent
     * @throws InvalidArgumentException if the message is not a ReplyMessage
     */
    public function composeResponse(Response $response, $thread = null)
    {
        //using when its replyForm instance
        if ($response instanceof Response) {
            $body = $response->getContent();
            return $this->composer->postQuestion($response)
                        ->setUnique($response->getUnique())
                        ->setAuthor($this->getAuthenticatedUser())
                        ->setContent($this->buildHTML($body))
                        ->getResponse();
        }
    }
}
