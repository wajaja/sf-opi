import axios from 'axios'
import _ from 'lodash'
import * as Authors from './Authors'
import { BASE_PATH } from '../../config/api'

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