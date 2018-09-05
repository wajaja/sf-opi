<?php

namespace OP\MediaBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;
use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * OP\MediaBundle\Document\MediaStreamRecorder
 *
 * @ODM\Document(
 *      db="opinion",
 *      collection="mediastreamrecorders",
 *     repositoryClass="OP\MediaBundle\Repository\MediaStreamRecorderRepository"
 * )
 * @ODM\ChangeTrackingPolicy("DEFERRED_IMPLICIT")
 */
class MediaStreamRecorder
{
    /**
     * @var MongoId $id
     *
     * @ODM\Id(strategy="AUTO")
     */
    protected $id;

    /**
     * @var string $path
     *
     * @ODM\Field(name="path", type="string")
     */
    protected $path;

    /**
     * @var string $size
     *
     * @ODM\Field(name="size", type="string")
     */
    protected $size;

    /**
     * @var string $type
     *
     * @ODM\Field(name="type", type="string")
     */
    protected $type;

    /**
     * @var timestamp $ts
     *
     * @ODM\Field(name="ts", type="timestamp")
     */
    protected $ts;
    
    /**
     * @var string $gender
     *
     * @ODM\Field(name="gender", type="string")
     */
    protected $gender;

    /**
     * @var string $duration
     *
     * @ODM\Field(name="duration", type="integer")
     */
    protected $duration;

    /**
     * @var date $createdAt
     *
     * @ODM\Field(name="createdAt", type="date")
     */
    protected $createdAt;

    /**
     * @var directory
     *
     * @ODM\Field(name="directory", type="string")
     */
    protected $directory;


    /**
     * @var date $updateAt
     *
     * @ODM\Field(name="updateAt", type="date")
     */
    protected $updateAt;

    /**
     *
     * @ODM\ReferenceOne(targetDocument="OP\UserBundle\Document\User", inversedBy="records")
     */
    protected $author;
    
    /**
     * @var  $notification
     *
     * @ODM\ReferenceOne(targetDocument="OP\SocialBundle\Document\Notification")
     */
    protected $mcommentNotification;
    
    /**
     * @var  $notification
     *
     * @ODM\ReferenceOne(targetDocument="OP\SocialBundle\Document\Notification")
     */
    protected $mlikeNotification;

     /**
     *
     * @ODM\ReferenceMany(targetDocument="OP\MediaBundle\Document\Reaction", mappedBy="recordId")
     */
    protected $reactions = array();
    /**
     * @var UploadedFile
     */
    protected $file;

    protected $tempFilename;


    // On modifie le setter de File, pour prendre en compte l'upload d'un fichier lorsqu'il en existe déjà un autre
    public function setFile(UploadedFile $file)
    {
        $this->file = $file;
        // On vérifie si on avait déjà un fichier pour cette entité
        if (null !== $this->path) {
            // On sauvegarde l'extension du fichier pour le supprimer plus tard
            $this->tempFilename = $this->path;
            // On réinitialise les valeurs des attributs path et alt
            $this->path = null;
            $this->alt = null;
        }
    }

    /**
    * @ODM\PrePersist()
    * @ODM\PreUpdate()
    */
    public function preUpload()
    {
        // Si jamais il n'y a pas de fichier (champ facultatif)
        if (null === $this->file) {
          return;
        }
        // Le nom du fichier est son id, on doit juste stocker également son extension
        // Pour faire propre, on devrait renommer cet attribut en « extension », plutôt que « path »
        $this->path = $this->file->guessExtension();
        // Et on génère l'attribut alt de la balise <img>, à la valeur du nom du fichier sur le PC de l'internaute
        $this->alt = $this->file->getClientOriginalName();
    }

    /**
    * @ODM\PostPersist()
    * @ODM\PostUpdate()
    */
    public function upload()
    {
        // Si jamais il n'y a pas de fichier (champ facultatif)
        if (null === $this->file) {
          return;
        }

        // Si on avait un ancien fichier, on le supprime
        if (null !== $this->tempFilename) {
          $oldFile = $this->getUploadRootDir().'/'.$this->id.'.'.$this->tempFilename;
          if (file_exists($oldFile)) {
            unlink($oldFile);
          }
        }
        // On déplace le fichier envoyé dans le répertoire de notre choix
        $this->file->move(
          $this->getUploadRootDir(), // Le répertoire de destination
          $this->id.'.'.$this->path   // Le nom du fichier à créer, ici « id.extension »
        );
    }

    /**
    * @ODM\PreRemove()
    */
    public function preRemoveUpload()
    {
        // On sauvegarde temporairement le nom du fichier, car il dépend de l'id
        $this->tempFilename = $this->getUploadRootDir().'/'.$this->id.'.'.$this->path;
    }

