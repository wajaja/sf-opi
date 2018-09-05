<?php
namespace OP\MediaBundle\FileUploader;

use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * Description of MediaName
 *
 * @author CEDRICK
 */
class MediaNamer
{
    public function name(UploadedFile $file)
    {
        return sprintf('%s', $file->getClientOriginalName());
    }
}
