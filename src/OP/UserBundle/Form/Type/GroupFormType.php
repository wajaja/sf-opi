<?php
namespace OP\UserBundle\Form\Type;

use Symfony\Component\Form\AbstractType,
    Symfony\Component\Form\FormBuilderInterface, 
    Symfony\Component\OptionsResolver\OptionsResolver,
    Symfony\Component\Form\Extension\Core\Type as Types,
    OP\UserBundle\Form\Subscriber\RegisterSubscriber,
    OP\UserBundle\Repository\OpinionUserManager;

class GroupFormType extends AbstractType
{

    private $userManager;

    public function __construct(OpinionUserManager $userManager)
    {
        $this->userManager = $userManager;
    }


    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        parent::buildForm($builder, $options);
        // $builder->remove('username')  // we     email as the username
                // ->remove('plainPassword.second')
                ;
        //..
        // add your custom field
        $builder->add('goal', Types\TextType::class, array('required'=>TRUE))
                ->add('status', Types\TextType::class, array('required'=>FALSE))
                ->add('recipients', Types\TextType::class, array('required'=>false))
                ;

        $builder->addEventSubscriber(new RegisterSubscriber($this->userManager));
    }

    public function configureOptions(OptionsResolver $resolver)
    {
         parent::configureOptions($resolver);
        $resolver->setDefaults(array(
            'csrf_protection' => false,
            'allow_extra_fields' => true,
        ));
    }

    public function getParent()
    {
        return 'FOS\UserBundle\Form\Type\GroupFormType';
    }

    public function getBlockPrefix()
    {
        return 'group';
    }
}