<?php
namespace OP\PostBundle\Composer;

use OP\PostBundle\DocumentManager\PostManager;

/**
 */
class Composer implements ComposerInterface
{
    /**
     * Post manager
     *
     */
    protected $postManager;

    public function __construct(PostManager $postManager)
    {
        $this->opinionManager = $postManager;
    }

    /**
     *
     * @return NewPostBuilder
     */
    public function newPost()
    {
        return new \OP\PostBundle\Document\Post();
    }

    /**
     *
     * @return NewCommentBuilder
     */
    public function newComment()
    {
        return new \OP\PostBundle\Document\Comment();
    }

    /**
     *
     * @return NewCommentBuilder
     */
    public function newLeftComment()
    {
        return new \OP\PostBundle\Document\LeftComment();
    }

    /**
     *
     * @return NewCommentBuilder
     */
    public function newRightComment()
    {
        return new \OP\PostBundle\Document\RightComment();
    }

    /**
     *
     * @return NewUnderCommentBuilder
     */
    public function newUnderComment()
    {
        return new \OP\PostBundle\Document\UnderComment();
    }

    /**
     *
     * @return NewPostBuilder
     */
    public function newShare()
    {
        return new \OP\PostBundle\Document\Share();
    }

    /**
     */
    public function newLike()
    {
        return new \OP\PostBundle\Document\Like();
    }
    
    /**
     */
    public function newRate()
    {
        return new \OP\PostBundle\Document\Rate();
    }
}
