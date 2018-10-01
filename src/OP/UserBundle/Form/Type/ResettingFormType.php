<?php

/*
 * This file is part of the FOSUserBundle package.
 *
 * (c) FriendsOfSymfony <http://friendsofsymfony.github.com/>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace OP\UserBundle\Form\Type;

use Symfony\Component\Form\AbstractType,
    Symfony\Component\Form\Extension\Core\Type\PasswordType,
    Symfony\Component\Form\Extension\Core\Type\RepeatedType,
    Symfony\Component\Form\FormBuilderInterface,
    Symfony\Component\OptionsResolver\OptionsResolver;


class ResettingFormType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        parent::buildForm($builder, $options);
        // $builder->add('plainPassword', RepeatedType::class, array(
        //     'type' => PasswordType::class,
        //     'options' => array(
        //         'translation_domain' => 'FOSUserBundle',
        //         'attr' => array(
        //             'autocomplete' => 'new-password',
        //         ),
        //     ),
        //     'first_options' => array('label' => 'form.new_password'),
        //     'second_options' => array('label' => 'form.new_password_confirmation'),
        //     'invalid_message' => 'fos_user.password.mismatch',
        // ));
    }

    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        parent::configureOptions($resolver);
        $resolver->setDefaults(array(
            'csrf_protection' => false
        ));
    }

    public function getParent()
    {
        return 'FOS\UserBundle\Form\Type\ResettingFormType';
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'resetting';
    }
}
