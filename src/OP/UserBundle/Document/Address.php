<?php

namespace OP\UserBundle\Document;

use JMS\Serializer\Annotation\Type,
    JMS\Serializer\Annotation\Expose,
    JMS\Serializer\Annotation\Groups,
    Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;

/**
 * OP\UserBundle\Document\Address
 *
 * @ODM\EmbeddedDocument
 */
class Address
{
    /**
     * @var MongoId $id
     * @Expose
     * @Type("string")
     * @Groups({"Detail", "Me", "Infos", "Profile", "Default"})
     *
     * @ODM\Id(strategy="AUTO")
     */
    protected $id;

    /**
     * @var string $country
     *
     * @Expose
     * @Type("string")
     * @Groups({"Detail", "Me", "Infos", "Profile", "Default"})
     * @ODM\Field(name="country", type="string")
     */
    protected $country;

    /**
     * @var string $city
     *
     * @Expose
     * @Type("string")
     * @Groups({"Detail", "Me", "Infos", "Profile", "Default"})
     * @ODM\Field(name="city", type="string")
     */
    protected $city;

    /**
     * @var string $region || province
     * 
     * @Expose
     * @Type("string")
     * @Groups({"Detail", "Me", "Infos", "Profile", "Default"})
     * @ODM\Field(name="region", type="string")
     */
    protected $region;

    /**
    * @var string $birthCity
    *
    * @Expose
    * @Type("string")
    * @Groups({"Detail", "Me", "Infos", "Profile", "Default"})
    * @ODM\Field(name="birthCity", type="string")
    */
    protected $birthCity;

    /**
     * @var string $familly
     *
     * @Expose
     * @Type("string")
     * @Groups({"Detail", "Me", "Infos", "Profile", "Default"})
     * @ODM\Field(name="familly", type="string")
     */
    protected $familly;

    /**
    * @var string $localization
    *
    * @Expose
    * @Type("string")
    * @Groups({"Detail", "Me", "Infos", "Profile", "Default"})
    * @ODM\Field(name="localization", type="string")
    */
    protected $localization;

    public function __construct(){
        $this->city         = "";
        $this->birthCity    = "";
        $this->country      = "";
        $this->localization = "";
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
     * Set country
     *
     * @param string $country
     * @return self
     */
    public function setCountry($country)
    {
        $this->country = $country;
        return $this;
    }

    /**
     * Get country
     *
     * @return string $country
     */
    public function getCountry()
    {
        return $this->country;
    }

    /**
     * Set city
     *
     * @param string $city
     * @return self
     */
    public function setCity($city)
    {
        $this->city = $city;
        return $this;
    }

    /**
     * Get city
     *
     * @return string $city
     */
    public function getCity()
    {
        return $this->city;
    }

    /**
     * Set birthCity
     *
     * @param string $birthCity
     * @return self
     */
    public function setBirthCity($birthCity)
    {
        $this->birthCity = $birthCity;
        return $this;
    }

    /**
     * Get birthCity
     *
     * @return string $birthCity
     */
    public function getBirthCity()
    {
        return $this->birthCity;
    }

    /**
     * Set familly
     *
     * @param string $familly
     * @return self
     */
    public function setFamilly($familly)
    {
        $this->familly = $familly;
        return $this;
    }

    /**
     * Get familly
     *
     * @return string $familly
     */
    public function getFamilly()
    {
        return $this->familly;
    }

    /**
     * Set localization
     *
     * @param string $localization
     * @return $this
     */
    public function setLocalization($localization)
    {
        $this->localization = $localization;
        return $this;
    }

    /**
     * Get localization
     *
     * @return string $localization
     */
    public function getLocalization()
    {
        return $this->localization;
    }

    /**
     * Set region
     *
     * @param string $region
     * @return $this
     */
    public function setRegion($region)
    {
        $this->region = $region;
        return $this;
    }

    /**
     * Get region
     *
     * @return string $region
     */
    public function getRegion()
    {
        return $this->region;
    }
}
