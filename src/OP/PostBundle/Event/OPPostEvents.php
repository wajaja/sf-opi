<?php
namespace OP\PostBundle\Event;

/*** Declares all events thrown in the PostBundle */
final class OPPostEvents
{
    /**
     * The POST_SEND event occurs after a message has been sent
     * The event is an instance of OP\MessageBundle\Event\MessageEvent
     *
     * @var string
     */
    const POST_CREATE = 'op_post.post_create';

    /**
     * The POST_SEND event occurs after a message has been sent
     * The event is an instance of OP\MessageBundle\Event\MessageEvent
     *
     * @var string
     */
    const SHARE_CREATE = 'op_post.share_create';

    /**
     * The POST_SEND event occurs after a message has been sent
     * The event is an instance of OP\MessageBundle\Event\MessageEvent
     *
     * @var string
     */
    const COMMENT_CREATE = 'op_post.comment_create';

    /**
     * The POST_SEND event occurs after a message has been sent
     * The event is an instance of OP\MessageBundle\Event\MessageEvent
     *
     * @var string
     */
    const COMMENT_UPDATE = 'op_post.comment_update';

    /**
     * The POST_SEND event occurs after a message has been sent
     * The event is an instance of OP\MessageBundle\Event\MessageEvent
     *
     * @var string
     */
    const COMMENT_DELETE = 'op_post.comment_delete';

    /**
     * The POST_SEND event occurs after a message has been sent
     * The event is an instance of OP\MessageBundle\Event\MessageEvent
     *
     * @var string
     */
    const LEFT_COMMENT_CREATE = 'op_post.left_create';

    /**
     * The POST_SEND event occurs after a message has been sent
     * The event is an instance of OP\MessageBundle\Event\MessageEvent
     *
     * @var string
     */
    const LEFT_COMMENT_UPDATE = 'op_post.left_update';

    /**
     * The POST_SEND event occurs after a message has been sent
     * The event is an instance of OP\MessageBundle\Event\MessageEvent
     *
     * @var string
     */
    const LEFT_COMMENT_DELETE = 'op_post.left_delete';

    /**
     * The POST_SEND event occurs after a message has been sent
     * The event is an instance of OP\MessageBundle\Event\MessageEvent
     *
     * @var string
     */
    const RIGHT_COMMENT_CREATE = 'op_post.right_create';

    /**
     * The POST_SEND event occurs after a message has been sent
     * The event is an instance of OP\MessageBundle\Event\MessageEvent
     *
     * @var string
     */
    const RIGHT_COMMENT_UPDATE = 'op_post.right_update';

    /**
     * The POST_SEND event occurs after a message has been sent
     * The event is an instance of OP\MessageBundle\Event\MessageEvent
     *
     * @var string
     */
    const RIGHT_COMMENT_DELETE = 'op_post.right_delete';

    /**
     * The POST_SEND event occurs after a message has been sent
     * The event is an instance of OP\MessageBundle\Event\MessageEvent
     *
     * @var string
     */
    const UNDERCOMMENT_CREATE = 'op_post.under_create';

    /**
     * The POST_SEND event occurs after a message has been sent
     * The event is an instance of OP\MessageBundle\Event\MessageEvent
     *
     * @var string
     */
    const UNDERCOMMENT_UPDATE = 'op_post.under_update';

    /**
     * The POST_SEND event occurs after a message has been sent
     * The event is an instance of OP\MessageBundle\Event\MessageEvent
     *
     * @var string
     */
    const UNDERCOMMENT_DELETE = 'op_post.under_delete';

    /**
     * The POST_SEND event occurs after a message has been sent
     * The event is an instance of OP\MessageBundle\Event\MessageEvent
     *
     * @var string
     */
    const POST_ALLIE_CREATE = 'op_post.post_allie_create';

    /**
     * The POST_DELETE event occurs after a thread has been marked as deleted
     * The event is an instance of OP\MessageBundle\Event\ThreadEvent
     *
     * @var string
     */
    const POST_DELETE = 'op_post.post_delete';

    /**
     * The POST_UNDELETE event occurs after a thread has been marked as undeleted
     * The event is an instance of OP\MessageBundle\Event\ThreadEvent
     *
     * @var string
     */
    const POST_UPDATE = 'op_message.post_update';

    /**
     * The POST_SEND event occurs after a message has been sent
     * The event is an instance of OP\MessageBundle\Event\MessageEvent
     *
     * @var string
     */
    const LIKE_CREATE = 'op_post.like';

    /**
     * The POST_SEND event occurs after a message has been sent
     * The event is an instance of OP\MessageBundle\Event\MessageEvent
     *
     * @var string
     */
    const LIKE_DELETE = 'op_post.unlike';

    /**
     * The POST_SEND event occurs after a message has been sent
     * The event is an instance of OP\MessageBundle\Event\MessageEvent
     *
     * @var string
     */
    const RATE_CREATE = 'op_post.rate_create';

    /**
     * The POST_SEND event occurs after a message has been sent
     * The event is an instance of OP\MessageBundle\Event\MessageEvent
     *
     * @var string
     */
    const RATE_DELETE = 'op_post.rate_delete';

    /**
     * The POST_SEND event occurs after a message has been sent
     * The event is an instance of OP\MessageBundle\Event\MessageEvent
     *
     * @var string
     */
    const RATE_UPDATE = 'op_post.rate_update';
}
