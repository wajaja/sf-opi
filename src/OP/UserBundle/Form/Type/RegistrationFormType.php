<?php
namespace OP\UserBundle\Form\Type;

use Symfony\Component\Form\AbstractType,
    Symfony\Component\Form\FormBuilderInterface, 
    Symfony\Component\OptionsResolver\OptionsResolver,
    Symfony\Component\Form\Extension\Core\Type\TextType,
    Symfony\Component\Form\Extension\Core\Type\BirthdayType,
    Symfony\Component\Form\Extension\Core\Type\ChoiceType,
    OP\UserBundle\Form\Subscriber\RegisterSubscriber,
    OP\UserBundle\Repository\OpinionUserManager;

class RegistrationFormType extends AbstractType
{

    private $userManager;

    public function __construct(OpinionUserManager $userManager)
    {
        $this->userManager = $userManager;
    }


    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        parent::buildForm($builder, $options);
        $builder->remove('username')  // we     email as the username
                // ->remove('plainPassword.second')
                ;
        //..
        // add your custom field
        $builder->add('firstname', TextType::class, array('required'=>TRUE))
                ->add('lastname', TextType::class, array('required'=>TRUE))
                ->add('gender', ChoiceType::class, 
                    array(
                        'choices'   => array('male' =>'Male', 'female' => 'Female' ), 
                        'attr'      => array('class'=>'form-registration-gender'),  
                        'label_attr'=> array('class'=>'form-registration-gender-lab'), 
                        'expanded'  => true, 
                        'multiple'  => false, 
                        'required'  => true, 
                        'empty_data'=> null
                    )
                );

        $builder->addEventSubscriber(new RegisterSubscriber($this->userManager));
    }

    public function configureOptions(OptionsResolver $resolver)
    {
         parent::configureOptions($resolver);
        $resolver->setDefaults(array(
            'csrf_protection' => false
        ));
    }

    public function getParent()
    {
        return 'FOS\UserBundle\Form\Type\RegistrationFormType';
    }

    public function getBlockPrefix()
    {
        return 'registration';
    }
}