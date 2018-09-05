<?php

namespace OP\PostBundle\ModelManager;

/**
 * Abstract Message Manager implementation which can be used as base by
 * your concrete manager.
 *
 */
abstract class PostManager implements PostManagerInterface
{
    /**
     * Creates an empty message instance
     * @return MessageInterface
     */
    public function createPost()
    {
        $class = $this->getClass();
        $post = new $class;

        return $post;
    }

}
