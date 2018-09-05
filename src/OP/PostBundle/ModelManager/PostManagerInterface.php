<?php

namespace OP\PostBundle\ModelManager;

use OP\PostBundle\Document\Post,
    OP\PostBundle\Model\ParticipantInterface;

/**
 * Interface to be implemented by post managers. This adds an additional level
 * of abstraction between your application, and the actual repository.
 *
 * All changes to posts should happen through this interface.
 */
interface PostManagerInterface extends ReadableManagerInterface
{
    /**
     * Tells how many unread, non-spam, posts this participant has
     *
     * @param ParticipantInterface $participant
     * @return int the number of unread posts
     */
    function getNbUnreadPostByParticipant(ParticipantInterface $participant);

    /**
     * Creates an empty post instance
     *
     * @return PostInterface
     */
    function createPost();

    /**
     * Saves a post
     *
     * @param PostInterface $post
     * @param Boolean $andFlush Whether to flush the changes (default true)
     */
    function savePost(Post $post, $andFlush = true);

    /**
     * Returns the post's fully qualified class PostManagerInterface.
     *
     * @return string
     */
    function getClass();
}
