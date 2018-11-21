import * as axios from 'axios'
import { Authors } from '../post'
import _ 			from 'lodash'
import { BASE_PATH } from '../../config/api'


/**
* SEEING_MESSAGE_REQUEST
* @type {string}
*/
export const SHOW_ALERT_REQUEST = "MESSAGE::SHOW_ALERT_REQUEST"

/**
* _seeingRequest
* @private
*/
const _showAlertRequest = () => ({type: SHOW_ALERT_REQUEST, })

/**
* SEEING_MESSAGE_RESPONSE
* @type {string}
*/
export const SHOW_ALERT_RESPONSE = "MESSAGE::SHOW_ALERT_RESPONSE"

/**
* _seeingResponse
* @private
*/
const _showAlertResponse = (data) => ({type: SHOW_ALERT_RESPONSE, data, })

export function showAlert(nbAlerts) {
	return (dispatch, getState) => {

		axios.get(`${BASE_PATH}/api/messages/alert/show`)
		.then(
			(res) => {
				dispatch(_showAlertResponse(res.data))
			},
			(err) => {
				console.log('error in messages code')
			}
		)
	}
}


/**
* SEEING_MESSAGE_REQUEST
* @type {string}
*/
export const HIDE_ALERT_REQUEST = "MESSAGE::HIDE_ALERT_REQUEST"

/**
* _seeingRequest
* @private
*/
const _hideAlertRequest = () => ({type: HIDE_ALERT_REQUEST, })

/**
* SEEING_MESSAGE_RESPONSE
* @type {string}
*/
export const HIDE_ALERT_RESPONSE = "MESSAGE::HIDE_ALERT_RESPONSE"

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
		axios.get(`${BASE_PATH}/api/messages/alert/hide`)
		.then(res => {
			dispatch(_hideAlertResponse(res.data))
		})
	}
}

export const CREATE_THREAD_REQUEST = 'MESSAGE::CREATE_THREAD_REQUEST'
export const _createThreadRequest = () =>({type: CREATE_THREAD_REQUEST})

export const CREATE_THREAD_RESPONSE = 'MESSAGE::CREATE_THREAD_RESPONSE'
export const _createThreadResponse = (thread) =>({type: CREATE_THREAD_RESPONSE, thread})

export function createThread(data, uniqueString) {
	return (dispatch, getState) => {
		return new Promise(function (resolve, reject) {
			dispatch(_createThreadRequest())
			axios.post(`${BASE_PATH}/api/threads/create?uniqueString=${uniqueString}`, data)
			.then(function (res) {
				if(typeof res.data === 'object') {
					const { thread, message } = res.data
					dispatch(Authors.pushAuthor(message.sender))
					dispatch(_createThreadResponse(thread))
					dispatch(_pushMessage(message))
					resolve(thread)
				}

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
				reject(err)
			});
		})
	}
}


export const LOAD_THREADS_REQUEST = 'MESSAGE::LOAD_THREADS_REQUEST'

export const _loadThreadsRequest = (page) => ({type: LOAD_THREADS_REQUEST})

export const LOAD_THREADS_RESPONSE = 'MESSAGE::LOAD_THREADS_RESPONSE'

export const _loadThreadsResponse = (threads, messages) => ({type: LOAD_THREADS_RESPONSE, threads, messages})

export function loadThreads(page) {
	return (dispatch, getState) => {
		dispatch(_loadThreadsRequest(page))
		axios.get(`${BASE_PATH}/api/messages/threads/load/`, { 
    			params : {
					page: page
				}})
			 .then(function (res) {
			 	console.log(res.data)
				dispatch(_loadThreadsResponse(res.data.threads, res.data.messages))
			}, function(err) { 
				console.log('err :', err);
			})
	}
}

export const ADD_THREAD_RESPONSE = 'MESSAGE::ADD_THREAD_RESPONSE'
export const _addThread = (thread) => ({type: ADD_THREAD_RESPONSE, thread})


export const _pushThread = (thread) => ({type: PUSH_THREAD, thread})

export const PUSH_THREAD = 'PUSH_THREAD'

export function pushThread(thread) {
	return (dispatch, getState) => {
		dispatch(_pushThread(thread))
	}
}

export const UPDATE_THREAD_REQUEST = 'MESSAGE::UPDATE_THREAD_REQUEST'
export const _updateThreadRequest = (threadId) =>({type: UPDATE_THREAD_REQUEST, threadId})

