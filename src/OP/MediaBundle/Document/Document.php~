<?php

namespace OP\MediaBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;

/**
 * OP\MediaBundle\Document\Document
 *
 * @ODM\EmbeddedDocument
 * @ODM\Document(
 *     repositoryClass="OP\MediaBundle\Document\DocumentRepository"
 * )
 * @ODM\ChangeTrackingPolicy("DEFERRED_IMPLICIT")
 */
class Document
{
    /**
     * @var MongoId $id
     *
     * @ODM\Id(strategy="AUTO")
     */
    protected $id;

    /**
     * @var string $alt
     *
     * @ODM\Field(name="alt", type="string")
     */
    protected $alt;

    /**
     * @var string $path
     *
     * @ODM\Field(name="path", type="string")
     */
    protected $path;

    /**
     * @var integer $size
     *
     * @ODM\Field(name="size", type="integer")
     */
    protected $size;

    /**
     * @var date $createdAt
     *
     * @ODM\Field(name="createdAt", type="date")
     */
    protected $createdAt;

    /**
     * @var timestamp $ts
     *
     * @ODM\Field(name="ts", type="timestamp")
     */
    protected $ts;
    
    /**
     * @var date $updateAt
     *
     * @ODM\Field(name="updateAt", type="date")
     */
    protected $updateAt;
    
    /**
     * @var integer $size
     *
     * @ODM\Field(name="directory", type="string")
     */
    protected $directory = '';
    
    //----------------------  galleryDir  -----------------------------------
    public function getMsgDocUploadDir()
    {
    // On retourne le chemin relatif vers l'image pour un navigateur
    return 'uploads/gallerymsgdoc';
    }

    public function getMsgDocUploadRootDir()
    {
    // On retourne le chemin relatif vers l'image pour notre code PHP
    return __DIR__.'/../../../../web/'.$this->getMsgDocUploadDir();
    }
    
    //---------------------  galleryOpiDocDir  ---------------------------------
    public function getOpiDocUploadDir()
    {
        // On retourne le chemin relatif vers l'image pour un navigateur
        return 'uploads/galleryopidoc';
    }

    protected function getOpiDocUploadRootDir()
    {
        // On retourne le chemin relatif vers l'image pour notre code PHP
        return __DIR__.'/../../../../web/'.$this->getOpiDocUploadDir();
    }
    
    public function getWebPath()
    {
        if($this->getDirectory()=='gallerymsgdoc'){
           return $this->getMsgDocUploadDir().'/'.$this->getPath(); 
        }elseif ($this->getDirectory()=='galleryopidoc') {
            return $this->getOpiDocUploadDir().'/'.$this->getPath();
        }else {
            return; 
        }    
    }

    public function __construct()
    {
        $this->createdAt = new \Datetime(null, new \DateTimeZone("UTC"));
    }


    /**
     * Get id
     *
     * @return id $id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set alt
     *
     * @param string $alt
     * @return self
     */
    public function setAlt($alt)
    {
        $this->alt = $alt;
        return $this;
    }

    /**
     * Get alt
     *
     * @return string $alt
     */
    public function getAlt()
    {
        return $this->alt;
    }

    /**
     * Set path
     *
     * @param string $path
     * @return self
     */
    public function setPath($path)
    {
        $this->path = $path;
        return $this;
    }

    /**
     * Get path
     *
     * @return string $path
     */
    public function getPath()
    {
        return $this->path;
    }

    /**
     * Set size
     *
     * @param integer $size
     * @return self
     */
    public function setSize($size)
    {
        $this->size = $size;
        return $this;
    }

    /**
     * Get size
     *
     * @return integer $size
     */
    public function getSize()
    {
        return $this->size;
    }

    /**
     * Set createdAt
     *
     * @param date $createdAt
     * @return self
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    /**
     * Get createdAt
     *
     * @return date $createdAt
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Set updateAt
     *
     * @param date $updateAt
     * @return self
     */
    public function setUpdateAt($updateAt)
    {
        $this->updateAt = $updateAt;
        return $this;
    }

    /**
     * Get updateAt
     *
     * @return date $updateAt
     */
    public function getUpdateAt()
    {
        return $this->updateAt;
    }

    /**
     * Set ts
     *
     * @param timestamp $ts
     * @return $this
     */
    public function setTs($ts)
    {
        $this->ts = $ts;
        return $this;
    }

    /**
     * Get ts
     *
     * @return timestamp $ts
     */
    public function getTs()
    {
        return $this->ts;
    }

    /**
     * Set directory
     *
     * @param string $directory
     * @return self
     */
    public function setDirectory($directory)
    {
        $this->directory = $directory;
        return $this;
    }

    /**
     * Get directory
     *
     * @return string $directory
     */
    public function getDirectory()
    {
        return $this->directory;
    }
}
