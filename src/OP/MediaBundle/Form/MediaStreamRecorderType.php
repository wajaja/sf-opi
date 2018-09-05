<?php

namespace OP\MediaBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class MediaStreamRecorderType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('createdAt')
            ->add('updateAt')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'OP\MediaBundle\Document\MediaStreamRecorder'
        ));
    }

    public function getBlockPrefix()
    {
        return 'op_mediabundle_mediastreamrecordertype';
    }
}
