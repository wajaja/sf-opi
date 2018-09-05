<?php

namespace OP\UserBundle\Document;

use JMS\Serializer\Annotation\Type,
    JMS\Serializer\Annotation\Expose,
    JMS\Serializer\Annotation\Groups,
    Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;

/**
 * OP\UserBundle\Document\Contact
 *
 * @ODM\EmbeddedDocument
 * @ODM\Document(
 *     repositoryClass="OP\UserBundle\Repository\NotificationRepository"
 * )
 * @ODM\ChangeTrackingPolicy("DEFERRED_IMPLICIT")
 */
class Notification
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
     * @ODM\Field(name="email", type="boolean")
     */
    protected $email;

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
     * Set email
     *
     * @param boolean $email
     * @return $this
     */
    public function setEmail($email)
    {
        $this->email = $email;
        return $this;
    }

    /**
     * Get email
     *
     * @return boolean $email
     */
    public function getEmail()
    {
        return $this->email;
    }
}
