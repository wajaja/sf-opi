<?php

namespace OP\UserBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * OP\UserBundle\Document\Favorite
 * 
 * @author Cedrick Ngeja
 *
 * @ODM\Document(
 *     db="opinion",
 *      collection="favorites",
 *      repositoryClass="OP\UserBundle\Repository\FavoriteRepository",
 * indexes={
 *          @ODM\index(keys={"date"="desc"}),
 *          @ODM\index(keys={"author.id"="desc"}),
 *          @ODM\index(keys={"type"="asc"}),
 *          @ODM\index(keys={"target"="asc"}),
 *       },
 *         requireIndexes=true
 * )
 */
class Favorite
{
    /**
     * @var MongoId $id
     *
     * @ODM\Id(strategy="AUTO")
     */
    protected $id;

    /**
     * @var string $target
     * property to store document type; (e.g : Post || Opinion)
     * 
     * @ODM\Field(name="target", type="string")
     */
    protected $target;

    /**
     * @var string $type
     *
     * type (mask or favorite)
     * @ODM\Field(name="type", type="string")
     */
    protected $type;

    /**
     * @var date $date
     *
     * @ODM\Field(name="date", type="date")
     */
    protected $date;
    
    /**
     * @ODM\ReferenceOne(targetDocument="OP\UserBundle\Document\User")
     */
    protected $author;

    /**
     * @var collection $myFovorites
     *
     * @ODM\Field(name="myFovorites", type="collection")
     */
    protected $myFovorites = [];
    
    /**
     * @ODM\ReferenceMany(targetDocument="OP\PostBundle\Document\Post")
     */
    protected $posts = [];

    public function __construct() {
        $this->date = new \DateTime(null, new \DateTimeZone("UTC"));
        $this->posts = new ArrayCollection();
        $this->opinions = new ArrayCollection();
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
     * Set target
     *
     * @param string $target
     * @return self
     */
    public function setTarget($target)
    {
        $this->target = $target;
        return $this;
    }

    /**
     * Get target
     *
     * @return string $target
     */
    public function getTarget()
    {
        return $this->target;
    }

    /**
     * Set type
     *
     * @param string $type
     * @return self
     */
    public function setType($type)
    {
        $this->type = $type;
        return $this;
    }

    /**
     * Get type
     *
     * @return string $type
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Set date
     *
     * @param date $date
     * @return self
     */
    public function setDate($date)
    {
        $this->date = $date;
        return $this;
    }

    /**
     * Get date
     *
     * @return date $date
     */
    public function getDate()
    {
        return $this->date;
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
     * Set myFovorites
     *
     * @param collection $myFovorites
     * @return self
     */
    public function setMyFovorites($myFovorites)
    {
        $this->myFovorites = $myFovorites;
        return $this;
    }

    /**
     * Get myFovorites
     *
     * @return collection $myFovorites
     */
    public function getMyFovorites()
    {
        return $this->myFovorites;
    }

    /**
     * Add post
     *
     * @param OP\PostBundle\Document\Post $post
     */
    public function addPost(\OP\PostBundle\Document\Post $post)
    {
        $this->posts[] = $post;
    }

    /**
     * Remove post
     *
     * @param OP\PostBundle\Document\Post $post
     */
    public function removePost(\OP\PostBundle\Document\Post $post)
    {
        $this->posts->removeElement($post);
    }

    /**
     * Get posts
     *
     * @return \Doctrine\Common\Collections\Collection $posts
     */
    public function getPosts()
    {
        return $this->posts;
    }
}
