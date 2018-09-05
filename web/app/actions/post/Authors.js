import axios from 'axios'
import { BASE_PATH } from '../../config/api'

export const LOAD_AUTHORS_REQUEST = 'LOAD_AUTHORS_REQUEST'

export const _loadAuthorsRequest = () => ({type: LOAD_AUTHORS_REQUEST})

export const LOAD_AUTHORS_RESPONSE = 'LOAD_AUTHORS_RESPONSE'

export const _loadAuthorsResponse = (authors) => ({type: LOAD_AUTHORS_RESPONSE, authors})

export function loadAuthors() {
	return (dispatch, getState) => {
		dispatch(_loadAuthorsRequest(postId))
		axios.get(`${BASE_PATH}/api/users/authors`)
			 .then(function (res) {
			 	console.log(res.data)
				// dispatch(_loadAuthorsResponse(res.data))
			}, function(err) { 
				console.log('err :', err);
			})
	}
}


export const PUSH_AUTHOR = 'PUSH_AUTHOR'
export const _pushAuthor = (author) => ({type: PUSH_AUTHOR, author})

export function pushAuthor(author) {
	return (dispatch, getState) => {
		dispatch(_pushAuthor(author))
		// axios.get(`${BASE_PATH}/api/users/author/${id}`)
		// 	 .then(function (res) {
		// 	 	console.log(res.data)
		// 	}, function(err) { 
		// 		console.log('err :', err);
		// 	})
	}
}