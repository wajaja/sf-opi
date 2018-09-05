<?php
namespace OP\UserBundle\FormHandler;

use OP\UserBundle\Document\Group,
    OP\MessageBundle\DataTransformer\UsernameToUserTransformer;


class NewFormHandler extends AbstractFormHandler
{

    /**
     *
     * @return NewPostBuilder
     */
    public function newGroup()
    {
        return new Group(''); //empty string name
    }

    /**
     * Composes a opinion from the form data
     *
     * @param AbstractGroup $group
     * @return GroupInterface the composed opinion ready to be sent
     * @throws InvalidArgumentException if the opinion is not a NewThreadGroup
     */
    public function composeGroup(Group $group, $update)
    {
        if (!$group instanceof Group) {
            throw new \InvalidArgumentException(sprintf('Group must be a NewThreadGroup instance, "%s" given', get_class($group)));
        }
        if($update) return $this->composeUpdateGroup($group);
        
        $doc = $this->newGroup()
            ->setName($group->getName())
            ->setStatus($group->getStatus())
            ->setOwner($this->getAuthentificatedUser())
            ->addMembers($this->userTransformer->reverseTransform($group->getRecipients()));

        return $doc;
    }
 
    protected function composeUpdateGroup(Group $group)
    {
        $doc = $group
            ->setName($group->getName())        
            // ->setUpdateAt(new \DateTime(null, new \DateTimeZone("UTC")))
            ;
        
        return $doc;
    }
}
