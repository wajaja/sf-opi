<?php

namespace OP\UserBundle\Document;

use JMS\Serializer\Annotation\Type,
    JMS\Serializer\Annotation\Expose,
    JMS\Serializer\Annotation\Groups,
    Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;

/**
 * OP\UserBundle\Document\AboutMe
 *
 * @ODM\EmbeddedDocument
 * @ODM\Document(
 *     repositoryClass="OP\UserBundle\Repository\AboutMeRepository"
 * )
 * @ODM\ChangeTrackingPolicy("DEFERRED_IMPLICIT")
 */
class AboutMe
{

    /**
     * @var MongoId $id
     *
     * @ODM\Id(strategy="AUTO")
     * @Expose
     * @Type("string")
     * @Groups({"Detail", "Me", "Infos", "Profile", "Default"})
     */
    protected $id;

    /**
     * @var string $job
     *
     * @Expose
     * @Type("string")
     * @Groups({"Detail", "Me", "Infos", "Profile", "Default"})
     * @ODM\Field(name="job", type="string")
     */
    protected $job;

    /**
     * @var string $scools
     *
     * @Expose
     * @Type("string")
     * @Groups({"Detail", "Me", "Infos", "Profile", "Default"})
     * @ODM\Field(name="school", type="string")
     */
    protected $school;

    /**
     * @var string $scools
     *
     * @Expose
     * @Type("string")
     * @Groups({"Detail", "Me", "Infos", "Profile", "Default"})
     * @ODM\Field(name="scools", type="string")
     */
    protected $university;
    
    /**
     * @var string $sports
     *
     * @Expose
     * @Type("array")
     * @Groups({"Detail", "Me", "Infos", "Profile", "Default"})
     * @ODM\Field(name="sport", type="hash")
     */
    protected $sports = [];
    
    /**
     * @var string $musics
     *
     * @Expose
     * @Type("array")
     * @Groups({"Detail", "Me", "Infos", "Profile", "Default"})
     * @ODM\Field(name="musics", type="hash")
     */
    protected $musics = [];
    
    public function __contruct(){
        $this->sports = [];
        $this->musics = [];
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
     * Set job
     *
     * @param string $job
     * @return self
     */
    public function setJob($job)
    {
        $this->job = $job;
        return $this;
    }

    /**
     * Get job
     *
     * @return string $job
     */
    public function getJob()
    {
        return $this->job;
    }

    /**
     * Set university
     *
     * @param string $university
     * @return self
     */
    public function setUniversity($university)
    {
        $this->university = $university;
        return $this;
    }

    /**
     * Get university
     *
     * @return string $university
     */
    public function getUniversity()
    {
        return $this->university;
    }

    /**
     * Set sports
     *
     * @param hash $sports
     * @return self
     */
    public function setSports($sports)
    {
        $this->sports = $sports;
        return $this;
    }

    /**
     * Get sports
     *
     * @return hash $sports
     */
    public function getSports()
    {
        return $this->sports;
    }

    /**
     * Set musics
     *
     * @param hash $musics
     * @return self
     */
    public function setMusics($musics)
    {
        $this->musics = $musics;
        return $this;
    }

    /**
     * Get musics
     *
     * @return hash $musics
     */
    public function getMusics()
    {
        return $this->musics;
    }

    /**
     * Set school
     *
     * @param string $school
     * @return $this
     */
    public function setSchool($school)
    {
        $this->school = $school;
        return $this;
    }

    /**
     * Get school
     *
     * @return string $school
     */
    public function getSchool()
    {
        return $this->school;
    }
}
