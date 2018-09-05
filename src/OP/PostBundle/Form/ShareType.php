<?php

namespace OP\PostBundle\Form;

use Symfony\Component\Form\AbstractType,
    Symfony\Component\Form\FormBuilderInterface,
    Symfony\Component\OptionsResolver\OptionsResolver,
    Symfony\Component\Form\Extension\Core\Type\HiddenType;

class ShareType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('postValid', HiddenType::class, array('required'=>FALSE))
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'OP\PostBundle\Document\Share',
            'csrf_protection' => false
        ));
    }

    public function getBlockPrefix()
    {
        return 'share';
    }
}
