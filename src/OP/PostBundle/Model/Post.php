<?php
namespace OP\PostBundle\Model;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\Validator\Constraints as Assert,
    // JMS\Serializer\Annotation\Type,
    // JMS\Serializer\Annotation\Expose,
    // JMS\Serializer\Annotation\Groups,
    JMS\Serializer\Annotation\ExclusionPolicy,
    Doctrine\Common\Collections\ArrayCollection;


/**
 * @ExclusionPolicy("all")
 * @MongoDB\MappedSuperclass
 */
class Post
{
    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\UserBundle\Document\User")
     */
    protected $participants;

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\PostBundle\Document\LeftComment", cascade={"remove"})
     */
    protected $leftcomments;
    
    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\PostBundle\Document\RightComment", cascade={"remove"})
     */
    protected $rightcomments;
    
    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\MediaBundle\Document\Video", cascade={"remove"})
     */
    protected $videos;

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\MediaBundle\Document\Image", cascade={"remove"})
     */
    protected $images;

    /**
     * @MongoDB\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $author;

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\PostBundle\Document\Like", cascade={"remove"})
     */
    protected $likes;
    
    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\PostBundle\Document\Rate", cascade={"remove"})
     */
    protected $rates;

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\MessageBundle\Document\Question", cascade={"remove"})
     */
    protected $questions;

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\PostBundle\Document\Comment", cascade={"remove"})
     */
    protected $comments;

    /**
     * @MongoDB\ReferenceMany(targetDocument="OP\PostBundle\Document\Share", cascade={"remove"})
     */
    protected $shares;

    /**
     * @var  $notification
     *
     * @MongoDB\ReferenceOne(targetDocument="OP\SocialBundle\Document\Notification", cascade={"remove"})
     */
    protected $notification;

    /**
     * @var  $notification
     *
     * @MongoDB\ReferenceOne(targetDocument="OP\SocialBundle\Document\Notification", cascade={"remove"})
     */
    protected $commentNotification;
    
    /**
     * @var  $notification
     *
     * @MongoDB\ReferenceOne(targetDocument="OP\SocialBundle\Document\Notification", cascade={"remove"})
     */
    protected $rightNotification;
    
    /**
     * @var  $notification
     *
     * @MongoDB\ReferenceOne(targetDocument="OP\SocialBundle\Document\Notification", cascade={"remove"})
     */
    protected $leftNotification;
    
    /**
     * @var  $notification
     *
     * @MongoDB\ReferenceOne(targetDocument="OP\SocialBundle\Document\Notification", cascade={"remove"})
     */
    protected $rateNotification;

    /**
     * @var  $notification
     *
     * @MongoDB\ReferenceOne(targetDocument="OP\SocialBundle\Document\Notification", cascade={"remove"})
     */
    protected $likeNotification;

    /**
     * @var
     *
     * @MongoDB\ReferenceOne(targetDocument="OP\SocialBundle\Document\Notification", cascade={"remove"})
     */
    protected $shareNotification;

    /**
     * Set id
     *
     * @param string $id
     * @return self
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * Get id
     *
     * @return id $id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set content
     *
     * @param string $content
     * @return self
     */
    public function setContent($content)
    {
        $this->content = $content;
        return $this;
    }

    /**
     * Get content
     *
     * @return string $content
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * Set createdAt
     *
     * @param date $createdAt
     * @return self
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    /**
     * Get createdAt
     *
     * @return date $createdAt
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Set updateAt
     *
     * @param date $updateAt
     * @return self
     */
    public function setUpdateAt($updateAt)
    {
        $this->updateAt = $updateAt;
        return $this;
    }

    /**
     * Get updateAt
     *
     * @return date $updateAt
     */
    public function getUpdateAt()
    {
        return $this->updateAt;
    }

    /**
     * Set visible
     *
     * @param boolean $visible
     * @return self
     */
    public function setVisible($visible)
    {
        $this->visible = $visible;
        return $this;
    }

    /**
     * Get visible
     *
     * @return boolean $visible
     */
    public function getVisible()
    {
        return $this->visible;
    }

    /**
     * Add image
     *
     * @param OP\MediaBundle\Document\Image $image
     */
    public function addImage(\OP\MediaBundle\Document\Image $image)
    {
        $this->images[] = $image;
    }

    /**
     * Remove image
     *
     * @param OP\MediaBundle\Document\Image $image
     */
    public function removeImage(\OP\MediaBundle\Document\Image $image)
    {
        $this->images->removeElement($image);
    }
    
    /**
    * @param array Images
    */
    public function setImages(array $images)
    {
        $this->images = $images;
        return $this;
    }

