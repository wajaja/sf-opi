import { call, put, fork,
		 select, all, takeEvery, 
		 takeLatest } 		from 'redux-saga/effects'

import * as axios 			from 'axios'
import _ 					from 'lodash'
import { BASE_PATH } 		from '../config/api'

const getSuggestions = state => state.RelationShip.suggestions

// function pushSuggestions(suggestions) {
// 	_.forEach(comments, (comment, i) => {
// 		const author = comment.author
// 		put({type: 'PUSH_COMMENT', comment})
// 		put({type: 'PUSH_AUTHOR', author})
// 	})
// }

/**
* Function findInitIds 
* return array ids of suggested users
*/
function* findInitIds() {
	const suggestions = yield select(getSuggestions);
    return suggestions.map((s, i) => { return s.id })
}

function* loadSuggestions(userId) {
	var initIds = yield call(findInitIds)
    try {
    	yield put({type: 'LOAD_SUGGESTIONS_REQUEST', userId})
       	const res 	= yield call(axios.get, 
       							`${BASE_PATH}/api/invitations/load/suggestions`, 
       								{ params : { initIds: initIds } }
       							),
        suggestions 	= res.data.suggestions
        yield put({type: 'LOAD_SUGGESTIONS_RESPONSE', suggestions})
    } catch(e) {
    	if(e.response) {
			console.log(e.response.data);	
			console.log(e.response.status);
			console.log(e.response.headers);				
		} else if(e.request) {
			console.log(e.request);
		} else {
			console.log(e.message);
		}
		console.log(e.config);
    }
}

function* callLoadSuggestions({userId}) {
	yield call(loadSuggestions, userId)
}

export function* suggestionsSaga() {
	yield takeEvery("LOAD_SUGGESTIONS", callLoadSuggestions);
	// yield takeLatest("PUBLISH_COMMENT", callPublishComment);
}