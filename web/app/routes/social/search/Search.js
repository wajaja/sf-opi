import React                from 'react'
import createReactClass     from 'create-react-class'
import { findDOMNode }      from 'react-dom'
import { connect }          from 'react-redux'
import { Helmet }           from 'react-helmet'
import { bindActionCreators } from 'redux'
import { Link, withRouter, 
    Switch, Route }             from 'react-router-dom'
import { 
    Left, Center, Right 
}                                   from './components'
import { getUrlParameterByName }    from '../../../utils/funcs'
import { 
    Posts as PostsActions,
    Search as SearchActions 
}                                   from '../../../actions'
import Foot                         from './components/Foot'

//import Actor from 'components/Activity/Actor'
import '../../../styles/social/search.scss'

// import {
//     User as UserActions,
//     Photos as PhotosActions,
//     Profile as ProfileActions,
// } from 'actions'

/**
 * handleRouteChange
 * @param dispatch
 * @param history
 * @param location
 */
function handleSearchChange(dispatch, history, location) {
    const pathname = location.pathname,
    tag = getUrlParameterByName('tag', location.search) //['infos, photos, relations']

    if(pathname.indexOf('/grouppic')) {
        console.log('ProfilePic')
    } else if(pathname.indexOf('/relations')) {
        console.log('relations')
    } else if(pathname.indexOf('/infos')) {
        console.log('infos')
    } else {
        
    }
}

/**
 * Home
 * '/'
 * React Route - Documentation: https://github.com/reactjs/react-router/tree/master/docs
 * @UserIsAuthenticated
 */
const Search  = createReactClass({

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
        const { user, postIds, dispatch, } = this.props;
        findDOMNode(this._pageElm).addEventListener('scroll', this.handleScroll)

        // dispatch(PostsActions.load(user.id, postIds));   //redux saga
        // import('./../utils/OpinionStream').then(OpinionStream => {
        //     this.stream = new OpinionStream(dispatch, user.id, lastStreamId);
        // });
        // import('./../utils/StreamAnalytic').then(StreamAnalytic => {            
        //     //this._streamAnalytic = new StreamAnalytic(this.props.user); //TODO 
        // });
    },

    /**
     * componentWillUnmount
     */
    componentWillUnmount() {
        window.clearRequestTimeout(this.$scroll)
        findDOMNode(this._pageElm).removeEventListener('scroll', this.handleScroll)
    },

    componentWillReceiveProps(nextProps) {
        if(this.props.user !== nextProps.user) {
            const { dispatch, user, postIds } = nextProps
            // dispatch(PostsActions.load(user.id, postIds));   //redux saga
        }
    },

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.search !== nextProps.search ||
               this.props.location.search !== nextProps.location.search
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

        const { dispatch, user, location }      = this.props,
        { hasOwnDiary, screenWidth, newsRefs }  = this.state,
        userId                        = user.id,
        q = getUrlParameterByName('q', location.search),
        tag = getUrlParameterByName('tag', location.search)
        return (
            <div className="hm-container search" ref={c => this._pageElm = c}>
                <Helmet>
                    <title>{`Search . ${q}`}</title>
                </Helmet>
                <div id="hm_main_blk" className="col-sm-12 col-md-12 col-lg-10 col-xs-12">
                    <div className="hm-main-blk-ctnr">
                        <div id="hm_lft_dv" className="hm-lft-dv">
                            {screenWidth > 760 && 
                                <div id="hm_frst_blk" className="hm-frst-blk">
                                    <div className="hm-frst-blk-a">
                                        <Left 
                                            {...this.props}
                                            q={q}
                                            screenWidth={screenWidth}
                                            />                                
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="home-center-div central-border">
                            <Center 
                                {...this.props} 
                                q={q}
                                tag={tag}
                                home={true}
                                onShare={this.onShare} 
                                onComment={this.onComment}
                                onLike={this.onLike}
                                profile={null}
                                newsRefs={newsRefs}
                                onSideComment={this.onSideComment}
                                screenWidth={screenWidth}
                                onFriendConfirm={this.onFriendConfirm}
                                onFriendRequest={this.onFriendRequest}
                                onFollowRequest={this.onFollowRequest}
                                onUnFollowRequest={this.onUnFollowRequest}
                                onDeleteInvitation={this.onDeleteInvitation}
                                />
                        </div>
                    </div>
                </div>

                {screenWidth > 1302 && 
                    <div className="null">
                        
                    </div>
                }
                <div className={this.props.postFormFocus ? `gl-frm-out out-active` : `gl-frm-out`}></div>
                <div className={this.props.editPostFormFocus ? `edt-pst-out out-active` : `edt-pst-out`}></div>
            </div>
        )
    }
})

const mapStateToProps = (state, { }) => {
    const search = state.Search;
    return {
        user:  state.User.user,
        search: search,
        postIds:  state.Posts.postIds,
        newsRefs:   search.newsRefs,
        postFormFocus:  state.App.postFormFocus,
        editPostFormFocus:  state.App.editPostFormFocus
    }
}

////////
function mapDispatchToProps(dispatch) {
    return {
        searchActions: bindActionCreators(SearchActions, dispatch),
    }
}

/**
 * connect
 * Connects React component to a Redux store
 * Documentation: https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options
 */
export default  withRouter(connect(mapStateToProps, mapDispatchToProps)(Search))
