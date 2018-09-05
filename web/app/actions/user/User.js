import * as axios from 'axios'
import { BASE_PATH } from '../../config/api'

import { Search as SearchActions } from '../social'


if(typeof localStorage === 'undefined') {
    global.localStorage = {};
}
/**
 * logout
 * Performs Facebook logout for a given user
 * Redux Action
 * Reference: http://redux.js.org/docs/basics/Actions.html
 * @returns {Function}
 */
export function logout() {
    return dispatch => {
        dispatch(_logoutRequest())
        FB.logout(response => {
            dispatch(_logoutResponse(response))
        })
    }
}

/**
 * GET_USER
 * @type {string}
 */
export const GET_ME = 'USER::GET_ME'

/**
 * GET_USER
 * @type {string}
 */
export const GET_ME_REQUEST = 'USER::GET_ME_REQUEST'

/**
 * GET_USER
 * @type {string}
 */
export const GET_ME_RESPONSE = 'USER::GET_ME_RESPONSE'

/**
 * @param initial
 * @private
 */
const _getMe = () => ({ type: GET_ME })


/**
 * @param initial
 * @private
 */
const _getMeRequest = () => ({ type: GET_ME_REQUEST })


/**
 * @param initial
 * @private
 */
const _getMeResponse = (user) => ({ type: GET_ME_RESPONSE, user })

/**
* @getUser
* Get authenticated user; dispatch in store
* return {Function}
*/
// export function getMe() {
//     return dispatch => {
//         dispatch(_getMe())
//     }
// }

/**
 * _fbLoginInitial
 * @param initial
 * @private
 */
const _initialize = (initial) => ({ type: INIT, initial, })

/**
 *
 */
export function getMe() {
    // var token = response.authResponse.accessToken;
    // var userID = response.authResponse.userID;
    return (dispatch, getState) => {
        // return new Promise(function (resolve, reject) {
            //user not authenticated; redirect to login page
            axios.get( BASE_PATH + '/api/users/me/')
                .then(
                    (res) => {
                        const data = res.data
                        dispatch(_getMeResponse(data))
                        //dispatch(SearchActions.recent())  //get recent Result
                    }, 
                    (err) => {
                        if (err.response && err.response.data.message == "Expired JWT Token") {
                            localStorage.removeItem && localStorage.removeItem('_tk_key');
                            //redirect user to login page
                            //dispatch(loginError(error));
                            //dispatch(push('/login'));
                        } else {
                          // Something happened in setting up the request that triggered an Error
                          console.log('Error', err.message);
                        }
                })
    }
}

/**
 * GET_USER
 * @type {string}
 */
export const SET_PROFILE_PIC = 'USER::SET_PROFILE_PIC'

/**
 * GET_USER
 * @type {string}
 */
export const SET_PROFILE_PIC_REQUEST = 'USER::SET_PROFILE_PIC_REQUEST'

/**
 * GET_USER
 * @type {string}
 */
export const SET_PROFILE_PIC_RESPONSE = 'USER::SET_PROFILE_PIC_RESPONSE'

/**
 * @param initial
 * @private
 */
const _setProfilePic = () => ({ type: SET_PROFILE_PIC })


/**
 * @param initial
 * @private
 */
const _setProfilePicRequest = () => ({ type: SET_PROFILE_PIC_REQUEST })

/**
 * @param initial
 * @private
 */
const _setProfilePicResponse = (profilePic) => ({ type: SET_PROFILE_PIC_RESPONSE, profilePic })

/**
 *
 */
export function setProfilePic(dataUrl) {
    // var token = response.authResponse.accessToken;
    // var userID = response.authResponse.userID;
    return (dispatch, getState) => {
        dispatch(_setProfilePicRequest)
        return new Promise(function (resolve, reject) {
            axios.get( BASE_PATH + '/api/users/me/')
                .then(
                    (res) => {
                        const profilePic = res.data
                        dispatch(_setProfilePicResponse(profilePic))
                        resolve(profilePic)
                    }, 
                    (err) => {
                        if (err.response && err.response.data.message == "Expired JWT Token") {
                            localStorage.removeItem && localStorage.removeItem('_tk_key');
                            //redirect user to login page
                            //dispatch(loginError(error));
                            //dispatch(push('/login'));
                        } else {
                          // Something happened in setting up the request that triggered an Error
                          console.log('Error', err.message);
                        }
                })
        })
    }
}


/**
 * GET_USER
 * @type {string}
 */
export const SET_INFOS = 'USER::SET_INFOS'

/**
 * GET_USER
 * @type {string}
 */
export const SET_INFOS_REQUEST = 'USER::SET_INFOS_REQUEST'

/**
 * GET_USER
 * @type {string}
 */
export const SET_INFOS_RESPONSE = 'USER::SET_INFOS_RESPONSE'

/**
 * @param initial
 * @private
 */
const _setInfos = () => ({ type: SET_INFOS })


/**
 * @param initial
 * @private
 */
const _setInfosRequest = () => ({ type: SET_INFOS_REQUEST })

/**
 * @param initial
 * @private
 */
const _setInfosResponse = (infos) => ({ type: SET_INFOS_RESPONSE, infos })

/**
 *
 */
export function setInfos(data) {
    // var token = response.authResponse.accessToken;
    // var userID = response.authResponse.userID;
    return (dispatch, getState) => {
        dispatch(_setProfilePicRequest)
        return new Promise(function (resolve, reject) {
            axios.get( BASE_PATH + '/api/users/me/')
                .then(
                    (res) => {
                        const profilePic = res.data
                        dispatch(_setProfilePicResponse(profilePic))
                        resolve(profilePic)
                    }, 
                    (err) => {
                        if (err.response && err.response.data.message == "Expired JWT Token") {
                            localStorage.removeItem && localStorage.removeItem('jwt_opinion');
                            //redirect user to login page
                            //dispatch(loginError(error));
                            //dispatch(push('/login'));
                        } else {
                          // Something happened in setting up the request that triggered an Error
                          console.log('Error', err.message);
                        }
                })
        })
    }
}



/**
 * FOLLOW
 * @type {string}
 */
export const FOLLOW = 'USER::FOLLOW'

/**
 * follow
 * @param user
 * @returns {{type: string, user: *}}
 */
export function follow(user) {
    return {
        type: FOLLOW,
        user,
    }
}

/**
 * FOLLOW
 * @type {string}
 */
export const UNFOLLOW = 'USER::UNFOLLOW'

/**
 * follow
 * @param user
 * @returns {{type: string, user: *}}
 */
export function unfollow(   user) {
    return {
        type: UNFOLLOW,
        user,
    }
}

export const ADD_POST_REF = 'USER::ADD_POST_REF'

export function addPostRef(postId, postType) {
    return {
        type: ADD_POST_REF, 
        postId,
        postType,
    }
}

export const ADD_MORE_REF = 'USER::ADD_MORE_REF'

export function addMoreRef(postId, postType) {
    return {
        type: ADD_MORE_REF, 
        postId,
        postType,
    }
}

export const ADD_MORE_REFS = 'USER::ADD_MORE_REFS'

export function addMoreRefs(postId, postType) {
    return {
        type: ADD_MORE_REFS, 
        postId,
        postType,
    }
}

export const DELETE_POST_REF = 'USER::DELETE_POST_REF'

export function deletePostRef(postId, postType) {
    return {
        type: DELETE_POST_REF, 
        postId,
        postType,
    }
}
