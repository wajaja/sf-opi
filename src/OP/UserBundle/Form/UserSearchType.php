<?php

namespace OP\UserBundle\Form;

use OP\UserBundle\Document\User;


class UserSearchType extends AbstractType
{
    protected $perPage = 10;
    protected $perPageChoices = array(2,5,10);

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        // la liste de choix "perPage" est codée en dur. Dans un vrai projet, il ne faut pas faire ça
        $perPageChoices = array();
        foreach($this->perPageChoices as $choice){
            $perPageChoices[$choice] = 'Display '.$choice.' items';
        }

        $builder
            // ajout des autres types
            ->add('sort', 'hidden', array(
                'required' => false,
            ))
            ->add('direction', 'hidden', array(
                'required' => false,
            ))
            ->add('sortSelect','choice',array(
                'choices' => ArticleSearch::$sortChoices,
            ))
            ->add('perPage', 'choice', array(
                'choices' => $perPageChoices,
            ))
            ->add('search','submit',array(
                'attr' => array(
                    'class' => 'btn btn-primary',
                )
            ))
            ->addEventListener(FormEvents::PRE_SUBMIT, function (FormEvent $event) {
                // émule la soumission du sortSelect pour préremplir le champ
                $articleSearch = $event->getData();

                if(array_key_exists('sort',$articleSearch) && array_key_exists('direction',$articleSearch)){
                    $articleSearch['sortSelect'] = $articleSearch['sort'].' '.$articleSearch['direction'];
                }else{
                    $articleSearch['sortSelect'] = '';
                }

                $event->setData($articleSearch);
            })
        ;