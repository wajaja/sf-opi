import * as axios                       from 'axios'
import * as querystring                 from 'querystring'
import _                                from 'lodash'

import { BASE_PATH }                    from '../../config/api'
import { Posts as PostsActions, 
         Photo as PhotoActions,
         Photos as PhotosActions,
         Comments as CommentsActions,  
         UnderComments as UnderCommentsActions 
     }                                      from '../../actions'

/**
 * LOAD
 * @type {string}
 */
export const LOAD = 'LIKE_LOAD'

/**
 * ADD_LIKE
 * @type {string}
 */
export const ADD_LIKE = 'ADD_LIKE'

/**
 * _hnadleAddLikeRequest
 * @param postID
 * @private
 */
export const _handleAddLikeRequest = (objId, type) => ({ type: ADD_LIKE, objId, type,})

/**
 * _handleAddLikeResponse
 * @param postID
 * @param response
 * @private
 */
export const _handleAddLikeResponse = (objId, type, response) => ({ type: ADD_LIKE, objId, type, response, })

/**
 * like
 * Posts a 'like' to the API for a user and post
 * @param postID post id
 * @returns {Function}
 */
export const like = (postId, refer) => 
    (dispatch, getState) => 
        new Promise(function (resolve, reject) {
            dispatch({type: 'LIKE_REQUEST', postId, refer})
            axios.post(`${BASE_PATH}/api/likes/add`, {
                params :{
                    postId: postId,
                    refer: refer
                }
            })
            .then(function (res) {
                    const data = res.data.data;
                    if(refer === 'post') {
                        dispatch(PostsActions.updateOnLike(data.id, data))
                    } else if(refer === 'picture') {
                        dispatch(PhotoActions.updateOnLike(data.id, data))
                    } else if(refer === 'comment') {
                        dispatch(CommentsActions.updateOnLike(data.id, data))
                    } else if(refer === 'undercomment') {
                        dispatch(UnderCommentsActions.updateOnLike(data.id, data))
                    }
                    dispatch({type: 'LIKE_RESPONSE', postId, data})
                    resolve(data)
                }, function(error) {                     
                    dispatch({type: 'LIKE_FAILLURE', error})
                    reject(error)
            });
        })

/**
 * DELETE_LIKE
 * @type {string}
 */
export const DELETE_LIKE = 'DELETE_LIKE'

/**
 * _handleDeleteLikeRequest
 * @param postID
 * @private
 */
export const _handleDeleteLikeRequest = (objId, type) => ({ type: DELETE_LIKE, objId, type,})

/**
 * _handleDeleteLikeResponse
 * @param postID
 * @param response
 * @private
 */
export const _handleDeleteLikeResponse = (objId, type, response) => ({ type: DELETE_LIKE, objId, type, response, })

/**
 * deleteLike
 * Removes like (unlikes) for a user and a post
 * @param postID post id
 * @returns {Function}
 */

export const deleteLike = (postId, refer) => 
    (dispatch, getState) => 
        new Promise(function (resolve, reject) {
            dispatch({type: 'LIKE_REQUEST', postId, refer})
            axios.delete(`${BASE_PATH}/api/likes/delete`, { 
                params : {
                    refer: refer,
                    postId: postId,
                }})
            .then(function (res) {
                    const data = res.data.data; //data = {id as postId, liked, nbLikers, refer}
                    if(refer === 'post') {
                        dispatch(PostsActions.updateOnLike(data.id, data))
                    } else if(refer === 'picture') {
                        dispatch(PhotosActions.updateOnLike(data.id, data))
                    } else if(refer === 'comment') {
                        dispatch(CommentsActions.updateOnLike(data.id, data))
                    } else if(refer === 'undercomment') {
                        dispatch(UnderCommentsActions.updateOnLike(data.id, data))
                    }
                    dispatch({type: 'LIKE_RESPONSE', postId, data})
                    resolve(data)
                }, function(error) {                     
                    dispatch({type: 'LIKE_FAILLURE', error})
                    reject(error)
            });
        })


export const LOAD_LIKES_REQUEST = 'LOAD_LIKES_REQUEST'

export const _loadLikesRequest = (postId) => ({type: LOAD_LIKES_REQUEST})

export const LOAD_LIKES_RESPONSE = 'LOAD_LIKES_RESPONSE'

export const _loadLikesResponse = (likes) => ({type: LOAD_LIKES_RESPONSE, likes})

export function load(postId, refer) {
    return (dispatch, getState) => {
        dispatch(_loadLikesRequest(postId))
        axios.get(`${BASE_PATH}/api/likes/load/${postId}`, { 
                params : {
                    refer: refer
                }})
            .then(
                function (res) {
                const likes = res.data.likes;
                _.forEach(likes, function(like, i) {
                    dispatch(_pushLike(like));
                    dispatch(Authors.pushAuthor(like.author))
                })
            },  function(err) { 
                    if(err.response) {
                    console.log(err.response.data); 
                        console.log(err.response.status);
                        console.log(err.response.headers);              
                    } else if(err.request) {
                        console.log(err.request);
                    } else {
                        console.log(err.message);
                    }
                console.log(err.config);
            });
    }
}

export const LOAD_MORE_LIKES_REQUEST = 'LOAD_MORE_LIKES_REQUEST'

export const _loadMoreLikesRequest = (ids) => ({type: LOAD_MORE_LIKES_REQUEST})

export const LOAD_MORE_LIKES_RESPONSE = 'LOAD_LIKES_RESPONSE'

export const _loadMoreLikesResponse = (likes) => ({type: LOAD_MORE_LIKES_RESPONSE, likes})

export function loadMoreLikes(ids) {
    return (dispatch, getState) => {
        dispatch(_loadComentsRequest(ids))
        axios.get(`${BASE_PATH}/api/likes/loadsmore/`, { 
                params : {
                    ids: ids,
                    refer: refer
                }})
             .then(function (res) {
                console.log(res.data)
                // dispatch(_loadMoreLikesResponse(res.data))
            }, function(err) { 
                console.log('err :', err);
            })
    }
}

export const PUSH_LIKE = 'PUSH_LIKE'

export function pushLike(like) {
    return (dispatch, getState) => {
        dispatch(_pushLike(like))
    }
}
