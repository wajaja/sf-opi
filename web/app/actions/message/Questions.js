import axios 	from 'axios'
import { BASE_PATH } from '../../config/api'



export const LOAD_QUESTIONS_REQUEST = 'LOAD_QUESTIONS_REQUEST'

export const _loadQuestionsRequest = (postId) => ({type: LOAD_QUESTIONS_REQUEST})

export const LOAD_QUESTIONS_RESPONSE = 'LOAD_QUESTIONS_RESPONSE'

export const _loadQuestionsResponse = (questions) => ({type: LOAD_QUESTIONS_RESPONSE, questions})

export const LOAD_QUESTIONS = 'LOAD_QUESTIONS'
export function loadQuestions(postId, refer) {
	return {
		type: LOAD_QUESTIONS,
		postId,
		refer,
	}
}

export const LOAD_QUESTION = 'LOAD_QUESTION'
export function loadQuestion(postId, refer) {
	return {
		type: LOAD_QUESTION,
		postId,
		refer,
	}
}

export const LOAD_MORE_QUESTIONS_REQUEST = 'LOAD_MORE_QUESTIONS_REQUEST'

export const _loadMoreQuestionsRequest = (ids) => ({type: LOAD_MORE_QUESTIONS_REQUEST})

export const LOAD_MORE_QUESTIONS_RESPONSE = 'LOAD_QUESTIONS_RESPONSE'

export const _loadMoreQuestionsResponse = (questions) => ({type: LOAD_MORE_QUESTIONS_RESPONSE, questions})

export function loadMoreQuestions(ids, refer) {
	return (dispatch, getState) => {
		dispatch(_loadComentsRequest(ids))
		axios.get(`${BASE_PATH}/api/questions/loadsmore/`, { 
    			params : {
					ids: ids,
					refer: refer
				}})
			 .then(function (res) {
			 	console.log(res.data)
				// dispatch(_loadMoreQuestionsResponse(res.data))
			}, function(err) { 
				console.log('err :', err);
			})
	}
}

export const GET_QUESTION_RESPONSE = 'GET_QUESTION_RESPONSE'
export const _getQuestion = (question) => ({type: GET_QUESTION_RESPONSE, question})

export function getQuestion(questionId, refer) {
	return (dispatch, getState) => {
		axios.post(`${BASE_PATH}/api/questions/show/${questionId}`, { 
    			params : {
					refer: refer
				}})
			 .then(function (res) {
			 	console.log(res.data)
				// dispatch(_addQuestion(res.data))
			}, function(err) { 
				console.log('err :', err);
			})
	}
}

export const ADD_QUESTION_RESPONSE = 'ADD_QUESTION_RESPONSE'
export const _addQuestion = (question) => ({type: ADD_QUESTION_RESPONSE, question})


export const _pushQuestion = (question) => ({type: PUSH_QUESTION, question})

export const PUSH_QUESTION = 'PUSH_QUESTION'

export function pushQuestion(question) {
	return (dispatch, getState) => {
		dispatch(_pushQuestion(question))
	}
}

export const UPDATE_QUESTION_REQUEST = 'UPDATE_QUESTION_REQUEST'
export const _updateQuestionRequest = (questionId) =>({type: UPDATE_QUESTION_REQUEST, questionId})

export const UPDATE_QUESTION_RESPONSE = 'UPDATE_QUESTION_RESPONSE'
export const _updateQuestionResponse = (questionId, question) =>({type: UPDATE_QUESTION_RESPONSE, questionId, question})

export function updateQuestion(questionId, data, rmv_filenames) {
	return (dispatch, getState) => {
		dispatch(_updateQuestionRequest(questionId))
		axios.put(`${BASE_PATH}/api/questions/edit/${questionId}`, data, { 
    			params : {
					removedFilenames: rmv_filenames
				}})
			 .then(function (res) {
				dispatch(_updateQuestionResponse(questionId, res.data.question))
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

export const DELETE_QUESTION_REQUEST = 'DELETE_QUESTION_REQUEST'
export const _deleteQuestionRequest = (questionId) =>({type: DELETE_QUESTION_REQUEST, questionId})

export const DELETE_QUESTION_RESPONSE = 'DELETE_QUESTION_RESPONSE'
export const _deleteQuestionResponse = (questionId) =>({type: DELETE_QUESTION_RESPONSE, questionId})

export function deleteQuestion(question) {
	return (dispatch, getState) => {
		const questionId = question.id;
		dispatch(_deleteQuestionRequest(questionId))
		axios.post(`${BASE_PATH}/api/questions/remove/${questionId}`)
			 .then(function (res) {
				dispatch(_deleteQuestionResponse(questionId))
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

export const MASK_QUESTION_RESPONSE = 'MASK_QUESTION_RESPONSE'
export const _maskQuestionResponse = (questionId, question) =>({type: MASK_QUESTION_RESPONSE, questionId})

export function maskQuestion(question) {
	return (dispatch, getState) => {
		const questionId = question.id;
		axios.post(`${BASE_PATH}/api/questions/mask/${questionId}`)
			 .then(function (res) {
				dispatch(_maskQuestionResponse(questionId))
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