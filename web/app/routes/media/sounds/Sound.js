import React 				from 'react'
import { findDOMNode } 		from 'react-dom'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'
import { Helmet }  	        from 'react-helmet'

import { 
    Link, withRouter,
    Route, Switch,
    Redirect 
}                           from 'react-router-dom'
import {
	Foot, IntroPrev, SoundForm,
    Left, Right, Center
}                         	from './components'
import { 
	Sounds as SoundsActions 
}    						from '../../../actions'

import '../../../styles/media/sound.scss'


const Sound  = createReactClass( {

	getInitialState() {
		return {
			hasOwnDiary: false,
            screenWidth: 760,
            group: {},
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

    createMessageTo(usernames) {
    	this.props.createMessageTo(usernames);
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

    componentWillMount() {
        window.clearRequestTimeout(this.$scroll)
    },

    /**
     * componentDidMount
     */
    componentDidMount() {
        this.setState({
            screenWidth:  window.screen.width
        })
        const { user, postIds, dispatch } = this.props;
        findDOMNode(this._pageElm).addEventListener('scroll', this.handleScroll)

        // dispatch(PostsActions.load(user.id, postIds));   //redux saga
    },

    /**
     * componentWillUnmount
     */
    componentWillUnmount() {
        findDOMNode(this._pageElm).removeEventListener('scroll', this.handleScroll)
    },

    componentWillReceiveProps(nextProps) {
    	if(this.props.location !== nextProps.location) {
    		handleSearchChange(
    			this.props.dispatch,
    			nextProps.history,
    			nextProps.location
    		)
    	}
    },

	render() {
		const { 
            screenWidth, 
            newsRefs, loading 
        }                         = this.state,
		{ dispatch, user, serverSide }        = this.props

        if(loading) {
            return(
                <div className="hm-container group" ref={c => this._pageElm = c}>
                    <div className="ld-route-dta">loading</div>
                </div>
            )
        }

        /////////////////
		return (
			<div className="hm-container group" ref={c => this._pageElm = c}>
                <Helmet>
                    <title>Create an audio</title>
                </Helmet>
                <div id="hm_main_blk" className="col-sm-12 col-md-12 col-lg-10 col-xs-12">
                    <div className="hm-main-blk-ctnr"> 
                        <div id="hm_lft_dv" className="hm-lft-dv">
                            <div className="show-grp-plus">
                            </div>
                            <div id="hm_frst_blk" className="hm-frst-blk">
                                <div className="hm-lft-dv">
                                    <Left 
                                        {...this.props}
                                        user={user}
                                        screenWidth={screenWidth}
                                        />                                
                                </div>
                            </div>
                        </div>
                        <div id="home-center-div" className="home-center-div central-border col-xs-8 col-sm-8 col-md-6 col-lg-6">
                                <div  className="center-tp">
                                    <SoundForm 
                                        {...this.props} 
                                        user={user}
                                        />
                                </div>
                                <div  className="center-bd">
                                    <Center 
                                        {...this.props} 
                                        onShare={this.onShare} 
                                        onComment={this.onComment}
                                        onLike={this.onLike}
                                        home={false}
                                        newsRefs={newsRefs}
                                        onSideComment={this.onSideComment}
                                        screenWidth={screenWidth}
                                        referIn="sound"
                                        />
                                </div>
                        </div>
                        <div id="hm_rght_div" className="col-xs-4 col-sm-4 col-md-3 col-lg-2">
                            <div className="lft-dv">
                                <div className="lft-dv-a">
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
		)
	}
})


//////
export default  withRouter(connect(state =>({
	user: state.User.user,
	stream: state.Stream.stream,
}))(Sound))