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
import { push }             from 'react-router-redux';
import { 
    Left,
    Right, 
}                           from './components'

import {
	Foot, IntroPrev, SoundForm,
}                         	from './components'
import { 
	Sounds as SoundsActions 
}    						from '../../../actions'

import { getUrlParameterByName } from '../../../utils/funcs'


import '../../../styles/media/sound.scss'


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

const Sound  = createReactClass( {

	getInitialState() {
		return {
			hasOwnDiary: false,
            screenWidth: 760,
            group: {},
            loading: true,
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
		{ dispatch, user }        = this.props

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
                                <div className="show-grp-plus-a">
                                    <div className="show-grp-plus-intro">
                                        <IntroPrev
                                            {...this.props} 
                                            group={group}
                                            user={user}
                                            />
                                    </div>                              
                                    <Foot 
                                        {...this.props} 
                                        />
                                </div>
                            </div>
                            <div id="hm_frst_blk" className="hm-frst-blk">
                                <div className="hm-lft-dv">
                                    <Left 
                                        {...this.props}
                                        user={user}
                                        screenWidth={screenWidth}
                                        group={group}
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
                <div className={this.props.postFormFocus ? `gl-frm-out out-active` : `gl-frm-out`}></div>
                <div className={this.props.editPostFormFocus ? `edt-pst-out out-active` : `edt-pst-out`}></div>
                <ModalVideoConfirm />
            </div>
		)
	}
})


//////
export default  withRouter(connect(state =>({
	user: state.User.user,
	groups: state.Profiles.users,
}))(Sound))