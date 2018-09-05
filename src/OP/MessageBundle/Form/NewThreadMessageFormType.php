<?php
namespace OP\MessageBundle\Form;

use OP\MessageBundle\Form\UserSelectorType,
  Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\{ 
  AbstractType, FormBuilderInterface, 
  Extension\Core\Type\TextareaType, Extension\Core\Type\TextType, Extension\Core\Type\FileType
};

/**
 * Message form type for starting a new conversation
 */
class NewThreadMessageFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
    $builder ->add('recipients', UserSelectorType::class, array('required'=>false))
              ->add('subject', TextType::class, array('required'=>false))
              ->add('unique', TextType::class, array('required'=>false))
              ->add('document', FileType::class, 
                array('required'=>false, 'attr'=>array('accept'=>
                              'application/pdf, application/msword, appplication/vnd.ms-excel, application/vnd.ms-powerpoint', 
                                'multiple'=>true)));
    }

    public function getBlockPrefix()
    {
        return 'thread_message';
    }
}
