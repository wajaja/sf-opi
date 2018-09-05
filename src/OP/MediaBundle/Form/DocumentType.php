<?php

namespace OP\MediaBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class DocumentType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('alt')
            ->add('path')
            ->add('size')
            ->add('createdAt')
            ->add('updateAt')
        ;
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'OP\MediaBundle\Document\Document'
        ));
    }

    public function getName()
    {
        return 'op_mediabundle_documenttype';
    }
}
