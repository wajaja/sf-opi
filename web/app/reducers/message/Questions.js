import Immutable, {
 List, Map, Set, fromJS 
} 							from 'immutable'
import { REHYDRATE, PURGE } from 'redux-persist'

import { 
	Questions as QuestionsActions 
} 							from '../../actions/message'

export const initialState = {
	questions: [],
}

/**
 *Function union
 *@param Array left
 *@param Array right
 *@return Immutable List()
 */
function union(left, right) {
	var list = [], screen = {};

	for(var i=0; i<left.length; i++) {
		if(!screen[left[i]]) list.push(left[i]);
		screen[left[i]] = 1;
	}

	for (var i =0; i<right.length; i++) {
		if (!screen[right[i]]) list.push(right[i]);
		screen[right[i]] = 1;
	}
	return List(list);
}


function Questions(state = initialState, action) {

	switch(action.type) {

		
		
		case QuestionsActions.PUSH_QUESTION: {
			const obj 				= {};
			obj[action.question.id] = action.question;			
			const questions		= List([obj]).concat(fromJS(state).get('questions'));
			return Object.assign({}, state, {questions: questions.toJS()});
		}

		case QuestionsActions.LOAD_QUESTIONS_RESPONSE: {
			const questions = action.questions.map((q) => ({[q.id]: q }))
			return fromJS(state).set('questions', questions).toJS();
		}

		case QuestionsActions.LOAD_MORE_QUESTIONS_RESPONSE: {
			const questions	= List(fromJS(action.questions))
								.concat(fromJS(state)
								.get('questions'));
			return Object.assign({}, state, { questions: questions.toJS() })
		}

		case QuestionsActions.UPDATE_QUESTION_RESPONSE:{
			const list = fromJS(state)
						.get('questions')
						.map(q => q.get(action.questionId) ? 
						 			fromJS({[action.questionId]: action.question}) : q);
			return Object.assign({}, state, { questions: list.toJS() });
		}

		case QuestionsActions.DELETE_QUESTION_REQUEST:{
			const list = state.questions
						.filter(q => action.questionId != ((typeof q[action.questionId] != 'undefined') ?
						 			q[action.questionId].id : ''));
					return Object.assign({}, state, { questions: list });
		}

		case QuestionsActions.MASK_QUESTION_RESPONSE:{
			const list = state.questions
						.filter(q => action.questionId != ((typeof q[action.questionId] != 'undefined') ? 
							q[action.questionId].id : ''));
					return Object.assign({}, state, { questions: list });
		}

		return state;
	}
	return state
}

export default Questions;