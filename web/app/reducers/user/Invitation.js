import { REHYDRATE, PURGE } from 'redux-persist'
import { Invitation as InvitationsActions } from '../../actions/user'

export const initialState = {
	nbAlerts: 0,
	unreads: 0,
	invitationsById: {},
	invitationIds: []
}

function Invitation(state=initialState, action) {
		switch(action.type) {

			case InvitationsActions.SHOW_ALERT_RESPONSE: 
			    return Object.assign({}, state, {nbAlerts: action.nbAlerts})

			case InvitationsActions.HIDE_ALERT_REQUEST: 
	            return Object.assign({}, state, {
	                nbAlerts: 0
	            })

	        case InvitationsActions.HIDE_ALERT_RESPONSE: 
	            return Object.assign({}, state, {
	                nbAlerts: 0,
	                invitationIds: action.data.ids,
	                invitationsById: action.data.invitations
	            })
			default:
			    return state;
		}
		return state;
}

export default Invitation;