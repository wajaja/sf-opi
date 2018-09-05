<?php

namespace OP\UserBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * OP\UserBundle\Document\Request
 *
 * @ODM\EmbeddedDocument
 */
class Request
{
    /**
     * @var MongoId $id
     *
     * @ODM\Id(strategy="AUTO")
     */
    protected $id;

    /**
     * @var collection $userIds
     *
     * @ODM\Field(name="userIds", type="collection")
     */
    protected $userIds = array();
    
    public function __construct() {
        $this->userIds = new ArrayCollection();
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
     * Set userIds
     *
     * @param collection $userIds
     * @return self
     */
    public function setUserIds($userIds)
    {
        $this->userIds = $userIds;
        return $this;
    }

    /**
     * Get userIds
     *
     * @return collection $userIds
     */
    public function getUserIds()
    {
        return $this->userIds;
    }
}
