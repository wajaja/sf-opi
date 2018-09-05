<?php
namespace OP\MediaBundle\Form\Type;

use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints as Assert;
/**
 * Class FilesType
 */
class FileType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        return $builder->add("file", FileType::class);
    }

    public function buildView(FormView $view, FormInterface $form, array $options)
    {
        parent::buildView($view, $form, $options);
//        $view->vars['full_name'] .= '[]';
//        $view->vars['attr']['multiple'] = 'multiple';
    }
    
    public function getBlockPrefix()
    {
        return 'file';
    }
}