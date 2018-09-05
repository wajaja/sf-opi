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
 *     repositoryClass="OP\UserBundle\Repository\ContactRepository"
 * )
 * @ODM\ChangeTrackingPolicy("DEFERRED_IMPLICIT")
 */
class Contact
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
     * @Type("string")
     * @Groups({"Detail", "Me", "Infos", "Profile", "Default"})
     * @ODM\Field(name="phone", type="string")
     */
    protected $phone;

    /**
     * @var string $secontEmail
     *
     * @Expose
     * @Type("string")
     * @Groups({"Detail", "Me", "Infos", "Profile", "Default"})
     * @ODM\Field(name="secondEmail", type="string")
     */
    protected $secondEmail;

    /**
     * @var string $secontEmail
     *
     * @Expose
     * @Type("array")
     * @Groups({"Detail", "Me", "Infos", "Profile", "Default"})
     * @ODM\Field(name="secontEmail", type="hash")
     */
    protected $othersEmails = [];

    public function __construct(){
        $this->telephones = [];
        $this->othersEmails = [];
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
     * Set othersEmails
     *
     * @param hash $othersEmails
     * @return self
     */
    public function setOthersEmails($othersEmails)
    {
        $this->othersEmails = $othersEmails;
        return $this;
    }

    /**
     * Get othersEmails
     *
     * @return hash $othersEmails
     */
    public function getOthersEmails()
    {
        return $this->othersEmails;
    }

    /**
     * Set phone
     *
     * @param string $phone
     * @return $this
     */
    public function setPhone($phone)
    {
        $this->phone = $phone;
        return $this;
    }

    /**
     * Get phone
     *
     * @return string $phone
     */
    public function getPhone()
    {
        return $this->phone;
    }

    /**
     * Set secondEmail
     *
     * @param string $secondEmail
     * @return $this
     */
    public function setSecondEmail($secondEmail)
    {
        $this->secondEmail = $secondEmail;
        return $this;
    }

    /**
     * Get secondEmail
     *
     * @return string $secondEmail
     */
    public function getSecondEmail()
    {
        return $this->secondEmail;
    }
}
