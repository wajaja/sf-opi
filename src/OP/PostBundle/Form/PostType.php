<?php

namespace OP\PostBundle\Form;

use Symfony\Component\Form\AbstractType,
    Symfony\Component\Form\FormBuilderInterface,
    Symfony\Component\OptionsResolver\OptionsResolver,
    Symfony\Component\Form\Extension\Core\Type as Types;

class PostType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('type', TypeType::class, array('required'=>'false'))
            ->add('timelineId', Types\TextType::class, array('required'=>'false'))
            ->add('timelineType', Types\TextType::class, array('required'=>'false'))
            ->add('gapMinutes', Types\IntegerType::class, 
                    array('required'=>false,  'attr'=>array('min'=>0, 'max'=>59)))
            ->add('gapHours', Types\IntegerType::class, 
                    array('required'=>false, 'attr'=>array('min'=>0, 'max'=>23)))
            ->add('recipients', Types\TextType::class, 
                    array('required'=>false))
            ->add('editorTexts', Types\TextType::class, 
                    array('required'=>false))
            ->add('leftEditorTexts', Types\TextType::class, 
                    array('required'=>false))
            ->add('rightEditorTexts', Types\TextType::class, 
                    array('required'=>false))
            ->add('videoName', Types\TextType::class, 
                    array('required'=>false))
            ->add('unique', Types\TextType::class, 
                    array('required'=>false))
            ->add('isMainPost', Types\CheckboxType::class, 
                    array('required' => false))
            ->add('confidence', Types\TextType::class, 
                    array('required'=>'false'))
            ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'OP\PostBundle\Document\Post',
            'csrf_protection' => false
        ));
    }

    public function getBlockPrefix()
    {
        return 'post';
    }
}
