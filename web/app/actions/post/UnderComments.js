import axios from 'axios'
import * as Authors from './Authors'
import { BASE_PATH } from '../../config/api'



export const LOAD_UNDERCOMMENTS_REQUEST = 'LOAD_UNDERCOMMENTS_REQUEST'

export const _loadCommentsRequest = (postId) => ({type: LOAD_UNDERCOMMENTS_REQUEST})

export const LOAD_UNDERCOMMENTS_RESPONSE = 'LOAD_UNDERCOMMENTS_RESPONSE'

export const _loadCommentsResponse = (comments) => ({type: LOAD_UNDERCOMMENTS_RESPONSE, comments})

export function loadComments(postId) {
	return (dispatch, getState) => {
		dispatch(_loadCommentsRequest(postId))
		axios.put(`${BASE_PATH}/api/undercomments/loads/postId`)
			 .then(function (res) {
			 	console.log(res.data)
				// dispatch(_loadCommentsResponse(res.data))
			}, function(err) { 
				console.log('err :', err);
			})
	}
}

export const LOAD_MORE_UNDERCOMMENTS_REQUEST = 'LOAD_MORE_UNDERCOMMENTS_REQUEST'

export const _loadMoreCommentsRequest = (ids) => ({type: LOAD_MORE_UNDERCOMMENTS_REQUEST})

export const LOAD_MORE_UNDERCOMMENTS_RESPONSE = 'LOAD_UNDERCOMMENTS_RESPONSE'

export const _loadMoreCommentsResponse = (comments) => ({type: LOAD_MORE_UNDERCOMMENTS_RESPONSE, comments})

export function loadMoreComments(ids) {
	return (dispatch, getState) => {
		dispatch(_loadComentsRequest(ids))
		axios.get(`${BASE_PATH}/api/undercomments/loadsmore/`, { 
    			params : {
					ids: ids
				}})
			 .then(function (res) {
			 	console.log(res.data)
				// dispatch(_loadMoreCommentsResponse(res.data))
			}, function(err) { 
				console.log('err :', err);
			})
	}
}

export const UPDATE_UNDERCOMMENTS_ON_LIKE = 'UPDATE_UNDERCOMMENTS_ON_LIKE'

export const _updateOnLike = (commentId, nbLikers, liked) =>({type: UPDATE_UNDERCOMMENTS_ON_LIKE, commentId, nbLikers, liked})

export function updateOnLike(commentId, data) {
	return (dispatch, getState) => {
		dispatch(_updateOnLike(commentId, data.nbLikers, data.liked))
	}
}

export const GET_UNDERCOMMENT_RESPONSE = 'GET_UNDERCOMMENT_RESPONSE'
export const _getComment = (comment) => ({type: GET_UNDERCOMMENT_RESPONSE, comment})

export function getComment(commentId) {
	return (dispatch, getState) => {
		axios.get(`${BASE_PATH}/api/undercomments/show/${commentId}`)
			 .then(function (res) {
			 	console.log(res.data)
				// dispatch(_addComment(res.data))
			}, function(err) { 
				console.log('err :', err);
			})
	}
}

export const ADD_UNDERCOMMENT_RESPONSE = 'ADD_UNDERCOMMENT_RESPONSE'
export const _addComment = (comment) => ({type: ADD_UNDERCOMMENT_RESPONSE, comment})


export const _pushComment = (comment) => ({type: PUSH_UNDERCOMMENT, comment})

// export function pushComment(comment) {
// 	return (dispatch, getState) => {
// 		dispatch(_pushComment(comment))
// 	}
// }

export const PUSH_UNDERCOMMENT = 'PUSH_UNDERCOMMENT'

export function pushComment(comment) {
	return (dispatch, getState) => {
		dispatch(_pushComment(comment))
	}
}

export const UPDATE_UNDERCOMMENT_REQUEST = 'UPDATE_UNDERCOMMENT_REQUEST'
export const _updateCommentRequest = (commentId) =>({type: UPDATE_UNDERCOMMENT_REQUEST, commentId})

export const UPDATE_UNDERCOMMENT_RESPONSE = 'UPDATE_UNDERCOMMENT_RESPONSE'
export const _updateCommentResponse = (commentId, comment) =>({type: UPDATE_UNDERCOMMENT_RESPONSE, commentId, comment})

export function updateComment(commentId, data, rmv_filenames) {
	return (dispatch, getState) => {
		dispatch(_updateCommentRequest(commentId))
		axios.put(`${BASE_PATH}/api/undercomments/edit/${commentId}`, data, { 
    			params : {
					removedFilenames: rmv_filenames
				}})
			 .then(function (res) {
				dispatch(_updateCommentResponse(commentId, res.data.comment))
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

export const DELETE_UNDERCOMMENT_REQUEST = 'DELETE_UNDERCOMMENT_REQUEST'
export const _deleteCommentRequest = (commentId) =>({type: DELETE_UNDERCOMMENT_REQUEST, commentId})

export const DELETE_UNDERCOMMENT_RESPONSE = 'DELETE_UNDERCOMMENT_RESPONSE'
export const _deleteCommentResponse = (commentId) =>({type: DELETE_UNDERCOMMENT_RESPONSE, commentId})

export function deleteComment(comment) {
	return (dispatch, getState) => {
		const commentId = comment.id;
		dispatch(_deleteCommentRequest(commentId))
		axios.post(`${BASE_PATH}/api/undercomments/remove/${commentId}`)
			 .then(function (res) {
				dispatch(_deleteCommentResponse(commentId))
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

export const MASK_UNDERCOMMENT_RESPONSE = 'MASK_UNDERCOMMENT_RESPONSE'
export const _maskCommentResponse = (commentId, comment) =>({type: MASK_UNDERCOMMENT_RESPONSE, commentId})

export function maskComment(comment) {
	return (dispatch, getState) => {
		const commentId = comment.id;
		axios.post(`${BASE_PATH}/api/undercomments/mask/${commentId}`)
			 .then(function (res) {
				dispatch(_maskCommentResponse(commentId))
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