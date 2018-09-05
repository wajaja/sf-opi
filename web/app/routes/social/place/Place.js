import React 				from 'react'
import { findDOMNode } 		from 'react-dom'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'
import { fromJS, Map }  	from 'immutable'
import { bindActionCreators } from 'redux'

import { 
    Link, withRouter,
    Route, Switch,
    Redirect 
}                           from 'react-router-dom'
import { push }             from 'react-router-redux';

import { LiveActivities, 
		 Diary, TVChannel,
}            				from '../../../components'
import { 
    ModalVideoConfirm, 
    Center,
    Right, 
}                           from '../../../components/social/home'

import Left 				from './Left'
import List                 from './List'
import New                  from './New'
import PlaceName            from './PlaceName'
import {
	Foot, IntroPrev, PhotosPrev, StickyMenu,
	StickyNavLinks, Head, MembersPrev,
    OptionsPrev,
}                         	from './components'
import { 
	Posts as PostsActions,
	Places as PlacesActions 
}    						from '../../../actions'

import { getUrlParameterByName } from '../../../utils/funcs'


/**
 * handleRouteChange
 * @param dispatch
 * @param history
 * @param location
 */
function handleSearchChange(dispatch, history, location) {
    const pathname = location.pathname,
    tag = getUrlParameterByName('tag', location.search) //['infos, photos, relations']

    if(pathname.indexOf('/placepic')) {
        console.log('ProfilePic')
    } else if(pathname.indexOf('/relations')) {
        console.log('relations')
    } else if(pathname.indexOf('/infos')) {
        console.log('infos')
    } else {
        
    }
}

const Place  = createReactClass( {

	getInitialState() {
		return {
			hasOwnDiary: false,
            screenWidth: 760,
            place: {},
		}
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

    updatePlace(props) {
    	const { match : { params : { id } }, places } = props,
        place = places[id];

        if(!!place) {
        	this.setState({
        		place: places[id].place,
        		newsRefs: places[id].newsRefs,
        		photos: places[id].photos,
        	})
        } else {
            // this.setState({ loading: true })
        }
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
        const { user, postIds, dispatch } = this.props;

        // dispatch(PostsActions.load(user.id, postIds));   //redux saga
    },

    /**
     * componentWillUnmount
     */
    componentWillUnmount() {
        window.clearRequestTimeout(this.$scroll)
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

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.place !== nextProps.place;
    },

	render() {
		const { 
            hasOwnDiary, screenWidth, 
            place, newsRefs, 
            photos, 
        }                         = this.state,
		{ dispatch, user }        = this.props

        /////////////////
		return (
			<Switch>
                <Route exact strict path='/places/list' children={() => <List {...this.props} />} />
                <Route exact strict path='/places/new' children={() => <New {...this.props} />} />
                <Route exact path={`/places/${name}`} 
                    children={() => 
                        <PlaceName 
                            onFollowRequest={this.onFollowRequest}
                            onFriendConfirm={this.onFriendConfirm}
                            onFriendRequest={this.onFriendRequest}
                            onDeleteInvitation={this.onDeleteInvitation}
                            onUnFollowRequest={this.onUnFollowRequest}
                            {...this.props} 
                        />
                    } 
                />
                <Redirect to='/places/new' />
            </Switch>
		)
	}
})

//////
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Object.assign({}, PlacesActions), dispatch)
}


//////
export default  withRouter(connect(state =>({
	user: state.User.user,
	places: state.Places.places,
}), mapDispatchToProps)(Place))