<?php

namespace OP\UserBundle\Form\Subscriber;

use Symfony\Component\Form\FormEvent,
    Symfony\Component\Form\FormEvents,
    OP\UserBundle\Repository\OpinionUserManager,
    Symfony\Component\Form\Extension\Core\Type\TextType,
    Symfony\Component\EventDispatcher\EventSubscriberInterface;


class RegisterSubscriber implements EventSubscriberInterface
{
	private $userManager;

    public function __construct(OpinionUserManager $userManager)
    {
        $this->userManager = $userManager;
    }


    public static function getSubscribedEvents()
    {
        return array(
            FormEvents::PRE_SUBMIT => 'preSubmit'
        );
    }

    public function preSubmit(FormEvent $event)
    {
        $form       = $event->getForm();

        //work only if submitted form is an user's registration
        if($form->getName() === 'registration') {
            $data     = $event->getData();
            $async    = isset($data['firstname']) ? false : true;  //json or x-form
            $username = $this->createUsername(
                $async ? $data['registration']['firstname'] : $data['firstname'], 
                $async ? $data['registration']['lastname'] : $data['lastname']
            );
            $form->add('username', TextType::class, ['empty_data' => $username]);
        }
    }

    protected function createUsername($firstname, $lastname) 
    {
    	//$inversedStr = $lastname . $firstname;
    	$normalStr = $firstname . $lastname;
        //TODO make normalStr different with ['messages', 'login', register, '...']
    	$usernames = $this->userManager->loadUsernamesByString($normalStr);
        //remove Uppercase & other chars
    	$username  = $this->guessUsername($usernames, strtolower(preg_replace('/[^a-z0-9]/', '', $normalStr)));

    	return $username;
    }    

    public function guessUsername($db_usernames = [], $normalStr = '')
    {
    	$possibleCombin = [];
    	$ends = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 
    		'11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    		'21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
    		'31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
    		'41', '42', '43', '44', '45', '46', '47', '48', '49', '50',
    		'51', '52', '53', '54', '55', '56', '57', '58', '59', '60',
    		'61', '62', '63', '64', '65', '66', '67', '68', '69', '70',
    		'71', '72', '73', '74', '75', '76', '77', '78', '79', '80',
    		'81', '82', '83', '84', '85', '86', '87', '88', '89', '90'
    	];

    	foreach ($ends as $end) {
    		$possibleCombin[] = $normalStr . $end;
    	}

    	//re-index after array_diff
    	$usernames = array_values(array_diff($possibleCombin, $db_usernames));

    	return $usernames[0];
    }

}
