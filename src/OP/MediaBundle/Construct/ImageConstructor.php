<?php

namespace OP\MediaBundle\Construct;

use Symfony\Component\HttpFoundation\RequestStack,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;

/**
 * cl
 */
class ImageConstructor
{

    /**
     * services convert images object to array 
     * @var type 
     */
    protected $container, $request;

    public function __construct(Container $container, RequestStack $request) {
        $this->container = $container;
        $this->request   = $request->getCurrentRequest();
    }

    /**
    * @return image data transformer into array
    */
    public function imagesToArray($imgs){
        $images = [];
        //
        foreach ($imgs as $img) {
            if(!$img){
                $image['id'] = null;
                $image['reason'] = 'some reason';
                $image['webPath'] = $this->getRemovedImagePath();
            } else {
                $image['id'] = (string)$img['_id'];
                $strPath = 'uploads/'.$img['directory'].'/'.$img['path'];
                $image['webPath'] = $this->getCachePath($strPath);
            }
            $images[] = $image;
        }
        return $images;
    }

    /**
    * @return image data transformer into array
    */
    public function imageToArray($img){
        $strPath = 'uploads/'.$img['directory'].'/'.$img['path'];
        return [
            'id' => (string)$img['_id'],
            'webPath' => $this->getCachePath($strPath)
        ];
    }

     /**
    * @return image data transformer into array
    */
    public function imageObjectToArray($imgs){
        $images = [];
        //
        foreach ($imgs as $img) {
                $image['id'] = $img->getId();
                $image['path'] = $img->getPath();
                $image['webPath'] = $img->getWebPath();
                $images[] = $image;
        }
        return $images;
    }
    
    public function videoToArray($vids)
    {
        $videos = [];
        foreach($vids as $vid){
            $path           = explode('.', $vid['path'])[0];
            $video['id']    = (string)$vid['_id'];
            $video['source'] = 'http://opinion.com/optube/uploads/videos/' . $path;
            $video['name']  = $vid['name'];
            $videos[]       = $video;                    
        }
        return $videos;
    }

    protected function checkCache($path) {
         /** @var CacheManager */
        $imagineCacheManager = $this->container->get('liip_imagine.cache.manager');

        /** @var string */
        if(!$imagineCacheManager->getBrowserPath($path, 'photo_50percent')){
            return false;
        }

        return true;
    }

    public function getCachePath($path) {
         /** @var CacheManager */
        $u_path         = urldecode($path);
        $resolver       = $this->request->get('resolver');
        $cacheManager   = $this->container->get('liip_imagine.cache.manager');


        try {
            if(!$cacheManager->isStored($u_path, 'photo_50percent', $resolver)) {
                $imagine = $this->container->get('liip_imagine.controller');
                $imagine->filterAction($this->request, $path, 'photo_50percent');
            } 
            $browserPatch = $cacheManager->getBrowserPath($path, 'photo_50percent');
        } catch(\Exception $e) {
            $browserPatch = '';
        }

        return $browserPatch;
    }

    public function getRemovedImagePath() {
        return 'http://opinion.com/images/if_list-remove.ico';
    }
    
    public function getUploadRootDir()
    {
        return __DIR__.'/../../../../uploads/';
    }
}
