<?php
namespace OP\MessageBundle\DataTransformer;

use OP\UserBundle\Document\User,
    Doctrine\Common\Collections\Collection,
    OP\UserBundle\Repository\OpinionUserManager,
    Doctrine\Common\Collections\ArrayCollection,
    Symfony\Component\Form\DataTransformerInterface,
    Symfony\Component\Security\Core\User\UserInterface,
    Symfony\Component\Form\Exception\UnexpectedTypeException,
    Symfony\Component\Form\Exception\TransformationFailedException;

class UsernameToUserTransformer implements DataTransformerInterface
{
    private $manager;

    public function __construct(OpinionUserManager $userManager)
    {
        $this->manager = $userManager;
    }

    /**
     * Transforms a collection of users into a string
     *
     * @param Collection $users
     *
     * @return string
     */
    public function transform($users)
    {
        if ($users === null || $users->count() == 0) {
            return "";
        }

        $users = array();
        foreach ($users as $user) {
            $usernames[] = $user->getUsername();
        }

        return implode(', ', $usernames);
    }

    /**
     * Transforms a string (usernames) to a Collection of UserInterface
     *
     * @param string $usernames
     *
     * @throws UnexpectedTypeException
     * @throws TransformationFailedException
     * @return Collection $recipients
     */
    public function reverseTransform($usernames)
    {

        if (!is_string($usernames) || null === $usernames) {
            throw new UnexpectedTypeException($usernames, 'string');
        }

        $recipients = new ArrayCollection();
        $usernames = array_filter(explode(',', $usernames));

        foreach ($usernames as $username) {
            // query for the user with this id
            $user = $this->manager->findUserByUsername($username);

            if (!$user instanceof UserInterface) {
                throw new TransformationFailedException(sprintf('User "%s" does not exists', $username));
            }

            $recipients->add($user);
        }

        return $recipients;
    }
}
