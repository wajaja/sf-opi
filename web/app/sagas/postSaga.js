import { call, put, fork, select, 
		 all, takeEvery, takeLatest } from 'redux-saga/effects'

import * as axios from 'axios'
import { BASE_PATH } from '../config/api'

const getPosts = state => state.Posts.postsById
const getAllies = state => state.Posts.allies

/**
 * load
 * Gets single photo upload from API based on upload id
 * Redux Action
 * Reference: http://redux.js.org/docs/basics/Actions.html
 * @param id upload id
 * @returns {Function}
 */
 function* loadAllieByOrder(postId, order) {
 	try {
    	yield put({type: 'LOAD_ALLIE_REQUEST', postId, order})
		const res 	= yield call(axios.get, `${BASE_PATH}/api/posts/allies/load/${postId}`, {
							params :{ order: order, }
						}),
	 	allie 		= res.data.post;
        if(allie.id) {
		    yield put({type: 'LOAD_ALLIE_RESPONSE', postId, allie})
			yield put({type: 'PUSH_ALLIE', allie})
		}
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


function* findInAllieStore(postId, order) {
	const posts = yield select(getAllies),
    post = posts
		.filter((p, i) => {
	        for(var prop in p) {
	            return p[prop].mainAllieId === postId && 
	            	   p[prop].opinionOrder === order;
	        }
		}).map((p, i) => {
	        for(var prop in p) {
	            return p[prop];
	        }
		})[0]
	return post;
}

function* callLoadAllieByOrder({postId, order}) {
	var post = yield call(findInAllieStore, postId, order)
	if(!post)
		post = yield call(loadAllieByOrder, postId, order)
}
/*
Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
Allows concurrent fetches of user.
*/
export default function* loadPostSaga() {
	//allow multiple instance to be started currently
	yield takeEvery("LOAD_ALLIE_BY_ORDER", callLoadAllieByOrder); 
}