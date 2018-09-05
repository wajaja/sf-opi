<?php
namespace OP\PostBundle\Form;

use Symfony\Component\Form\AbstractType,
    Symfony\Component\Form\FormBuilderInterface,
    Symfony\Component\OptionsResolver\OptionsResolver,
    Symfony\Component\Form\Extension\Core\Type as Types;

class CommentType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('postValid', Types\HiddenType::class, array('required'=>FALSE))
            ->add('rmv_arr', Types\HiddenType::class, array('required'=>false))
            ->add('unique', Types\TextType::class, array('required'=>false))
                ;
            
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'OP\PostBundle\Document\Comment',
            'csrf_protection' => false
        ));
    }

    public function getBlockPrefix()
    {
        return 'comment';
    }
}
