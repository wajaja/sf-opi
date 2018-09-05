<?php

namespace OP\UserBundle\Form;

use Symfony\Component\Form\AbstractType,
    Symfony\Component\Form\FormBuilderInterface,
    Symfony\Component\OptionsResolver\OptionsResolver,
    Symfony\Component\Form\Extension\Core\Type\TextType;


class AboutMeType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('job', TextType::class)
                ->add('school', TextType::class)
                ->add('university', TextType::class)
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'OP\UserBundle\Document\AboutMe',
            'csrf_protection' => false
        ));
    }

    public function getBlockPrefix()
    {
        return 'aboutMe';
    }
}
