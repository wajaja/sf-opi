<?php

namespace OP\MessageBundle\FormModel;

use Symfony\Component\HttpFoundation\File\File;

abstract class AbstractMessage
{
    /**
     * The message body
     *
     * @var string
     */
    protected $body;

    /**
     * 
     * @var string
     */
    protected $unique;
    
    /**
     * The thread subject
     *
     * @var file
     */
    protected $document;

    /**
     * @return string
     */
    public function getBody()
    {
        return $this->body;
    }

    /**
     * @param  string
     * @return null
     */
    public function setDocument(File $document)
    {
        $this->document = $document;
    }
    
    /**
     * @return string
     */
    public function getDocument()
    {
        if ($this->document == 0){

        }else{
            return $this->document;
        }
    }

    /**
     * @param  string
     * @return null
     */
    public function setBody($body)
    {
        $this->body = $body;
    }

     /**
     * Set unique
     *
     * @param string $unique
     * @return $this
     */
    public function setUnique($unique)
    {
        $this->unique = $unique;
        return $this;
    }

    /**
     * Get unique
     *
     * @return string $unique
     */
    public function getUnique()
    {
        return $this->unique;
    }
}
