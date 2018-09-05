<?php

namespace OP\MediaBundle\Uploader\Storage;

use Symfony\Component\Finder\Finder,
    Symfony\Component\HttpFoundation\File\File,
    Symfony\Component\HttpFoundation\File\UploadedFile,
    Symfony\Component\HttpFoundation\Session\SessionInterface,

    OP\MediaBundle\Uploader\Storage\StorageInterface,
    OP\MediaBundle\Uploader\Storage\FilesystemStorage,
    OP\MediaBundle\Uploader\Storage\OrphanageStorageInterface;

class FilesystemOrphanageStorage extends FilesystemStorage implements OrphanageStorageInterface
{
    protected $storage;
    protected $session;
    protected $rootDir;

    public function __construct(StorageInterface $storage, SessionInterface $session, $rootDir)
    {
        // We can just ignore the chunkstorage here, it's not needed to access the files
        $this->rootDir = $rootDir;
        $this->storage = $storage;
        $this->session = $session;
    }

    public function upload(File $file, $name, $path = null)
    {
        $this->session->start();
        if(!$this->session->isStarted())
            throw new \RuntimeException('You need a running session in order to run the Orphanage.');

        return parent::upload($file, $name, $this->getPath());
    }


    public function uploadFiles($type, array $files = null)
    {
        try {
            
            if (null === $files) {
                if($type === 'post'){
                    $files = $this->getPostFiles();                    
                }elseif($type === 'opinion'){
                    $files = $this->getOpinionFiles ();
                }elseif ($type === 'message'){
                    $files = $this->getMessageFiles();
                }else{
                    return;
                }
            }
            
            $return = array();

            foreach ($files as $file) {
                $file_path = $file->getPathname();
                if($type === 'post'){
                    $filename = str_replace($this->getPostFindPath(), '', $file);
                }elseif ($type === 'opinion'){
                    $filename = str_replace($this->getOpinionFindPath(), '', $file);
                }elseif ($type === 'message') {
                    $filename = str_replace($this->getMessageFindPath(), '', $file);
                }else{
                    $filename = 'video';
                }
                
                $return[] = $this->storage->upload(new UploadedFile($file_path, $filename, null, $file->getSize(), 0, true), $filename);
            }
            return $return;
        } catch (\Exception $e) {            
            return array();
        }
    }

    public function getPostFiles()
    {
        $finder = new Finder();
        try {
            $finder->in($this->getPostFindPath())->files();     //get files in the matched folder
        } catch (\InvalidArgumentException $e) {
            //catch non-existing directory exception.
            //This can happen if getFiles is called and no file has yet been uploaded
            //push empty array into the finder so we can emulate no files found
            $finder->append(array());
        }
        return $finder;
    }
    
    public function getOpinionFiles()
    {
        $finder = new Finder();
        try {
            $finder->in($this->getOpinionFindPath())->files();     //get files in the matched folder
        } catch (\InvalidArgumentException $e) {
            //catch non-existing directory exception.
            //This can happen if getFiles is called and no file has yet been uploaded

            //push empty array into the finder so we can emulate no files found
            $finder->append(array());
        }

        return $finder;
    }
    
    public function getMessageFiles()
    {
        $finder = new Finder();
        try {
            $finder->in($this->getMessageFindPath())->files();     //get files in the matched folder
        } catch (\InvalidArgumentException $e) {
            //catch non-existing directory exception.
            //This can happen if getFiles is called and no file has yet been uploaded

            //push empty array into the finder so we can emulate no files found
            $finder->append(array());
        }

        return $finder;
    }

    protected function getPostPath()
    {
        $this->session->start();
        return sprintf('%s/%s/%s', 'optube/cache/uploads/videos', $this->session->getId(), 'post');
    }
    
    protected function getOpinionPath()
    {
        $this->session->start();
        return sprintf('%s/%s/%s', 'optube/cache/uploads/videos', $this->session->getId(), 'opinion');
    }
    
    protected function getMessagePath()
    {
        $this->session->start();
        return sprintf('%s/%s/%s', 'optube/cache/uploads/videos', $this->session->getId(), 'message');
    }

    protected function getPostFindPath()
    {
        return sprintf('%s/%s', realPath($this->rootDir.'/../web'), $this->getPostPath());
    }
    
    protected function getOpinionFindPath()
    {
        //directory
        return sprintf('%s/%s', realPath($this->rootDir.'/../web'), $this->getOpinionPath());
    }
    
    protected function getMessageFindPath()
    {
        //directory
        return sprintf('%s/%s', realPath($this->rootDir.'/../web'), $this->getMessagePath());
    }
}
