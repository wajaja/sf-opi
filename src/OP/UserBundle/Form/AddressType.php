<?php

namespace OP\UserBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;

class AddressType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('country', TextType::class, 
                array('required'=>FALSE, 'attr'=>array('class'=>'cfrm-adr-fld'),  'label_attr'=>array('class'=>'cfrm-adr-fld-lb')))
            ->add('city', TextType::class, 
                array('required'=>FALSE, 'attr'=>array('class'=>'cfrm-adr-fld'),  'label_attr'=>array('class'=>'cfrm-adr-fld-lb')))
            ->add('birthCity', TextType::class, 
                array('required'=>FALSE, 'attr'=>array('class'=>'cfrm-adr-fld'),  'label_attr'=>array('class'=>'cfrm-adr-fld-lb')))
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'OP\UserBundle\Document\Address',
            'csrf_protection' => false
        ));
    }

    public function getBlockPrefix()
    {
        return 'address';
    }
}