    /**
    * @ODM\PostRemove()
    */
    public function removeUpload()
    {
        // En PostRemove, on n'a pas accès à l'id, on utilise notre nom sauvegardé
        if (file_exists($this->tempFilename)) {
          // On supprime le fichier
          unlink($this->tempFilename);
        }
    }

    public function getMediaUploadDir()
    {
        // On retourne le chemin relatif vers l'image pour un navigateur
        return 'uploads/mediastream';
    }

    public function getUploadRootDir()
    {
        // On retourne le chemin relatif vers l'image pour notre code PHP
        return __DIR__.'/../../../../web/'.$this->getMediaUploadDir();
    }

    public function getWebPath()
    {
        if($this->getDirectory()=='mediastream'){
           return $this->getMediaUploadDir().'/'.$this->getPath();
        }else {
            return;
        }
    }

    public function __construct()
    {
        $this->reactions = new \Doctrine\Common\Collections\ArrayCollection();
        $this->createdAt = new \Datetime(null, new \DateTimeZone("UTC"));
        $this->datepubledAt = new \DateTime(null, new \DateTimeZone("UTC"));
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
     * Set path
     *
     * @param string $path
     * @return self
     */
    public function setPath($path)
    {
        $this->path = $path;
        return $this;
    }

    /**
     * Get path
     *
     * @return string $path
     */
    public function getPath()
    {
        return $this->path;
    }

    /**
     * Set size
     *
     * @param string $size
     * @return self
     */
    public function setSize($size)
    {
        $this->size = $size;
        return $this;
    }

    /**
     * Get size
     *
     * @return string $size
     */
    public function getSize()
    {
        return $this->size;
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
     * Add reaction
     *
     * @param OP\MediaBundle\Document\Reaction $reaction
     */
    public function addReaction(\OP\MediaBundle\Document\Reaction $reaction)
    {
        $this->reactions[] = $reaction;
    }

    /**
     * Remove reaction
     *
     * @param OP\MediaBundle\Document\Reaction $reaction
     */
    public function removeReaction(\OP\MediaBundle\Document\Reaction $reaction)
    {
        $this->reactions->removeElement($reaction);
    }

    /**
     * Get reactions
     *
     * @return \Doctrine\Common\Collections\Collection $reactions
     */
    public function getReactions()
    {
        return $this->reactions;
    }

    /**
     * Set directory
     *
     * @param string $directory
     * @return $this
     */
    public function setDirectory($directory)
    {
        $this->directory = $directory;
        return $this;
    }

    /**
     * Get directory
     *
     * @return string $directory
     */
    public function getDirectory()
    {
        return $this->directory;
    }

    /**
     * Set gender
     *
     * @param string $gender
     * @return $this
     */
    public function setGender($gender)
    {
        $this->gender = $gender;
        return $this;
    }

    /**
     * Get gender
     *
     * @return string $gender
     */
    public function getGender()
    {
        return $this->gender;
    }

    /**
     * Set duration
     *
     * @param integer $duration
     * @return $this
     */
    public function setDuration($duration)
    {
        $this->duration = $duration;
        return $this;
    }

    /**
     * Get duration
     *
     * @return integer $duration
     */
    public function getDuration()
    {
        return $this->duration;
    }

    /**
     * Set ts
     *
     * @param timestamp $ts
     * @return $this
     */
    public function setTs($ts)
    {
        $this->ts = $ts;
        return $this;
    }

    /**
     * Get ts
     *
     * @return timestamp $ts
     */
    public function getTs()
    {
        return $this->ts;
    }

    /**
     * Set mcommentNotification
     *
     * @param OP\SocialBundle\Document\Notification $mcommentNotification
     * @return self
     */
    public function setMcommentNotification(\OP\SocialBundle\Document\Notification $mcommentNotification)
    {
        $this->mcommentNotification = $mcommentNotification;
        return $this;
    }

    /**
     * Get mcommentNotification
     *
     * @return OP\SocialBundle\Document\Notification $mcommentNotification
     */
    public function getMcommentNotification()
    {
        return $this->mcommentNotification;
    }

    /**
     * Set mlikeNotification
     *
     * @param OP\SocialBundle\Document\Notification $mlikeNotification
     * @return self
     */
    public function setMlikeNotification(\OP\SocialBundle\Document\Notification $mlikeNotification)
    {
        $this->mlikeNotification = $mlikeNotification;
        return $this;
    }

    /**
     * Get mlikeNotification
     *
     * @return OP\SocialBundle\Document\Notification $mlikeNotification
     */
    public function getMlikeNotification()
    {
        return $this->mlikeNotification;
    }
}
