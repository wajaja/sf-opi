import React 				from 'react'
import { findDOMNode } 		from 'react-dom'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'
import { bindActionCreators } from 'redux'
import { Helmet }           from "react-helmet";
import { Link, withRouter } from 'react-router-dom'
import {
	Left, Center,
}                         	from './components'
import { 
    Setting as SettingActions, 
}    						from '../../../actions'

import { getUrlParameterByName } from '../../../utils/funcs'

import '../../../styles/user/setting.scss'
const inArray = require('in-array');

/**
 * handleRouteChange
 * @param dispatch
 * @param history
 * @param location
 */
function handleSearchChange(dispatch, history, location) {
    const pathname = location.pathname,
    tag = getUrlParameterByName('tag', location.search)

    //call function (Action) like => SettingActions.contact();
    if(tag === 'security')
        dispatch(SettingActions.security())
    else if (tag === 'notification')
        dispatch(SettingActions.notification())
    else if(tag === 'contact')
        dispatch(SettingActions.contact())
    else if(tag === 'general')
        dispatch(SettingActions.general())
    else if(tag === 'adress')
        dispatch(SettingActions.adress())
    else if(tag === 'aboutme')
        dispatch(SettingActions.aboutme())
}

const Setting  = createReactClass( {

	getInitialState() {
		return {
			hasOwnDiary: false,
            screenWidth: 760,
            profile: {},
            tagsArr: ['general', 'security', 'aboutme', 'adress', 'contact', 'notification']
		}
	},

    /**
     * handleScroll
     * @param e event
     */
    handleScroll(e) {

        if (this.$scroll) window.clearRequestTimeout(this.$scroll);

        this.$scroll = window.requestTimeout(() => {

            const d = findDOMNode(this)
            const threshold = (d.offsetHeight / 2)

            if ((d.scrollTop + d.offsetHeight) >= (d.scrollHeight - threshold)) {
                this.props.onFetch()
            }

        }, 25)
    },

    updateProfile(props) {
    	// const { 
    	// 	match : { 
    	// 		params : { 
    	// 			username 
    	// 		} 
    	// 	}, 
    	// 	profiles 
    	// } 				= props
    	// this.setState({
    	// 	profile: profiles[username].user,
    	// 	newsRefs: profiles[username].newsRefs,
    	// 	photos: profiles[username].photos,
    	// })
    },

    componentWillMount() {
        // this.updateProfile(this.props);
    },

    /**
     * componentDidMount
     */
    componentDidMount() {
        this.setState({
            screenWidth:  window.screen.width
        })
        // const { user, postIds, dispatch } = this.props;
        findDOMNode(this).addEventListener('scroll', this.handleScroll)
        const tag = getUrlParameterByName('tag', this.props.location.search)
        //check if the current query search exist in allowed array of setting searchs
        if(!inArray(this.state.tagsArr, tag)){
            this.props.history.push('/settings/?tag=general')
        }

        // dispatch(PostsActions.load(user.id, postIds));   //redux saga
    },

    /**
     * componentWillUnmount
     */
    componentWillUnmount() {
        window.clearRequestTimeout(this.$scroll);
        findDOMNode(this).removeEventListener('scroll', this.handleScroll)
    },

    componentWillReceiveProps(nextProps) {
    	// if(this.props.profiles !== nextProps.profiles) {
    	// 	this.updateProfile(nextProps);
    	// }

    	if(this.props.location !== nextProps.location) {
    		handleSearchChange(
    			this.props.dispatch,
    			nextProps.history,
    			nextProps.location
    		)
    	}

        // // firebase Password Reset
        // fireAuth.sendPasswordResetEmail(email);

        // // firebase Password Change
        // fireAuth.currentUser.updatePassword(password);
    },

    shouldComponentUpdate(nextProps) {
        return this.props.location !== nextProps.location
    },

	render() {
		const { screenWidth, } = this.state
		const { dispatch, user } = this.props

		return (
			<div className="hm-container setting" ref={c => this._pageElm = c}>
                <Helmet>
                    <title>Setting</title>
                </Helmet>
                <div id="sttg_main_blk" className="sttg-main-blk">
                    <div className="sttg-main-blk-ctnr"> 
                        <div className="sttg-lft-dv">
                            <div className="sttg-frst-blk">
                                <div className="sttg-lft-dv">
                                    <Left 
                                        {...this.props}
                                        user={user}
                                        screenWidth={screenWidth}
                                        />                                
                                </div>
                            </div>
                        </div>
                        <div className="sttg-center-div central-border">
                            <div className="sttg-center-div-a central-border-a">
                                <Center 
                                    {...this.props} 
                                    onShare={this.onShare} 
                                    onComment={this.onComment}
                                    onLike={this.onLike}
                                    home={false}
                                    onSideComment={this.onSideComment}
                                    screenWidth={screenWidth}
                                    referIn="profile"
                                    />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
		)
	}
})

///////
function mapDispatchToProps(dispatch) {
    return  bindActionCreators(Object.assign({}, SettingActions), dispatch)
}


//////
export default  withRouter(connect(state =>({
	user: state.User.user,
}), mapDispatchToProps)(Setting))