<?php

use Doctrine\Common\Annotations\AnnotationRegistry;
use Composer\Autoload\ClassLoader;
use Doctrine\ODM\MongoDB\Mapping\Driver\AnnotationDriver;

error_reporting(error_reporting() & ~E_USER_DEPRECATED);

/**
 * @var ClassLoader $loader
 */
$loader = require __DIR__.'/../vendor/autoload.php';

//added packages
$loader->add('SocketIO\Emitter', __DIR__.'/../vendor/rase/socket.io-emitter/src/');
$loader->add('GetStream\Stream\Client', __DIR__.'/../vendor/get-stream/stream/lib/');
// $loader->add('ZxcvbnPhp\Zxcvbn', __DIR__.'/../vendor/get-stream/stream/lib/');


AnnotationRegistry::registerLoader(array($loader, 'loadClass'));
AnnotationDriver::registerAnnotationClasses();

return $loader;
