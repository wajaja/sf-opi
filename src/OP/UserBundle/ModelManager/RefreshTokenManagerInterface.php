<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
namespace OP\UserBundle\ModelManager;

use OP\UserBundle\Model\RefreshTokenInterface;

/**
 * Description of RefreshTokenManagerInterface
 *
 * @author CEDRICK
 */
interface RefreshTokenManagerInterface 
{
    /**
     * Creates an empty user instance.
     *
     * @return RefreshTokenInterface
     */
    public function create();

    /**
     * @param string $refreshToken
     *
     * @return RefreshTokenInterface
     */
    public function get($refreshToken);

    /**
     * @param string $username
     *
     * @return RefreshTokenInterface
     */
    public function getLastFromUsername($username);

    /**
     * @param RefreshTokenInterface $refreshToken
     */
    public function save(RefreshTokenInterface $refreshToken);

    /**
     * @param RefreshTokenInterface $refreshToken
     */
    public function delete(RefreshTokenInterface $refreshToken);

    /**
     * @return RefreshTokenInterface[]
     */
    public function revokeAllInvalid();

    /**
     * Returns the user's fully qualified class name.
     *
     * @return string
     */
    public function getClass();
}
