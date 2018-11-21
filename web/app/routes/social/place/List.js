import React 				from 'react'
import { findDOMNode } 		from 'react-dom'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'
import { fromJS, Map }  	from 'immutable'

import { Link, withRouter } from 'react-router-dom'
import { push } from 'react-router-redux';

import Left 				from './Left'
import Right                from './Right'
import {
	Foot, GroupBox, NavLinks
}                         	from './components'
import { 
	Places as PlacesActions 
}    						from '../../../actions'

import { 
    PlaceForm
}                           from '../../../components'

import { getUrlParameterByName } from '../../../utils/funcs'


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

const Head = (props) => {
    const { user, handleGroupSubmit, updateRecipients } = props,

    imageStyle = {
        width: '400px',
    }
    return(
        <div className="plc-top-a" >
            <div className="plc-top-b">
                <div className="plc-top-content">
                    <PlaceForm 
                        {...props}
                        user={user}
                        onSubmit={handlePlaceSubmit}
                        />
                </div>
            </div>
        </div>
    )
}

const List  = createReactClass( {

	getInitialState() {
		return {
			hasOwnDiary: false,
            screenWidth: 760,
            group: {},
            loading: true,
            recipients: [],
		}
	},

    handlePlaceSubmit(e) {
        e.preventDefault();
        const name = this.props.placeForm.values.name,
        data = {
            name: name,
        }
        this.props.createPlace(data);
    },

    /**
     * handleScroll
     * @param e event
     */
    handleScroll(e) {

        if (this.$scroll) window.clearRequestTimeout(this.$scroll)

        this.$scroll = window.requestTimeout(() => {

            const d = findDOMNode(this)
            const threshold = (d.offsetHeight / 2)

            if ((d.scrollTop + d.offsetHeight) >= (d.scrollHeight - threshold)) {
                this.props.onFetch()
            }

        }, 25)
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
        findDOMNode(this).addEventListener('scroll', this.handleScroll)

        // dispatch(PostsActions.load(user.id, postIds));   //redux saga
    },

    /**
     * componentWillUnmount
     */
    componentWillUnmount() {
        window.clearRequestTimeout(this.$scroll)
        findDOMNode(this).removeEventListener('scroll', this.handleScroll)
    },

    componentWillReceiveProps(nextProps) {
    	if(this.props.groups !== nextProps.groups) {
    		//this.updateProfile(nextProps);
    	}

    	if(this.props.location !== nextProps.location) {
    		handleSearchChange(
    			this.props.dispatch,
    			nextProps.history,
    			nextProps.location
    		)
    	}
    },

    shouldComponentUpdate(nextProps) {
        return this.props.list !== nextProps.list;
    },

	render() {
		const { 
            hasOwnDiary, screenWidth, 
            loading 
        }                         = this.state,
		{ dispatch, user, list }        = this.props

        /////////////////
		return (
			<div className="hm-container group" ref={c => this._pageElm = c}>
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
                        <div id="home-center-div" className="home-center-div central-border">
                            <div  className="center-tp">
                                <Head 
                                    {...this.props} 
                                    user={user}
                                    handlePlaceSubmit={this.handlePlaceSubmit}
                                    />
                            </div>
                            <div  className="center-bd">
                                {list.map(function(place, i) {
                                    return(
                                        <PlaceBox 
                                            {...this.props} 
                                            key={i}
                                            home={false}
                                            place={place}
                                            referIn="place"
                                            />
                                    )
                                })}

                                {!list.length && 
                                    <div  className="center-bd-empt-lst">
                                        <div  className="empt-lst-a">
                                            no suggestion
                                        </div> 
                                    </div> 
                                }
                            </div>
                        </div>
                    </div>
                </div>

                {screenWidth > 992 && 
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
            </div>
		)
	}
})


//////
export default  withRouter(connect(state =>({
	user: state.User.user,
	list: state.Places.list,
}))(List))