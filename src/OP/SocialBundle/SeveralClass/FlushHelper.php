<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace OP\SocialBundle\SeveralClass;
use Symfony\Component\HttpFoundation\Session\Session;

/**
 * Description of FlushHelper
 *
 * @author CEDRICK
 */
class FlushHelper
{
    //put your code here
    static $BUFFER_SIZE_APACHE = 65536;         //

    protected $bufferSize;

    function __construct($bufferSize = null) {
        $this->bufferSize = $bufferSize ? $bufferSize : max(static::$BUFFER_SIZE_APACHE, 0);
    }

    function out($output) {

        if(!is_scalar($output))
            throw new InvalidArgumentException();

        echo $output;
        echo str_repeat(' ', 100);
        ob_flush();
        flush();
    }

    function outPlaceholder($output, $id, $script) {
        $out = '<script type="text/javascript">';
        $out .= '$("#'.$id.'").html('.$output.');';
        $out .= $script;
        $out .= '</script>';
        return $this->out($out);
    }

    /**
    * Using babal for react render
    *
    */
    public function outPlaceholderReact($output, $id, $script){
        $out = '<script type="text/babel">';
        $out .= '$("#'.$id.'").html('.$output.');';
        $out .= $script;
        $out .= '</script>';
        return $this->out($out);
    }
}
