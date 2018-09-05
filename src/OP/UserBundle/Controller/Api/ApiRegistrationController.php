<?php

namespace OP\UserBundle\Controller\Api;

use FOS\UserBundle\FOSUserEvents,
    FOS\UserBundle\Event\FormEvent,
    FOS\RestBundle\Controller\Annotations,
    Nelmio\ApiDocBundle\Annotation as Doc,
    Symfony\Component\HttpFoundation\Request,
    FOS\UserBundle\Event\GetResponseUserEvent,
    FOS\RestBundle\Controller\FOSRestController,
    FOS\UserBundle\Event\FilterUserResponseEvent,
    Symfony\Component\HttpFoundation\JsonResponse,
    FOS\RestBundle\Routing\ClassResourceInterface,
    Symfony\Component\HttpFoundation\RedirectResponse,
    FOS\RestBundle\Controller\Annotations\RouteResource,
    FOS\UserBundle\Form\Factory\FormFactory,
    OP\UserBundle\Repository\OpinionUserManager,
    Symfony\Component\EventDispatcher\EventDispatcherInterface,
    Symfony\Component\Routing\Generator\UrlGeneratorInterface;

/**
 * @RouteResource("registration", pluralize=false)
 */
class ApiRegistrationController extends FOSRestController implements ClassResourceInterface
{
    /**
     * @Annotations\Post("/signup")
     */
    public function registerAction(Request $request, FormFactory $formFactory, EventDispatcherInterface $dispatcher, OpinionUserManager $userManager)
    {
        $user           = $userManager->createUser();
        $contentType    = $request->headers->get('Content-Type');

        $user->setEnabled(true);
        $event          = new GetResponseUserEvent($user, $request);
        $dispatcher->dispatch(FOSUserEvents::REGISTRATION_INITIALIZE, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }

        if('application/x-www-form-urlencoded' === $contentType) { 
            $url        = $this->generateUrl('fos_user_registration_register', array('panel' => 'profilepic'));
            $response   = new RedirectResponse($url);
            $form       = $formFactory->createForm();
            $form->setData($user);
            $form->handleRequest($request);
        } else {
            $form       = $formFactory->createForm(['csrf_protection' => false]);
            $data       = json_decode($request->getContent(), true);
            $form->setData($user);
            $request->request->replace(is_array($data) ? $data : array());
            $form->submit($data);
            // $response->setData(array('token'=>'token'));
        }

        if ($form->isSubmitted()) {         
            if ($form->isValid()) {
                $event = new FormEvent($form, $request);
                $dispatcher->dispatch(FOSUserEvents::REGISTRATION_SUCCESS, $event);

                $userManager->updateUser($user, false);

                if (null === $response = $event->getResponse()) {
                    $url = $this->generateUrl('fos_user_registration_confirmed');
                    $response = new RedirectResponse($url);
                }

                $dispatcher->dispatch(FOSUserEvents::REGISTRATION_COMPLETED, new FilterUserResponseEvent($user, $request, $response));
                
                $userManager->updateUser($user); //flush

                return $response;
            } else {

                $event = new FormEvent($form, $request);
                $dispatcher->dispatch(FOSUserEvents::REGISTRATION_FAILURE, $event);
                
                // return $on;
                // $this->render('@OPUser/Registration/register.html.twig', array(
                //     'form' => $form->createView(),
                // ));
            }


            if (null !== $response = $event->getResponse()) {
                return $response;
            }
            //$dm->flush(array('safe'=>true));   //Enforcing unique key constraints
        }

        // echo "string";
        // die();
        
        // return $this->render('@FOSUser/Registration/register.html.twig', array(
        //     'form' => $form->createView(),
        // ));

    }

    /**
    * @Annotations\Get("/check_email")
    *
    * @return Integer
    */
    public function checkEmailAction(Request $request)
    {
        $res     = new JsonResponse();
        $email   = $request->query->get('email');
        $session = $request->getSession();
        $session->isStarted() ?: $session->start();

        return $res->setData(array('status'=> $request->getBasePath()));
    }


    // private function userFromJSON() {
    //     $data = $request->request->all();

    //     $user = $userManager->createUser();
    //     $user->setEnabled(true);
    //     $event = new GetResponseUserEvent($user, $request);
    //     $dispatcher->dispatch(FOSUserEvents::REGISTRATION_INITIALIZE, $event);

    //     if (null !== $event->getResponse()) {
    //         return $event->getResponse();
    //     }

    //     $dateStr =  "{$data['month']}-{$data['day']}-{$data['year']}";
    //     $user 
    //         ->setFirstname($data['firstname'])
    //         ->setLastname($data['lastname'])
    //         ->setEmail($data['email'])
    //         ->setGender($data['gender'])
    //         ->setBirthdate( \DateTime::createFromFormat('m-d-Y', $dateStr)->format('Y-m-d'))
    //         ->setPlainPassword($data['password']);

    //     if ($event->getResponse()) {
    //         return $event->getResponse();
    //     }
    //     return $this->generateToken($user, 201);
    // }


    protected function generateToken($user, $statusCode = 200)
    {
        // Generate the token
        $token = $this->get('lexik_jwt_authentication.jwt_manager')->create($user);

        $response = array(
            'token' => $token,
            'user'  => $user // Assuming $user is serialized, else you can call getters manually
        );

        return new JsonResponse($response, $statusCode); // Return a 201 Created with the JWT.
    }


    /**
     * Returns the DocumentManager
     * @return DocumentManager
     */
    private function getDocumentManager()
    {
        return $this->dm;
    }
}