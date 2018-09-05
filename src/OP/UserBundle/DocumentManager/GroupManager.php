<?php
namespace OP\UserBundle\DocumentManager;

use OP\UserBundle\Document\Group,
    Doctrine\ODM\MongoDB\DocumentManager,
    OP\UserBundle\Security\UserProvider,
    Doctrine\Common\Persistence\ObjectManager,
    Symfony\Component\HttpFoundation\RequestStack,
    OP\UserBundle\Repository\OpinionUserManager,
    Symfony\Component\Form\FormFactoryInterface,
    OP\UserBundle\Document\Invitation\Invitation,
    OP\UserBundle\Document\Invitation\InvitationMetadata,
    OP\UserBundle\DataTransformer\ObjectToArrayTransformer,
    FOS\UserBundle\Doctrine\GroupManager as BaseManager,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;

/**
 * Description of NotificationManager
 * class that manage all about opinion's notifications
 * @author CEDRICK
 */
class GroupManager extends BaseManager
{
    /**
     *
     * @var type
     */
    protected $dm, $um, $container, $formFactory, $request,
              $objectManager, $repository, $class, $uProvider;

    public function __construct(ObjectManager $om, $class, DocumentManager $dm, Container $container, RequestStack $request, UserProvider $uProvider) {
         parent::__construct($om, $class);
        $this->objectManager    = $om;
        $this->repository       = $om->getRepository($class);
        $metadata               = $om->getClassMetadata($class);
        $this->class            = $metadata->getName();
        $this->request          = $request->getCurrentRequest();
        $this->dm               = $dm;
        $this->container        = $container;
        $this->uProvider        = $uProvider;
    }
    
    /**
     * {@inheritdoc}
     */
    public function findGroupById($id)
    {
        return $this->findGroupBy(array('id' => $id));
    }

    /**
    * Function loadSuggestions
    * $initIds | array (empty firstly; array of ids when load more request)
    * $friendIds | array 
    * $blockedIds | array
    * $requestedIds array (of user_ids whose send me request or i've send request)
    */
    public function loadGroupsByAvatarRef($refIds)
    {

        $qb = $this->repository->getDocumentManager()
                               ->createQueryBuilder('OP\UserBundle\Document\Group');

        $qb ->field('avatar.$id')->equals(new \MongoId($refIds));

        $users = $qb->getQuery()->execute()->toArray();
        return $users;
    }

    /**
     * @param Group $group
     * @param Boolean $andFlush Whether to flush the changes (default true)
     */
    public function saveGroup(Group $group)
    {
        $req = $this->request;
        $req->getSession()->start();
        $all     = $req->request->all();       
        $data    = json_decode($req->getContent(), true);        
        $name    =   !$req->getFormat('application/json') ? 
                            $all['group']['name']: $data['name'];

        $group->setName($name);
        $this->dm->persist($group);
        // $this->dm->flush();
    }

    /**
     * This is not participant deletion but real deletion
     * @param Group $group the  to delete
     */
    public function editGroup(Group $group)
    {
        $this->request->getSession()->start();
        $all     = $this->request->request->all();       
        $data    = json_decode($this->request->getContent(), true);        
        $name    = !$this->request->getFormat('application/json') ? 
                            $all['group']['name']: $data['name'];

        $group->setName($name);
        $this->dm->flush($group);
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
    public function getUser()
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

    public function memberGroups($member, $initIds, $limit = 10) {

        $qb = $this->repository->createQueryBuilder();

        $qb 
            ->limit($limit)
            ->field('id')->notIn($initIds)
            ->field('membersIds')->equals($member->getId());

        $groups = $qb->getQuery()->execute()
                    ->toArray();
        return $groups;

    }
}
