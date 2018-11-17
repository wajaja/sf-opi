<?php
namespace OP\MessageBundle\Form;

use Symfony\Component\Form\{AbstractType, FormBuilderInterface, Extension\Core\Type\TextType};
use OP\UserBundle\Repository\OpinionUserManager,
    Symfony\Component\OptionsResolver\OptionsResolver,
    OP\MessageBundle\DataTransformer\UsernameToUserTransformer;


class UserSelectorType extends AbstractType
{
    private $manager;

    public function __construct(OpinionUserManager $userManager)
    {
        $this->manager = $userManager;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $transformer = new UsernameToUserTransformer($this->manager);
        $builder->addModelTransformer($transformer);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'invalid_message' => 'The selected issue does not exist',
        ));
    }

    public function getParent()
    {
        return TextType::class;
    }
    /**
     * {@inheritDoc}
     */
    public function getBlockPrefix()
    {
        return 'user_selector';
    }
}
