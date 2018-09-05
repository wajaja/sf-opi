<?php
namespace OP\PostBundle\Form;

use Symfony\Component\Form\AbstractType,
    Symfony\Component\Form\FormBuilderInterface,
    Symfony\Component\OptionsResolver\OptionsResolver,
    Symfony\Component\Form\Extension\Core\Type as Types;

class UnderCommentType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('rmv_arr', Types\HiddenType::class, array('required'=>false))
            ->add('commentValid', Types\HiddenType::class, array('required'=>TRUE))
            ->add('unique', Types\TextType::class, array('required'=>false))
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'OP\PostBundle\Document\UnderComment',
            'csrf_protection' => false
        ));
    }

    public function getBlockPrefrix()
    {
        return 'undercomment';
    }
}
