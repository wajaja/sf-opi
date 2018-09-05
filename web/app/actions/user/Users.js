import * as axios       from 'axios'
import { BASE_PATH }    from '../../config/api'

/**
 * LOAD_DEFAULT
 * @type {string}
 */
export const LOAD_DEFAULT = 'USERS::LOAD_DEFAULT'

/**
 * LOAD_DEFAULT_REQUEST
 * @type {string}
 */
export const LOAD_DEFAULT_REQUEST = 'USERS::LOAD_DEFAULT_REQUEST'

/**
 * LOAD_DEFAULT_RESPONSE
 * @type {string}
 */
export const LOAD_DEFAULT_RESPONSE = 'USERS::LOAD_DEFAULT_RESPONSE'

/**
 * _getAllDefaultRequest
 * @private
 */
const _loadDefaultRequest = () => ({ type: LOAD_DEFAULT_REQUEST, })

/**
 * _getAllDefaultResponse
 * @param users
 * @private
 */
const _loadDefaultResponse = (users) => ({ type: LOAD_DEFAULT_RESPONSE, users, })

/**
 * getAllDefault
 * Redux Action
 * Reference: http://redux.js.org/docs/basics/Actions.html
 * @returns {Function}
 */
export function loadDefault(userId, notIn) {
    return (dispatch, getState) => {
        dispatch(_loadDefaultRequest())
        return new Promise((resolve, reject) => {
            axios.get(`${BASE_PATH}/api/search/load_default/`).then(
                (res) => {
                    console.log(res.data)
                    const users = res.data.map((user) => {
                        return Object.assign({}, {
                            id: user.identity.id,
                            username: user.identity.username,
                            lastname: user.identity.lastname,
                            firstname: user.identity.firstname,
                            profilePic: user.profilePic
                        })
                    })
                    resolve(users)
                    dispatch(_loadOnlineResponse(users))
                },
                (error) => {
                    if(error.response) {
                        console.log(error.response.data);   
                        console.log(error.response.status);
                        console.log(error.response.headers);                
                    } else if(error.request) {
                        console.log(error.request);
                    } else {
                        console.log(error.message);
                    }
                    console.log(error.config);
                    reject(error)
                })
        })
    }
}


/**
 * LOAD_DEFAULT
 * @type {string}
 */
export const LOAD_ONLINE = 'USERS::LOAD_ONLINE'

/**
 * LOAD_DEFAULT_REQUEST
 * @type {string}
 */
export const LOAD_ONLINE_REQUEST = 'USERS::LOAD_ONLINE_REQUEST'

/**
 * LOAD_DEFAULT_RESPONSE
 * @type {string}
 */
export const LOAD_ONLINE_RESPONSE = 'USERS::LOAD_ONLINE_RESPONSE'

/**
 * _getAllDefaultRequest
 * @private
 */
const _loadOnlineRequest = () => ({ type: LOAD_ONLINE_REQUEST, })

/**
 * _getAllDefaultResponse
 * @param users
 * @private
 */
const _loadOnlineResponse = (users) => ({ type: LOAD_ONLINE_RESPONSE, users, })

/**
 * getAllDefault
 * Redux Action
 * Reference: http://redux.js.org/docs/basics/Actions.html
 * @returns {Function}
 */
export function loadOnlines() {
    return (dispatch, getState) => {
        dispatch(_loadOnlineRequest())
        return new Promise((resolve, reject) => {
            axios.get(`${BASE_PATH}/api/search/online/?target=me`).then(
                (res) => {
                    const users = res.data.users
                    resolve(users)
                    dispatch(_loadOnlineResponse(users))
                },
                (err) => {
                    console.log('error happens')
                    reject(err)
                })
        })
    }
}

/**
 * LOAD_DEFAULT_RESPONSE
 * @type {string}
 */
export const LOAD_INFO_RESPONSE = 'USERS::LOAD_INFO_RESPONSE'

export const LOAD_INFO_REQUEST = 'USERS::LOAD_INFO_REQUEST'
/**
 * _getAllDefaultRequest
 * @private
 * type SagaMiddle
 */
const _loadInfoRequest = (userId) => ({ type: LOAD_INFO_REQUEST, userId})

/**
 * _getAllDefaultResponse
 * @param users
 * @private
 */
const _loadInfoResponse = (user, userId) => ({ type: LOAD_INFO_RESPONSE, user, userId})

/**
 * LOAD_DEFAULT
 * @type {string}
 */
export const LOAD_PROFILE = 'USERS::LOAD_PROFILE'

