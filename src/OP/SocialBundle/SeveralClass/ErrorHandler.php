<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace OP\SocialBundle\SeveralClass;
use Symfony\Component\HttpFoundation\Session\Session,
    Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Description of FlushHelper
 *
 * @author CEDRICK
 */
class ErrorHandler
{

    function __construct($response) {
        $this->response = $response ? $response : [];
    }


    function out404($output) {
       
    }
}
