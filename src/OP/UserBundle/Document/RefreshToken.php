<?php 

namespace OP\UserBundle\Document;

use OP\UserBundle\Model\RefreshTokenInterface, 
    Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB,
    Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * This class override OP\UserBundle\Entity\RefreshToken to have another table name.
 *
 * @MongoDB\Document(
 *      db="opinion",
 *      collection="jwt_refresh_token",
 * 	    repositoryClass="OP\UserBundle\Repository\JwtRefreshTokenRepository"
 * )
 */
class RefreshToken implements RefreshTokenInterface
{

    /**
     * @MongoDB\Id(strategy="auto")
     */
    protected $id;


    /**
     * @var string
     *
     * @MongoDB\Field(name="refresh_token", type="string")
     */
    protected $refreshToken;

    /**
     * @var string
     *
     * @MongoDB\Field(name="username", type="string")
     */
    protected $username;

    /**
     * @var string
     *
     * @MongoDB\Field(name="valid", type="date")
     */
    protected $valid;

    /**
     * Get id.
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set refreshToken.
     *
     * @param string $refreshToken
     *
     * @return RefreshToken
     */
    public function setRefreshToken($refreshToken = null)
    {
        if (null == $refreshToken) {
            $this->refreshToken = bin2hex(openssl_random_pseudo_bytes(64));
        } else {
            $this->refreshToken = $refreshToken;
        }

        return $this;
    }

    /**
     * Get refreshToken.
     *
     * @return string
     */
    public function getRefreshToken()
    {
        return $this->refreshToken;
    }

    /**
     * Set valid.
     *
     * @param \DateTime $valid
     *
     * @return RefreshToken
     */
    public function setValid($valid)
    {
        $this->valid = $valid;

        return $this;
    }

    /**
     * Get valid.
     *
     * @return \DateTime
     */
    public function getValid()
    {
        return $this->valid;
    }

    /**
     * Set username.
     *
     * @param string $username
     *
     * @return RefreshToken
     */
    public function setUsername($username)
    {
        $this->username = $username;

        return $this;
    }

    /**
     * Get username.
     *
     * @return string
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * Check if is a valid refresh token.
     *
     * @return bool
     */
    public function isValid()
    {
        $datetime = new \DateTime();

        return ($this->valid >= $datetime) ? true : false;
    }

    /**
     * @return string Refresh Token
     */
    public function __toString()
    {
        return $this->getRefreshToken();
    }
}
