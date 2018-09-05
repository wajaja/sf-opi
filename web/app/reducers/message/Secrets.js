import Immutable, { List, Map, Set, fromJS } from 'immutable'
import { REHYDRATE, PURGE } from 'redux-persist'

import { Secrets 
	as SecretsActions 
} from '../../actions/message'

export const initialState = {
	secrets: [],
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


function Secrets(state = initialState, action) {

	switch(action.type) {
		
        
		case SecretsActions.PUSH_SECRET:{
			const obj 				= {};
			obj[action.secret.id] 	= action.secret;			
			const secrets			= List([obj]).concat(fromJS(state).get('secrets'));
			return Object.assign({}, state, {secrets: secrets.toJS()});
		}

		case SecretsActions.LOAD_SECRETS_RESPONSE: {
			const secrets 			= action.secrets.map((s) => ({[s.id]: s }))
			return fromJS(state).set('secrets', secrets).toJS();
		}

		case SecretsActions.LOAD_MORE_SECRETS_RESPONSE:{
			const secrets			= List(fromJS(action.secrets))
									  .concat(fromJS(state).get('secrets'));
			return Object.assign({}, state, { secrets: secrets.toJS() })
		}

		case SecretsActions.UPDATE_SECRET_RESPONSE:{
			const list = fromJS(state).get('secrets')
									  .map(item => item.get(action.secretId) ? 
									   fromJS({[action.secretId]: action.secret}) : item);
			return Object.assign({}, state, { secrets: list.toJS() });
		}
		case SecretsActions.DELETE_SECRET_REQUEST:{
			const secrets = state.secrets.filter(s => 
								action.secretId != ((typeof s[action.secretId] != 'undefined') ? 
					s[action.secretId].id : ''));
			return Object.assign({}, state, { secrets: secrets });
		}

		case SecretsActions.MASK_SECRET_RESPONSE:{
			const list = state.secrets.filter(item => 
						action.secretId != ((typeof item[action.secretId] != 'undefined') ? 
						item[action.secretId].id : ''));
			return Object.assign({}, state, { secrets: list });
		}
		return state;
	}
	return state
}

export default Secrets;