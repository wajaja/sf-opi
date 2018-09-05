import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'
import { User, BuildContent } 			from '../../../components' 

export const Intro = (props) => {
	return (
		<div className="intro-dv">
			<div className="intro-dv-ml">{props.email}</div>
			<div className="intro-dv-stt">
				<BuildContent
                    content={props.status}
                    />
            </div>
		</div>
	)
}

////////////
export const FocalPoint = createReactClass({

	componentDidMount() {

	},

	render() {
		return(
			<div>FocalPoint</div>
		)
	}
})

////////
export const FriendButtonOption = createReactClass({

	getInitialState() {
		return {}
	},

	onClick(e) {
		e.preventDefault();

		this.props.onDeleteInvitation();
	},

	render() {
		return(
			<div className="fri-b-o-ctnr">
				<div className="fri-b-o-ctnr-a">
					<button 
		        		type="button"  
		        		onClick={this.onClick}
		        		className="btn btn-default" 
		        		>
		        		delete invitation
		        	</button>
				</div>
			</div>
		)
	}
})

////////
export const FollowButtonOption = createReactClass({

	getInitialState() {
		return {}
	},

	onClick(e) {
		e.preventDefault();

		this.props.onUnFollowRequest();
	},

	render() {
		return(
			<div className="fol-b-o-ctnr">
				<div className="fol-b-o-ctnr-a">
					<button 
		        		type="button"  
		        		onClick={this.onClick}
		        		className="btn btn-default" 
		        		>
		        		unfollow
		        	</button>
				</div>
			</div>
		)
	}
})

////////////
export const FollowButton = createReactClass({

	getInitialState() {
		return { option: false }
	},

	onClick(e) {
		e.preventDefault();
		const { user, target } = this.props
		this.props.onFollowRequest(user.id, target.id);
	},

	onUnFollowRequest() {
		const { user, target } = this.props
		this.props.onUnFollowRequest(user.id, target.id);
	},

	mouseOver(e) {
		this.setState({
			option: true
		})
	},

	mouseOut(e) {
		this.setState({
			option: false
		})
	},

	render() {
		let message = 'follow',
		disabled 	= false;

		if(this.props.friendRequest)
			disabled= true
		else if (this.props.ownRequest) 
			disabled=true
		else if(this.props.followRequest)
			message = 'following'
		else 
			disabled = false

		return (
			<div className="sugg-follow-ctnr">
				{this.state.option && this.props.followRequest && 
					<FollowButtonOption 
						onUnFollowRequest={this.onUnFollowRequest} />
				}
	        	<button 
	        		type="button" 
	        		disabled={disabled} 
	        		onClick={this.onClick}
	        		className="btn btn-default" 
	        		onMouseOver={this.mouseOver} 
	        		onMouseOut={this.mouseOut} >
	        		{message}
	        	</button>
	        </div>
	    )
	}
})

////////////
export const FriendButton = createReactClass({

	getInitialState() {
		return { option: false }
	}, 

	onClick(e) {
		e.preventDefault();
		const { user, target } = this.props
		if(this.props.friendRequest) 
			this.props.onFriendConfirm(user.id, target.id);
		else
			this.props.onFriendRequest(user.id, target.id);
	},

	onDeleteInvitation() {
		const { user, target } = this.props
		this.props.onDeleteInvitation(user.id, target.id);
	},

	mouseOver(e) {
		this.setState({
			option: true
		})
	},

	mouseOut(e) {
		this.setState({
			option: false
		})
	},

	render() {
		let message = ''; 
		if(this.props.friendRequest)
			message = 'confirm'
		else if (this.props.ownRequest) 
			message = 'request sended'
		else 
			message = 'send demand'

		return (
			<div className="sugg-friend-ctnr">
				{this.state.option && this.props.friendRequest && 
					<FriendButtonOption 
						onDeleteInvitation={this.onDeleteInvitation} 
						/>
				}

				{this.state.option && this.props.ownRequest && 
					<FriendButtonOption 
						onDeleteInvitation={this.onDeleteInvitation} 
						/>
				}
	        	<button 
	        		type="button" 
	        		className="btn btn-default" 
	        		onClick={this.onClick}
	        		onMouseOver={this.mouseOver} 
	        		onMouseOut={this.mouseOut} >
	        		{message}
	        	</button>
	        </div>
	    )
	}
})

//////////////////////////////////
const SuggestUserBox  = createReactClass( {

	getInitialState() {
		return {
			ownRequest: false,
			followRequest: false,
			friendRequest: this.props.suggestion.friendRequest,
		}
	},

	getDefaultProps() {
		return {
			imageStyle: {},
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

	componentDidMount() {

	},

	render() {
		const { user, suggestion, type, full, imageStyle } = this.props,
		additional = suggestion.school 		||
					 suggestion.university 	||
					 suggestion.city 		||
					 suggestion.country;

		const { friendRequest, followRequest } = this.state
		return(
			<div className="u-sugg-el">
				<div className="u-sugg-el-a">
					<div className="rmv-sugg" onClick={this.removeSuggestion}></div>
		            <div className="u-sugg-lft">
		            	<div className="pic-dv-u-sugg">
		            		<User.Photo 
		            			imgHeight={53}
		            			for="suggestion"
		            			user={suggestion}
		            			imageStyle={imageStyle}
		            			className="pic-u-sugg" />
			            </div>
			        </div>
			        <div className="u-sugg-rght">
		            	<div className="nm-dv-u-sugg">
		            		<User.Name 
		            			for="suggestion"
		            			user={suggestion}
		            			className="nm-link-u-sugg" />
		            	</div>
		            	{type === 'suggestion-detail' && <div className="intro-dv-u-sugg">
				            		<Intro 
				            			status={suggestion.status}
				            			email={suggestion.email}
				            			/>
				            		suggestion-detail
			            			<div className="inf-u-sugg-pls">   
					                    <div className="nf-u-sugg-pls-a">
					                    	<FocalPoint 
					                    		suggId={suggestion.id}
					                    		userId={this.props.user.id}
					                    		/>
					                    </div>
					            	</div>
				            	</div>
			            }
			            {type === 'search-detail' && <div className="intro-dv-u-sugg">
				            		<Intro 
				            			status={suggestion.status}
				            			email={suggestion.email}
				            			/>
				            		search-detail
			            			<div className="inf-u-sugg-pls">   
					                    <div className="nf-u-sugg-pls-a">
					                    	<FocalPoint 
					                    		suggId={suggestion.id}
					                    		userId={this.props.user.id}
					                    		/>
					                    </div>
					            	</div>
				            	</div>
			            }
		                <div className="req-sugg-btn-ct"> 
		                	<div className="lft">
		                		<FriendButton 
		                			user={user}
		                			target={suggestion}
		                			friendRequest={friendRequest}
		                			onFriendRequest={this.onFriendRequest}
		                			onDeleteInvitation={this.onDeleteInvitation}
		                			/>
		                	</div>
		                	<div className="rght">
		                		<FollowButton 
		                			user={user}
		                			target={suggestion}
		                			followRequest={followRequest}
		                			friendRequest={friendRequest}
		                			onFollowRequest={this.onFollowRequest}
		                			onUnFollowRequest={this.onUnFollowRequest}
		                			/>
		                	</div>
			            </div>
		            </div>
		        </div>
	        </div>
		)
	}
})
////
export default SuggestUserBox