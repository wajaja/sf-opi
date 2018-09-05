<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
namespace OP\UserBundle\ModelManager;

/**
 * Description of RefreshTokenManager
 *
 * @author CEDRICK
 */
abstract class RefreshTokenManager implements RefreshTokenManagerInterface
{
    /**
     * Creates an empty RefreshToken instance.
     *
     * @return RefreshTokenInterface
     */
    public function create()
    {
        $class = $this->getClass();
        $token = new $class();

        return $token;
    }
}
