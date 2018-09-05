<?php

namespace OP\UserBundle\Document\Invitation;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * Description of InvitationMetadata
 * @MongoDB\EmbeddedDocument
 * @author CEDRICK
 */
class InvitationMetadata 
{
    /**
     * @MongoDB\Field(name="isConfirmed", type="boolean")
     * @var type 
     */
    protected $isConfirmed = false;
    
    /**
     * @MongoDB\Field(name="isMasket", type="boolean")
     * 
     * @var type 
     */
    protected $isMasked = false;
    
    /**
     * @MongoDB\Field(name="isDeleted", type="boolean")
     * 
     * @var type 
     */
    protected $isDeleted = false;
    
    
    public function getIsconfirmed(){
        return $this->isConfirmed;
    }
    
    public function setIsconfirmed($isConfirmed){
        $this->isConfirmed = $isConfirmed;
        return $this;
    }
    
    public function setIsmasked($isMasked){
        $this->isMasked = $isMasked;
        return $this;
    }
    
    public function getIsmasked(){
        return $this->isMasked;
    }
    
    public function setIsdeleted($isDeleted){
        $this->isDeleted = $isDeleted;
        return $this;
    }
    
    public function getIsdeleted(){
        return $this->isDeleted;
    }
}
