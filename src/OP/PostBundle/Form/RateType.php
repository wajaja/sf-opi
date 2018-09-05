<?php

namespace OP\PostBundle\Form;

use Symfony\Component\Form\AbstractType,
    Symfony\Component\Form\FormBuilderInterface,
    Symfony\Component\OptionsResolver\OptionsResolver,
    Symfony\Component\Form\Extension\Core\Type as Types;

class RateType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('refValid', Types\HiddenType::class, array('required'=>false))
            ->add('rate', Types\RangeType::class, array('required'=>false,  'attr'=>array('min'=>0, 'max'=>50)))
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'OP\PostBundle\Document\Rate',
            'csrf_protection' => false
        ));
    }

    public function getBlockPrefix()
    {
        return 'rate';
    }
}
