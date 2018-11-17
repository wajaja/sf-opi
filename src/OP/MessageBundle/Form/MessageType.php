<?php

namespace OP\MessageBundle\Form;

use Symfony\Component\{
    Form\AbstractType, Form\FormBuilderInterface, OptionsResolver\OptionsResolverInterface
};

class MessageType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('isSpam')
            ->add('unreadForParticipants')
            ->add('sender')
            ->add('body')
            ->add('createdAt')
            ->add('thread')
            ->add('metadata')
        ;
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'OP\MessageBundle\Document\Message'
        ));
    }

    public function getName()
    {
        return 'op_messagebundle_messagetype';
    }
}
