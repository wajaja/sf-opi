<?php

namespace OP\UserBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;

class NameType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('firstname', TextType::class, array('required'=>TRUE,  'attr'=>array('min'=>5, 'max'=>59)))
            ->add('lastname', TextType::class, array('required'=>TRUE,  'attr'=>array('min'=>5, 'max'=>59)))
            ->add('nickname', TextType::class, array('required'=>FALSE,  'attr'=>array('min'=>3, 'max'=>59)))
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'OP\UserBundle\Document\User',
            'csrf_protection' => false,
            'allow_extra_fields' => true,
        ));
    }

    public function getBlockPrefix()
    {
        return 'name';
    }
}
