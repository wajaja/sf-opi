import React                from 'react'
import createReactClass     from 'create-react-class'
import { findDOMNode }      from 'react-dom'
import { connect }          from 'react-redux'
import { Helmet }           from 'react-helmet'
import { Link, withRouter,
         Switch, Route }    from 'react-router-dom'

import { LiveActivities, Diary, TVChannel,
         SuggestUsers, }            from '../../../components'
import { 
    Center, Right, ModalVideoConfirm 
}                                   from '../../../components/social/home'
import { Left, Foot }                    from './components'
import { UserIsAuthenticated }      from '../../../utils/auth/authWrappers'
import { Posts as PostsActions }    from '../../../actions/post'

//import Actor from 'components/Activity/Actor'
import '../../../styles/social/hashtag.scss'


/**
 * Home
 * '/'
 * React Route - Documentation: https://github.com/reactjs/react-router/tree/master/docs
 * @UserIsAuthenticated
 */
const Hashtag  = createReactClass({

    getInitialState() {
        return {
            hasOwnDiary: true,
            screenWidth: 760,
        }
    },


    onShare(postId, refer) {
        this.props.onShare(postId, refer)
    },

    onComment(comment, post) {
        this.props.onComment(comment, post)
    },

    onSideComment(comment, side, post) {
        this.props.onSideComment(comment, side, post)
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

    postFormFocus(val) {
        this.props.postFormFocus(val)
    },

    editPostFormFocus(val) {
        this.props.editPostFormFocus(val)
    },

    getImageFromCache(filename, galleryDir) {
        this.props.getImageFromCache(filename, galleryDir)
    },
    /**
     * handleLike
     * @param data
     */
    // handleLike = (data) {
    //     this.props.dispatch(PhotosActions[data.liked ? 'like' : 'unlike'](data.id))
    // }

    /**
     * handleFetch
     */
    // handleFetch () {
    //     this.props.dispatch(PhotosActions.paginate())
    // }

    // handleLoadHidden () {
    //     this.props.dispatch(PhotosActions.loadHidden())
    // }

    // handleFollow = userID => {
    //     this.props.dispatch(ProfileActions.follow(userID)).then(followed => {
    //         this.props.dispatch(PhotosActions.reload())
    //     })

    // }

    /**
     * handleScroll
     * @param e event
     */
    handleScroll(e) {

        if (this.$scroll) window.clearRequestTimeout(this.$scroll)

        this.$scroll = window.requestTimeout(() => {

            const d = findDOMNode(this._pageElm)
            const threshold = (d.offsetHeight / 2)

            if ((d.scrollTop + d.offsetHeight) >= (d.scrollHeight - threshold)) {
                this.props.onFetch()
            }

        }, 25)
    },

    componentWillMount() {
        // this.screenWidth =  window.screen.width
        //far make more operations for newsRefs
        this.setState({
            newsRefs: this.props.newsRefs,
        })
    },

    /**
     * componentDidMount
     */
    componentDidMount() {
        import('../../../utils/OpinionStream').then(OpinionStream => {
            this.stream = new OpinionStream();
        });
        this.setState({
            screenWidth:  window.screen.width
        })
        const { user, dispatch } = this.props;
        findDOMNode(this._pageElm).addEventListener('scroll', this.handleScroll);
    },

    /**
     * componentWillUnmount
     */
    componentWillUnmount() {
        findDOMNode(this._pageElm).removeEventListener('scroll', this.handleScroll)
        window.clearRequestTimeout(this.$scroll);
    },

    componentWillReceiveProps(nextProps) {
        if(this.props.user !== nextProps.user) {
            const { dispatch, user } = nextProps
        }
    },


    /**
     * handleRefresh
     * @param e event
     */
    handleRefresh(e) {
        this.props.onLoadHidden()
    },

    shouldComponentUpdate(nextProps) {
        return this.props.newsRefs !== nextProps.nextProps ||
            this.props.match !== nextProps.match
    },

    /**
     * render
     * @returns {*|markup}
     */
    render() {

        const { dispatch, user, match: {params } }      = this.props,
        { hasOwnDiary, screenWidth, newsRefs }  = this.state,
        userId                        = user.id;
        return (
            <div className="hm-container" ref={c => this._pageElm = c}>
                <Helmet>
                    <title>Hashtag {params.word}</title>
                </Helmet>
                <div id="hm_main_blk" className="col-sm-12 col-md-12 col-lg-10 col-xs-12">
                    <div className="hm-main-blk-ctnr">
                        <div id="hm_lft_dv" className="hm-lft-dv">
                            {screenWidth > 760 && 
                                <div id="hm_frst_blk" className="hm-frst-blk">
                                    <div className="hm-frst-blk-a">
                                        <Left 
                                            {...this.props}
                                            screenWidth={screenWidth}
                                            />                                
                                    </div>
                                </div>
                            }
                        </div>
                        <div id="home-center-div" className="home-center-div central-border col-xs-8 col-sm-8 col-md-6 col-lg-6">
                            <Center 
                                {...this.props} 
                                home={null}
                                profile={null}
                                hashtag={true}
                                newsRefs={newsRefs}
                                onLike={this.onLike}
                                onShare={this.onShare} 
                                screenWidth={screenWidth}
                                onComment={this.onComment}
                                postFormFocus={this.postFormFocus}
                                editPostFormFocus={this.editPostFormFocus}
                                onSideComment={this.onSideComment}
                                getImageFromCache={this.getImageFromCache}
                                referIn="home"
                                timelineId={user.id}
                                timelineType='user'
                                />
                        </div>
                        <div id="hm_rght_div" className="col-xs-4 col-sm-4 col-md-3 col-lg-2">
                            {screenWidth > 992 && 
                                <div className="lft-dv">
                                    <div className="lft-dv-a">
                                        <SuggestUsers 
                                            dispatch={dispatch}
                                            onFriendConfirm={this.onFriendConfirm}
                                            onFollowRequest={this.onFriendRequest}
                                            onFriendRequest={this.onFriendRequest}
                                            onUnFollowRequest={this.onUnFollowRequest}
                                            onDeleteInvitation={this.onDeleteInvitation}
                                            {...this.props} 
                                            />
                                        <Foot />                                
                                    </div>
                                </div>
                            }                                  
                        </div>
                    </div>
                </div>

                {screenWidth > 1300 && 
                    <div id="hm_scond_blk" className="col-xs-1 col-sm-1 col-md-1 col-lg-2">
                        <Right 
                            {...this.props} 
                            screenWidth={screenWidth}
                            onFriendConfirm={this.onFriendConfirm}
                            onFriendRequest={this.onFriendRequest}
                            onFollowRequest={this.onFollowRequest}
                            onUnFollowRequest={this.onUnFollowRequest}
                            onDeleteInvitation={this.onDeleteInvitation}
                            />
                    </div>
                }
                <ModalVideoConfirm />
            </div>
        )
    }
})

////////

/**
 * connect
 * Connects React component to a Redux store
 * Documentation: https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options
 */
export default  withRouter(connect(state => ({
    tag: null,
    term: state.Search.term,
    user:  state.User.user,
    search: state.Search,
    postIds:  state.Posts.postIds,
    newsRefs:   state.Search.newsRefs,
    postFormFocus:  state.App.postFormFocus,
    editPostFormFocus:  state.App.editPostFormFocus
}))(Hashtag))
