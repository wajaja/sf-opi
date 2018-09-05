<?php

namespace OP\UserBundle\Document;

use JMS\Serializer\Annotation\Type,
    JMS\Serializer\Annotation\Expose,
    JMS\Serializer\Annotation\Groups,
    Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;

/**
 * OP\UserBundle\Document\Config
 *
 * @ODM\EmbeddedDocument
 * @ODM\Document(
 *     repositoryClass="OP\UserBundle\Repository\ConfigRepository"
 * )
 * @ODM\ChangeTrackingPolicy("DEFERRED_IMPLICIT")
 */
class Config
{
    /**
     * @var MongoId $id
     *
     * @Expose
     * @Type("string")
     * @Groups({"Detail", "Me", "Infos", "Profile", "Default"})
     * @ODM\Id(strategy="AUTO")
     */
    protected $id;

    /**
     * @var integer $firstCell
     *
     * @Expose
     * @Type("boolean")
     * @Groups({"Detail", "Me", "Infos", "Profile", "Default"})
     * @ODM\Field(name="enterToSubmitMessage", type="boolean")
     */
    protected $enterToSubmitMessage;

    public function __construct(){
        
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
     * Set enterToSubmitMessage
     *
     * @param boolean $enterToSubmitMessage
     * @return $this
     */
    public function setEnterToSubmitMessage($enterToSubmitMessage)
    {
        $this->enterToSubmitMessage = $enterToSubmitMessage;
        return $this;
    }

    /**
     * Get enterToSubmitMessage
     *
     * @return boolean $enterToSubmitMessage
     */
    public function getEnterToSubmitMessage()
    {
        return $this->enterToSubmitMessage;
    }
}
