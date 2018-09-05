import * as axios from 'axios'
import * as PostsActions from './Posts'
import { BASE_PATH } from '../../config/api'

/**
 * LOAD
 * @type {string}
 */
export const LOAD = 'RATE_LOAD'

/**
 * _loadRequest
 * @param postID
 * @private
 */
export const _loadRequest = (objId, type) => ({ type: LOAD, objId, type})

/**
 * _loadResponse
 * @param postID
 * @param response
 * @private
 */
export const _loadResponse = (objId, type, response) => ({ type: LOAD, objId, type, response, })

/**
 * load
 * Gets number of 'rates' from API for user and post
 * Redux Action
 * Reference: http://redux.js.org/docs/basics/Actions.html
 * @param postID post id
 * @param userID user id
 * @returns {Function}
 */
export function load(objId, type, userId) {
    return (dispatch, getState) => {
        dispatch(_loadRequest(objId, type))
        const user = getState().User
        axios.get(`${BASE_PATH}/api/rates?upload_id=${postID}&user_id=${user.id}`)
        .then(res => {
            dispatch(_loadResponse(objId, type, res.data))
        })
    }
}

/**
 * ADD_RATE
 * @type {string}
 */
export const ADD_RATE = 'ADD_RATE'

/**
 * _hnadleAddRateRequest
 * @param postID
 * @private
 */
export const _handleAddRateRequest = (objId, type) => ({ type: ADD_RATE, objId, type,})

/**
 * _handleAddRateResponse
 * @param postID
 * @param response
 * @private
 */
export const _handleAddRateResponse = (objId, type, response) => ({ type: ADD_RATE, objId, type, response, })

/**
 * rate
 * Posts a 'rate' to the API for a user and post
 * @param postID post id
 * @returns {Function}
 */
export function rate(data, objId, type) {
    return (dispatch, getState) => {
        dispatch(_handleAddRateRequest(objId, type))
        axios.post(`${BASE_PATH}/api/rates/add`, data, { 
                params : {
                    type: type,
                    objId: objId,
                }})
        .then(res => {
            if(type == 'post') dispatch(PostsActions._updatePostResponse(objId, res.data.post));
            if(type == 'leftcomment') dispatch(LeftsActions._updatePostResponse(objId, res.data.post));
            if(type == 'rightcomment') dispatch(RightsActions._updatePostResponse(objId, res.data.post));
            dispatch(_handleAddRateResponse(objId, type, res.data.post))
        }, err => {
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
        })
    }
}

/**
 * ADD_RATE
 * @type {string}
 */
export const UPDATE_RATE = 'UPDATE_RATE'

/**
 * _hnadleAddRateRequest
 * @param postID
 * @private
 */
export const _handleUpdateRateRequest = (objId, type) => ({ type: UPDATE_RATE, objId, type,})

/**
 * _handleAddRateResponse
 * @param postID
 * @param response
 * @private
 */
export const _handleUpdateRateResponse = (objId, type, response) => ({ type: UPDATE_RATE, objId, type, response, })

/**
 * rate
 * Posts a 'rate' to the API for a user and post
 * @param postID post id
 * @returns {Function}
 */
export function updateRate(data, objId, type) {
    return (dispatch, getState) => {
        dispatch(_handleUpdateRateRequest(objId, type))
        axios.post(`${BASE_PATH}/api/rates/update/${objId}`, data, { 
                params : {
                    type: type,
                    objId: objId,
                }})
        .then(res => {
            if(type == 'post') dispatch(PostsActions._updatePostResponse(objId, res.data.post));
            if(type == 'leftcomment') dispatch(LeftsActions._updatePostResponse(objId, res.data.post));
            if(type == 'rightcomment') dispatch(RightsActions._updatePostResponse(objId, res.data.post));
            dispatch(_handleUpdateRateResponse(objId, type, res.data.post))
        }, err => {
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
        })
    }
}

/**
 * DELETE_RATE
 * @type {string}
 */
export const DELETE_RATE = 'DELETE_RATE'

/**
 * _handleDeleteRateRequest
 * @param postID
 * @private
 */
export const _handleDeleteRateRequest = (objId, type) => ({ type: DELETE_RATE, objId, type,})

/**
 * _handleDeleteRateResponse
 * @param postID
 * @param response
 * @private
 */
export const _handleDeleteRateResponse = (objId, type, response) => ({ type: DELETE_RATE, objId, type, response, })

/**
 * deleteRate
 * Removes rate (unrates) for a user and a post
 * @param postID post id
 * @returns {Function}
 */
export function deleteRate(objId, type) {
    return (dispatch, getState) => {
        dispatch(_handleDeleteRateRequest(objId, type))
        axios.delete(`${BASE_PATH}/api/rates/delete`, { 
            params : {
                type: type,
                objId: objId,
            }})
        .then(res => {
            if(type == 'post') dispatch(PostsActions._updatePostResponse(objId, res.data.post));
            if(type == 'leftcomment') dispatch(LeftsActions._updatePostResponse(objId, res.data.post));
            if(type == 'rightcomment') dispatch(RightsActions._updatePostResponse(objId, res.data.post));
            dispatch(_handleDeleteRateResponse(objId, type, res.data.post))
        }, err => {
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
        })
    }
}
