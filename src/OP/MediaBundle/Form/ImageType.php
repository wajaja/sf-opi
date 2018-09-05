<?php

namespace OP\MediaBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

use Symfony\Component\Form\Extension\Core\Type\FileType;

class ImageType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            //    ->(name, type)
            ->add('file', FileType::class, array(
                'multiple' => false,
            ))
            //->add('size')
//            ->add('createdAt', null, array(
//                'mapped' => false
//            ))
            //->add('updateAt')
            //->add('name')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'OP\MediaBundle\Document\Image'
        ));
    }

    public function getBlockPrefix()
    {
        return 'op_mediabundle_imagetype';
    }
}
