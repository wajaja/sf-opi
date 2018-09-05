<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
namespace OP\UserBundle\Request;

use Symfony\Component\HttpFoundation\Request;

/**
 * Description of RequestRefreshToken
 *
 * @author CEDRICK
 */
class RequestRefreshToken 
{
    public static function getRefreshToken(Request $request)
    {
        $refreshTokenString = null;
        if (false !== strpos($request->getContentType(), 'json')) {
            $content = $request->getContent();
            $params = !empty($content) ? json_decode($content, true) : array();
            $refreshTokenString = isset($params['refresh_token']) ? trim($params['refresh_token']) : null;
        } elseif (null !== $request->get('refresh_token')) {
            $refreshTokenString = $request->get('refresh_token');
        } elseif (null !== $request->request->get('refresh_token')) {
            $refreshTokenString = $request->request->get('refresh_token');
        }

        return $refreshTokenString;
    }
}
