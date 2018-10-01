import React 				from 'react'
import { findDOMNode } 		from 'react-dom'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'
import { Helmet }           from 'react-helmet'
import { withRouter }       from 'react-router-dom'
import { push } from 'react-router-redux';

import {
	Left, Right, NavLinks, Option
}                         	from './components'
import { 
	Posts as PostsActions,
}    						from '../../../../actions/post'

import { getUrlParameterByName } from '../../../../utils/funcs'
const Post = require('../../../../components/post/post/Basic').default,
Picture  = require('../../../../routes/media/pictures/Picture').default,
Video    = require('../../../../routes/media/videos/Video').default;

import '../../../../styles/post/post.scss'


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

const Basic  = createReactClass( {

	getInitialState() {
		return {
			hasOwnDiary: false,
            screenWidth: 760,
            loading: true,
		}
	},

    scrollToTop() {
        findDOMNode(this).scrollTop = 0
    },

    scrollToBottom() {
        this.postEnd.scrollIntoView({ behavior: "smooth" });
    },

    /**
     * handleScroll
     * @param e event
     */
    handleScroll(e) {
        
    },

    componentWillMount() {
        
    },

    /**
     * componentDidMount
     */
    componentDidMount() {
        this.setState({
            screenWidth:  window.screen.width
        })
        //findDOMNode(this._pageElm).addEventListener('scroll', this.handleScroll)
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
            screenWidth, loading 
        }                         = this.state,
		{ dispatch, user, post }        = this.props

        /////////////////
		return (
			<div className="hm-container post" ref={c => this._pageElm = c}>
                <Helmet>
                    <title>Publication of {post.author.firstname}</title>
                </Helmet>
                <div id="hm_main_blk" className="col-sm-12 col-md-12 col-lg-10 col-xs-12">
                    <div className="hm-main-blk-ctnr"> 
                    	<div className="hm-lft-dv">
                            <div className="hm-frst-blk">
                                <div className="hm-frst-blk-a">
                                    <Left 
                                        {...this.props}
                                        user={user}
                                        screenWidth={screenWidth}
                                        />                                
                                </div>
                            </div>
                    	</div>
                        <div className="cter-dv">
                            <div  className="center-bd">
                                <div className="center-bd-a">
                                    <Post 
                                        {...this.props}
                                        fullPage={true}
                                        post={post} 
                                        />
                                </div>
                                <div style={{ float:"left", clear: "both" }}
                                     ref={(el) => { this.postEnd = el; }}>
                                </div>
                            </div>
                        </div>
                        <div className="rght-dv-abs">
                            <Option
                                {...this.props} 
                                showBestComments={this.showBestComments}
                                showSecret={this.showSecret}
                                showLikes={this.showLikes}
                                post={this.props.post}
                                user={user}
                                />
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
}))(Basic))