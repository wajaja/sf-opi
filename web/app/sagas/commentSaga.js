import { call, put, fork,
		 select, all, takeEvery, 
		 takeLatest } 		from 'redux-saga/effects'

import * as axios 			from 'axios'
import _ 					from 'lodash'
import { BASE_PATH } 		from '../config/api'

const getLefts = state => state.Comments.leftcomments

const getRights = state => state.Comments.rightcomments

const getComments = state => state.Comments.comments

function pushComments(comments) {
	_.forEach(comments, (comment, i) => {
		const author = comment.author
		put({type: 'PUSH_COMMENT', comment})
		put({type: 'PUSH_AUTHOR', author})
	})
}
function* callPublishComment({comment, uri}) {
    try {
		yield put({type: 'PUSH_COMMENT', comment})
    } catch(err) {

    }
}

function* loadComments(postId, refer) {
    try {
    	yield put({type: 'LOAD_COMMENTS_REQUEST', postId, refer})
       	const res 	= yield call(axios.get, 
       							`${BASE_PATH}/api/comments/load/${postId}`, 
       								{ params : { refer: refer } }
       							),
        comments 	= res.data.comments
        yield put({type: 'LOAD_COMMENTS_RESPONSE', comments, postId, refer})
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

function* callSubmitSideComment({allie_id, side, data}) {
    try {
    	yield put({type: 'LOAD_SIDE_REQUEST', allie_id, side})
		const res 	= yield call(axios.post, `${BASE_PATH}/api/${side}s/add/`, data, {
							params :{
								postId: allie_id,
								side: side
							}
						}),
	 	comment 	= res.data.comment,
	 	postId 		= comment.id;
        if(postId) {
		    yield put({type: 'LOAD_SIDE_RESPONSE', allie_id, side})
        	if(side === 'right')
				yield put({type: 'PUSH_RIGHT', comment})
        	else
        		yield put({type: 'PUSH_LEFT', comment})
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


function* callLoadComments({postId, refer}) {
	yield call(loadComments, postId, refer)
}

/**
 * load
 * Gets single photo upload from API based on upload id
 * Redux Action
 * Reference: http://redux.js.org/docs/basics/Actions.html
 * @param id upload id
 * @returns {Function}
 */
 function* loadRight(id) {
    try {
    	const side = 'right', allie_id = id;
    	yield put({type: 'LOAD_SIDE_REQUEST', allie_id, side})
       	const res 	= yield call(axios.get, `${BASE_PATH}/api/rights/load/${id}`),
        comment 	= res.data.comment,
        author 		= comment.author,
        refer 		= comment.side,
        postId 		= comment.id
        if(postId) {
	        yield put({type: 'LOAD_SIDE_RESPONSE', allie_id, side})
	        yield put({type: 'LOAD_COMMENTS', postId, refer})
			yield put({type: 'PUSH_RIGHT', comment})
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


function* findRight(id) {
	const rights = yield select(getRights),
    comment = rights.filter((c, i) => {
				        for(var prop in c) {
				            return c[prop].postId === id;
				        }
					}).map((c, i) => {
				        for(var prop in c) {
				            return c[prop];
				        }
					})[0]

	return comment;
}

function* callLoadRightComment({allie_id}) {
	var comment = yield call(findRight, allie_id)
	console.log(comment);
	if(!comment) 
		comment = yield call(loadRight, allie_id)
}


/**
 * load
 * Gets single photo upload from API based on upload id
 * Redux Action
 * Reference: http://redux.js.org/docs/basics/Actions.html
 * @param id upload id
 * @returns {Function}
 */
 function* loadLeft(id) {
    try {
    	const side = 'left', allie_id = id;
    	yield put({type: 'LOAD_SIDE_REQUEST', allie_id, side})
       	const res 	= yield call(axios.get, `${BASE_PATH}/api/lefts/load/${id}`),
        comment 	= res.data.comment,
        author 		= comment.author,
        refer 		= comment.side,
        postId 		= comment.id
        if(postId) {
	        yield put({type: 'LOAD_SIDE_RESPONSE', allie_id, side})
	        yield put({type: 'LOAD_COMMENTS', postId, refer})
			yield put({type: 'PUSH_LEFT', comment})
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


function* findLeft(id) {
	const lefts = yield select(getLefts),
    comment = lefts.filter((c, i) => {
				        for(var prop in c) {
				            return c[prop].postId === id;
				        }
					}).map((c, i) => {
				        for(var prop in c) {
				            return c[prop];
				        }
					})[0]

	return comment;
}

function* callLoadLeftComment({allie_id}) {
	var comment = yield call(findLeft, allie_id)
	console.log(comment);
	if(!comment) 
		comment = yield call(loadLeft, allie_id)
}

function* callPublishLeft({comment, postId, order}) {
	yield put({type: 'ADD_POST_INFO', postId, from: "left", order})
	yield put({type: 'PUSH_LEFT', comment})
	yield window.requestTimeout(() => { put({type: 'REMOVE_POST_INFO', postId}); }, 6000);
}

function* callPublishRight({comment, postId, order}) {
	yield put({type: 'ADD_POST_INFO', postId, from: "right", order})
	yield put({type: 'PUSH_RIGHT', comment})
	yield window.requestTimeout(() => { put({type: 'REMOVE_POST_INFO', postId}); }, 6000);
}
/*
Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
Allows concurrent fetches of user.
*/

export function* sideCommentsSaga() {
	yield takeEvery("LOAD_LEFT", callLoadLeftComment); 
	yield takeEvery("LOAD_RIGHT", callLoadRightComment); 
	yield takeLatest("PUBLISH_LEFT", callPublishLeft);
	yield takeLatest("PUBLISH_RIGHT", callPublishRight);
	// yield takeEvery("SUBMIT_SIDE_REQUEST", callSubmitSideComment);
}

export function* commentsSaga() {
	yield takeEvery("LOAD_COMMENTS", callLoadComments);
	yield takeLatest("PUBLISH_COMMENT", callPublishComment);
}