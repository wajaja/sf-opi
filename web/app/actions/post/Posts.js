import axios from 'axios'
import _ from 'lodash'
import { BASE_PATH } from '../../config/api'
import { User as UserActions } 	from '../user'
import { 
	Authors as AuthorsActions, 
	Comments as CommentsActions } from '../post'

import { App as AppActions,
	NewsFeed as NewsFeedActions } from '../social'

export const NEW_POST_REQUEST = 'POSTS::NEW_POST_REQUEST'

export const _newPostRequest = () => ({type: NEW_POST_REQUEST})

export const NEW_POST_RESPONSE = 'POSTS::NEW_POST_RESPONSE'

export const _newPostResponse = (post) => ({type: NEW_POST_RESPONSE, post})

export function newPost(post) {
	return (dispatch, getState) => {
		const { id, type } = post
		// dispatch(_newPostResponse(post));
		dispatch(AuthorsActions.pushAuthor(post.author))
		dispatch(NewsFeedActions.addPost(post));
		dispatch(UserActions.addPostRef(id, type));
	}
}

export const UPDATE_POST_REQUEST = 'POSTS::UPDATE_POST_REQUEST'
export const _updatePostRequest = (postId) =>({type: UPDATE_POST_REQUEST, postId})

export const UPDATE_POST_RESPONSE = 'POSTS::UPDATE_POST_RESPONSE'
export const _updatePostResponse = (postId, post) =>({type: UPDATE_POST_RESPONSE, postId, post})

export function updatePost(id, data, rmv_filenames) {
	return (dispatch, getState) => {
		return new Promise(function (resolve, reject) {
			dispatch(_updatePostRequest(id))
			axios.put(`${BASE_PATH}/api/posts/edit/${id}`, data, { 
	    			params : {
						removedFilenames: rmv_filenames
					}})
				 .then(function (res) {
				 	const post = res.data.post;
					dispatch(_updatePostResponse(id, post))
					dispatch(NewsFeedActions.updatePost(post.id, post.type))
					resolve(post)
				}, function(err) { 
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
					reject(error)
					dispatch({type:'UPDATE_POST_FAILLURE', err})
			})
		})
	}
}

export const UPDATE_POST_ON_LIKE = 'POSTS::UPDATE_POST_ON_LIKE'

const _updateOnLike = (postId, postType, liked, nbLikers) =>({type: UPDATE_POST_ON_LIKE, postId, postType, liked, nbLikers})

export function updateOnLike(postId, data) {
	const postType = data.refer, 
	liked = data.liked,
	nbLikers = data.nbLikers
	return (dispatch, getState) => {
		dispatch(_updateOnLike(postId, postType, liked, nbLikers))
		dispatch(NewsFeedActions.updateOnLike(postId, postType, liked, nbLikers))
	}
}

export const DELETE_POST_REQUEST = 'POSTS::DELETE_POST_REQUEST'
export const _deletePostRequest = (postId) =>({type: DELETE_POST_REQUEST, postId})

export const DELETE_POST_RESPONSE = 'POSTS::DELETE_POST_RESPONSE'
export const _deletePostResponse = (postId) =>({type: DELETE_POST_RESPONSE, postId})

export function deletePost(post) {
	return (dispatch, getState) => {
		const postId = post.id;
		dispatch(_deletePostRequest(postId))
		axios.delete(`${BASE_PATH}/api/posts/remove/${postId}`)
			 .then(function (res) {
			 	console.log(res.data);
				dispatch(_deletePostResponse(postId))
				dispatch(NewsFeedActions.deletePost(postId, post.type))
				dispatch(UserActions.deletePostRef(postId, post.type));
			}, function(err) { 
				console.log('err :', err);
			})
	}
}

export const MASK_POST_RESPONSE = 'POSTS::MASK_POST_RESPONSE'
export const _maskPostResponse = (postId, post) =>({type: MASK_POST_RESPONSE, postId})

export function maskPost(post) {
	return (dispatch, getState) => {
		const postId = post.id;
		//dispatch(_deletePostRequest(post))
		axios.post(`${BASE_PATH}/api/posts/mask/${postId}`)
			 .then(function (res) {
			 	console.log(res.data);
				dispatch(_maskPostResponse(postId))
				dispatch(NewsFeedActions.maskPost(postId, post.type))
				dispatch(UserActions.removePostRef(id, type));
			}, function(err) { 
				console.log('err :', err);
			})
	}
}

export const FAVORITE_POST_RESPONSE = 'POSTS::FAVORITE_POST_RESPONSE'
export const _favoritePostResponse = (postId) =>({type: FAVORITE_POST_RESPONSE, postId})

export function favoritePost(post) {
	return (dispatch, getState) => {
		const postId = post.id;
		//dispatch(_deletePostRequest(post))
		axios.post(`${BASE_PATH}/api/posts/favorite/${postId}`)
			 .then(function (res) {
			 	console.log(res.data);
				dispatch(_favoritePostResponse(postId))
				dispatch(NewsFeedActions.updateOnFavorite(postId, post.type))
			}, function(err) { 
				console.log('err :', err);
			})
	}
}

export const LOAD_REQUEST  = 'POSTS::LOAD_REQUEST'

export const _loadRequest = () => ({type: LOAD_REQUEST})

export const LOAD_RESPONSE  = 'POSTS::LOAD_RESPONSE'

export const _loadResponse = (post) => ({type: LOAD_RESPONSE, post})

export function load(id) {
	return (dispatch, getState) => {
		return new Promise(function (resolve, reject) {
			dispatch(_loadRequest());
			return axios.get(`${BASE_PATH}/api/posts/show/${id}`).then(
			 	function(res) {
		 			const post = res.data,
	 				{ id, type } = post
	 				if(!!id) {
			 			dispatch(_loadResponse(post))
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
		})
	}
}

export const ADD_TO_POST = 'POSTS::ADD_TO_POST'
const _addToPost = (postId, opinionOrder) =>({type: ADD_TO_POST, postId, opinionOrder})

export const _pushAllie = (allie) => ({type: PUSH_ALLIE, allie})
export const PUSH_ALLIE = 'POSTS::PUSH_ALLIE'

export function pushAllie(allie) {
	return (dispatch, getState) => {
		dispatch(_pushAllie(allie))
		dispatch(_addToPost(allie.mainAllieId, allie.opinionOrder))
	}
}

export const LOAD_ALLIE_BY_ORDER = 'POSTS::LOAD_ALLIE_BY_ORDER'

export function loadAllieByOrder(postId, order) {
	return  {
		type: LOAD_ALLIE_BY_ORDER, 
		postId,
		order,
	}
}

export function loadAllie(id) {
	return (dispatch, getState) => {
		axios.get(`${BASE_PATH}/api/posts/allies/all/${id}`)
		.then(function (res) {
			 	const posts = res.data.posts;
			 	_.each(posts, function(post, i) {
					dispatch(pushAllie(post));
					dispatch(AuthorsActions.pushAuthor(post.author));
			 	})
			}, function(err) { 
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
		});
	}
}

export function getRecentAllie(id) {
	return (dispatch, getState) => {
		axios.get(`${BASE_PATH}/api/posts/allies/recent/${id}`)
			.then(function (res) {
				 	const post = res.data.post;
					dispatch(pushAllie(post));
				}, function(err) { 
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
			});
	}
}