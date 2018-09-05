<?php
namespace OP\MessageBundle\Event;

/*** Declares all events thrown in the MessageBundle */
final class OPMessageEvents
{

    /**
     * The POST_SEND event occurs after a message has been sent
     * The event is an instance of OP\MessageBundle\Event\MessageEvent
     *
     * @var string
     */
    const THREAD_CREATE = 'op_message.thread_create';

    /**
     * The POST_SEND event occurs after a message has been sent
     * The event is an instance of OP\MessageBundle\Event\MessageEvent
     *
     * @var string
     */
    const THREAD_DELETE = 'op_message.thread_delete';


    /**
     * The POST_SEND event occurs after a message has been sent
     * The event is an instance of OP\MessageBundle\Event\MessageEvent
     *
     * @var string
     */
    const MESSAGE_SEND = 'op_message.message_send';

    /**
     * The POST_DELETE event occurs after a thread has been marked as deleted
     * The event is an instance of OP\MessageBundle\Event\ThreadEvent
     *
     * @var string
     */
    const MESSAGE_DELETE = 'op_message.message_delete';

    /**
     * The POST_UNDELETE event occurs after a thread has been marked as undeleted
     * The event is an instance of OP\MessageBundle\Event\ThreadEvent
     *
     * @var string
     */
    const MESSAGE_UNDELETE = 'op_message.message_undelete';

    /**
     * The POST_READ event occurs after a thread has been marked as read
     * The event is an instance of OP\MessageBundle\Event\ReadableEvent
     *
     * @var string
     */
    const MESSAGE_READ = 'op_message.message_read';

    /**
     * The POST_UNREAD event occurs after a thread has been unread
     * The event is an instance of OP\MessageBundle\Event\ReadableEvent
     *
     * @var string
     */
    const MESSAGE_UNREAD = 'op_message.message_unread';

    /**
     * The POST_UNREAD event occurs after a thread has been unread
     * The event is an instance of OP\MessageBundle\Event\ReadableEvent
     *
     * @var string
     */
    const MESSAGE_WRITING = 'op_message.message_writing';

    /**
     * The POST_SEND event occurs after a message has been sent
     * The event is an instance of OP\MessageBundle\Event\MessageEvent
     *
     * @var string
     */
    const RESPONSE_SEND = 'op_message.response_send';

    /**
     * The POST_DELETE event occurs after a thread has been marked as deleted
     * The event is an instance of OP\MessageBundle\Event\ThreadEvent
     *
     * @var string
     */
    const RESPONSE_DELETE = 'op_message.response_delete';

    /**
     * The POST_UNDELETE event occurs after a thread has been marked as undeleted
     * The event is an instance of OP\MessageBundle\Event\ThreadEvent
     *
     * @var string
     */
    const RESPONSE_UNDELETE = 'op_message.response_undelete';

    /**
     * The POST_READ event occurs after a thread has been marked as read
     * The event is an instance of OP\MessageBundle\Event\ReadableEvent
     *
     * @var string
     */
    const RESPONSE_READ = 'op_message.response_read';

    /**
     * The POST_UNREAD event occurs after a thread has been unread
     * The event is an instance of OP\MessageBundle\Event\ReadableEvent
     *
     * @var string
     */
    const RESPONSE_UNREAD = 'op_message.response_unread';
}
