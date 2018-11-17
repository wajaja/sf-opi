<?php

namespace OP\MediaBundle\Construct;

use Symfony\Component\HttpFoundation\RequestStack,
    Liip\ImagineBundle\Imagine\Cache\CacheManager,
    Liip\ImagineBundle\Controller\ImagineController,
    Symfony\Component\DependencyInjection\ContainerInterface as Container;

class ImageConstructor
{

    /**
     * services convert images object to array 
     * @var type 
     */
    protected $container, $request, $cacheManager, $fileBaseUrl, $imagine;

    public function __construct(Container $container, RequestStack $request, CacheManager $cacheManager, $fileBaseUrl, ImagineController $imagine) {
        $this->container = $container;
        $this->fileBaseUrl = $fileBaseUrl;
        $this->cacheManager = $cacheManager;
        $this->imagine = $imagine;
        $this->request   = $request->getCurrentRequest();
    }

    /**
     * function imagesToArray
     * @param type $imgs
     * @return array
     */
    public function imagesToArray($imgs) : array {
        $images = [];
        foreach ($imgs as $img) {
            $image = !$img ? [
                    'id' => null,
                    'reason' => 'some reason',
                    'webPath' => $this->getRemovedImagePath()
                ] : [
                    'id' => (string)$img['_id'],
                    'webPath' => $this->getCachePath('uploads/'.$img['directory'].'/'.$img['path'])
                ];
            $images[] = $image;
        }
        return $images;
    }

    /**
     * imageToArray
     * @param type $img
     * @return array
     */
    public function imageToArray($img) : array {
        return [
            'id' => (string)$img['_id'],
            'webPath' => $this->getCachePath('uploads/'.$img['directory'].'/'.$img['path'])
        ];
    }

     /**
      * 
      * @param type $imgs
      * @return array
      */
    public function imageObjectToArray($imgs) : array {
        $images = [];
        foreach ($imgs as $img) {
            $images[] = [
                'id' => $img->getId(),
                'path' => $img->getPath(),
                'webPath' => $img->getWebPath()
            ];
        }
        return $images;
    }
    
    /**
     * 
     * @param type $vids
     * @return array
     */
    public function videosToArray($vids) : array {
        $videos = [];
        foreach($vids as $vid){
            $path     = explode('.', $vid['path'])[0];
            $videos[] = [
                'id' => (string)$vid['_id'],
                'source' => $this->fileBaseUrl .'/optube/uploads/videos/' . $path,
                'name'  => $vid['name']
            ];
        }
        return $videos;
    }

    protected function checkCache($path) : bool {
        $quality = $this->request->getHost() === 'm.opinion.com' ? 'photo_10percent' : 'photo_50percent';
        return !$this->cacheManager->getBrowserPath($path, $quality) ? false : true;
    }

    public function getCachePath($path) : string {
         /** @var CacheManager */
        $u_path         = urldecode($path);
        $cacheManager   = $this->cacheManager;
        $resolver       = $this->request->get('resolver');
        $quality        = $this->request->getHost() === 'm.opinion.com' ? 'photo_10percent' : 'photo_50percent';

        try {
            if(!$cacheManager->isStored($u_path, $quality, $resolver)) {
                $this->imagine->filterAction($this->request, $path, $quality);
            } 
            $browserPatch = $cacheManager->getBrowserPath($path, $quality);
        } catch(\Exception $e) {
            $browserPatch = '';
        }

        return $browserPatch;
    }

    public function getRemovedImagePath() {
        return $this->fileBaseUrl . '/images/if_list-remove.ico';
    }
}
