<?php

namespace OP\MessageBundle\Form;

use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\{
    Extension\Core\Type\TextareaType, AbstractType,
    Extension\Core\Type\TextType, FormBuilderInterface,
    Extension\Core\Type\FileType
};

/**
 * Form type for a reply
 */
class ReplyMessageFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder ->add('body', TextareaType::class, array('required'=>false))
                ->add('unique', TextType::class, array('required'=>false))
                ->add('document', FileType::class, 
                    array('required'=>false, 'attr'=>array('accept'=>
                          'application/pdf, application/msword, appplication/vnd.ms-excel, application/vnd.ms-powerpoint', 
                            'multiple'=>true)));
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class'=>'OP\MessageBundle\FormModel\ReplyMessage'
        ));
    }

    public function getBlockPrefix()
    {
        return 'reply_message';
    }
}