    /**
     * Get images
     *
     * @return \Doctrine\Common\Collections\Collection $images
     */
    public function getImages()
    {
        return $this->images;
    }

    /**
     * Set author
     *
     * @param OP\UserBundle\Document\User $author
     * @return self
     */
    public function setAuthor(\OP\UserBundle\Document\User $author)
    {
        $this->author = $author;
        return $this;
    }

    /**
     * Get author
     *
     * @return OP\UserBundle\Document\User $author
     */
    public function getAuthor()
    {
        return $this->author;
    }

    /**
     * Add like
     *
     * @param OP\PostBundle\Document\Like $like
     */
    public function addLike(\OP\PostBundle\Document\Like $like)
    {
        $this->likes[] = $like;
        $this->incrementLikers();
    }

    /**
     * Remove like
     *
     * @param OP\PostBundle\Document\Like $like
     */
    public function removeLike(\OP\PostBundle\Document\Like $like)
    {
        $this->likes->removeElement($like);
        $this->decrementLikers();
    }

    /**
     * Get plikes
     *
     * @return \Doctrine\Common\Collections\Collection $likes
     */
    public function getLikes()
    {
        return $this->likes;
    }

    /**
     * Set nbLikers
     *
     * @param int $nbLikers
     * @return self
     */
    public function setNbLikers($nbLikers)
    {
        $this->nbLikers = $nbLikers;
        return $this;
    }

    /**
     * Get nbLikers
     *
     * @return int $nbLikers
     */
    public function getNbLikers()
    {
        return $this->nbLikers;
    }

    /**
     * Add comment
     *
     * @param OP\PostBundle\Document\Comment $comment
     */
    public function addComment(\OP\PostBundle\Document\Comment $comment)
    {
        $this->comments[] = $comment;
        $this->incrementComments();
    }

    /**
     * Remove comment
     *
     * @param OP\PostBundle\Document\Comment $comment
     */
    public function removeComment(\OP\PostBundle\Document\Comment $comment)
    {
        $this->comments->removeElement($comment);
        $this->decrementComments();
    }

    /**
     * Get comments
     *
     * @return \Doctrine\Common\Collections\Collection $comments
     */
    public function getComments()
    {
        return $this->comments;
    }

    /**
     * Remove share
     *
     * @param OP\PostBundle\Document\Pshare $share
     */
    public function removeShare(\OP\PostBundle\Document\Share $share)
    {
        $this->shares->removeElement($share);
    }

    /**
     * Get shares
     *
     * @return \Doctrine\Common\Collections\Collection $shares
     */
    public function getShares()
    {
        return $this->shares;
    }

    // this method help us to converts that PostDocument in String method
    public function __toString()
    {
        try {
            // ... do some stuff
            // and try to return a string
            $string = $this->getId();
            if (!is_string($string)) {
                // we must throw an exception manually here because if $value
                // is not a string, PHP will trigger an error right after the
                // return statement, thus escaping our try/catch.
                throw new \LogicException(__CLASS__ . "__toString() must return a string");
            }

            return $string;
        } catch (\Exception $exception) {
            $previousHandler = set_exception_handler(function (){
            });
            restore_error_handler();
            call_user_func($previousHandler, $exception);
            die;
        }
    }

     /**
     * Add participant
     *
     * @param OP\UserBundle\Document\User $participant
     */
    public function addParticipant(\OP\UserBundle\Document\User $participant)
    {
        $this->participants[] = $participant;
    }

    /**
     * Remove participant
     *
     * @param OP\UserBundle\Document\User $participant
     */
    public function removeParticipant(\OP\UserBundle\Document\User $participant)
    {
        $this->participants->removeElement($participant);
    }

    /**
     * Get participants
     *
     * @return \Doctrine\Common\Collections\Collection $participants
     */
    public function getParticipants()
    {
        if ($this->participants === null) {
            $this->participants = new ArrayCollection();
        }
        return $this->participants;
    }

        /**
     * Set title
     *
     * @param string $title
     * @return self
     */
    public function setTitle($title)
    {
        $this->title = $title;
        return $this;
    }

    /**
     * Get title
     *
     * @return string $title
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set opinionOrder
     *
     * @param int $opinionOrder
     * @return self
     */
    public function setOpinionOrder($opinionOrder)
    {
        $this->opinionOrder = $opinionOrder;
        return $this;
    }

    /**
     * Get opinionOrder
     *
     * @return int $opinionOrder
     */
    public function getOpinionOrder()
    {
        return $this->opinionOrder;
    }

