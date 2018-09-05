import axios from 'axios'
import _ from 'lodash'
import * as Authors from './Authors'
import { BASE_PATH } from '../../config/api'

export const LOAD_COMMENTS_REQUEST = 'LOAD_COMMENTS_REQUEST'

export const _loadCommentsRequest = (postId, refer) => ({type: LOAD_COMMENTS_REQUEST, postId, refer })

export const LOAD_COMMENTS_RESPONSE = 'LOAD_COMMENTS_RESPONSE'

export const _loadCommentsResponse = (comments, postId, refer) => ({type: LOAD_COMMENTS_RESPONSE, comments, postId, refer})


export const LOAD_COMMENTS = 'LOAD_COMMENTS'

export function loadComments(postId, refer) {
	return  {
		type: LOAD_COMMENTS, 
		postId,
		refer,
	}
}

export const submitSideComment = (allie_id, side, data) => 
	(dispatch, getState) => 
		new Promise(function (resolve, reject) {
			dispatch({type: 'SUBMIT_SIDE_REQUEST', allie_id, side})
			axios.post(`${BASE_PATH}/api/${side}s/add/`, data, {
				params :{
					postId: allie_id,
					side: side
				}
			})
			.then(function (res) {
				 	const comment = res.data.comment;
					// dispatch(CommentsActions.pushComment(comment));
					// dispatch(AuthorsActions.pushAuthor(comment.author))
					dispatch({type: 'SUBMIT_SIDE_RESPONSE', allie_id, side})
					if(side === 'right')
						dispatch({type: 'PUSH_RIGHT', comment})
		        	else
		        		dispatch({type: 'PUSH_LEFT', comment})
					dispatch({type: 'PUSH_COMMENT', comment})
					resolve(comment)
				}, function(error) { 
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
					reject(error)
					dispatch({type: 'SUBMIT_SIDE_FAILLURE', error})
			});
		})

export const submitComment = (postId, refer, data) => 
	(dispatch, getState) => 
		new Promise(function (resolve, reject) {
			dispatch({type: 'SUBMIT_COMMENT_REQUEST', postId, refer})
			axios.post(`${BASE_PATH}/api/comments/add/`, data, {
				params :{
					postId: postId,
					refer: refer
				}
			})
			.then(function (res) {
				 	const comment = res.data.comment;
					// dispatch(CommentsActions.pushComment(comment));
					// dispatch(AuthorsActions.pushAuthor(comment.author))
					dispatch({type: 'SUBMIT_COMMENT_RESPONSE', postId, comment})
					dispatch({type: 'PUSH_COMMENT', comment})
					resolve(comment)
				}, function(error) { 
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
					reject(error)
					dispatch({type: 'SUBMIT_COMMENT_FAILLURE', error})
			});
		})

