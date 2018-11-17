<?php

namespace OP\SocialBundle\Firebase;

use Kreait\Firebase\Factory,
    Kreait\Firebase\ServiceAccount;

class Firebase 
{

	protected $firebase;

    public function __construct(){
        // This assumes that you have placed the Firebase credentials in the same directory
        // as this PHP file.
        $serviceAccount = ServiceAccount::fromJsonFile(__DIR__.'/google-service-account.json');
        $firebase = (new Factory)->withServiceAccount($serviceAccount)
            // The following line is optional if the project id in your credentials file
            // is identical to the subdomain of your Firebase project. If you need it,
            // make sure to replace the URL with the URL of your project.
            ->withDatabaseUri('https://opinion-5f379.firebaseio.com')
            ->create();
        $this->firebase = $firebase;
    }
    
    public function firebaseLogin($email, $password) {
        $serviceAccount = ServiceAccount::fromJsonFile(__DIR__.'/google-service-account.json');
        $auth       = $this->firebase->getAuth();

        try {
            $userRecord = $auth->verifyPassword($email, $password);
        } catch (Kreait\Firebase\Exception\Auth\InvalidPassword $e) {
            //TODO
            echo "userRecord string";
            echo $e->getMessage();
            exit;
        }
        //detail on https://github.com/kreait/firebase-php/issues/178
        //Authenticate with limited privileges
        $userConnection = (new Factory)
            ->withServiceAccount($serviceAccount)
            ->asUser($userRecord->uid)
            ->create();
    }

    public function getDatabase() {
    	return $this->firebase->getDatabase();
    }

    public function getAuth() {
    	return $this->firebase->getAuth();
    }
}