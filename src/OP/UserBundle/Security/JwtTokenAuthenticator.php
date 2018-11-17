<?php
namespace OP\UserBundle\Security;

use Doctrine\ODM\MongoDB\DocumentManager,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Component\Security\Core\User\UserInterface,
    Symfony\Component\Security\Core\User\UserProviderInterface,
    Symfony\Component\Security\Guard\AbstractGuardAuthenticator,
    Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface,
    Symfony\Component\Security\Core\Exception\AuthenticationException,
    Symfony\Component\Security\Core\Authentication\Token\TokenInterface,
    Lexik\Bundle\JWTAuthenticationBundle\TokenExtractor\AuthorizationHeaderTokenExtractor,
    Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;


class JwtTokenAuthenticator extends AbstractGuardAuthenticator
{
    protected $jwtEncoder, $dm;

    public function __construct(JWTEncoderInterface $jwtEncoder, DocumentManager $dm)
    {
        $this->jwtEncoder = $jwtEncoder;
        $this->dm = $dm;
    }

    /**
    * Called on every request. Return whatever credentials you want,
    * or null to stop authentication.
    */
    public function getCredentials(Request $request)
    {
        $extractor = new AuthorizationHeaderTokenExtractor(
            'Bearer',
            'Authorization'
        );
        $token = $extractor->extract($request);
        if (!$token) {
            return ;
        }
        // What you return here will be passed to getUser() as $credentials
        return $token;
    }


    public function getUser($credentials, UserProviderInterface $userProvider)
    {
        $data = $this->jwtEncoder->decode($credentials);
        if ($data === false) {
            throw new CustomUserMessageAuthenticationException('Invalid Token');
        }
        $username = $data['username'];

        // if null, authentication will fail
        // if a User object, checkCredentials() is called
        return $this->dm
            ->getRepository('OPUserBundle:User')
            ->findOneBy(['username' => $username]);
    }


    public function checkCredentials($credentials, UserInterface $user)
    {
        // check credentials - e.g. make sure the password is valid
        // no credential check is needed in this case

        // return true to ca    authentication success
        return true;
    }


    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        $data = array(
            'message' => strtr($exception->getMessageKey(), $exception->getMessageData())
            // or to translate this message
            // $this->translator->trans($exception->getMessageKey(), $exception->getMessageData())
        );
        return new JsonResponse($data, 403);
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, $providerKey)
    {
        // do nothing - let the controller be called
        // on success, let the request continue
        //return null;
        $session = $request->getSession();
        if(!$session->isStarted())
            $session->start();

        $session->set('_security_api', serialize($token));
    }

    public function supportsRememberMe()
    {
        return false;
    }

    public function start(Request $request, AuthenticationException $authException = null)
    {
        // TODO: Implement start() method.
        // $data = array(
        // // you might translate this message
        // 'message' => 'Authentication Required'
        // );
        // return new JsonResponse($data, 401);
    }
}