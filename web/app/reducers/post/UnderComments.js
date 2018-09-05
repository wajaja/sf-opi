import Immutable, { List, Map, Set, fromJS } from 'immutable'
import { REHYDRATE, PURGE } from 'redux-persist'

import { UnderComments 
	as CommentsActions 
} from '../../actions/post'

export const initialState = {
	comments: [],
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


function UnderComments(state = initialState, action) {

	switch(action.type) {

		
		
		case CommentsActions.PUSH_UNDERCOMMENT:
			const obj 				= {};
			obj[action.comment.id] 	= action.comment;			
			const pComments			= List([obj]).concat(fromJS(state).get('comments'));
			return Object.assign({}, state, {comments: pComments.toJS()});

		case CommentsActions.LOAD_UNDERCOMMENTS_RESPONSE:
			const lComments = action.commets.map(function(comment) { return { [comment.id]: comment }})
			return fromJS(state).set('comments', lComments).toJS();
		
		case CommentsActions.LOAD_MORE_UNDERCOMMENTS_RESPONSE:
			const mComments	= List(fromJS(action.comments))
							  .concat(fromJS(state).get('comments'));
			return Object.assign({}, state, { comments: mComments.toJS() })

		case CommentsActions.UPDATE_UNDERCOMMENT_RESPONSE:
			const newList = Immutable.fromJS(state).get('comments').map(item => 
			    item.get(action.commentId) ? Immutable.fromJS({[action.commentId]: action.comment}) : item
			);
			return Object.assign({}, state, { comments: newList.toJS() });

		case CommentsActions.UPDATE_UNDERCOMMENTS_ON_LIKE:
			var comments = fromJS(state).get('comments').map(item => { 
				if(item.get(action.commentId)){
					var comment = item .get(action.commentId)
									.merge({
										"liked": action.liked, 
										"nbLikers": action.nbLikers
									});
					return  fromJS({[action.commentId]: comment.toJS()})
				} else {
					return item
				}
				
			});
			return Object.assign({}, state, { comments: comments.toJS() })

		case CommentsActions.DELETE_UNDERCOMMENT_REQUEST:
			const dNewComments = state.comments.filter(item => 
				action.commentId != ((typeof item[action.commentId] != 'undefined') ? item[action.commentId].id : '')
			);
			return Object.assign({}, state, { comments: dNewComments });

		case CommentsActions.MASK_UNDERCOMMENT_RESPONSE:
			const mNewComments = state.comments.filter(item => 
				action.commentId != ((typeof item[action.commentId] != 'undefined') ? item[action.commentId].id : '')
			);
			return Object.assign({}, state, { comments: mNewComments });

		return state;
	}
	return state
}

export default UnderComments;