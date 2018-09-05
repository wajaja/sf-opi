import Immutable, { List, Map, Set, fromJS } from 'immutable'
import { REHYDRATE, PURGE } from 'redux-persist'

import { Shares 
	as SharesActions 
} from '../../actions/post'

export const initialState = {
	isRequesting: true,
	sharedPost: {},
}

/**
 *Function union
 *@param Array left
 *@param Array right
 *@return Immutable List()
 */
function union(left, right) {
	var list = [], screen = {};

	for(var i=0; i<left.length; i++) {
		if(!screen[left[i]]) list.push(left[i]);
		screen[left[i]] = 1;
	}

	for (var i =0; i<right.length; i++) {
		if (!screen[right[i]]) list.push(right[i]);
		screen[right[i]] = 1;
	}
	return List(list);
}


function Shares(state = initialState, action) {

	switch(action.type) {

		

		case SharesActions.HANDLE_SHARE_REQUEST: 
            return initialState

		case SharesActions.HANDLE_SHARE_RESPONSE:
			return Object.assign({}, state, { 
				sharedPost: action.sharedPost,
				isRequesting: false
			})
		
		case SharesActions.CREATE_SHARE_REQUEST:
			return Object.assign({}, state, { 
				sharedPost: state.sharedPost,
				isRequesting: false
			})

		case SharesActions.CREATE_SHARE_RESPONSE:
			return initialState

		return state;
	}
	return state
}

export default Shares;