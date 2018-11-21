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
import { 
    ModalVideoConfirm, 
    Center,
    Right, 
}                           from '../../../components/social/home'

import Left 				from './Left'
import List                 from './List'
import New                  from './New'
import GroupName            from './GroupName'
import { 
	Groups as GroupsActions 
}    						from '../../../actions'

import { getUrlParameterByName } from '../../../utils/funcs'


import '../../../styles/user/group.scss'


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

const Group  = createReactClass( {

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

    postFormFocus(val) {
        this.props.postFormFocus(val)
    },

    editPostFormFocus(val) {
        this.props.editPostFormFocus(val)
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

            const d = findDOMNode(this)
            const threshold = (d.offsetHeight / 2)

            if ((d.scrollTop + d.offsetHeight) >= (d.scrollHeight - threshold)) {
                this.props.onFetch()
            }

        }, 25)
    },

    updateGroup(props) {
    	const { match : { params : { id } }, groups } = props,
        group = groups[id];

        if(!!group) {
        	this.setState({
        		group: groups[id].group,
        		newsRefs: groups[id].newsRefs,
        		photos: groups[id].photos,
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
        window.clearRequestTimeout(this.$scroll);
        findDOMNode(this).removeEventListener('scroll', this.handleScroll)
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
            hasOwnDiary, screenWidth, 
            group, newsRefs, 
            photos, 
        }                         = this.state,
		{ dispatch, user }        = this.props

        /////////////////
		return (
			<Switch>
                <Route exact path='/groups/list' children={() => <List {...this.props} />} />
                <Route exact path='/groups/new' children={() => <New {...this.props} />} />
                <Route exact path="/groups/:id" 
                    children={() => 
                        <GroupName 
                            {...this.props} 
                            postFormFocus={this.postFormFocus}
                            editPostFormFocus={this.editPostFormFocus}
                            onFollowRequest={this.onFollowRequest}
                            onFriendConfirm={this.onFriendConfirm}
                            onFriendRequest={this.onFriendRequest}
                            onDeleteInvitation={this.onDeleteInvitation}
                            onUnFollowRequest={this.onUnFollowRequest}
                        />
                    } 
                />
                <Redirect to='/groups/new' />
            </Switch>
		)
	}
})

//////
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Object.assign({}, GroupsActions), dispatch)
}


//////
export default  withRouter(connect(state =>({
	user: state.User.user,
	groups: state.Groups.groups,
}), mapDispatchToProps)(Group))