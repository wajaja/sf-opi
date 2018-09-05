<?php

namespace OP\MessageBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM,
	OP\MessageBundle\Model\MessageMetadata as BaseMessageMetadata;

/**
 * @ODM\EmbeddedDocument
 */
class MessageMetadata extends BaseMessageMetadata
{
    /**
     * @ODM\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $participant;
}
