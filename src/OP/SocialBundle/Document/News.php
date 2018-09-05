<?php

namespace OP\SocialBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;
use Doctrine\Common\Collections\ArrayCollection;


/**
 * @author Cedrick Ngeja
 * this class helpe to
 * Handle and serve View in listNews for 
 * Specific Document from DB  
 */
class News
{
    protected $type,
              $data;

    public function setData($data)
    {
        $this->data = $data;
    }
    /**
     * Get data
     * @return data $data
     */
    public function getData()
    {
        return $this->data;
    }

    /**
     * Set type
     *
     * @param string $type
     * @return $this
     */
    public function setType($type)
    {
        $this->type = $type;
        return $this;
    }

    /**
     * Get type
     *
     * @return string $type
     */
    public function getType()
    {
        return $this->type;
    }
}