export function load(postId, refer) {
	return (dispatch, getState) => {
		dispatch(_loadCommentsRequest(postId, refer))
		axios.get(`${BASE_PATH}/api/comments/load/${postId}`, { 
    			params : {
					refer: refer
				}})
			.then(
				function (res) {
			 	const comments = res.data.comments;
			 	_.forEach(comments, function(comment, i) {
					dispatch(_pushComment(comment));
					dispatch(Authors.pushAuthor(comment.author))
			 	})
			},  function(err) { 
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

export const LOAD_MORE_COMMENTS_REQUEST = 'LOAD_MORE_COMMENTS_REQUEST'

export const _loadMoreCommentsRequest = (ids) => ({type: LOAD_MORE_COMMENTS_REQUEST})

export const LOAD_MORE_COMMENTS_RESPONSE = 'LOAD_COMMENTS_RESPONSE'

export const _loadMoreCommentsResponse = (comments) => ({type: LOAD_MORE_COMMENTS_RESPONSE, comments})

export function loadMoreComments(ids) {
	return (dispatch, getState) => {
		dispatch(_loadComentsRequest(ids))
		axios.get(`${BASE_PATH}/api/comments/loadsmore/`, { 
    			params : {
					ids: ids,
					refer: refer
				}})
			 .then(function (res) {
			 	console.log(res.data)
				// dispatch(_loadMoreCommentsResponse(res.data))
			}, function(err) { 
				console.log('err :', err);
			})
	}
}

export const UPDATE_COMMENTS_ON_LIKE = 'UPDATE_COMMENTS_ON_LIKE'

export const _updateOnLike = (id, nbLikers, liked) =>({type: UPDATE_COMMENTS_ON_LIKE, id, nbLikers, liked})

export function updateOnLike(id, data) {
	return (dispatch, getState) => {
		dispatch(_updateOnLike(id, data.nbLikers, data.liked))
	}
}

export const GET_COMMENT_RESPONSE = 'GET_COMMENT_RESPONSE'
export const _getComment = (comment) => ({type: GET_COMMENT_RESPONSE, comment})

export function getComment(id) {
	return (dispatch, getState) => {
		axios.post(`${BASE_PATH}/api/comments/get/${id}`)
			 .then(function (res) {
			 	console.log(res.data)
				// dispatch(_addComment(res.data))
			}, function(err) { 
				console.log('err :', err);
			})
	}
}

export const ADD_COMMENT_RESPONSE = 'ADD_COMMENT_RESPONSE'
export const _addComment = (comment) => ({type: ADD_COMMENT_RESPONSE, comment})


export const _pushComment = (comment) => ({type: PUSH_COMMENT, comment})

export const PUSH_COMMENT = 'PUSH_COMMENT'

export function pushComment(comment) {
	return (dispatch, getState) => {
		dispatch(_pushComment(comment))
	}
}

export const UPDATE_COMMENT_REQUEST = 'UPDATE_COMMENT_REQUEST'
export const _updateCommentRequest = (id) =>({type: UPDATE_COMMENT_REQUEST, id})

export const UPDATE_COMMENT_RESPONSE = 'UPDATE_COMMENT_RESPONSE'
export const _updateCommentResponse = (id, comment) =>({type: UPDATE_COMMENT_RESPONSE, id, comment})

export function updateComment(id, data, rmv_filenames) {
	return (dispatch, getState) => {
		dispatch(_updateCommentRequest(id))
		axios.put(`${BASE_PATH}/api/comments/edit/${id}`, data, { 
    			params : {
					removedFilenames: rmv_filenames
				}})
			 .then(function (res) {
				dispatch(_updateCommentResponse(id, res.data.comment))
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
			})
	}
}

export const DELETE_COMMENT_REQUEST = 'DELETE_COMMENT_REQUEST'
export const _deleteCommentRequest = (id) =>({type: DELETE_COMMENT_REQUEST, id})

export const DELETE_COMMENT_RESPONSE = 'DELETE_COMMENT_RESPONSE'
export const _deleteCommentResponse = (id) =>({type: DELETE_COMMENT_RESPONSE, id})

export function deleteComment(comment) {
	return (dispatch, getState) => {
		const id = comment.id;
		dispatch(_deleteCommentRequest(id))
		axios.post(`${BASE_PATH}/api/comments/remove/${id}`)
			 .then(function (res) {
				dispatch(_deleteCommentResponse(id))
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
		})
	}
}

export const MASK_COMMENT_RESPONSE = 'MASK_COMMENT_RESPONSE'
export const _maskCommentResponse = (id, comment) =>({type: MASK_COMMENT_RESPONSE, id})

export function maskComment(comment) {
	return (dispatch, getState) => {
		const id = comment.id;
		axios.post(`${BASE_PATH}/api/comments/mask/${id}`)
			 .then(function (res) {
				dispatch(_maskCommentResponse(id))
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
			})
	}
}

export const SUBMIT_SIDE_REQUEST = 'SUBMIT_SIDE_REQUEST'

export function submitSideRequest(allie_id, side, data) {
	return {
		type: SUBMIT_SIDE_REQUEST, 
		allie_id, 
		side, 
		data,
	}
}

export const SUBMIT_SIDE_RESPONSE = 'SUBMIT_SIDE_RESPONSE'

export const _submitSideResponse = (allie_id, side, comment) => ({type: SUBMIT_SIDE_RESPONSE, allie_id, side, comment})


export const LOAD_LEFT_REQUEST = 'LOAD_LEFT_REQUEST'

export const _loadLeftRequest = (allie_id) => ({type: LOAD_LEFT_REQUEST})

export const LOAD_LEFT_RESPONSE = 'LOAD_LEFT_RESPONSE'

export const _loadLeftResponse = (comment) => ({type: LOAD_LEFTS_RESPONSE, comment})

export const UPDATE_LEFT_ON_LEGAL = 'UPDATE_LEFT_ON_LEGAL'

export const _updateLeftOnLegal = (id, nbLegals, legal) =>({type: UPDATE_LEFT_ON_LEGAL, id, nbLegals, legal})

export function updateLeftOnLegal(id, data) {
	return (dispatch, getState) => {
		dispatch(_updateLeftOnLegal(id, data.nbLegals, data.legal))
	}
}

export const LOAD_LEFT = 'LOAD_LEFT'

export function loadLeftComment(allie_id) {
	return  {
		type: LOAD_LEFT, 
		allie_id,
	}
}

export const ADD_LEFT_RESPONSE = 'ADD_LEFT_RESPONSE'
export const _addLeft = (comment) => ({type: ADD_LEFT_RESPONSE, comment})


export const _pushLeft = (comment) => ({type: PUSH_LEFT, comment})

export const PUSH_LEFT = 'PUSH_LEFT'

export function pushLeft(comment) {
	return (dispatch, getState) => {
		dispatch(_pushLeft(comment))
	}
}

export const UPDATE_LEFT_REQUEST = 'UPDATE_LEFT_REQUEST'
export const _updateLeftRequest = (id) =>({type: UPDATE_LEFT_REQUEST, id})

export const UPDATE_LEFT_RESPONSE = 'UPDATE_LEFT_RESPONSE'
export const _updateLeftResponse = (id, comment) =>({type: UPDATE_LEFT_RESPONSE, id, comment})

export function updateLeft(id, data, rmv_filenames) {
	return (dispatch, getState) => {
		dispatch(_updateLeftRequest(id))
		axios.put(`${BASE_PATH}/api/comments/edit/${id}`, data, { 
    			params : {
					removedFilenames: rmv_filenames
				}})
			 .then(function (res) {
				dispatch(_updateLeftResponse(id, res.data.comment))
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
			})
	}
}

export const DELETE_LEFT_REQUEST = 'DELETE_LEFT_REQUEST'
export const _deleteLeftRequest = (id) =>({type: DELETE_LEFT_REQUEST, id})

export const DELETE_LEFT_RESPONSE = 'DELETE_LEFT_RESPONSE'
export const _deleteLeftResponse = (id) =>({type: DELETE_LEFT_RESPONSE, id})

export function deleteLeft(comment) {
	return (dispatch, getState) => {
		const id = comment.id;
		dispatch(_deleteLeftRequest(id))
		axios.post(`${BASE_PATH}/api/comments/remove/${id}`)
			 .then(function (res) {
				dispatch(_deleteLeftResponse(id))
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
		})
	}
}

export const LOAD_RIGHT_REQUEST = 'LOAD_RIGHT_REQUEST'

export const _loadRightRequest = (allie_id) => ({type: LOAD_RIGHT_REQUEST})

export const LOAD_RIGHT_RESPONSE = 'LOAD_RIGHT_RESPONSE'

export const _loadRightResponse = (comment) => ({type: LOAD_RIGHTS_RESPONSE, comment})

export const UPDATE_RIGHT_ON_LEGAL = 'UPDATE_RIGHT_ON_LEGAL'

export const _updateRightOnLegal = (id, nbLegals, legal) =>({type: UPDATE_RIGHT_ON_LEGAL, id, nbLegals, legal})

export function updateRightOnLegal(id, data) {
	return (dispatch, getState) => {
		dispatch(_updateRightOnLegal(id, data.nbLegals, data.legal))
	}
}

export const LOAD_RIGHT = 'LOAD_RIGHT'

export function loadRightComment(allie_id) {
	return  {
		type: LOAD_RIGHT, 
		allie_id,
	}
}

export const ADD_RIGHT_RESPONSE = 'ADD_RIGHT_RESPONSE'
export const _addRight = (comment) => ({type: ADD_RIGHT_RESPONSE, comment})


export const _pushRight = (comment) => ({type: PUSH_RIGHT, comment})

export const PUSH_RIGHT = 'PUSH_RIGHT'

export function pushRight(comment) {
	return (dispatch, getState) => {
		dispatch(_pushRight(comment))
	}
}

export const UPDATE_RIGHT_REQUEST = 'UPDATE_RIGHT_REQUEST'
export const _updateRightRequest = (id) =>({type: UPDATE_RIGHT_REQUEST, id})

export const UPDATE_RIGHT_RESPONSE = 'UPDATE_RIGHT_RESPONSE'
export const _updateRightResponse = (id, comment) =>({type: UPDATE_RIGHT_RESPONSE, id, comment})

export function updateRight(id, data, rmv_filenames) {
	return (dispatch, getState) => {
		dispatch(_updateRightRequest(id))
		axios.put(`${BASE_PATH}/api/comments/edit/${id}`, data, { 
    			params : {
					removedFilenames: rmv_filenames
				}})
			 .then(function (res) {
				dispatch(_updateRightResponse(id, res.data.comment))
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
			})
	}
}

export const DELETE_RIGHT_REQUEST = 'DELETE_RIGHT_REQUEST'
export const _deleteRightRequest = (id) =>({type: DELETE_RIGHT_REQUEST, id})

export const DELETE_RIGHT_RESPONSE = 'DELETE_RIGHT_RESPONSE'
export const _deleteRightResponse = (id) =>({type: DELETE_RIGHT_RESPONSE, id})

export function deleteRight(comment) {
	return (dispatch, getState) => {
		const id = comment.id;
		dispatch(_deleteRightRequest(id))
		axios.post(`${BASE_PATH}/api/comments/remove/${id}`)
			 .then(function (res) {
				dispatch(_deleteRightResponse(id))
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
		})
	}
}