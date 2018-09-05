<?php
namespace OP\MediaBundle\Uploader\File;

use Symfony\Component\HttpFoundation\File\File,
    Symfony\Component\HttpFoundation\File\UploadedFile;

class FilesystemFile extends UploadedFile implements FileInterface
{
    public function __construct(File $file)
    {
        if ($file instanceof UploadedFile) {
            echo '1';
            parent::__construct($file->getPathname(), $file->getClientOriginalName(), $file->getClientMimeType(), $file->getClientSize(), $file->getError(), true);
        } else {
            echo '2';
            parent::__construct($file->getPathname(), $file->getBasename(), $file->getMimeType(), $file->getSize(), 0, true);
        }

    }

    public function getExtension()
    {
        return $this->getClientOriginalExtension();
    }
}