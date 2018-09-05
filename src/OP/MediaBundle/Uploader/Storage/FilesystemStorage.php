<?php

namespace OP\MediaBundle\Uploader\Storage;

use Symfony\Component\HttpKernel\Kernel,
    Symfony\Component\HttpFoundation\File\File;

class FilesystemStorage implements StorageInterface
{
    protected $rootDir;
    
    public function __construct($rootDir)
    {
        $this->rootDir = $rootDir;
    }
    public function upload(File $file, $name, $path = null)
    {
        
        $path = is_null($path) ? $name : sprintf('%s/%s', $path, $name);
        $path = sprintf('%s/%s', $this->rootDir.'/../web/optube/uploads/videos', $path);
        
        
        // now that we have the correct path, compute the correct name
        // and target directory
        $targetName = basename($path);
        $targetDir  = dirname($path);  
        
        $file = $file->move($targetDir, $targetName);
        return $file;
    }
}
