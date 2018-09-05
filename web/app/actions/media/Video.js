import * as axios from 'axios'

/**
 * LOAD
 * @type {string}
 */
export const LOAD_VIDEO = 'LOAD_VIDEO'


export const LOAD_VIDEO_REQUEST = 'LOAD_VIDEO_REQUEST'
/**
 * _loadRequest
 * @private
 */
export function loadRequest(params) { 
    return {
        type: LOAD_VIDEO_REQUEST,
        params,
    }
}

export const VIDEO_CLOSE_MODAL = 'VIDEO_CLOSE_MODAL'

/**
 * _loadRequest
 * @private
 */
export function closeModal() { 
    return {
        type: VIDEO_CLOSE_MODAL,
    }
}

export const LOAD_VIDEO_RESPONSE = 'LOAD_VIDEO_RESPONSE'

/**
 * _loadResponse
 * @param response
 * @private
 */
export function loadResponse(video) { 
    return {
        type: LOAD_VIDEO_RESPONSE, 
        video, 
    }
}

export const MODAL_VIDEO = 'MODAL_VIDEO'

export function modalVideo(params, query, status, loading) {
    return {
        type: MODAL_VIDEO,
        params,
        query,
        status,
        loading,
    }
}

export const UPDATE_VIDEO_ON_LIKE = 'UPDATE_VIDEO_ON_LIKE'

const _updateOnLike = (videoId, nbLikers, liked) =>({type: UPDATE_VIDEO_ON_LIKE, videoId, nbLikers, liked})

export function updateOnLike(videoId, data) {
    return (dispatch, getState) => {
        dispatch(_updateOnLike(videoId, data.nbLikers, data.liked))
    }
}

/**
 * load
 * Gets single video upload from API based on upload id
 * Redux Action
 * Reference: http://redux.js.org/docs/basics/Actions.html
 * @param id upload id
 * @returns {Function}
 */
export function load(imageId, postId) { 
    return {
        type: LOAD_VIDEO,
        imageId,
        postId,
    }
}