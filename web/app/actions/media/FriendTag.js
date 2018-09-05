import * as axios from 'axios'
import { BASE_PATH } from '../../config/api'

/**
 * LOAD
 * @type {string}
 */
export const LOAD = 'FRIENDTAGS::LOAD'

/**
 * _loadRequest
 * @param postID
 * @private
 */
export const _loadRequest = (imgId) => ({ type: LOAD, imgId})

/**
 * _loadResponse
 * @param postID
 * @param response
 * @private
 */
export const _loadResponse = (objId, type, response) => ({ type: LOAD, imgId, response, })

/**
 * load
 * Gets number of 'rates' from API for user and post
 * Redux Action
 * Reference: http://redux.js.org/docs/basics/Actions.html
 * @param postID post id
 * @param userID user id
 * @returns {Function}
 */
export function load(imgId) {
    return (dispatch, getState) => {
        dispatch(_loadRequest(imgId))
        axios.get(`${BASE_PATH}/api/pictures/tag/load/${id}`)
        .then(res => {
            dispatch(_loadResponse(imgId, res.data))
        })
    }
}

/**
 * ADD_RATE
 * @type {string}
 */
export const ADD_TAG = 'FRIENDTAGS::ADD_TAG'

/**
 * _hnadleAddRateRequest
 * @param postID
 * @private
 */
export const _handleAddTagRequest = (imgId) => ({ type: ADD_TAG, imgId,})

/**
 * _handleAddRateResponse
 * @param postID
 * @param response
 * @private
 */
export const _handleAddTagResponse = (imgId, response) => ({ type: ADD_RATE, imgId, response, })

/**
 * rate
 * Posts a 'rate' to the API for a user and post
 * @param postID post id
 * @returns {Function}
 */
export function addTag(imgId, username, rect, clientScale) {
    return (dispatch, getState) => {
        dispatch(_handleAddTagRequest(imgId))
        const data = {
            rect: rect,
            username: username,
            clientScale: clientScale
        }
        axios.post(`${BASE_PATH}/api/pictures/tag/add/${imgId}`, data)
        .then(res => {
            dispatch(_handleAddTagResponse(imgId, res.data.tag))
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
export const DELETE_TAG = 'FRIENDTAGS::DELETE_TAG'

/**
 * _handleDeleteRateRequest
 * @param postID
 * @private
 */
export const _handleDeleteTagRequest = (imgId) => ({ type: DELETE_TAG, imgId,})

/**
 * _handleDeleteRateResponse
 * @param postID
 * @param response
 * @private
 */
export const _handleDeleteTagResponse = (imgId, response) => ({ type: DELETE_TAG, imgId, username, response, })

/**
 * deleteRate
 * Removes rate (unrates) for a user and a post
 * @param postID post id
 * @returns {Function}
 */
export function deleteTag(imgId, username) {
    return (dispatch, getState) => {
        dispatch(_handleDeleteTagRequest(imgId))
        axios.delete(`${BASE_PATH}/api/pictures/tag/delete/${imgId}`, { 
        params : { username: username }})
        .then(res => {
            dispatch(_handleDeleteTagResponse(imgId, username, res.data))
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