/**
 * LOAD_DEFAULT_REQUEST
 * @type {string}
 */
export const LOAD_PROFILE_REQUEST = 'USERS::LOAD_PROFILE_REQUEST'

/**
 * LOAD_DEFAULT_RESPONSE
 * @type {string}
 */
export const LOAD_PROFILE_RESPONSE = 'USERS::LOAD_PROFILE_RESPONSE'

/**
 * _getAllDefaultRequest
 * @private
 */
const _loadProfileRequest = () => ({ type: LOAD_PROFILE_REQUEST, })

/**
 * _getAllDefaultResponse
 * @param users
 * @private
 */
const _loadProfileResponse = (users) => ({ type: LOAD_PROFILE_RESPONSE, user, })

/**
 * getAllDefault
 * Redux Action
 * Reference: http://redux.js.org/docs/basics/Actions.html
 * @returns {Function}
 */
export function loadProfile() {
    return {
        type: LOAD_PROFILE,
    }
}





/**
 * getAllDefault
 * Redux Action
 * Reference: http://redux.js.org/docs/basics/Actions.html
 * @returns {Function}
 */
// export function getAllDefault() {
//     return (dispatch, getState) => {
//         dispatch(_getAllDefaultRequest())
//         axios.get(`${BASE_PATH}/api/ff/users`)
//             .then(
//                 function(res) {
//                     const data = res.data.map(function(user) {
//                         return Object.assign({}, {
//                             id: user.identity.id,
//                             username: user.identity.username,
//                             lastname: user.identity.lastname,
//                             firstname: user.identity.firstname,
//                             profilePic: user.profilePic
//                         })
//                     })
//                     dispatch(_getAllDefaultResponse(data))
//                 },
//                 function(err) {
//                     console.log('error happens')
//                 })
//     }
// }

/**
 * TRIGGER
 * @type {string}
 */
export const LOAD_SUGGESTIONS = 'LOAD_SUGGESTIONS'

/**
 * _getAllDefaultRequest
 * @private
 */
export const _loadSuggestions = (userId) => ({ type: LOAD_SUGGESTIONS, userId})

/**
 * TRIGGER
 * @type {string}
 */
export const LOAD_SUGGESTIONS_RESPONSE = 'LOAD_SUGGESTIONS_RESPONSE'

/**
 * _getAllDefaultRequest
 * @private
 */
export const _loadSuggestionsResponse = (suggestions) => ({ type: LOAD_SUGGESTIONS_RESPONSE, suggestions})

// /**
//  * RECENT
//  * @type {string}
//  */
// export const RECENT = 'SEARCH_RECENT'

// /**
//  * _recentRequest
//  * @private
//  */
// const _recentRequest = () => ({ type: RECENT, })

// /**
//  * _recentResponse
//  * @param response
//  * @private
//  */
// const _recentResponse = (response) => ({ type: RECENT, response, })

// /**
//  * recent
//  * Gets recent searches from API for a given user
//  * Redux Action
//  * Reference: http://redux.js.org/docs/basics/Actions.html
//  * @returns {Function}
//  */
// export function recent() {
//     return (dispatch, getState) => {
//         dispatch(_recentRequest());
//         axios.get( BASE_PATH + '/api/searches?user_id=' + getState().User.id)
//         .then(res => {
//             dispatch(_recentResponse(res.data));    //dispatch recent terms in search
//             dispatch(_triggerRequest(res.data[res.data.length - 1]))    //dispatch triggerRequest by last recent search term
//         })
//     }
// }

// /**
//  * RESULTS
//  * @type {string}
//  */
// export const RESULTS = 'SEARCH_RESULTS'

// /**
//  * _searchResultsRequest
//  * @private
//  */
// const _searchResultsRequest = () => ({ type: RESULTS, })

// /**
//  * _searchResultsResponse
//  * @param response
//  * @private
//  */
// const _searchResultsResponse = (response) => ({ type: RESULTS, response, })

// /**
//  * results
//  * Gets uploads from API based on Algolia Search response
//  * Redux Action
//  * Reference: http://redux.js.org/docs/basics/Actions.html
//  * @param type {string}
//  * @param query {string}
//  * @returns {Function}
//  */
// export function results(type, query) {
//     return dispatch => {
//         dispatch(_searchResultsRequest())
//         axios.get( BASE_PATH + '/api/uploads?type=${type}&query=${encodeURIComponent(query)}')
//         .then(res => {
//             dispatch(_searchResultsResponse(res.data))
//         })
//     }
// }
