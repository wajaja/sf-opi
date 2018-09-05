import { REHYDRATE, PURGE } from 'redux-persist'
import { Post
	as PostActions 
} from '../../actions/post'

export const initialState = {
	option: false
}

function Post(state= [], action) {

	switch(action.type) {

		

		case action.TOGGLE_OPTION:
			return Object.assign({}, state, {
				option:
			})

		case action.NEW_POST_RESPONSE:
			return Object.assign({}, state, {
				posts: [
					action.post.id: Object.assign({}, action.post),
				]
				...state.posts
			})

		return state
	}
}

export default Post;