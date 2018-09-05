import Immutable, { List, Map, Set, fromJS } from 'immutable'
import { REHYDRATE, PURGE } from 'redux-persist'

import { Posts 
	as PostsActions 
} from '../../actions/post'

export const initialState = {
	postsById: {},
	postIds: [],
	allies: [],
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


function Posts(state = initialState, action) {

	switch(action.type) {

		//nothing to do		
		case PostsActions.NEW_POST_RESPONSE: {
			// const ImState 	= fromJS(state),
			// postsById 		= state.postsById,
			// postIds 		= union([action.post.id], state.postIds);

			// postsById[action.post.id] = action.post
			// return ImState.set('postsById', postsById)
			// 			  .set('postIds', postIds)
			// 			  .toJS();
		}						  

		case PostsActions.LOAD_RESPONSE: {
			const ImState 	= fromJS(state),
			postsById 		= state.postsById,
			postIds 		= union([action.post.id], state.postIds);

			postsById[action.post.id] = action.post
			return ImState.set('postsById', postsById)
						  .set('postIds', postIds)
						  .toJS();
		}
		
		case PostsActions.UPDATE_POST_RESPONSE: {
			const postsById 		  = state.postsById;
			postsById[action.post.id] = action.post
			return Object.assign({}, state, { postsById: postsById })
		}

		case PostsActions.UPDATE_POST_ON_LIKE: {
			var postList = fromJS(state).get('postsById').map(item => { 
				if(item.get(action.postId)){
					var post = item .get(action.postId)
									.merge({
										"liked": action.liked, 
										"nbLikers": action.nbLikers
									});
					return  fromJS({[action.postId]: post.toJS()})
				} else {
					return item
				}
				
			});
			return Object.assign({}, state, { postsById: postList.toJS() })
		}

		case PostsActions.ADD_TO_POST: {
			var postList = fromJS(state).get('postsById').map(item => { 
				if(item.get(action.postId)){
					var post = item .get(action.postId).merge({"nbAllies": action.opinionOrder});
					return  fromJS({[action.postId]: post.toJS()})
				} else {
					return item
				}
				
			});
			return Object.assign({}, state, { postsById: postList.toJS() })
		}

		case PostsActions.DELETE_POST_REQUEST: {
			const dPostIds = Immutable.fromJS(state).get('postIds'),
			dNewPostsById = state.postsById.filter(item => 
				action.postId != ((typeof item[action.postId] != 'undefined') ? item[action.postId].id : '')
			);
			const dNewPostIds = List(dPostIds).filter(id => action.postId != id );
			return Object.assign({}, state, {
				postIds: dNewPostIds.toJS(),
				postsById: dNewPostsById
			})
		}

		case PostsActions.MASK_POST_RESPONSE: {
			const mPostIds = Immutable.fromJS(state).get('postIds'),
			mNewPostsById = state.postsById.filter(item => 
				action.postId != ((typeof item[action.postId] != 'undefined') ? item[action.postId].id : '')
			);
			const mNewPostIds = List(mPostIds).filter(id => action.postId != id );
			return Object.assign({}, state, {
				postIds: mNewPostIds.toJS(),
				postsById: mNewPostsById
			})
		}

		case PostsActions.PUSH_ALLIE: {
			var obj 				= {};
			obj[action.allie.id] 	= action.allie;			
			let allies			= List([obj]).concat(fromJS(state).get('allies'));
			return Object.assign({}, state, {allies: allies.toJS()});
		}

		return state
	}
	return state
}

export default Posts;