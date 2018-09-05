<?php

namespace OP\MessageBundle\Form;

use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\{
    Extension\Core\Type\TextareaType, AbstractType,
    Extension\Core\Type\TextType, FormBuilderInterface,
    Extension\Core\Type\FileType, Extension\Core\Type\HiddenType,
};


class ResponseType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('content', TextareaType::class, array('required'=>false))
            ->add('documentValid', HiddenType::class, array('required'=>FALSE))
            ->add('file', FileType::class, array('required'=>FALSE))
            ->add('unique', TextType::class, array('required'=>false))
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'OP\MessageBundle\Document\Response',
            'csrf_protection' => false
        ));
    }

    public function getBlockPrefix()
    {
        return 'response_type';
    }
}
