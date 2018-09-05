<?php 

namespace OP\MediaBundle\Manager;

use OP\MediaBundle\Document\Image,
	Doctrine\ODM\MongoDB\DocumentManager;


/**
* 
*/
class ImageManager
{
	private $dm,
			$class;
	
	function __construct(DocumentManager $manager, $class)
	{
		$this->dm 			= $manager;
		$this->Repository 	= $dm->getRepository($class);
	}

	public function get()
	{
		return;
	}
}