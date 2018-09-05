<?php

namespace OP\UserBundle\Form\Handler;

use FOS\UserBundle\Form\Handler\RegistrationFormHandler as BaseHandler;
use Symfony\Component\HttpFoundation\Request;

class RegistrationFormHandler extends BaseHandler
{
    public function process($confirmation = false)
    {
        $request = new Request();
        
        
        $user = $this->userManager->createUser();
        $this->form->setData($user);

        // pour symfony3.0  le 02/01/2016
        $this->form->handleRequest($request);            
            
            if ($this->form->isValid()) {

                // do your custom logic here

                return true;
            }

        return false;
    }
}