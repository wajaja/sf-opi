<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
namespace OP\UserBundle\Model;

/**
 * Description of RefreshTokenInterface
 *
 * @author CEDRICK
 */
interface RefreshTokenInterface 
{
    /**
     * Get id.
     *
     * @return int
     */
    public function getId();

    /**
     * Set refreshToken.
     *
     * @param string $refreshToken
     *
     * @return self
     */
    public function setRefreshToken($refreshToken = null);

    /**
     * Get refreshToken.
     *
     * @return string
     */
    public function getRefreshToken();

    /**
     * Set valid.
     *
     * @param \DateTime $valid
     *
     * @return self
     */
    public function setValid($valid);

    /**
     * Get valid.
     *
     * @return \DateTime
     */
    public function getValid();

    /**
     * Set username.
     *
     * @param $username
     *
     * @return self
     */
    public function setUsername($username);

    /**
     * Get user.
     *
     * @return $username
     */
    public function getUsername();

    /**
     * Check if is a valid refresh token.
     *
     * @return bool
     */
    public function isValid();
}
