import React 						from 'react'
import createReactClass 			from 'create-react-class'
import _ 							from 'lodash'
import { CoverPic, ProfilePic } 	from '../../../../components/user'

import { 
	CheckRelationShipButton, 
	MiniProfile
} 									from '../../../../components'

const Head = createReactClass({

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

	createMessage() {
		const { profile } = this.props.profile
		this.props.createMessageTo([profile.username]); //recipients as array
	},

	render() {
		const { profile, user, } 	= this.props

		return(
			<div className="in-top-a" >
			    <div className="in-top-b">
			        <div className="in-top-content">
			            <CoverPic 
			            	{...this.props}
			            	profile={profile}
			            	/>
			            <div className="in-top-plus-a">
			                <ProfilePic
			                	{...this.props}
			                	profile={profile}
			                	/>
			            </div>
		                <div className="in-top-plus-rgt-ctnr">
		                    <div className="in-top-plus-rgt-ctnr-a">
		                        <div className="in-top-name">
		                            <span>{profile.firstname}</span>
		                            <span>{profile.lastname}</span>
		                        </div>
		                        {false && <div className="in-top-sts-ctnr">
			                            <i className="fa fa-quote-left" aria-hidden="true"></i>
			                            <span className="sts-txt">
			                                {profile.status}
			                            </span>
			                            {user.id === profile.id &&
			                                <div className="edt-status">
			                                	<i className="fa fa-pencil" aria-hidden="true"></i>
			                                </div>
			                            }
			                        </div>
			                    }
		                    </div>
		                    <div className="in-top-plus-plus">
		                        {user.id != profile.id &&
			                        <div className="in-top-plus-plus-a">
			                            <div className="spa-in-add-freind">
				                        	<CheckRelationShipButton 
				                        		user={user}
				                        		profile={profile}
				                        		onFriendConfirm={this.onFriendConfirm}
						        				onFollowRequest={this.onFollowRequest}
						        				onFriendRequest={this.onFriendRequest}
						        				onDeleteInvitation={this.onDeleteInvitation}
						        				onUnFollowRequest={this.onUnFollowRequest}
				                        		/>			                                
			                            </div>
			                            <div className="spa-in-sd-message">
			                                <button 
			                                	className="btn-in-sd-message btn"
			                                	onClick={this.createMessage}>
			                                    <i className="fa fa-envelope"></i>
			                                    <span>Message</span>
			                                </button>
			                            </div>        
		                        	</div>
		                        }
		                    </div>
		                </div>
			        </div>
			    </div>
			</div>
		)
	}
})

export default Head