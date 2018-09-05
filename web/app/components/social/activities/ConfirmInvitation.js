import React 					from 'react'
import createReactClass 		from 'create-react-class'
import { connect } 				from 'react-redux'
import ConfirmInvitationBox 	from './ConfirmInvitationBox'

const ConfirmInvitation  = createReactClass({

	render() {
		const { invitations, dispatch } = this.props 
		return(
			<div className="cfrm-invt-ctnr">
				<div className="cfrm-invt-ctnr-a">
					{invitations.map((invitation, i) => {
						return(
							<div key={i} className="cfrm-invt-map">
								<ConfirmInvitationBox
									invitation={invitation}
									dispatch={dispatch} 
									/>
							</div>
						)
					})}
				</div>
			</div>
		)
	}
})

export default connect(state => ({
	invitations: state.FriendsFollowers.invitations
}))(ConfirmInvitation)