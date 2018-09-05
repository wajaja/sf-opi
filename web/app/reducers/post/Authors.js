
import Immutable, { List, Map, Set, fromJS } from 'immutable'
import { REHYDRATE, PURGE } from 'redux-persist'
import { Authors 
	as AuthorsActions 
} from '../../actions/post'

export const initialState = {
	authors: []
}

/**
 *Function union
 *@param Array left
 *@param Array right
 *@return Immutable List()
 */
function addOrUpdate(author, authors) {
	var list = authors, 
	obj 	= {}, 
	author_id = author.id;

	obj[author_id] 	= author;
	for (var i = 0; i<authors.length; i++) {
		for (var prop in authors[i]) {
			if (prop == author_id) list.splice(i, 1);
		}
	}
	list.push(obj)
	return List(list);
}

function Authors(state = initialState, action) {

	switch(action.type) {

		
		
		case AuthorsActions.PUSH_AUTHOR:
			var authors 		= addOrUpdate(action.author, state.authors);
			return Object.assign({}, state, {authors: authors.toJS()});

		case AuthorsActions.LOAD_AUTHORS_RESPONSE:
			const authors = action.authors.map(function(post) { 
				return { 
					[author.id]: author 
				}
			})
			return Immutable.fromJS(state).set('authors', authors)
						    .toJS();
		
		case AuthorsActions.UPDATE_AUTHOR_RESPONSE:
			const newList = Immutable.fromJS(state).get('authors').map(item => 
			    item.get(action.authorId) ? Immutable.fromJS({[action.authorId]: action.author}) : item
			);
			return Object.assign({}, state, { authors: newList.toJS() })

		return state
	}
	return state
}

export default Authors;