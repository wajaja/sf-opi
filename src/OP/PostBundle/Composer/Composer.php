<?php
namespace OP\PostBundle\Composer;

use OP\PostBundle\DocumentManager\PostManager;
use OP\PostBundle\Document\{Post, Like, Comment, UnderComment, LeftComment, RightComment, Share, Rate};

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
        return new Post();
    }

    /**
     *
     * @return NewCommentBuilder
     */
    public function newComment()
    {
        return new Comment();
    }

    /**
     *
     * @return NewCommentBuilder
     */
    public function newLeftComment()
    {
        return new LeftComment();
    }

    /**
     *
     * @return NewCommentBuilder
     */
    public function newRightComment()
    {
        return new RightComment();
    }

    /**
     *
     * @return NewUnderCommentBuilder
     */
    public function newUnderComment()
    {
        return new UnderComment();
    }

    /**
     *
     * @return NewPostBuilder
     */
    public function newShare()
    {
        return new Share();
    }

    /**
     */
    public function newLike()
    {
        return new Like();
    }
    
    /**
     */
    public function newRate()
    {
        return new Rate();
    }
}
