<?php

namespace OP\PostBundle\Form;

use Symfony\Component\Form\AbstractType,
    Symfony\Component\Form\FormBuilderInterface,
    Symfony\Component\OptionsResolver\OptionsResolver,
    Symfony\Component\Form\Extension\Core\Type\HiddenType;

class LikeType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('refValid', HiddenType::class, array('required'=>FALSE));
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'OP\PostBundle\Document\Like',
            'csrf_protection' => false
        ));
    }

    public function getBlockPrefix()
    {
        return 'like';
    }
}
