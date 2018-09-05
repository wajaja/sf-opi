import { REHYDRATE, PURGE } from 'redux-persist'
import Immutable, 
{ List, Map, Set, fromJS } from 'immutable'

import { 
	NewsFeed as NewsFeedActions 
} from '../../actions/social'

export const initialState = {
	news: [],
}

function NewsFeed(state = initialState, action) {

	switch(action.type) {

		
		
		case NewsFeedActions.ADD_POST: {
			const ImState 	= fromJS(state),
			news 			= ImState.get('news').concat(List([action.post]));
			return ImState.set('news', news)
						  .toJS();
		}

		case NewsFeedActions.LOAD: {
			const news = fromJS(state).get('news')
									  .concat(fromJS(action.NewsFeed))
			return fromJS(state).set('news', news)
								.toJS();
		}

		case NewsFeedActions.ADD_POSTS: {
			const news = fromJS(state).get('news')
									  .concat(fromJS(action.posts))
			return fromJS(state).set('news', news)
								.toJS();
		}

		// case PostsActions.LOAD_RESPONSE:
		// 	const ids = action.posts.map(function(post) { return post.id})
		// 	const postsById = action.posts.map(function(post) { return { [post.id]: post }})
		// 	return fromJS(state)
		// 			.set('postsById', postsById)
		// 			.set('postIds', ids)
		// 			.toJS();
		
		case NewsFeedActions.UPDATE_POST: {
			const news = state.news.map(item => 
			    (item.id === action.postId && item.type === action.postType) 
			    ? fromJS(action.post) : item
			);
			return Object.assign({}, state, { news: news })
		}

		case NewsFeedActions.UPDATE_POST_ON_LIKE: {
			var news = fromJS(state).get('news'),
			_news = news.map(item => { 
				console.log(item)
				if( item.get('id') === action.postId && 
				    item.get('type') === action.postType) {
					item.set({
						"liked": action.liked, 
						"nbLikers": action.nbLikers
					});
				   	console.log('selected', item.toJS())
					return item;
				} else {
					return item
				}
			});
			return Object.assign({}, state, { news: _news.toJS() })
		}

		case NewsFeedActions.ADD_TO_POST: {
			var news = fromJS(state).get('news');
			news.update(item => { 
				news.findIndex(function(item) {
					return  item.get('id') === action.postId && 
							item.get('type') === action.postType
				}), function(item) {
					return  item.merge({"nbAllies": action.opinionOrder});
				}
			});
			return Object.assign({}, state, { news: news.toJS() })
		}

		case NewsFeedActions.DELETE_POST: {
			const news = state.news.map(function(item) { 
				if(item.id !== action.postId && item.type !== action.postType) {
					return item;
				}
			});
			return Object.assign({}, state, {news: news})
		}

		case NewsFeedActions.MASK_POST: {
			const news = state.news.filter(function(item) { 
				if(item.id !== action.postId && item.type !== action.postType) {
					return item
				}
			});
			return Object.assign({}, state, { news : news })
		}
		return state
	}
	return state
}

export default NewsFeed;