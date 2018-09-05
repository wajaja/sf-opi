<?php
namespace OP\PostBundle\DocumentManager;

use Pagerfanta\Pagerfanta,
    Pagerfanta\Adapter\ArrayAdapter,
    OP\UserBundle\Document\User;

/**
 */
class PostManager extends BasePostManager
{
    /**
     * @param Post $post
     * @param Boolean $andFlush Whether to flush the changes (default true)
     */
    public function loadPost(User $user, $page=1, $date)
    {
        $user_id  = $user->getId();
        $dm       = $this->dm;
        $posts    = [];
        $post_ids = ['5a42cd6ad8d25a0898001de5', '59b728dbaa95aac40e00002a', '59b6c341aa95aa100c000029', '599e9203aa95aae00400002a', '5984acddaa95aaa00a00002e', '59959ce4aa95aa4c1a00002b', '59959e3aaa95aa6408000032', '5a444c0fd8d25a0700007e43', '5a44540ed8d25a1058002622', '5a44e669d8d25a1098000558', '5a826966d8d25a17440005e1', '5ac82713d8d25a0578000d13', '5ac8c2d5d8d25a113c007f35', '5ac8c4bfd8d25a06c00015e7', '5ac8e462d8d25a06c00015e9', '5ac99d36d8d25a0b3c004c17', '5ac9a074d8d25a0b3c004c19', '5acad985d8d25a0e70007ee6', '5ae95dd5d8d25a0ee800388e'];

        foreach ($post_ids as $post_id) {
            $post = $dm->getRepository('OPPostBundle:Post')
                        ->findSimplePostById($post_id);
            //post not found or masked
            if(!$post || in_array($user_id, $post['maskersForUserIds'])) {
                continue;
            }
            else {             
                $data = $post['type'] == 'opinion' ? $this->transformer->opinionToArray($post) :
                                        $this->transformer->postToArray($post);
                $data['verb'] = 'post';
                $posts[] = $data;
            }
        }

        return ['posts' => $posts, 'lastStreamId'=> null];
    }

    /**
     * @param Post $post
     * @param Boolean $andFlush Whether to flush the changes (default true)
     */
    public function loadTimelime(User $feed, $page=1, $date)
    {
        $stream  = $this->stream;     //getStream.io client
        $user_id = $this->getAuthenticatedUser()->getId();
        $feed_id = $feed->getId();
        $dm      = $this->dm;
        $posts   = [];

        if($timeline = $stream->getUserTimeline($feed_id)) {
            $last_id = $timeline[count($timeline) -1]['id'];
            foreach ($timeline as $t) {
                $verb = $t['verb'];
                $id   = $t['object'];
                $post = $dm->getRepository('OPPostBundle:Post')->findSimplePostById($id);
                //post not found or masked
                if(!$post || in_array($user_id, $post['maskersForUserIds'])) {
                    continue;
                } else {             
                    $data         = $post['type'] == 'opinion' ? $this->transformer->opinionToArray($post)
                                                               : $this->transformer->postToArray($post);
                    $data['verb'] = $verb;
                    $posts[] = $data;
                }
            }
            return ['posts' => $posts, 'lastStreamId'=> $last_id];
        }

        // //paginate
        // $adapter = new ArrayAdapter($ids);
        // $pager   = new Pagerfanta($adapter);
        // $pager->setMaxPerPage(10);
        // $pager->setCurrentPage(1);

        // foreach ($pager->getCurrentPageResults() as $stream) {
        //     // if($stream->verb === 'post') {
        //     //     //get post
        //     // }
        //     $id = $stream;  //TODO:: $stream->id
        //     $post = $dm->getRepository('OPPostBundle:Post')->findSimplePostById($id);
        //     //post not found or masked
        //     if(!$post || in_array($user_id, $post['maskersForUserIds'])) {
        //         continue;
        //     }
        //     else {             
        //         $posts[] = $post['type'] == 'opinion' ? $trans->opinionToArray($post) :
        //                                                 $trans->postToArray($post);
        //     }
        // }

        return $posts;
    }
}
