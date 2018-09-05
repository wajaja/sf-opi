<?php

namespace OP\PostBundle\Composer;
use OP\PostBundle\Document\Post;
/**
 *
 */
interface ComposerInterface
{
    /**
     *
     */
    function newPost();

    /**
     *
     * @param Post $post
     */
    function newComment();

    /*
     * return left comment
     */
    function newUnderComment();

    /*
     * return shared post
     */
    function newShare();

    /*
     * return plike comment
     */
    function newLike();
    
    /**
     * 
     */
    function newRate();
}
