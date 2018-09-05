import React 			from 'react'
import createReactClass from 'create-react-class'
import { Link } 		from 'react-router-dom'
import { 
	RelationShip as RelationShipAction 
} from '../../../actions'
import { 
	User, ModalUsersList, 
	InlineUsersList 
} 						from '../../../components'
import { FormattedMessage, 
        FormattedPlural, 
        FormattedNumber, 
        FormattedRelative 
}                               from 'react-intl';


export const MutualMessage = props => {
	const { count } = props
	return(
		<span>
            <FormattedMessage
                id={'mutual.users.to_user'}
                defaultMessage={'{count, plural, one {one persone} other {{formattedCount} persons }}'}
                values={{
                    count: count,
                    formattedCount: (
                        <span>
                            <FormattedNumber value={count} />
                        </span>
                    )
                }}
            />
        </span>
	)
}

//////
export const Mutual = createReactClass({
	getInitialState() {
		return {
			users: [], // list of all mutuals users
			over: false,
		}
	},

	mouseOver(e) {
		this.setState({over: true})
		if(!this.state.users.length) {
			this.props.dispatch(RelationShipAction.getMutual(this.props.mutualIds))
			.then(
				(users) => {this.setState({users})},
				(error) => {console.log('promise rejected')}
			)
		}
	},

	mouseOut(e) {
		this.setState({over: false})
		if(!this.state.users.length) {
			this.props.dispatch(RelationShipAction.getMutual(this.props.mutualIds))
			.then(
				(users) => {this.setState({users})},
				(error) => {console.log('promise rejected')}
			)
		}
	},

	onClick(e) {
		if(!this.state.users.length) {
			this.props.dispatch(RelationShipAction.getMutual(this.props.mutualIds))
			.then(
				(users) => {this.setState({users})},
				(error) => {console.log('promise rejected')}
			)
		}
	},

	render() {
		return(
			<div className="mutuals-users">
				<span 
					className="mtls-lk" 
					onMouseOver={this.mouseOver} 
					onMouseOut={this.mouseOut}
					onClick={this.onClick}
					>
					<MutualMessage count={this.props.mutualIds.length} />
				</span>
				<div className="abs-users-list">
					{this.state.mouseover && 
						<InlineUsersList users={this.state.users} />
					}
				</div>
				{this.state.showModal && 
					<ModalUsersList
						userIds={this.props.mutualIds}
						users={this.state.users}
						/>
				}
			</div>
		)
	}
})

/////
export const DeleteButton = createReactClass({

	getInitialState() {
		return {
			requesting: false
		}
	},

	onClick(e) {
		e.preventDefault();
		this.props.onDeleteInvitation();
	},

	render() {
		return(
			<div className="invit-b-o-ctnr">
				<div className="invit-b-o-ctnr-a">
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

////////////
export const ConfirmButton = createReactClass({

	getInitialState() {
		return { option: false }
	}, 

	onClick(e) {
		e.preventDefault();
		this.props.onFriendConfirm(user.id, target.id);
	},

	render() {
		return (
			<div className="invit-friend-ctnr">
	        	<button 
	        		type="button" 
	        		className="btn btn-default" 
	        		onClick={this.onClick}
	        		>
	        		confirm
	        	</button>
	        </div>
	    )
	}
})

const InvitationBox = (props) => {

	const { invitation, user, onFriendConfirm, onDeleteInvitation, dispatch } = props
	return(
		<div className="u-invit-el">
			<div className="u-invit-el-a">
		        <div className="u-invit-lft">
		        	<div className="pic-dv-u-invit">
		        		<div className="pic-u-invit">
			                <Link to={`/${invitation.sender.username}`} >
			                   <img 
			                        src={invitation.sender.profile_pic.web_path} 
			                        className="user-pic" 
			                        style={{display: 'inline-block', height: '53px'}} 
			                        />
			                </Link>
			           </div>
		            </div>
		        </div>
		        <div className="u-invit-rght">
		        	<div className="nm-dv-u-invit">
		        		<User.Name 
		        			for="suggestion"
		        			user={invitation.sender}
		        			className="nm-link-u-invit" />
		        	</div>
	        		<Mutual 
	        			mutualIds={invitation.mutualIds}
	        			dispatch={dispatch}
	        			/>
		            {!invitation.isConfirmed && <div className="req-invit-btn-ct"> 
			            	<div className="lft">
			            		<ConfirmButton 
			            			user={user}
			            			target={invitation.sender}
			            			onFriendConfirm={onFriendConfirm}
			            			/>
			            	</div>
			            	<div className="rght">
			            		<DeleteButton 
			            			user={user}
			            			target={invitation.sender}
			            			onDeleteInvitation={onDeleteInvitation}
			            			/>
			            	</div>
			            </div>
			        }
			        {invitation.isConfirmed && 
			        	<div className="req-invit-btn-ct">
		            		<div className="bx-conf-msg">
		            			friend
		            		</div>
		            	</div>
		            }
		        </div>
		    </div>
		</div>
	)
}

export default InvitationBox