export const UPDATE_THREAD_RESPONSE = 'UPDATE_THREAD_RESPONSE'
export const _updateThreadResponse = (threadId, thread) =>({type: UPDATE_THREAD_RESPONSE, threadId, thread})

export function updateThread(threadId, data, rmv_filenames) {
	return (dispatch, getState) => {
		dispatch(_updateThreadRequest(threadId))
		axios.put(`${BASE_PATH}/api/threads/edit/${threadId}`, data, { 
    			params : {
					removedFilenames: rmv_filenames
				}})
			 .then(function (res) {
				dispatch(_updateThreadResponse(threadId, res.data.thread))
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

export const DELETE_THREAD_REQUEST = 'MESSAGE::DELETE_THREAD_REQUEST'
export const _deleteThreadRequest = (threadId) =>({type: DELETE_THREAD_REQUEST, threadId})

export const DELETE_THREAD_RESPONSE = 'MESSAGE::DELETE_THREAD_RESPONSE'
export const _deleteThreadResponse = (threadId) =>({type: DELETE_THREAD_RESPONSE, threadId})

export function deleteThread(thread) {
	return (dispatch, getState) => {
		const threadId = thread.id;
		dispatch(_deleteThreadRequest(threadId))
		axios.post(`${BASE_PATH}/api/threads/remove/${threadId}`)
			 .then(function (res) {
				dispatch(_deleteThreadResponse(threadId))
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

export const LOAD_THREAD_RESPONSE = 'MESSAGE::LOAD_THREAD_RESPONSE'
export const _loadThreadResponse = (thread, messages) => ({type: LOAD_THREAD_RESPONSE, thread, messages})

export function loadThread(threadId) {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			axios.get(`${BASE_PATH}/api/threads/show/${threadId}`)
				 .then(function (res) {
				 	const { thread, messages } = res.data
					dispatch(_loadThreadResponse(thread, messages))
					resolve(thread)
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
					// console.log('err :', err);
					reject(err)
				})
		})
	}
}

/*export const LOAD_MESSAGES_REQUEST = 'MESSAGE::LOAD_MESSAGES_REQUEST'

export const _loadMessagesRequest = (threadId, page) => ({type: LOAD_MESSAGES_REQUEST})

export const LOAD_MESSAGES_RESPONSE = 'LOAD_MESSAGES_RESPONSE'

export const _loadMessagesResponse = (threadId, messages) => ({type: LOAD_MESSAGES_RESPONSE, thread, messages})

export function loadMessages(threadId, page) {
	return (dispatch, getState) => {
		dispatch(_loadMessagesRequest(threadId, page))
		axios.get(`${BASE_PATH}/api/messages/load/${threadId}`, { 
    			params : {
					page: page
				}})
			 .then(function (res) {
			 	console.log(res.data)
			 	const messages = res.data
				dispatch(_loadMessagesResponse(threadId, messages))
			}, function(err) { 
				console.log('err :', err);
			})
	}
}*/

export const GET_MESSAGE_RESPONSE = 'GET_MESSAGE_RESPONSE'
export const _getMessage = (message) => ({type: GET_MESSAGE_RESPONSE, message})

export function getMessage(messageId) {
	return (dispatch, getState) => {
		axios.post(`${BASE_PATH}/api/messages/get/${messageId}`)
			 .then(function (res) {
			 	console.log(res.data)
				// dispatch(_addResponse(res.data))
			}, function(err) { 
				console.log('err :', err);
			})
	}
}

export const INBOX_MESSAGES_RESPONSE = 'INBOX_MESSAGES_RESPONSE'
export const _inboxMessages = (data) => ({type: INBOX_MESSAGES_RESPONSE, data})

export function inbox() {
	return (dispatch, getState) => {
		axios.get(`${BASE_PATH}/api/messages/inbox`)
			 .then(function (res) {
				dispatch(_inboxMessages(res.data))
				console.log(res.data)
			}, function(err) { 
				console.log('err :', err);
			})
	}
}

export const LIST_MESSAGES_REQUEST = 'LIST_MESSAGES_REQUEST'
export const _loadMessagesReq = () => ({type: LIST_MESSAGES_REQUEST,})

export const LIST_MESSAGES_RESPONSE = 'LIST_MESSAGES_RESPONSE'
export const _loadMessages = (data, page) => ({type: LIST_MESSAGES_RESPONSE, data, page})

export function loadMessages(page) {
	return (dispatch, getState) => 
		new Promise(function (resolve, reject) {
			dispatch(_loadMessagesReq())
			axios.get(`${BASE_PATH}/api/messages/load/${page}`)
				 .then(function (res) {
					dispatch(_loadMessages(res.data, page))
					console.log(res.data)
					resolve(res.data)
				}, function(err) { 
					console.log('err :', err);
					reject(err)
				})

		})
}

export const CREATE_MESSAGE_REQUEST = 'MESSAGE::CREATE_MESSAGE_REQUEST'
export const _createMessageRequest = (threadId) => ({ type: CREATE_MESSAGE_REQUEST, threadId })

export const CREATE_MESSAGE_RESPONSE = 'MESSAGE::CREATE_MESSAGE_RESPONSE'
export const _createMessageResponse = (threadId, message) => ({ type: CREATE_MESSAGE_RESPONSE, threadId, message })


export function createMessage(threadId, data) {
	return (dispatch, getState) => {
		dispatch(_createMessageRequest(threadId))
		return new Promise((resolve, reject) => {
			axios.post(`${BASE_PATH}/api/messages/create/${threadId}`, data) 
			.then(
				(res) => {
					console.log('message created with ', res.data)
					const { message } = res.data
					if(typeof message === 'object') {
						dispatch(_createMessageResponse(threadId, message))
						dispatch(Authors.pushAuthor(message.sender))
						console.log('message sended')
						resolve(message);
					}
				}, (err) => {
					console.log('some error hapens when send message')
					reject(err)
			})
		})
	}
}

export const PUSH_MESSAGE = 'MESSAGES::PUSH_MESSAGE'
export const _pushMessage = (message) => ({type: PUSH_MESSAGE, message})

export function pushMessage(message) {
	return (dispatch, getState) => {
		dispatch(_pushMessage(message))
	}
}

export const UPDATE_MESSAGE_REQUEST = 'UPDATE_MESSAGE_REQUEST'
export const _updateMessageRequest = (messageId) =>({type: UPDATE_MESSAGE_REQUEST, messageId})

export const UPDATE_MESSAGE_RESPONSE = 'UPDATE_MESSAGE_RESPONSE'
export const _updateMessageResponse = (messageId, message) =>({type: UPDATE_MESSAGE_RESPONSE, messageId, message})

export function updateMessage(messageId, data, rmv_filenames) {
	return (dispatch, getState) => {
		dispatch(_updateMessageRequest(messageId))
		axios.put(`${BASE_PATH}/api/messages/edit/${messageId}`, data, { 
    			params : {
					removedFilenames: rmv_filenames
				}})
			 .then(function (res) {
				dispatch(_updateMessageResponse(messageId, res.data.message))
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

export const DELETE_MESSAGE_REQUEST = 'DELETE_MESSAGE_REQUEST'
export const _deleteMessageRequest = (messageId) =>({type: DELETE_MESSAGE_REQUEST, messageId})

export const DELETE_MESSAGE_RESPONSE = 'DELETE_MESSAGE_RESPONSE'
export const _deleteMessageResponse = (messageId) =>({type: DELETE_MESSAGE_RESPONSE, messageId})

export function deleteMessage(message) {
	return (dispatch, getState) => {
		const messageId = message.id;
		dispatch(_deleteMessageRequest(messageId))
		axios.post(`${BASE_PATH}/api/messages/remove/${messageId}`)
			 .then(function (res) {
				dispatch(_deleteMessageResponse(messageId))
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

export const MASK_MESSAGE_RESPONSE = 'MASK_MESSAGE_RESPONSE'
export const _maskMessageResponse = (messageId, message) =>({type: MASK_MESSAGE_RESPONSE, messageId})

export function maskResponse(message) {
	return (dispatch, getState) => {
		const messageId = response.id;
		axios.post(`${BASE_PATH}/api/messages/mask/${messageId}`)
			 .then(function (res) {
				dispatch(_maskMessageResponse(messageId))
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

export const TOGGLE_ONLINE_LIST = "MESSAGE::TOGGLE_ONLINE_LIST"

const _toggleOnlineList = () => ({type: TOGGLE_ONLINE_LIST, })

/**
* seeingMessages
* @public
*/
export function toggleOnlineList() {
	return dispatch => {
		dispatch(_toggleOnlineList())
		//to do more controle here
	}
}

// toggleOnlineList