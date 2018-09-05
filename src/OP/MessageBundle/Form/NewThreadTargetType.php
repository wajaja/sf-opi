<?php
namespace OP\MessageBundle\Form;

use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\{
    Extension\Core\Type\TextareaType, AbstractType,
    Extension\Core\Type\TextType, FormBuilderInterface
};

/**
 * Message form type for starting a new conversation
 */
class NewThreadMessageFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder  ->add('subject', TextType::class, array('required'=>false))
                  ->add('unique', TextType::class, array('required'=>false))
                  ->add('body', TextareaType::class, array('required'=>true));
    }

    public function configureOptions(OptionsResolever $resolver){
        $resolver->setDefault(array(
            'data_class'=>'',
        ));
    }

    public function getBlockPrefix()
    {
        return 'op_message_new_thread_target';
    }
}
