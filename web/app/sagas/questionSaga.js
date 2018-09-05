import { call, put, fork,
		 select, all, takeEvery, 
		 takeLatest } 		from 'redux-saga/effects'

import * as axios 			from 'axios'
import _ 					from 'lodash'
import { BASE_PATH } 		from '../config/api'

import {toastr} from 'react-redux-toastr'

// const toastrOptions = {
//   timeOut: 3000, // by setting to 0 it will prevent the auto close
//   icon: (<myCustomIconOrAvatar />), // You can add any component you want but note the the with and height are 70px ;)
//   onShowComplete: () => console.log('SHOW: animation is done'),
//   onHideComplete: () => console.log('HIDE: animation is done'),
//   onCloseButtonClick: () => console.log('Close button was clicked'),
//   showCloseButton: false, // true by default
//   component: ( // this option will give you a func 'remove' as props
//     <MyCustomComponent myProp="myValue">
//       <span>Hello, World!</span>
//     </MyCustomComponent>
//   )
// }

// toastr.success('Title', 'Message', toastrOptions)
// toastr.info('The message', toastrOptions)
// toastr.warning('The title', 'The message')
// toastr.error('The message')
// toastr.removeByType('error') // Remove all toastrs with the type error.

const getQuestions = state => state.Questions.questions

const getSecrets = state => state.Responses.responses

function* loadQuestionForUser(postId, refer) {
    try {
    	yield put({type: 'LOAD_QUESTION_REQUEST', postId, refer})
       	const res 	= yield call(axios.get, `${BASE_PATH}/api/questions/find`, 
       								{ params : { 
       									postId: postId,
       									refer: refer 
       								}}
       							),
        question 	= res.data.question
        console.log(comments)
        yield put({type: 'LOAD_QUESTION_RESPONSE', question})
    } catch(e) {
    	if(e.response) {
			console.log(e.response.data);	
			console.log(e.response.status);
			console.log(e.response.headers);				
		} else if(e.request) {
			console.log(e.request);
		} else {
			console.log(e.message);
		}
		console.log(e.config);
    }
}

function* callLoadQuestionForUser({postId, refer}) {
	yield call(loadQuestionForUser, postId, refer)
}

/**
 * load
 * Gets single photo upload from API based on upload id
 * Redux Action
 * Reference: http://redux.js.org/docs/basics/Actions.html
 * @param id upload id
 * @returns {Function}
 */
 function* loadSecrets(questionId) {
    try {
    	yield put({type: 'LOAD_SECRETS_REQUEST', questionId})
       	const res 	= yield call(axios.get, `${BASE_PATH}/api/secrets/load/${questionId}`),

        secrets = res.data.secrets;
        yield put({type: 'LOAD_SECRETS_RESPONSE', secrets})
    } catch(e) {
    	if(e.response) {
			console.log(e.response.data);	
			console.log(e.response.status);
			console.log(e.response.headers);				
		} else if(e.request) {
			console.log(e.request);
		} else {
			console.log(e.message);
		}
		console.log(e.config);
    }
}


function* findSecrets(id) {
	const secrets = yield select(getSecrets),
    data = secrets.filter((s, i) => {
				        for(var prop in s) {
				            return s[prop].questionId === id;
				        }
					}).map((s, i) => {
				        for(var prop in s) {
				            return s[prop];
				        }
					})

	return data;
}

// function* callFindSecretsForUser({questionsId}) {
// 	var secrets = yield call(findSecrets, questionsId)
// 	console.log(secrets);
// 	if(!secrets.length) 
// 		secrets = yield call(loadSecrets, questionsId)
// }

function* callLoadSecrets({questionsId}) {
	var secrets = yield call(findSecrets, questionsId)
	console.log(secrets);
	if(!secrets.length) 
		secrets = yield call(loadSecrets, questionsId)
}

function* loadQuestions(postId, refer) {
    try {
    	yield put({type: 'LOAD_QUESTIONS_REQUEST', postId, refer})
       	const res 	= yield call(axios.get, `${BASE_PATH}/api/questions/load/${postId}`, { 
								            params : {
								                refer: refer
								            }}),
        questions = res.data.questions;
        yield put({type: 'LOAD_QUESTIONS_RESPONSE', questions})
    } catch(e) {
    	if(e.response) {
			console.log(e.response.data);	
			console.log(e.response.status);
			console.log(e.response.headers);				
		} else if(e.request) {
			console.log(e.request);
		} else {
			console.log(e.message);
		}
		console.log(e.config);
    }
}


function* findQuestions(postId, refer) {
	const questions = yield select(getQuestions),
    datas = questions.filter((q, i) => {
		        for(var prop in q) {
		        	return q[prop].postId === postId 
		        		&& q[prop].refer === refer;
		        }
			}).map((c, i) => {
		        for(var prop in q) {
		            return q[prop];
		        }
			})
	return datas;
}

function* callLoadQuestions({postId, refer}) {
	var questions = yield call(findQuestions, postId, refer)
	if(!questions.length) 
		questions = yield call(loadQuestions, postId, refer)
}

function* loadQuestion(postId, refer, userId) {
    try {
    	yield put({type: 'LOAD_QUESTIONS_REQUEST', postId, refer})
       	const res 	= yield call(axios.get, `${BASE_PATH}/api/questions/find/${postId}`, { 
								            params : {
								                refer: refer
								            }}),
        questions = res.data.questions;
        yield put({type: 'LOAD_QUESTIONS_RESPONSE', questions, postId, refer})
    } catch(e) {
    	if(e.response) {
			console.log(e.response.data);	
			console.log(e.response.status);
			console.log(e.response.headers);				
		} else if(e.request) {
			console.log(e.request);
		} else {
			console.log(e.message);
		}
		console.log(e.config);
    }
}

function* findQuestion(postId, refer, userId) {
	const questions = yield select(getQuestions),
    data = questions.filter((q, i) => {
				        for(var prop in q) {
				        	return q[prop].postId === postId 
				        		&& q[prop].createdBy.identity._id['$id'] === userId 
				        		&& q[prop].refer === refer;
				        }
					}).map((q, i) => {
				        for(var prop in q) {
				            return q[prop];
				        }
					})[0]

	return data;
}

function* callFindQuestionForUser({postId, refer, userId}) {
	var question = yield call(findQuestion, postId, refer, userId)
	console.log(question);
	if(!!question && question.id) {
		question = yield call(loadQuestion, postId, refer, userId)
		if(question.id) {
			var secrets = yield call(loadSecrets, question.id)
		}
	}
}

/*
Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
Allows concurrent fetches of user.
*/

export function* secretsSaga() {
	yield takeEvery("LOAD_SECRETS", callLoadSecrets);
}

export function* questionsSaga() {
	yield takeEvery("LOAD_QUESTIONS", callLoadQuestions);
	yield takeEvery("FIND_QUESTION_FOR_USER", callFindQuestionForUser);
}