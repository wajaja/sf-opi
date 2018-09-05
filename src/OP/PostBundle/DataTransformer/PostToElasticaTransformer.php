<?php

namespace OP\PostBundle\DataTransformer;

use Elastica\Document,
    OP\PostBundle\DataTransformer\ToArrayTransformer,
    Symfony\Component\PropertyAccess\PropertyAccessorInterface,
    FOS\ElasticaBundle\Transformer\ModelToElasticaTransformerInterface,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;

class PostToElasticaTransformer implements ModelToElasticaTransformerInterface 
{
    protected $transformer, $container;


    public function __construct(Container $container, ToArrayTransformer $transformer) {
        $this->container = $container;
        $this->transformer = $transformer;
    }

    /**
     * Transforme un article en object elasticsearch avec les clés requises
     *
     * @param article $article the object to convert
     * @param array  $fields the keys we want to have in the returned array
     *
     * @return Document
     **/
    public function transform($post, array $fields)
    {

        $values = [];
        $transformer = $this->transformer;

        if($post->getType() === 'post') {
            if(gettype($post) === 'object') {
                if($post->getObjectType() === 'opinion')
                    $values = $transformer->opinionObjectToArray($post);
                else 
                    $values = $transformer->postObjectToArray($post);

            } else {
                if($post['objectType'] === 'opinion')
                    $values = $transformer->opinionToArray($post);
                else 
                    $values = $transformer->postToArray($post);
            }
        }

        else if($post->getObjectType() === 'leftcomment') {
            if(gettype($post) === 'object') 
                $values = $transformer->commentObjectToArray($post);
            else
                $values = $transformer->commentToArray($post);
        }

        else if($post->getObjectType() === 'leftcomment' || $post->getObjectType() === 'rightcomment') {
            if(gettype($post) === 'object') 
                $values = $transformer->opinionCommentObjectToArray($post);
            else
                $values = $transformer->opinionCommentToArray($post);
        }

        else if($post->getObjectType() === 'undercomment') {
            if(gettype($post) === 'object') 
                $values = $transformer->underCommentObjectToArray($post);
            else
                $values = $transformer->underCommentToArray($post);
        } else {
            $values['id'] = null;
        }

        // Crée le document à indexer
        $document = new Document($values['id'], $values);
        // $document->setParent($post->getPostValid() );

        return $document;
    }
}