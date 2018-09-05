<?php

namespace OP\UserBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;

/**
 * OP\UserBundle\Document\Devices
 *
 * @ODM\Document(
 *      db="opinion",
 *      collection="devices",
 *      repositoryClass="OP\UserBundle\Repository\DevicesRepository"
 * )
 */
class Devices
{
    /**
     * @var MongoId $id
     *
     * @ODM\Id(strategy="AUTO")
     */
    protected $id;

    /**
     * @var
     *
     * @ODM\Field(name="infos", type="raw")
     */
    protected $infos;

    /**
     * @var
     *
     * @ODM\Field(name="date", type="date")
     */
    protected $date;

    /**
     * @var object_id $createdBy
     *
     * @ODM\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     *
     */
    protected $user;

    public function __construct($infos){
        $this->infos = $infos;
        $this->date = new \Datetime(null, new \DateTimeZone("UTC"));
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
     * Set infos
     *
     * @param string $infos
     * @return $this
     */
    public function setInfos($infos)
    {
        $this->infos = $infos;
        return $this;
    }

    /**
     * Get infos
     *
     * @return string $infos
     */
    public function getInfos()
    {
        return $this->infos;
    }

    /**
     * Set date
     *
     * @param date $date
     * @return $this
     */
    public function setDate($date)
    {
        $this->date = $date;
        return $this;
    }

    /**
     * Get date
     *
     * @return date $date
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * Set user
     *
     * @param OP\UserBundle\Document\User $user
     * @return $this
     */
    public function setUser(\OP\UserBundle\Document\User $user)
    {
        $this->user = $user;
        return $this;
    }

    /**
     * Get user
     *
     * @return OP\UserBundle\Document\User $user
     */
    public function getUser()
    {
        return $this->user;
    }
}
