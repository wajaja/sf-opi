<?php
/*
 * using for testing if is instanceof;
 */
namespace OP\SocialBundle\Twig\Extension;

use OP\PostBundle\Document\Post;
use OP\OpinionBundle\Document\Opinion;
use OP\MediaBundle\Document\MediaStreamRecorder;
 
class SocialExtension extends \Twig_Extension
{
    public function getTests()
    {
        return array(
            'social_post'  => new \Twig_SimpleTest($this, 'isPost'),
            'social_opinion'   => new \Twig_SimpleTest($this, 'isOpinion'),
            'social_mediastream' => new \Twig_SimpleTest($this, 'isMediaStream')
            
        );
    }
 
    public function isPost($news)
    {
        return ($news instanceof Post);
    }
 
    public function isOpinion($news)
    {
        return ($news instanceof Opinion);
    }
    public function isMediaStream($news)
    {
        return ($news instanceof MediaStreamRecorder);
    }
 
    public function getName()
    {
        return 'OP\SocialBundle\Twig\Extension\SocialExtension';
    }
}