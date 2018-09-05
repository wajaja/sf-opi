import { takeEvery, takeLatest } 		from 'redux-saga/effects'
import { call, put, fork, select, all } from 'redux-saga/effects'

import * as axios from 'axios'
import { BASE_PATH } from '../config/api'

const getUser = state => state.User.user,
getInfos 	  = state => state.Users.infos,
getProfiles   = state => state.Profiles.users

/**
* @getUser
* Get authenticated user; dispatch in store
* return {Function}
*/
function* getMe() {
	try {
    	yield put({type: 'USER::GET_ME_REQUEST'})
       	const res 	= yield call(axios.get, `${BASE_PATH}/api/users/me/`),
       	data 		= res.data
        console.log('init function ret', data)
        yield put({type: 'USER::GET_ME_RESPONSE', data})
    } catch(error) {
    	// console.log(e)
    	if(error.response) {
			console.log(error.response.data);	
			console.log(error.response.status);
			console.log(error.response.headers);				
		} else if(error.request) {
			console.log(error.request);
		} else {
			console.log(error.message);
		}
		console.log(error.config);
    }
}

/**
 * load
 * Gets single photo upload from API based on upload id
 * Redux Action
 * Reference: http://redux.js.org/docs/basics/Actions.html
 * @param id upload id
 * @returns {Function}
 */
//  function* load(id, postId) {
//     try {
// 		const params = { id: id }
//     	yield put({type: 'LOAD_PHOTO_REQUEST', params})
//        	const res 	= yield call(axios.get, `${BASE_PATH}/api/photos/show/${id}?post_id=${postId}`,),
//         photo 		= res.data.photo,
//         author 		= photo.author;
//         console.log(res.data.photo)
//         yield put({type: 'LOAD_PHOTO_RESPONSE', photo})
// 		yield put({type: 'PUSH_PHOTO', photo})
//         // yield put({type: 'PUSH_AUTHOR', author})
//         // yield dispatch(CommentsActions.load(photo.id, 'photo'))
//         // yield dispatch(LikesActions.load(photo.id))
//     } catch(e) {
//     	console.log(e)
//     }
// }


function* findInUserStore(id) {
	const user = yield select(getUser);
	return user;
}

function* callGetMe() {
	var user = yield call(findInUserStore)
	// console.log(user);
	if(!user.id) {
		user = yield call(getMe)
	} else {
		console.log('user exist in store')
		//yield put({type: 'LOAD_PHOTO_RESPONSE', photo})
	}
}

/*
Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
Allows concurrent fetches of user.
*/
export function* UserSaga() {
	//allow multiple instance to be started currently
	yield takeEvery("USER::GET_ME", callGetMe); 
}


/**
 * load
 * Gets single photo upload from API based on upload id
 * Redux Action
 * Reference: http://redux.js.org/docs/basics/Actions.html
 * @param id upload id
 * @returns {Function}
 */
 function* loadInfo(userId) {
    try {
       	const res 	= yield call(axios.get, `${BASE_PATH}/api/users/info/${userId}`,),
        info 		= res.data.info
        yield put({type: 'USERS::LOAD_INFO_RESPONSE', userId, info})
    } catch(e) {
    	console.log(e)
    }
}


function* findInInfoStore(id) {
	const infos = yield select(getInfos),
    info = infos.filter(function(info, i) {
		        for(var prop in info) {
		            return info[prop].id === id;
		        }
			}).map(function(info, i) {
		        for(var prop in info) {
		            return info[prop];
		        }
			})[0]

	return info;
}

function* callLoadInfoRequest({userId}) {
	let info = yield call(findInInfoStore, userId)
	console.log(info);
	if(!info) {
		info = yield call(loadInfo, userId)
	} else {
		// yield put({type: 'USERS::LOAD_INFO_RESPONSE', userId, info})
	}
}

/*
Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
Allows concurrent fetches of user.
*/
export function* UsersSaga() {
	//allow multiple instance to be started currently
	//yield takeEvery("USER::GET_ME", callGetMe); 
	yield takeLatest("USERS::LOAD_INFO_REQUEST", callLoadInfoRequest); 
}