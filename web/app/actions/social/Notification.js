import * as axios from 'axios'
import { BASE_PATH } from '../../config/api'
import { 
	Authors as AuthorsActions, 
	Comments as CommentsActions 
} 					from '../../actions/post'

/**
* SEEING_NOTIFICATION_REQUEST
* @type {string}
*/
export const SHOW_ALERT_REQUEST = "NOTIFICATION::SHOW_ALERT_REQUEST"

/**
* _seeingRequest
* @private
*/
const _showAlertRequest = () => ({type: SHOW_ALERT_REQUEST, })

/**
* SEEING_NOTIFICATION_RESPONSE
* @type {string}
*/
export const SHOW_ALERT_RESPONSE = "NOTIFICATION::SHOW_ALERT_RESPONSE"

/**
* _seeingResponse
* @private
*/
const _showAlertResponse = (data) => ({type: SHOW_ALERT_RESPONSE, data, })

export function showAlert(nbAlerts) {
	return (dispatch, getState) => {

		axios.get(`${BASE_PATH}/api/notifications/alert/show`)
		.then(
			(res) => {
				dispatch(_showAlertResponse(res.data))
			},
			(err) => {
				console.log('error in notifications code')
			}
		)
	}
}


/**
* SEEING_NOTIFICATION_REQUEST
* @type {string}
*/
export const HIDE_ALERT_REQUEST = "NOTIFICATION::HIDE_ALERT_REQUEST"

/**
* _seeingRequest
* @private
*/
const _hideAlertRequest = () => ({type: HIDE_ALERT_REQUEST, })

/**
* SEEING_NOTIFICATION_RESPONSE
* @type {string}
*/
export const HIDE_ALERT_RESPONSE = "NOTIFICATION::HIDE_ALERT_RESPONSE"

/**
* _seeingResponse
* @private
*/
const _hideAlertResponse = (data) => ({type: HIDE_ALERT_RESPONSE, data, })

/**
* seeingMessages
* @public
*/
export function hideAlert() {
	return dispatch => {
		dispatch(_hideAlertRequest())
		axios.get(`${BASE_PATH}/api/notifications/alert/hide`)
		.then(res => {
			dispatch(_hideAlertResponse(res.data))
		})
	}
}


export function loadPhoto(id, postId) {
	return (dispatch, getState) => {
		const photos = getState().Photos.photos,
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
		return new Promise(function (resolve, reject) {
			if(typeof photo === 'object' && photo.id === id) {
				resolve(photo);
				//return
			} else {
				dispatch({type: 'LOAD_PHOTO_REQUEST', id})
				return axios.get(`${BASE_PATH}/api/photos/show/${id}?post_id=${postId}`).then(
				 	function(res) {
				 		const photo = res.data.photo,
				        author 		= photo.author;
		 				if(!!photo.id) {
					        dispatch({type: 'LOAD_PHOTO_RESPONSE', photo})
							dispatch({type: 'PUSH_PHOTO', photo})
							dispatch({type: 'PUSH_AUTHOR', author})
			 				dispatch(CommentsActions.load(id, type))
			 				resolve(photo);
			 			} else {
			 				resolve({})  //resolve with empty object
			 			}
					},
				 	function(err) {
				 		if(err.response) {
							console.log(err.response.data);	
							console.log(err.response.status);
							console.log(err.response.headers);				
						} else if(err.request) {
							console.log(err.request);
						} else {
							console.log(err.message);
						}
						console.log(err.config);
				 })
			}
			console.log('continue..........')
		})
	}
}


export function loadPost(id) {
	return (dispatch, getState) => {
		const photos = getState().Photos.photos,
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
		return new Promise(function (resolve, reject) {
			if(typeof photo === 'object' && photo.id === id) {
				resolve(photo);
				//return
			} else {
				dispatch({type: 'POSTS::LOAD_REQUEST'})
				return axios.get(`${BASE_PATH}/api/posts/show/${id}`).then(
				 	function(res) {
			 			const post = res.data.post,
		 				{ id, type } = post
		 				if(!!id) {
				 			dispatch({type: 'POSTS::LOAD_RESPONSE', post})
			 				dispatch(AuthorsActions.pushAuthor(post.author))
			 				resolve(post);

			 				dispatch(CommentsActions.load(id, type))
			 				if(post.type === 'post' && post.editors.length > 0) {
			 					dispatch(loadAllie(post.id));
			 				}
			 				if(post.type === 'opinion' && post.nbAllies > 0) {
			 					dispatch(getRecentAllie(post.id));
			 				}
			 			} else {
			 				resolve({})  //resolve with empty object
			 			}
				 				// 	dispatch(Authors.pushAuthor(comment.author))
					}, 
				 	function(err) {
				 		if(err.response) {
							console.log(err.response.data);	
							console.log(err.response.status);
							console.log(err.response.headers);				
						} else if(err.request) {
							console.log(err.request);
						} else {
							console.log(err.message);
						}
						console.log(err.config);
				 })
			}
			console.log('continue..........')
		})
	}
}