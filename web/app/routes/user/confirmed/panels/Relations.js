import React, { Component } 		from 'react'
import createReactClass 			from 'create-react-class'
import { connect } 					from 'react-redux'
import axios 						from 'axios'

import MyLoadable    from '../../../../components/MyLoadable'
const SuggestUserBox = MyLoadable({loader: () => import('../../../../components/social/activities/SuggestUserBox')})

import '../../../../styles/user/relation.scss'

const Relations = createReactClass({

	getInitialState() {
		return {
			
		}
	},

	gotoHome() {
		this.history.push('/', {state: 'relations'})
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
		// this.props.loadSuggestions();
	},

	render() {
		const { suggestions, user, dispatch } = this.props,
		imageStyle = {
			height: '98px',
		    width: '98px',
		    border: '1px solid #595656',
		    borderRadius: '50%'
		}
		return(
			<div className="pnl-relat-ctnr">
				<div className="pnl-relat-ctnr-a">
					<div className="pnl-relat-ctnr-b">
						<div className="db-cfmd-tp">
		                    <div className="wlc-nw-usr-dv">
		                        <div className="tp-lft-ctnr" style={{display: 'inline-block' }}>
		                            <span className="wlc-nw-usr-sp">suggestions</span>
		                        </div>
		                        <div className="tp-rght-ctnr" style={{display: 'inline-block' }}>
		                            <div className="dfault-ctnr"></div>
		                        </div>
		                    </div>
		                </div>
						<div className="pnl-relat-bdy">
							<div className="pnl-relat-bdy-a">
						        {suggestions.map((sugg, i) => {
						        	return (
						        	<SuggestUserBox
				        				key={i}
				        				user={user}
				        				type="suggestion-detail"
				        				full={true}
				        				suggestion={sugg}
				        				dispatch={dispatch}
				        				imageStyle={imageStyle}
				        				onFriendRequest={this.onFriendRequest}
				        				onFriendConfirm={this.onFriendConfirm}
				        				onFollowRequest={this.onFollowRequest}
				        				onDeleteInvitation={this.onDeleteInvitation}
				        				onUnFollowRequest={this.onUnFollowRequest}
				        				/>
					        		)
						        })}
						    </div>
					    </div>
					    <div className="adr-area-bd">
							<div id="db-cfmd-ln" className="db-cfmd-ln">
		                        <div className="db-cfmd-ign-lk">
		                            <div className="ign-ctnr sve-pic-ctnr">
		                            	<button 
		                            		className="btn btn-primary cfrm_sv_pic" 
		                                    style={{outline: 'none'}}
		                            		id="cfrm_sv_pic" 
		                            		onClick={this.gotoHome}>
		                            		Finish
		                            	</button>
		                            </div>
		                        </div>
		                    </div>
		                </div>
					</div>
				</div>
			</div>
		)
	}
})

////////
///////
// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {
//     loadSuggestions: () => {
//       dispatch(RelationShipActions.loadSuggestions(ownProps.user.id));
//     }
//   };
// };

export default connect(state => ({
	user: 		state.User.user,
	suggestions: state.RelationShip.suggestions
}))(Relations)