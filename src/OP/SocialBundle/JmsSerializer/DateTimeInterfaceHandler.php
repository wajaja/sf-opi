<?php

///https://www.blog.davidfuhr.de/2016/09/28/implement-a-datetimeinterface-handler-for-jmsserializer.html
namespace OP\SocialBundle\JmsSerializer;

use DateTimeInterface,
    JMS\Serializer\VisitorInterface;

class DateTimeInterfaceHandler
{
    public function serializeToJson(VisitorInterface $visitor, DateTimeInterface $dateTime, array $type)
    {
        return $dateTime->format(DATE_ATOM);
    }
}