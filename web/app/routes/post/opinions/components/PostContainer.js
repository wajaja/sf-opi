import React                        from 'react'
import createReactClass             from 'create-react-class'
import { Link, Router }             from 'react-router-dom'
import { connect }                  from 'react-redux'
import classnames                   from 'classnames';
import * as axios                   from 'axios'
import { OHead, PostPhotos}         from '../../../../components/post/'
import Photos                       from '../../../../components/post/post/Photos'
import { BASE_PATH }                from '../../../../config/api'
import * as DraftFuncs              from '../../../../components/social/home/form/DraftFuncs'
import { BuildContent, RateButton, 
         Images, Author, TimeAgo,
         LeftForm, RightForm,
         EditPostForm, AddPostForm, Videos }      from '../../../../components' 

import { 
    App as AppActions,
    Posts as PostsActions,
}                                   from '../../../../actions'

// import '../../../../styles/post/opinion.scss'
const Option  = createReactClass({

    getInitialState() {
        return{
            option: false
        }
    },

    getPost () {
        const self  = this;
        return axios.get(`${BASE_PATH}/api/posts/edit/${self.props.post.id}`);
    },

    handleEdit(e) {
        e.preventDefault();
        const { dispatch } = this.props;
        if(!this.props.editingPost) {
            this.props.handleEdit(true);
            dispatch(AppActions.editPostFormFocus(true));
            dispatch(AppActions.editingPost(true));
        }
    },

    handleRemove(e) {
        e.preventDefault();
        this.props.handleRemove();
    },

    maskPost(e) {
        e.preventDefault();
        this.props.maskPost();
    },

    favoritePost(e) {
        e.preventDefault();
        this.props.favoritePost();
    },

    renderForAuthor() {
        return(
            <div className="pst-opt-ctnr-a">
                <div className="opt-rel-ctnr">
                    <i className="opt-arraw"><i></i></i>
                    <span className="pst-opt-ctnr-b">
                        <a href="" className="pst-opt-edit" data-pst-id={this.props.post.id} onClick={this.handleEdit}>
                            <span className="pst-opt-edit-ico">
                                <i className="fa fa-pencil" aria-hidden="true"></i>
                            </span>
                            <span className="pst-opt-edit-txt"> Edit</span>
                        </a>
                        <a href="" className="pst-opt-remove" data-pst-id={this.props.post.id} onClick={this.handleRemove}>
                            <span className="pst-opt-remove-ico">
                                <i className="fa fa-times" aria-hidden="true"></i>
                            </span>
                            <span className="pst-opt-remove-txt">Trash</span>
                        </a>
                    </span>
               </div>
            </div>
        )
    },

    ///
    ///
    renderForUser() {
        return(
            <div className="pst-opt-ctnr-a">
               <div className="opt-rel-ctnr">
                    <i className="opt-arraw"><i></i></i>
                    <span className="pst-opt-ctnr-b">                                    
                        <a href="" className="pst-opt-mask" data-pst-id={this.props.post.id} onClick={this.maskPost}>
                            <span className="pst-opt-mask-ico">
                                <i className="fa fa-trash" aria-hidden="true"></i>
                            </span>
                            <span className="pst-opt-mask-txt">Mask</span>
                        </a>
                        <a href="" className="pst-opt-favorite" onClick={this.favoritePost}>
                            <span className="pst-opt-favorite-ico">
                                <i className="fa fa-star" aria-hidden="true"></i>
                            </span>
                            <span className="pst-opt-favorite-txt">Favorite</span>
                        </a>
                    </span>
                </div>
            </div>
        )
    },
////////
    render() {

        const { user } = this.props
        return (
            <div />
        )
    }
})
/////
/////
const Nav  = createReactClass( {

    goNext(e) {
        this.props.goNext()
    },

    goPrev(e) {
        this.props.goPrev()
    },

    render() {
        return(
            <div className="nav-allie-ctnr">
                <div className="prev-al-ctnr" onClick={this.goPrev}>
                    <span className="glyphicon glyphicon-arrow-left"></span>
                </div>
                <div className="nxt-al-ctnr" onClick={this.goNext}>
                    <span className="glyphicon glyphicon-arrow-right"></span>
                </div>
            </div>
        )
    }
})
/////
////
const PostContainer  = createReactClass( {

    getInitialState() {
        return {
            allie: {},
            info: false,
            option: false,
            editing: false,
            nextPostForm: false,
        }
    },

    goNext () {
        this.props.goNext()
    },

    goPrev () {
        this.props.goPrev()
    },

    onRate () {
        console.log('Ratinnnnnn')
    },

    nextStep(e) {
        if(!this.state.nextPostForm) {
            this.setState({nextPostForm: true});
        }
    },

    onSideComment(comment, side) {
        console.log(comment, side)
    },

    subcribe(e) {
        const {userID, postId, dispatch } = this.props;
        dispatch(PostsActions.subcribe(postId, userID))
    },

    onShare(postId, refer) {
        this.props.onShare(postId, refer);
    },

    handleEdit(val) {
        if(this.props.editingPost) return;
        this.setState({editing: val})
    },

    handleRemove () {
        const { post, dispatch } = this.props;
        dispatch(PostsActions.deletePost(post));
    },

    maskPost () {
        const { post, dispatch } = this.props;
        dispatch(PostsActions.maskPost(post));
    },

    favoritePost () {
        const { post, dispatch } = this.props;
        dispatch(PostsActions.favoritePost(post));
    },

    postMouseHover(e) {
        $(e.target).find('.pst-opt-lk').css("opacity", "1");
    },

    postMouseOut(e) {
        $(e.target).find('.pst-opt-lk').css("opacity", "0.3");
    },

    toggleOption () {
        const self = this;
        this.setState({option: !self.state.option})
    },

    toggleInfo () {
        const self = this
        this.setState({info: !self.state.info})
    },

    postClick(e) {
        this.setState({option: false})
    },

    onAddToPost() {
        this.setState({nextPostForm: false});
    },

    cancelNextPost () {
        this.setState({nextPostForm: false})
    },

    render() {
        const { post: {id, author, content,  nbLeftComments, nbRightComments }, userID,
                mainPost: { rightEditors, leftEditors, 
                    nbAllies, } } = this.props,
            { allie, nextPostForm, } = this.state,
            rightEditorId = rightEditors.map((ed) => ed.id)[0],
            leftEditorId = leftEditors.map((ed) => ed.id)[0],
            authorId = author.id;
        return(
            <div className="center">
                <div className={nextPostForm ? `blck-drp nxt-pst` : `blck-drp`}></div>
                <div className="center-a">
                    <div className="head">
                        <div className={nextPostForm ? `pst-dv-txt-ctn nxt-pst` : `pst-dv-txt-ctn`}>
                            <div className="ctnr">
                                <div className="head">
                                    <OHead {...this.props}
                                        author={author}
                                        maskPost={this.maskPost}
                                        option={this.state.option} 
                                        editing={this.state.editing} 
                                        handleEdit={this.handleEdit} 
                                        toggleOption={this.toggleOption}
                                        favoritePost={this.favoritePost}
                                        handleRemove={this.handleRemove} />
                                </div>
                                <div className="postContent">
                                    <BuildContent content={content} />
                                    <div className="multi-pst-dv-img-ctn">
                                        <div className="multi-pst-dv-img-ctn-a">
                                            <div className="multi-pst-dv-img-ctn-b">
                                                {images.length > 0 && videos.length === 0 && 
                                                    <div className="multi-pst-dv-img">
                                                        <Photos 
                                                            {...this.props}
                                                            images={this.props.post.images}
                                                            post={this.props.post}
                                                            />
                                                   </div>
                                                }
                                                {videos.length > 0 && 
                                                    <div className="multi-pst-dv-vdeos">
                                                        <Videos 
                                                            {...this.props}
                                                            videos={this.props.post.videos}
                                                            post={this.props.post}
                                                            />
                                                   </div>
                                               }                           
                                            </div>
                                        </div>                              
                                    </div>
                                </div>
                                {userID !== leftEditorId && userID !== rightEditorId &&
                                    <div className="nav-allie">
                                        <Nav
                                            goNext={this.goNext}
                                            goPrev={this.goPrev}
                                            />
                                    </div>
                                }
                                {userID === leftEditorId && nbLeftComments === 0 && 
                                    <div className="nav-allie">
                                        <Nav
                                            goNext={this.goNext}
                                            goPrev={this.goPrev}
                                            />
                                        <div className="pst-lr-cmts-frm-b">
                                            <div className="pst-lft-frm-ctnr">
                                                <LeftForm 
                                                    key={id}
                                                    postId={id} 
                                                    side='left'
                                                    onSideComment={this.onSideComment}
                                                    post={this.props.post}  
                                                    />
                                            </div>
                                        </div>
                                    </div>
                                }
                                {nextPostForm && 
                                    <div className="nxt-frm-ctnr">
                                        <div className="nxt-frm-ctnr-a">
                                            <span className="nxt-abord" onClick={this.cancelNextPost}>
                                                <i className="fa fa-times" aria-hidden="true"></i>
                                            </span>
                                            <AddPostForm 
                                                postId={this.props.mainPost.id}
                                                refer="opinion"
                                                user={this.props.user}
                                                post={this.props.mainPost}
                                                onAddToPost={this.onAddToPost}
                                                />
                                         </div>
                                    </div>
                                }
                                {userID === leftEditorId && nbLeftComments > 0 && 
                                    <div className="nav-allie">
                                        <Nav
                                            goNext={this.goNext}
                                            goPrev={this.goPrev}
                                            />
                                    </div>
                                }
                                {userID === rightEditorId && nbRightComments === 0 && 
                                    <div className="nav-allie">
                                        <Nav
                                            goNext={this.goNext}
                                            goPrev={this.goPrev}
                                            />
                                        <div className="pst-lr-cmts-frm-b">
                                            <div className="pst-rght-frm-ctnr">
                                                <RightForm 
                                                    key={id}
                                                    postId={id} 
                                                    side='right'
                                                    post={this.props.post}  
                                                    onSideComment={this.onSideComment}
                                                    />
                                            </div>
                                        </div>
                                    </div>
                                }
                                {userID === rightEditorId && nbRightComments > 0 && 
                                    <div className="nav-allie">
                                        <Nav
                                            goNext={this.goNext}
                                            goPrev={this.goPrev}
                                            />
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="foot op-lks-actties" >
                        <div className="foot-ctnr">
                            {authorId !== userID && 
                                <div className="pst-sbcrb" >
                                    <span className="lkSubcribe" onClick={this.subcribe}> 
                                        subcribe
                                    </span>
                                    <span className="pst-sbcrber-nb"> </span>
                                </div>
                            }
                            {authorId === userID && 
                                <div className="pst-sbcrb" >
                                    <span className="lkSubcribe" onClick={this.nextStep}> 
                                        next Step
                                    </span>
                                    <span className="pst-sbcrber-nb"> </span>
                                </div>
                            }
                            <div className="postShareDiv">
                                <span className="postShare-icon-form" onClick={this.onShare.bind(this, this.props.mainPost.id)}>
                                    <i className="fa fa-share-alt"></i>
                                    <span className="txt">share</span>
                                </span>
                            </div>
                            <RateButton 
                                post={this.props.post} 
                                type="post" 
                                onRate={this.onRate}
                                onUpLike={this.onUpLike} 
                                onDownLike={this.onDownLike}
                                />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})

export default connect(state => ({
    allies: state.Posts.allies,
    userID: state.User.user.id,
}))(PostContainer)