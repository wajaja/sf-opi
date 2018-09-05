import * as axios from 'axios'
import { BASE_PATH } from '../../config/api'

/**
 * LOAD
 * @type {string}
 */
export const LOAD = 'EVERYWHERE::LOAD'

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
        axios.get(`${BASE_PATH}/api/pictures/ever/load/${id}`)
        .then(res => {
            dispatch(_loadResponse(imgId, res.data))
        })
    }
}

/**
 * ADD_RATE
 * @type {string}
 */
export const ADD = 'EVERYWHERE::ADD'

/**
 * _hnadleAddRateRequest
 * @param postID
 * @private
 */
export const _handleAddEverRequest = (imgId) => ({ type: ADD, imgId,})

/**
 * _handleAddRateResponse
 * @param postID
 * @param response
 * @private
 */
export const _handleAddEverResponse = (imgId, response) => ({ type: ADD, imgId, response, })

/**
 * rate
 * Posts a 'rate' to the API for a user and post
 * @param postID post id
 * @returns {Function}
 */
export function addEver(imgId, data) {
    return (dispatch, getState) => {
        dispatch(_handleAddEverRequest(imgId))
        axios.post(`${BASE_PATH}/api/ever/add/${imgId}`, data)
        .then(res => {
            dispatch(_handleAddEverResponse(imgId, res.data.ever))
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
export const DELETE = 'EVERYWHERE::DELETE'

/**
 * _handleDeleteRateRequest
 * @param postID
 * @private
 */
export const _handleDeleteEverRequest = (id) => ({ type: DELETE, id,})

/**
 * _handleDeleteRateResponse
 * @param postID
 * @param response
 * @private
 */
export const _handleDeleteEverResponse = (id, response) => ({ type: DELETE, id, response, })

/**
 * deleteRate
 * Removes rate (unrates) for a user and a post
 * @param postID post id
 * @returns {Function}
 */
export function deleteEver(id) {
    return (dispatch, getState) => {
        dispatch(_handleDeleteEverRequest(imgId))
        axios.delete(`${BASE_PATH}/api/pictures/ever/delete/${id}`)
        .then(res => {
            dispatch(_handleDeleteEverResponse(id, userId, res))
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
export const UPDATE = 'EVERYWHERE::UPDATE'

/**
 * _hnadleAddRateRequest
 * @param postID
 * @private
 */
export const _handleUpdateEverRequest = (id) => ({ type: UPDATE_EVER, id,})

/**
 * _handleAddRateResponse
 * @param postID
 * @param response
 * @private
 */
export const _handleUpdateEverResponse = (id, response) => ({ type: UPDATE_EVER, id, response, })

/**
 * rate
 * Posts a 'rate' to the API for a user and post
 * @param postID post id
 * @returns {Function}
 */
export function updateEver(id, data) {
    return (dispatch, getState) => {
        dispatch(_handleUpdateEverRequest(id))
        axios.post(`${BASE_PATH}/api/pictures/ever/update/${id}`, data)
        .then(res => {
            dispatch(_handleUpdateEverResponse(id, res))
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