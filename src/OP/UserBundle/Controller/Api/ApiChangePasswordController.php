<?php

// /src/AppBundle/Controller/RestPasswordManagementController.php

namespace OP\UserBundle\Controller\Api;

use FOS\UserBundle\FOSUserEvents,
    FOS\UserBundle\Event\FormEvent,
    Nelmio\ApiDocBundle\Annotation as Doc,
    FOS\RestBundle\Controller\Annotations,
    OP\UserBundle\Security\UserProvider,
    Symfony\Component\HttpFoundation\Request,
    FOS\UserBundle\Event\GetResponseUserEvent,
    FOS\RestBundle\Controller\FOSRestController,
    FOS\UserBundle\Event\FilterUserResponseEvent,
    FOS\RestBundle\Routing\ClassResourceInterface,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Component\Security\Core\User\UserInterface,
    FOS\RestBundle\Controller\Annotations\RouteResource,
    Symfony\Component\EventDispatcher\EventDispatcherInterface,
    Symfony\Component\Security\Core\Exception\AccessDeniedException,
    // Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException,
    Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;

/**
 * @RouteResource("password", pluralize=false)
 */
class ApiChangePasswordController extends FOSRestController implements ClassResourceInterface
{
    
    protected $dm, $user_provider;

    public function __construct(UserProvider $uProvider, \Doctrine\ODM\MongoDB\DocumentManager $dm) {
        $this->dm           = $dm;
        $this->user_provider = $uProvider;
    }
    
    /**
     * Change user password
     * @Annotations\Post("/setting/password/{userId}")
     *
     */
    public function changeAction(Request $request, $userId)
    {
        $user = $this->_getUser();
        if (!is_object($user) || !$user instanceof UserInterface) {
            throw new AccessDeniedException('This user does not have access to this section.');
        }

        $serializer     = $this->get('jms_serializer');
        $dispatcher     = $this->get('event_dispatcher');
        $contentType    = $request->headers->get('Content-Type');

        $event = new GetResponseUserEvent($user, $request);
        $dispatcher->dispatch(FOSUserEvents::CHANGE_PASSWORD_INITIALIZE, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }

        /** @var $formFactory FactoryInterface */
        $formFactory = $this->get('fos_user.change_password.form.factory');
        $redirected  = false;

        //we have to authenticate the user manually because we are in state less
        $token = new UsernamePasswordToken($user, null, "api", $user->getRoles());
        $this->container->get("security.token_storage")->setToken($token);

        if('application/x-www-form-urlencoded' === $contentType) { 
            $redirected = true;
            $form       = $formFactory->createForm();
            $form->setData($user);
            $form->handleRequest($request);
        } else {
            $form       = $formFactory->createForm(['csrf_protection' => false]);
            $data       = json_decode($request->getContent(), true);
            $response   = new JsonResponse();
            $form->setData($user);
            $request->request->replace(is_array($data) ? $data : array());
            $form->submit($data);
        }

        if (!$form->isValid() ) {
            if($redirected) {
                $url      = $this->generateUrl('fos_user_setting');
                // TODO :: set session flashbag 
                $response = new RedirectResponse($url);
            } else {
                $response->setData(
                    array('user'=>$serializer->toArray($this->_getUser()),  //get last user
                          'errors'=>$this->getErrorMessages($form))
                );
            }

        } else if ($form->isSubmitted() && $form->isValid()) {
            /** @var $userManager UserManagerInterface */
            $userManager = $this->get('fos_user.user_manager');
            $event       = new FormEvent($form, $request);
            $dispatcher->dispatch(FOSUserEvents::CHANGE_PASSWORD_SUCCESS, $event);

            $userManager->updateUser($user);

            $dispatcher->dispatch(FOSUserEvents::CHANGE_PASSWORD_COMPLETED, new FilterUserResponseEvent($user, $request, $response));

            if($redirected) {
                $url      = $this->generateUrl('fos_user_setting');
                // TODO :: set session flashbag 
                $response = new RedirectResponse($url);
            } else {
                $response->setData(array('user'=>$serializer->toArray($user), 'password'=>$user));
            }
        }

        return $response;
    }

    private function getErrorMessages(\Symfony\Component\Form\Form $form) {
        $errors = array();

        foreach ($form->getErrors() as $key => $error) {
            if ($form->isRoot()) {
                $errors['#'][] = $error->getMessage();
            } else {
                $errors[] = $error->getMessage();
            }
        }

        foreach ($form->all() as $child) {
            if (!$child->isValid()) {
                $errors[$child->getName()] = $this->getErrorMessages($child);
            }
        }

        return $errors;
    }

    public function _getUser()
    {
        return $this->user_provider->getHydratedUser();
    }
}