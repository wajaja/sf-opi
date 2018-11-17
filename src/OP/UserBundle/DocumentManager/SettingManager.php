<?php
namespace OP\UserBundle\DocumentManager;

use OP\UserBundle\Form\NameType,
    OP\UserBundle\Document\Address,
    OP\UserBundle\Form\AddressType,
    OP\UserBundle\Document\Contact,
    OP\UserBundle\Form\ContactType,
    OP\UserBundle\Document\AboutMe,
    OP\UserBundle\Form\AboutMeType,
    OP\UserBundle\Form\NotificationType,
    OP\UserBundle\Document\Notification,
    Doctrine\ODM\MongoDB\DocumentManager,
    OP\UserBundle\Security\UserProvider,
    Symfony\Component\HttpFoundation\Request,
    OP\UserBundle\Repository\OpinionUserManager,
    Symfony\Component\Form\FormFactoryInterface,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;

/**
 * Description of NotificationManager
 * class that manage all about opinion's notifications
 * @author CEDRICK
 */
class SettingManager
{
    /**
     *
     * @var type
     */
    protected $dm, $um, $container, $formFactory, $uProvider;

    public function __construct(DocumentManager $dm, Container $container, FormFactoryInterface $form, OpinionUserManager $um, UserProvider $uProvider) {
        $this->dm    = $dm;
        $this->um    = $um;
        $this->formFactory  = $form;
        $this->container = $container;
        $this->uProvider = $uProvider;
    }

    public function setAboutMe(Request $request) {
        $document   = new AboutMe();
        $user       = $this->_getUser();
        $form       = $this->createForm(AboutMeType::class, $document);
        $form->handleRequest($request);
        if ($form->isValid()) {
            $dm = $this->dm;
            $dm->persist($document);
            $user->setAboutMe($document);
            $dm->flush();
        }
        return $user->getAboutMe();
    }

    public function setStatus(Request $request) {
        $return     = null;          //return when user's input equal null
        $user       = $this->_getUser();
        $status     = $request->request->get('status');
        if(gettype($status) === 'array') {
            $content    = $status['content'];
            $user->setStatus($content);
            $this->um->updateUser($user);
            $return = $user->getStatus();
        }

        return $return;
    }

    public function setLang(Request $request) {
        $user     = $this->_getUser();
        $return   = $user->getLocale();  //default || 
        $language = $request->request->get('language');
        if(gettype($language) === 'array') {
            $locale   = $language['locale'];
            $user->setLocale($locale);
            $this->um->updateUser($user);
            $return = $user->getLocale();
        }

        return $return;
    }

    public function setName(Request $request) {
        $user    = $this->_getUser();
        $serializer = $this->container->get('jms_serializer');
        // $name    = $request->request->get('name');
        $data       = json_decode($request->getContent(), true);
        $form       = $this->createForm(NameType::class, $user);
        // $form->submit($data);
        $form->handleRequest($request);
        if (!$form->isValid()) {
            //TODO :: addFlashMessage
            $errors = $this->getErrorMessages($form);
            return [
                'user' =>$serializer->toArray($this->_getUser()), 
                'errors'=> $errors
            ];
        } else if($form->isSubmitted() && $form->isValid()) {
            // echo "soumit";
            // die();
            $this->um->updateUser($user);
            return [
                'user' =>$serializer->toArray($user), 
                'name'=> $serializer->toArray($user)
            ];
        }

        // if(gettype($name) === 'array') {
        //     $user->setFirstname($name['firstname']);
        //     $user->setLastname($name['lastname']);
        //     $user->setNickname($name['nickname']);
        //     array(
        //         'user' =>$serializer->toArray($this->_getUser()), 
        //         'name'=> $serializer->toArray($name)
        //     )
        // }

        // return $user;
    }

    public function setAddress(Request $request) {
        $document   = new Address();
        $user       = $this->_getUser();
        $form       = $this->createForm(AddressType::class, $document);
        $form->handleRequest($request);
        if ($form->isValid()) {
            $dm = $this->dm;
            $dm->persist($document);
            $user->setAddress($document);
            $this->um->updateUser($user);
        }

        return $user->getAddress();
    }

    public function setContact(Request $request) {
        $document   = new Contact();
        $user       = $this->_getUser();
        $form       = $this->createForm(ContactType::class, $document);
        $form->handleRequest($request);
        if ($form->isValid()) {
            $dm = $this->dm;
            $dm->persist($document);
            $user->setContact($document);
            $this->um->updateUser($user);
        }

        return $user->getContact();
    }

    public function setNotification(Request $request) {
        $document   = new Notification();
        $user       = $this->_getUser();
        $form       = $this->createForm(NotificationType::class, $document);
        $form->handleRequest($request);
        if ($form->isValid()) {
            $dm = $this->dm;
            $dm->persist($document);
            $user->setNotification($document);
            $this->um->updateUser($user);
        }

        return $user->getNotification();
    }

    public function createForm($type, $data = null, array $options = array())
    {
        return $this->formFactory->create($type, $data, $options);
    }

    /**
     * Gets the current authenticated user
     * See::OPMEssageBundle participantprovider
     * @return ParticipantInterface
     */
    public function _getUser()
    {
        return $this->uProvider->getHydratedUser();
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
}
