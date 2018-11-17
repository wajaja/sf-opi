<?php

namespace OP\SocialBundle\Form;

use Symfony\Component\Form\FormBuilderInterface,
    Symfony\Component\Form\AbstractType,
    Symfony\Component\OptionsResolver\OptionsResolver,
    Symfony\Component\Form\Extension\Core\Type\ChoiceType;

class ConfidenceType extends AbstractType
{
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'choices' => array(
                'public' => 'Public',
                'friends' => 'Friends',
                'private' => 'Private',
            )
        ));
    }
    public function getParent()
    {
        return ChoiceType::class;
    }
}
