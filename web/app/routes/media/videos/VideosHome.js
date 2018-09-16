import  React from "react";
import { Helmet }           from 'react-helmet'
import { Link, withRouter,
         Switch }           from 'react-router-dom'
import { Left, }            from '../../../components/social/home'
import createReactClass     from "create-react-class";
import { connect }          from 'react-redux'

//import Actor from 'components/Activity/Actor'
import Form    from './components/Form'
import { 
    Authors as AuthorsActions,
    Videos as VideosActions,
    App as AppActions
}                                   from '../../../actions'

import MyLoadable    from '../../../components/MyLoadable'


import { VideoUploader }        from '../../../components/social/home/form/PostFootElement'
import '../../../styles/media/videos-home.scss'
 
const VideoThumb = MyLoadable({loader: () => import('../../../components/media/VideoThumb')})

const _Option  = createReactClass({

    getInitialState() {
        return {
            option: false
        }
    },

    getPost() {
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

    ///
    ///
    render() {
        if(this.props.author.id === this.props.userId) {
            return this.renderForAuthor();
        } else {
            return this.renderForUser();
        }
    }
})

const Option = connect(state => ({
    userId: state.User.user.id
}))(_Option)

class  VideoHolder extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="vid-holder">                                    
                <div className="vid-holder-a">
                    <div className="vid-holder-ttl"></div>
                </div>
            </div>
        )
    }
}


const VideosHome  = createReactClass({

    getInitialState() {
        return {
            hasOwnDiary: true,
            screenWidth: 760,
            newsRefs: [],
            noPostsResults: false,
            boxPlacement: 'bottom'
        }
    },


    onShare(postId, refer) {
        this.props.onShare(postId, refer)
    },

    onComment(comment, post) {
        this.props.onComment(comment, post)
    },

    onLike(data, post) {
        this.props.onLike(data, post)
    },

    onFriendRequest(userId, targetId) {
        this.props.onFriendRequest(userId, targetId);
    },

    onFollowRequest(userId, targetId) {
        this.props.onFollowRequest(userId, targetId);
    },

    onFriendConfirm(userId, targetId) {
        this.props.onFriendConfirm(userId, targetId);
    },

    onUnFollowRequest(userId, targetId) {
        this.props.onUnFollowRequest(userId, targetId)
    },

    onDeleteInvitation(userId, targetId) {
        this.props.onDeleteInvitation(userId, targetId)
    },

    getImageFromCache(filename, galleryDir) {
        this.props.getImageFromCache(filename, galleryDir)
    },

    handleVideoClick(e) {
        e.stopPropagation();
    },

    shouldComponentUpdate(nextProps, nextState) {
        return (this.props.user !== nextProps.user || 
            this.props.screenWidth !== nextProps.screenWidth ||
            this.state.noPostsResults !== nextState.noPostsResults)
    },
    
    /**
     * handleRefresh
     * @param e event
     */
    handleRefresh(e) {
        this.props.onLoadHidden()
    },

    /**
     * render
     * @returns {*|markup}
     */
    render() {
        const { location, dispatch, user, serverSide, access_token } = this.props,
        { hasOwnDiary, newsRefs }  = this.state,
        userId                        = user.id;
        return (
            <div className="hm-container" ref={c => this._pageElm = c}>
                <Helmet>
                    <title>My Videos</title>
                </Helmet>
                <div id="hm_main_blk" className="col-sm-12 col-md-12 col-lg-10 col-xs-12">
                    <div className="hm-main-blk-ctnr">
                        <div id="hm_lft_dv" className="hm-lft-dv">
                            <div id="hm_frst_blk" className="hm-frst-blk">
                                <div className="hm-frst-blk-a">
                                    <Left 
                                        user={this.props.user}
                                        history={this.props.history}
                                        auth_data={this.props.auth_data}
                                        dispatch={this.props.dispatch}
                                        access_token={this.props.access_token}
                                        getImageFromCache={this.props.getImageFromCache}
                                        changeView={this.props.changeView}
                                        clientId={this.props.clientId}
                                        peerCon={this.props.peerCon}
                                        startCall={this.props.startCall}
                                        callWindow={this.props.callWindow}
                                        localSrc={this.props.localSrc}
                                        peerSrc={this.props.peerSrc}
                                        callConfig={this.props.callConfig}
                                        mediaDevice={this.props.peerCon.mediaDevice}
                                        endCall={this.props.endCall}
                                        fireUser={this.props.fireUser}
                                        firebase={this.props.firebase}
                                        toggleOnlineList={this.props.toggleOnlineList}
                                        />                                
                                </div>
                            </div>
                        </div>
                        <div id="home-center-div" className="home-center-div central-border col-xs-8 col-sm-8 col-md-6 col-lg-6">
                            <div className="wrp-vid-form">
                                <Form {...this.props} />
                            </div>
                            <div className="wrp-vid-list">
                                {!!this.props.videos && this.props.videos.map((video, i) => (
                                    <div key={i} className="wrp-vid-thumb">
                                        <div className="wrp-vid-thumb-a">
                                            <Link 
                                                onClick={this.handleVideoClick()}
                                                to={`/videos/{video.id}`} 
                                                className="wrp-vid-thumb-a">
                                                {!this.props.serverSide && 
                                                    <VideoThumb
                                                        video={video}
                                                        user={this.props.user}
                                                        history={this.props.history}
                                                        dispatch={this.props.dispatch}
                                                        access_token={this.props.access_token}
                                                        serverSide={serverSide}
                                                        newsRefs={newsRefs}
                                                        referIn="VideosHome"
                                                        />
                                                }
                                            </Link>
                                            {this.props.serverSide && 
                                                <VideoHolder />
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})

//// {isModalPhoto ? <Route path="/pictures/:id" children={() => <ModalPicture {...this.props} />} /> : null }                 

////////

/**
 * connect
 * Connects React component to a Redux store
 * Documentation: https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options
 */
export default  withRouter(connect(state => ({
    user: state.User.user,
    status: state.Photo.status,
    videosStore: state.Videos.videos,
    commentsStore: state.Comments.comments,
    // tokens: state.Tokens,
    // photos: state.Photos,
    // onboarding: state.Onboarding,
}))(VideosHome))