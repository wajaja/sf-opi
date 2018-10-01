import React                from 'react'
import createReactClass     from 'create-react-class'
import { findDOMNode }      from 'react-dom'
import { connect }          from 'react-redux'
import { Helmet }           from 'react-helmet'
import { withRouter }       from 'react-router-dom'
import { 
    Left,
}                            from '../notification/components'
import Foot                  from './Foot'

//import Actor from 'components/Activity/Actor'
import '../../../styles/social/not-matched.scss'


const NotMatched  = createReactClass({

    getInitialState() {
        return {
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
        // picRoute = ~location.pathname.indexOf('/pictures/') ? true : false,
        { hasOwnDiary, newsRefs }  = this.state
        return (
            <div className="hm-container notMatched">
                <Helmet>
                    <title>NotMatched</title>
                </Helmet>
                <div className="hm-main-blk-ctnr">
                    <div className="hm-main-blk-ctnr-a">
                        <div className="home-center-div central-border">
                            <div className="not-found-dv">
                                <div className="not-found-dv-a">
                                    Not Matched
                                </div>
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
    user:               state.User.user,
    // tokens: state.Tokens,
    // photos: state.Photos,
    // onboarding: state.Onboarding,
}))(NotMatched))
