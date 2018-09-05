import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'

const ConfirmInvitationBox  = createReactClass({

	getInitialState() {
		return {}
	}

	render() {
		return(
			<div className="cfrm-invt-box-ctnr">
				box confirmation container
				{user.invitation.exist && user.invitation.receiver_id === user.id &&
                    <div className="sugg-cfm-sp">
                        <span className="sugg-btn-cfm-fri" onClick={this.confirmFriend}>Confirme</span>
                        <span className="sugg-btn-cfm-flw" onClick={this.confirmFollow}>Follow</span>
                    </div>
                }
                {user.invitation.exist && user.invitation.sender_id === user.id &&
                    <div className="sugg-add-sp">
                        <span className="u-sugg-scs-sp">Sending</span>
                        <span className="delete-invitation">abord</span>
                    </div>
                }
			</div>
		)
	}
})

export default ConfirmInvitationBox;