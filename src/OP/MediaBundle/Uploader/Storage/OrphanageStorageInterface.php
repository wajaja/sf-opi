<?php

namespace OP\MediaBundle\Uploader\Storage;

use OP\MediaBundle\Uploader\Storage\StorageInterface;

interface OrphanageStorageInterface extends StorageInterface
{
    public function uploadFiles($type, array $files = null);
}
