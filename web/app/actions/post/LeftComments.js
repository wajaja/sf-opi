import axios from 'axios'
import _ from 'lodash'
import * as Authors from './Authors'
import { BASE_PATH } from '../../config/api'

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