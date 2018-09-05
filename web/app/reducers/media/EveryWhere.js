import Immutable, { List, Map, Set, fromJS } from 'immutable'
import { REHYDRATE, PURGE } from 'redux-persist'

import { EveryWhere as EveryWhereActions } from '../../actions/media'

export const initialState = {
	everywheres: [],
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


function EveryWhere(state = initialState, action) {

	switch(action.type) {		
		case EveryWhereActions.ADD: {
			let response = action.response
			if(response) {  
				const ev  = response,		
				evs = List([ev]).concat(fromJS(state).get('everywheres'));
				return Object.assign({}, state, {everywheres: evs.toJS()});
			}
		}

		case EveryWhereActions.LOAD: {
			let response = action.response
			if(response) {
				let lists = response.everywheres,
				evs  = List(lists).concat(fromJS(state).get('everywheres'));
				return fromJS(state).set('everywheres', evs).toJS();
			}
		}

		case EveryWhereActions.UPDATE: {
			let response = action.response
			if(response) {
				let ev = response.everywhere, id = ev.id,
				list = fromJS(state).get('everywheres')
							.map(item => item.get(id) === id ? fromJS(ev) : item);
				return Object.assign({}, state, {everywheres: list.toJS() });
			}
		}

		case EveryWhereActions.DELETE: {
			let response = action.response
			if(response) {
				let ev = response.id, id = ev.id,
				list = fromJS(state).get('everywheres')
							.map(item => item.get(id) === id ? fromJS(ev) : item);
				return Object.assign({}, state, {everywheres: list.toJS() });
			}
		}

		default: 
			return state;
	}
	return state
}

export default EveryWhere;