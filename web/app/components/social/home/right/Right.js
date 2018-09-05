import React                    from 'react'
import createReactClass         from 'create-react-class'
import { connect }              from 'react-redux'

import { LiveActivities, Diary, TVChannel,
         SuggestUsers, }        from '../../../../components'
import Foot                     from './Foot'

import '../../../../styles/social/right/right.scss'
import '../../../../styles/social/right/activities.scss'


const Right  = createReactClass({
	
	getInitialState() {
		return {
            hasOwnDiary: true,
        }
	},

    componentDidMount() {

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

	render() {
        const { screenWidth, dispatch, user } = this.props,
        { hasOwnDiary }                 = this.state,
        userId                              = user.id;

        if(!userId) return <div />

		return (
			<div id="h-r-dv" className="h-r-dv">
                <div className="h-r-dv-ctnr">
                    {screenWidth > 992 && 
                        <div className="rght-dv">
                            <div className="rght-dv-a">
                                <TVChannel 
                                    dispatch={dispatch}
                                    />
                                <div className="sep-dv"></div>
                                <LiveActivities 
                                    dispatch={dispatch}
                                    />
                                <div className="sep-dv"></div>                                
                            </div>
                        </div>
                    }
                </div>
            </div>
		)
	}
})

export default connect(state =>({
    user: state.User.user,
}))(Right)