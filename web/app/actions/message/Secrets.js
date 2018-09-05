import axios from 'axios'
import { BASE_PATH } from '../../config/api'



export const LOAD_SECRETS_REQUEST = 'LOAD_SECRETS_REQUEST'

export const _loadSecretsRequest = (questionId) => ({type: LOAD_SECRETS_REQUEST})

export const LOAD_SECRETS_RESPONSE = 'LOAD_SECRETS_RESPONSE'

export const _loadSecretsResponse = (secrets) => ({type: LOAD_SECRETS_RESPONSE, secrets})

export const LOAD_SECRETS = 'LOAD_SECRETS'
export function loadSecrets(questionId) {
	return {
		type: LOAD_SECRETS,
		questionId
	}
}

export const LOAD_MORE_SECRETS_REQUEST = 'LOAD_MORE_SECRETS_REQUEST'

export const _loadMoreSecretsRequest = (ids) => ({type: LOAD_MORE_SECRETS_REQUEST})

export const LOAD_MORE_SECRETS_RESPONSE = 'LOAD_SECRETS_RESPONSE'

export const _loadMoreSecretsResponse = (secrets) => ({type: LOAD_MORE_SECRETS_RESPONSE, secrets})

export function loadMoreSecrets(ids) {
	return (dispatch, getState) => {
		dispatch(_loadComentsRequest(ids))
		axios.get(`${BASE_PATH}/api/secrets/loadsmore/`, { 
    			params : {
					ids: ids
				}})
			 .then(function (res) {
			 	console.log(res.data)
				// dispatch(_loadMoreSecretsResponse(res.data))
			}, function(err) { 
				console.log('err :', err);
			})
	}
}

export const GET_SECRET_RESPONSE = 'GET_SECRET_RESPONSE'
export const _getSecret = (secret) => ({type: GET_SECRET_RESPONSE, secret})

export function getSecret(secretId) {
	return (dispatch, getState) => {
		axios.post(`${BASE_PATH}/api/secrets/get/${secretId}`)
			 .then(function (res) {
			 	console.log(res.data)
				// dispatch(_addResponse(res.data))
			}, function(err) { 
				console.log('err :', err);
			})
	}
}

export const ADD_SECRET_RESPONSE = 'ADD_SECRET_RESPONSE'
export const _addSecret = (secret) => ({type: ADD_SECRET_RESPONSE, secret})

export const _pushSecret = (secret) => ({type: PUSH_RESPONSE, secret})

export const PUSH_SECRET = 'PUSH_SECRET'

export function pushSecret(secret) {
	return (dispatch, getState) => {
		dispatch(_pushSecret(secret))
	}
}

export const UPDATE_SECRET_REQUEST = 'UPDATE_SECRET_REQUEST'
export const _updateSecretRequest = (secretId) =>({type: UPDATE_SECRET_REQUEST, secretId})

export const UPDATE_SECRET_RESPONSE = 'UPDATE_SECRET_RESPONSE'
export const _updateSecretResponse = (secretId, secret) =>({type: UPDATE_SECRET_RESPONSE, secretId, secret})

export function updateSecret(secretId, data, rmv_filenames) {
	return (dispatch, getState) => {
		dispatch(_updateSecretRequest(secretId))
		axios.put(`${BASE_PATH}/api/secrets/edit/${secretId}`, data, { 
    			params : {
					removedFilenames: rmv_filenames
				}})
			 .then(function (res) {
				dispatch(_updateSecretResponse(secretId, res.data.secret))
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

export const DELETE_SECRET_REQUEST = 'DELETE_SECRET_REQUEST'
export const _deleteSecretRequest = (secretId) =>({type: DELETE_SECRET_REQUEST, secretId})

export const DELETE_SECRET_RESPONSE = 'DELETE_SECRET_RESPONSE'
export const _deleteSecretResponse = (secretId) =>({type: DELETE_SECRET_RESPONSE, secretId})

export function deleteSecret(secret) {
	return (dispatch, getState) => {
		const secretId = secret.id;
		dispatch(_deleteSecretRequest(secretId))
		axios.post(`${BASE_PATH}/api/secrets/remove/${secretId}`)
			 .then(function (res) {
				dispatch(_deleteSecretResponse(secretId))
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

export const MASK_SECRET_RESPONSE = 'MASK_SECRET_RESPONSE'
export const _maskSecretResponse = (secretId, secret) =>({type: MASK_SECRET_RESPONSE, secretId})

export function maskResponse(secret) {
	return (dispatch, getState) => {
		const secretId = response.id;
		axios.post(`${BASE_PATH}/api/secrets/mask/${secretId}`)
			 .then(function (res) {
				dispatch(_maskSecretResponse(secretId))
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