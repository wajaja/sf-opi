import axios 			from 'axios'
import _ 				from 'lodash'
import { BASE_PATH } 	from '../../config/api'


export const ADD_POST = 'FEED::ADD_POST'

export function addPost(post) {
	return {
		type: ADD_POST, 
		post
	}
}

export const ADD_POSTS = 'FEED::ADD_POSTS'

export function addPosts(posts) {
	return {
		type: ADD_POSTS, 
		posts
	}
}

export const UPDATE_POST = 'FEED::UPDATE_POST'

export function updatePost(postId, postType) {
	return {
		type: UPDATE_POST, 
		postId,
		postType,
	}
}

export const UPDATE_POST_ON_LIKE = 'FEED::UPDATE_POST_ON_LIKE'

export function updateOnLike(postId, postType, liked, nbLikers) {
	return {
		type: UPDATE_POST_ON_LIKE, 
		postId, 
		postType, 
		nbLikers, 
		liked,
	}
}

export const DELETE_POST = 'FEED::DELETE_POST'

export function deletePost(postId, postType) {
	return {
		type: DELETE_POST, 
		postId,
		postType,
	}
}

export const MASK_POST = 'MASK_POST_RESPONSE'
export const _maskPostResponse = (postId, post) =>({})

export function maskPost(postId, postType) {
	return {
		type: MASK_POST, 
		postId,
		postType,
	}
}

export const FAVORITE_POST = 'FEED::FAVORITE_POST'

export function favoritePost(postId, postType) {
	return {
		type: FAVORITE_POST, 
		postId,
		postType
	}
}