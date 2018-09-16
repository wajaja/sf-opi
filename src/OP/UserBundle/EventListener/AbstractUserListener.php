<?php

namespace OP\UserBundle\EventListener;

use FOS\UserBundle\FOSUserEvents,
    Kreait\Firebase\Factory,
    Kreait\Firebase\ServiceAccount,
    OP\SocialBundle\Firebase\Firebase,
    Lexik\Bundle\JWTAuthenticationBundle\Events,
    Symfony\Component\HttpFoundation\RequestStack,
    Symfony\Component\HttpFoundation\RedirectResponse,
    Symfony\Component\HttpFoundation\JsonResponse,
    OP\MediaBundle\DocumentManager\PictureManager,
    Symfony\Component\Routing\Generator\UrlGeneratorInterface,
    Lexik\Bundle\JWTAuthenticationBundle\Services\JWTManager,
    Symfony\Component\EventDispatcher\EventDispatcherInterface,
    Symfony\Component\DependencyInjection\ContainerInterface as Container,
    Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;

/**
 * Listener responsible to change the redirection at the end of the password resetting
 */
abstract class AbstractUserListener
{

    protected $router, $request, $firebase,
            $dispatcher, $jwtManager, $container, $pic_man;

    public function __construct(UrlGeneratorInterface $router, RequestStack $request, EventDispatcherInterface $dispatcher, JWTManager $jwtManager,
        Container $container, Firebase $fb, PictureManager $pic_man)
    {
        $this->router     = $router;
        $this->dispatcher = $dispatcher;
        $this->jwtManager = $jwtManager;
        $this->request    = $request->getCurrentRequest();
        $this->container  = $container;
        $this->firebase   = $fb;
        $this->pic_man    = $pic_man;
    }

    protected function createFirebaseUser($user, $password) {
        $auth   = $this->firebase->getAuth();

        $userProperties = [
            'uid' => $user->getId(),
            'email' => $user->getEmail(),
            'username' =>$user->getUsername(),
            'gender' => $user->getGender(),
            'emailVerified' => false,
            // 'phoneNumber' => '',
            'password' => $password,
            'displayName' => "{$user->getFirstname()} {$user->getLastname()}",
            'photoUrl' => !$user->getProfilePic() ? '' : $user->getProfilePic()->getWebPath(),
            'disabled' => false,
        ];

        $createdUser = $auth->createUser($userProperties);
    }

    protected function updateFirebaseUser($user, $password) {

        $auth   = $this->firebase->getAuth();

        $userProperties = [
            'uid' => $user->getId(),
            'email' => $user->getEmail(),
            'username' =>$user->getUsername(),
            'gender' => $user->getGender(),
            'emailVerified' => false,
            // 'phoneNumber' => '',
            'password' => $password,
            'displayName' => "{$user->getFirsname()} {$user->getLastname()}",
            'photoUrl' => !$user->getProfilePic() ? '' : $user->getProfilePic()->getWebPath(),
            'disabled' => false,
        ];

        $updatedUser = $auth->updateUser($userProperties);
    }

    protected function firebaseLogin($email, $password) {
        $serviceAccount = ServiceAccount::fromJsonFile(__DIR__.'/google-service-account.json');
        $auth       = $this->firebase->getAuth();

        try {
            $userRecord = $auth->verifyPassword($email, $password);
        } catch (Kreait\Firebase\Exception\Auth\InvalidPassword $e) {
            echo "userRecord string";
            echo $e->getMessage();
            exit;
        }

        $userConnection = (new Factory)
            ->withServiceAccount($serviceAccount)
            ->asUser($userRecord->uid)
            ->create();
    }

    protected function firebaseChangePassword($user, $password) {
        $auth   = $this->firebase->getAuth();
        $updatedUser = $auth->changeUserPassword($user->getId(), $password);
    }

    protected function firebaseChangeEmail($user, $email) {
        $auth   = $this->firebase->getAuth();
        $updatedUser = $auth->changeUserEmail($user->getId(), $email);
    }

    protected function firebaseDisableUser($user) {
        $auth   = $this->firebase->getAuth();
        $updatedUser = $auth->disableUser($user->getId());
    }

    protected function firebaseEnableUser($user) {
        $auth   = $this->firebase->getAuth();
        $updatedUser = $auth->enableUser($user->getId());
    }    
}