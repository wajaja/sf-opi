<?php

namespace OP\MediaBundle\Uploader\Storage;

use Symfony\Component\HttpFoundation\File\File;

//use Sym/File
interface StorageInterface
{
    /**
     * Uploads a File instance to the configured storage.
     *
     * @param        $file
     * @param string $name
     * @param string $path
     */
    public function upload(File $file, $name, $path = null);
}
