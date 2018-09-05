<?php
// src/AppBundle/Encoder/NixillaJWTEncoder.php
namespace OP\UserBundle\Encoder;

use Firebase\JWT\JWT,
    Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;

/**
 * NixillaJWTEncoder
 *
 * @author Nicolas Cabot <n.cabot@lexik.fr>
 */
class OPJWTEncoder implements JWTEncoderInterface
{
    /**
     * @var string
     */
    protected $publicKey = <<<EOD
    -----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEArrlDum6wKdyu4qqCr9rm
QLfzgkD+Ul3RN77/PxsiDmraIVvndLp1Yt4vP9wJgULRi0Agk+yIzY0q2xElgMHU
t47p0525fcp7nsU0dE1ih44jh3li8MsR921iwSb4hW3UaCK0XjYgYfkVneg5UFBY
C/b5aDQ3hW3tTywt34ZJNzonWAypCeZcOQBMeMgMU5ElFNFex0LSaxM+uAdLKsNT
bXBZKPPToBBzIc8TGzHVLEl+kjbAg4hVb7u71aE4IJ5m3GFug80Re0Hua6Zls4jP
XsGz/UsQeZ8iXs8O75GRMc4TGeAZSpPp3+C1zVFyT92CLTp7lU18Qx+lxew8gdMi
cK+cWggZ7bfMkY5R5DV1g7vIe1ZQL6cjhcNL334+fysowQtK9xnRL6oUPiuTawFR
BTmIxgo1ymI6ZUEPJg03JqZ5AbBtoqtsJI8+pyL7q28I91gOOEyt+gtsoutlQfSj
S8qskIHIUh2x+o7cVANoZ8EvgmjlGGubxXB362vqKLAMQW+imTD+Xfl3Ws1cjRNe
FD6VmUltEX5Yu7JAuJO0ixTLPPWKdPacImUftEIXrZ5RqGl8karD53wDl4w4SEvQ
V83MWy8TzaS2T8lsteM8D8hRjbmh3H5sbktacPy1lKbfCcQirZw+eWzFNhngJDKl
ssZOTbKGIbO0kVIoCLfEZ3UCAwEAAQ==
-----END PUBLIC KEY-----
EOD;

    /**
     * __construct
     */
    public function __construct()
    {
        // $this->key = $key;
    }

    /**
     * {@inheritdoc}
     */
    public function encode(array $data)
    {
        return JWT::encode($data, $this->key);
    }

    /**
     * {@inheritdoc}
     */
    public function decode($token)
    {
        try {
            return (array) JWT::decode($token, $this->publicKey, array('RS256'));
        } catch (\Exception $e) {
            echo var_dump($e);
            die();
        }
    }
}