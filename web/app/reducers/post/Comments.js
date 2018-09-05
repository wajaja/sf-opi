import Immutable, { List, Map, Set, fromJS } from 'immutable'
import { REHYDRATE, PURGE } from 'redux-persist'

import { Comments 
	as CommentsActions 
} from '../../actions/post'

export const initialState = {
	comments: [],
	leftcomments: [],
	rightcomments: [],
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


function Comments(state = initialState, action) {

	switch(action.type) {

		
		
		case CommentsActions.PUSH_COMMENT: {
				let comments,
				o 				= {},  
				comment 		= action.comment;
				o[comment.id] 	= comment;			
				comments		= List([o]).concat(fromJS(state).get('comments'));
				return Object.assign({}, state, {comments: comments.toJS()});
			}

		case CommentsActions.PUSH_LEFT: {
				let comments,
				o 				= {},  
				comment 		= action.comment;
				o[comment.id] 	= comment;			
				comments		= List([o]).concat(fromJS(state).get('leftcomments'));
				return Object.assign({}, state, {leftcomments: comments.toJS()});
			}

		case CommentsActions.PUSH_RIGHT: {
				let comments,
				o 				= {},
				comment 		= action.comment;
				o[comment.id] 	= comment;
				comments		= List([o]).concat(fromJS(state).get('rightcomments'));
				return Object.assign({}, state, {rightcomments: comments.toJS()});
			}

		case CommentsActions.LOAD_COMMENTS_RESPONSE: {
				let lists 		= action.comments.map((c) => ({[c.id]: c })),
				comments		= List(lists).concat(fromJS(state).get('comments'));
				return fromJS(state).set('comments', comments).toJS();
			}

		case CommentsActions.LOAD_MORE_COMMENTS_RESPONSE: {
				const comments	= List(fromJS(action.comments)).concat(fromJS(state).get('comments'));
				return Object.assign({}, state, { comments: comments.toJS() })
			}

		case CommentsActions.UPDATE_COMMENT_RESPONSE: {
				let id 	= action.id, 
				comment = action.comment,
				list 	= fromJS(state).get('comments')
							.map(item => item.get(id) ? fromJS({[id]: comment}) : item);
				return Object.assign({}, state, { comments: list.toJS() });
			}

		case CommentsActions.UPDATE_COMMENTS_ON_LIKE: {
				let id 		= action.id,
				liked		= action.liked,
				nbLikers 	= action.nbLikers,
				comments 	= fromJS(state).get('comments');				
				comments 	= comments.map(item => { 
								if(item.get(id)) {
									let comment = 
										item.get(id).merge({
														"liked": liked, 
														"nbLikers": nbLikers
													});
									return  fromJS({[id]: comment.toJS()})
								} else {
									return item
								}
							});
				return Object.assign({}, state, { comments: comments.toJS() })
			}

			case CommentsActions.UPDATE_LEFT_ON_LEGAL: {
				let id 		= action.id,
				legal		= action.legal,
				nbLegals 	= action.nbLegals,
				comments 	= fromJS(state).get('leftcomments');				
				comments 	= comments.map(item => { 
								if(item.get(id)) {
									let comment = item.get(id);
										comment.merge({
													"legal": legal, 
													"nbLegals": nbLegals
												});
									return  fromJS({[id]: comment.toJS()})
								} else {
									return item
								}
							});
				return Object.assign({}, state, { leftcomments: comments.toJS() })
			}

			case CommentsActions.UPDATE_RIGHT_ON_LEGAL: {
				let id 		= action.id,
				legal		= action.legal,
				nbLegals 	= action.nbLegals,
				comments 	= fromJS(state).get('rightcomments');				
				comments 	= comments.map(item => { 
								if(item.get(id)) {
									let comment = item.get(id);
										comment.merge({
													"legal": legal, 
													"nbLegals": nbLegals
												});
									return  fromJS({[id]: comment.toJS()})
								} else {
									return item
								}
							});
				return Object.assign({}, state, { rightcomments: comments.toJS() })
			}

		case CommentsActions.DELETE_COMMENT_REQUEST: {
				const dNewComments = state.comments.filter(item => 
					action.id != ((typeof item[action.id] != 'undefined') ? item[action.id].id : '')
				);
				return Object.assign({}, state, { comments: dNewComments });
			}

		case CommentsActions.MASK_COMMENT_RESPONSE: {
				const mNewComments = state.comments.filter(item => 
					action.id != ((typeof item[action.id] != 'undefined') ? item[action.id].id : '')
				);
				return Object.assign({}, state, { comments: mNewComments });
			}
		default: 
			return state;
	}
	return state
}

export default Comments;