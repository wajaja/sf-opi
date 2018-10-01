import { call, put, fork, select, all,takeEvery, takeLatest } from 'redux-saga/effects'

import * as axios from 'axios'
import { BASE_PATH } from '../config/api'

const getPhotos = state => state.Photos.photos


/**
 * zoom
 * Gets single photo upload from API based on upload id
 * Redux Action
 * Reference: http://redux.js.org/docs/basics/Actions.html
 * @param id upload id
 * @returns {Function}
 */
 function* zoom(id) {
    try {
		const params = { id: id }
    	yield put({type: 'ZOOM_PHOTO_REQUEST', params})
       	const res 	= yield call(axios.get, `${BASE_PATH}/api/photos/zoom/${id}`,),
        photo 		= res.data.photo,
        author 		= photo.author;
        yield put({type: 'ZOOM_PHOTO_RESPONSE', photo})
		yield put({type: 'PUSH_PHOTO', photo})
        // yield put({type: 'PUSH_AUTHOR', author})
        // yield dispatch(CommentsActions.load(photo.id, 'photo'))
        // yield dispatch(LikesActions.load(photo.id))
    } catch(e) {
    	console.log(e)
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
 function* load(id, postId) {
    try {
		const params = { id: id }
    	yield put({type: 'LOAD_PHOTO_REQUEST', params})
       	const res 	= yield call(axios.get, `${BASE_PATH}/api/photos/show/${id}?post_id=${postId}`,),
        photo 		= res.data.photo,
        author 		= photo.author;
        yield put({type: 'LOAD_PHOTO_RESPONSE', photo})
		yield put({type: 'PUSH_PHOTO', photo})
        // yield put({type: 'PUSH_AUTHOR', author})
        // yield dispatch(CommentsActions.load(photo.id, 'photo'))
        // yield dispatch(LikesActions.load(photo.id))
    } catch(e) {
    	console.log(e)
    }
}


function* findInPhotoStore(id) {
	const photos = yield select(getPhotos),
    photo = photos
		.filter(function(photo, i) {
	        for(var prop in photo) {
	            return photo[prop].id === id;
	        }
		}).map(function(photo, i) {
	        for(var prop in photo) {
	            return photo[prop];
	        }
		})[0]

	return photo;
    // dispatch(PhotoActions._loadResponse(photo));
    // router.push(`/pictures/${image.id}?post_id=${postId}`);
}

function* callLoadPhoto({imageId, postId}) {
	var photo = yield call(findInPhotoStore, imageId)
	console.log(photo);
	if(!photo) {
		photo = yield call(load, imageId, postId)
	} else {
		yield put({type: 'LOAD_PHOTO_RESPONSE', photo})
	}
}

function* callZoomPhoto({imageId}) {
	var photo = yield call(findInPhotoStore, imageId)
	console.log(photo);
	if(!photo) {
		photo = yield call(zoom, imageId)
	} else {
		yield put({type: 'ZOOM_PHOTO_RESPONSE', photo})
	}
}
/*
Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
Allows concurrent fetches of user.
*/
export default function* loadPhotoSaga() {
	//allow multiple instance to be started currently
	yield takeEvery("LOAD_PHOTO", callLoadPhoto); 
	yield takeEvery("ZOOM_PHOTO", callZoomPhoto); 
}