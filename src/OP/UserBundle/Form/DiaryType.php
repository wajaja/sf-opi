<?php

namespace OP\UserBundle\Form;

use Symfony\Component\Form\AbstractType,
    Symfony\Component\Form\FormBuilderInterface,
    Symfony\Component\Form\Extension\Core\Type\TextType,
    Symfony\Component\Form\Extension\Core\Type\CollectionType,
    Symfony\Component\OptionsResolver\OptionsResolverInterface;


/**
*
*/
class DiaryType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('description', CollectionType::class)
            ->add('title', TextType::class)
        ;
    }

    public function configureOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'OP\UserBundle\Document\Diary'
        ));
    }

    public function getBlockPrefix()
    {
        return 'diary';
    }
}
