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
    Left, Center, Right, ModalVideoConfirm 
}                                   from '../../../components/social/home'
import { Posts as PostsActions }    from '../../../actions/post'
import Foot                         from './components/Foot'

//import Actor from 'components/Activity/Actor'
import '../../../styles/social/home.scss'



const Home  = createReactClass({

    getInitialState() {
        return {
            hasOwnDiary: true,
            screenWidth: 760,
            newsRefs: [],
            noPostsResults: false,
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
        const { user, lastStreamId, dispatch } = this.props;
        findDOMNode(this._pageElm).addEventListener('scroll', this.handleScroll);

        import('../../../utils/OpinionStream').then(OpinionStream => {
            //this.stream = new OpinionStream(dispatch, user.id, lastStreamId);
        });
        import('../../../utils/StreamAnalytic').then(StreamAnalytic => {            
            //this._streamAnalytic = new StreamAnalytic(this.props.user); //TODO 
        });

        // this._opinionStream = new OpinionStream(dispatch, user.id, lastStreamId);
        // dispatch(PostsActions.load(user.id, postIds));   //redux saga
        // this._opinionStream.subscribeRealTime(user.id);
    },

    /**
     * componentWillUnmount
     */
    componentWillUnmount() {
        findDOMNode(this._pageElm).removeEventListener('scroll', this.handleScroll);
        // window.clearRequestTimeout(this.$scroll);
    },

    componentWillReceiveProps(nextProps) {
        if(this.props.user !== nextProps.user) {
            const { dispatch, user, postIds } = nextProps
            // dispatch(PostsActions.load(user.id, postIds));   //redux saga
        }

        if(this.props.newsRefs !== nextProps.newsRefs) {
            this.setState({newsRefs: nextProps.newsRefs})
        }
    },

    shouldComponentUpdate(nextProps, nextState) {
        return (this.props.user !== nextProps.user || 
            this.props.form_focus !== nextProps.form_focus ||
            this.props.edit_form_focus !== nextProps.edit_form_focus ||
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

    _fetchPostsStream() {
        // if (this._opinionStream._loading)
        //     return;

        // if(this._opinionStream._noResults) {
        //     this.setState({noPostsResults: true})
        //     return;
        // }

        // this._opinionStream.load();
    },

    /**
     * render
     * @returns {*|markup}
     */
    render() {
        const { location, dispatch, user, serverSide, access_token } = this.props,
        // picRoute = ~location.pathname.indexOf('/pictures/') ? true : false,
        { hasOwnDiary, newsRefs }  = this.state,
        userId                        = user.id;
        return (
            <div className="hm-container" ref={c => this._pageElm = c}>
                <Helmet>
                    <title>Opinion</title>
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
                            <Center 
                                home={true}
                                profile={null}
                                user={this.props.user}
                                history={this.props.history}
                                auth_data={this.props.auth_data}
                                dispatch={this.props.dispatch}
                                access_token={this.props.access_token}
                                getImageFromCache={this.props.getImageFromCache}
                                timelineId={user.id}
                                location={location}
                                serverSide={serverSide}
                                newsRefs={newsRefs}
                                onLike={this.onLike}
                                onShare={this.onShare} 
                                onComment={this.onComment}
                                form_focus={this.props.form_focus}
                                edit_form_focus={this.props.edit_form_focus}
                                fetchPosts={this._fetchPostsStream}
                                postFormFocus={this.postFormFocus}
                                editPostFormFocus={this.editPostFormFocus}
                                onSideComment={this.onSideComment}
                                getImageFromCache={this.getImageFromCache}
                                referIn="home"
                                timelineType='user'
                                match={this.props.match}
                                />
                        </div>
                        <div id="hm_rght_div" className="col-xs-4 col-sm-4 col-md-3 col-lg-2">
                            {this.props.screenWidth > 992 && 
                                <div className="lft-dv">
                                    <div className="lft-dv-a">
                                        <Diary 
                                            dispatch={dispatch}
                                            forUserId={userId}
                                            hasOwnDiary= {hasOwnDiary}
                                            />
                                        <SuggestUsers 
                                            user={this.props.user}
                                            history={this.props.history}
                                            auth_data={this.props.auth_data}
                                            dispatch={this.props.dispatch}
                                            access_token={this.props.access_token}
                                            getImageFromCache={this.props.getImageFromCache}

                                            onFriendConfirm={this.onFriendConfirm}
                                            onFollowRequest={this.onFriendRequest}
                                            onFriendRequest={this.onFriendRequest}
                                            onUnFollowRequest={this.onUnFollowRequest}
                                            onDeleteInvitation={this.onDeleteInvitation}
                                            />
                                        <Foot dispatch={this.props.dispatch} />                                
                                    </div>
                                </div>
                            }                                  
                        </div>
                    </div>
                </div>

                {this.props.screenWidth > 1300 && 
                    <div id="hm_scond_blk" className="col-xs-1 col-sm-1 col-md-1 col-lg-2">
                        <Right 
                            home={true}
                            profile={null}
                            user={this.props.user}
                            history={this.props.history}
                            auth_data={this.props.auth_data}
                            dispatch={this.props.dispatch}
                            access_token={this.props.access_token}
                            getImageFromCache={this.props.getImageFromCache}
                            timelineId={user.id}
                            location={location}

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

//// {isModalPhoto ? <Route path="/pictures/:id" children={() => <ModalPicture {...this.props} />} /> : null }                 

////////

/**
 * connect
 * Connects React component to a Redux store
 * Documentation: https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options
 */
export default  withRouter(connect(state => ({
    user:               state.User.user,
    postIds:            state.Posts.postIds,
    newsRefs:           state.User.newsRefs,
    // tokens: state.Tokens,
    // photos: state.Photos,
    // onboarding: state.Onboarding,
}))(Home))
