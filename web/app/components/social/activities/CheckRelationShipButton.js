import React 			from 'react'
import createReactClass from 'create-react-class'
import _ 				from 'lodash'
import { FriendButton } from '../activities'

const CheckRelationShipButton = createReactClass({

	getInitialState() {
		return{

		}
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
		const { profile, user, } 	= this.props,
		followedIds 	= _.forEach(user.my_followeds, f => f.id ),
		followerIds 	= _.forEach(user.my_followers, f => f.id ),
		isFriend 		= _.indexOf(user.my_friends_ids, profile.id),
		isBlocked 		= _.indexOf(user.blockeds_with_me_ids, profile.id),
		requestToMe 	= _.indexOf(user.requests_from_users_ids, profile.id),
		requestFromMe   = _.indexOf(user.requests_to_users_ids, profile.id),
		isFollowed 		= _.indexOf(followedIds, profile.id),
		isFollower 		= _.indexOf(followerIds, profile.id);

		if(isFriend) {
			return(
				<div className="wrp-relship">
				    <div className="is-fri">
	    			 	<div className="is-fri">
	    			 	 	friend
					 	</div> 
					 </div> 
				</div>
			)
		}
		/////
		if(isFollowed) {
			return (
				<div className="wrp-relship">
					<div className="is-fri">
	    			 	<div className="is-fri">
	    			 	 	followed
					 	</div> 
					 </div> 
				</div>
			)
		}
		//////
		if(isFollower) {
			return (
				<div className="wrp-relship">
					<div className="is-fri">
	    			 	<div className="is-fri">
	    			 	 	follower
					 	</div> 
					</div> 
				</div>
			)
		}
		////////
		if(requestToMe) {
			return (
				<div className="wrp-relship">
					<div className="is-fri">
	    			 	<div className="is-fri">
	    			 	 	<FriendButton 
	    			 	 		{...this.props}
	    			 	 		user={user}
	    			 	 		target={profile}
	    			 	 		ownRequest={false}
	    			 	 		friendRequest={true}
	    			 	 		/>
					 	</div> 
					 </div> 
				</div>
			)
		}

		////////
		if(requestFromMe) {
			return (
				<div className="wrp-relship">
					<div className="is-fri">
	    			 	<div className="is-fri">
	    			 	 	<FriendButton 
	    			 	 		{...this.props}
	    			 	 		user={user}
	    			 	 		target={profile}
	    			 	 		ownRequest={true}
	    			 	 		friendRequest={false}
	    			 	 		/>
					 	</div> 
					 </div> 
				</div>
			)
		}

		return (
			<div className="wrp-relship">
				<div className="is-fri">
    			 	<div className="is-fri">
    			 	 	<FriendButton 
    			 	 		{...this.props}
    			 	 		user={user}
    			 	 		target={profile}
    			 	 		ownRequest={false}
    			 	 		friendRequest={false}
    			 	 		/>
				 	</div> 
				 </div> 
			</div>
		)
	}
})

export default CheckRelationShipButton