    /**
     * Set mainAllie
     *
     * @param OP\PostBundle\Document\Post $mainAllie
     * @return self
     */
    public function setMainAllie(\OP\PostBundle\Document\Post $mainAllie)
    {
        $this->mainAllie = $mainAllie;
        return $this;
    }

    /**
     * Get mainAllie
     *
     * @return OP\PostBundle\Document\Post $mainAllie
     */
    public function getMainAllie()
    {
        return $this->mainAllie;
    }

    /**
     * Set isMainPost
     *
     * @param boolean $isMainPost
     * @return self
     */
    public function setIsMainPost($isMainPost)
    {
        $this->isMainPost = $isMainPost;
        return $this;
    }

    /**
     * Get isMainPost
     *
     * @return boolean $isMainPost
     */
    public function getIsMainPost()
    {
        return $this->isMainPost;
    }

    /**
     * Set publishedAt
     *
     * @param date $publishedAt
     * @return self
     */
    public function setPublishedAt($publishedAt)
    {
        $this->publishedAt = $publishedAt;
        return $this;
    }

    /**
     * Get publishedAt
     *
     * @return date $publishedAt
     */
    public function getPublishedAt()
    {
        return $this->publishedAt;
    }

    /**
     * Adds all messages contents to the keywords property
     */
    public function doKeywords($body)
    {
        $keywords = '';
        if('array' === gettype($body)) {
            $blocks = $body['blocks'];
            foreach ($blocks as $block) {
                $keywords .= ' '.$block['text'];
            }
        } else {
            $keywords .= ' '.strip_tags($body);  //delete all html tag
        }

        // we only need each word once
        $this->keywords = implode(' ', array_unique(str_word_count(mb_strtolower($keywords, 'UTF-8'), 1)));
    }


    /***
    * list of proprerties and method usefull 
    * for post searches
    */
     /*
    * ElasticSearch Stuff 
    * source OBTAO
    */
     // un tableau public pour être utilisé comme liste déroulante dans le formulaire
    public static $sortChoices = array(
        'lastActivity desc' => 'Publication date : new to old',
        'lastActivity asc' => 'Publication date : old to new',
    );

    // query string
    protected $querySearch;

    // query string
    protected $criteria;

    // définit le champ utilisé pour le tri par défaut
    protected $sort = 'lastActivity';

    // définit l'ordre de tri par défaut
    protected $direction = 'desc';

    // une proprité "virtuelle" pour ajouter un champ select
    protected $sortSelect;

    // le numéro de page par défault
    protected $page = 1;

    // le nombre d'items par page
    protected $perPage = 10;

    // autres getters et setters
    public function handleRequest(Request $request)
    {
        if('application/x-www-form-urlencoded' !== $request->headers->get('Content-Type')) {
            $this->setPage($request->query->get('page', 1));
            $this->setCriteria($request->query->get('criteria', 'all'));
            // $this->setDirection($request->query->get('direction', 'desc'));
            $this->setQuery(urldecode($request->query->get('q', '')));
        } else {
            $this->setPage($request->get('page', 1));
            $this->setCriteria($request->get('criteria', 'all'));
            // $this->setDirection($request->get('direction', 'desc'));
            $this->setQuery(urldecode($request->get('q', '')));
        }
    }

    public function getPage()
    {
        return $this->page;
    }


    public function setPage($page)
    {
        if ($page != null) {
            $this->page = $page;
        }

        return $this;
    }

    public function getQuery()
    {
        return $this->querySearch;
    }


    public function setQuery($q)
    {
        $this->querySearch = $q;

        return $this;
    }

    public function getCriteria()
    {
        return $this->criteria;
    }


    public function setCriteria($c)
    {
        $this->criteria = $c;

        return $this;
    }

    public function getPerPage()
    {
        return $this->perPage;
    }

    public function setPerPage($perPage=null)
    {
        if($perPage != null){
            $this->perPage = $perPage;
        }

        return $this;
    }

    public function setSortSelect($sortSelect)
    {
        if ($sortSelect != null) {
            $this->sortSelect =  $sortSelect;
        }
    }

    public function getSortSelect()
    {
        return $this->sort.' '.$this->direction;
    }

    public function initSortSelect()
    {
        $this->sortSelect = $this->sort.' '.$this->direction;
    }

    public function getSort()
    {
        return $this->sort;
    }

    public function setSort($sort)
    {
        if ($sort != null) {
            $this->sort = $sort;
            $this->initSortSelect();
        }

        return $this;
    }

    public function getDirection()
    {
        return $this->direction;
    }

    public function setDirection($direction)
    {
        if ($direction != null) {
            $this->direction = $direction;
            $this->initSortSelect();
        }

        return $this;
    }

}
