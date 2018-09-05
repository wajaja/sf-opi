import * as axios       from 'axios'
import { BASE_PATH }    from '../../config/api'

/**
 * TRIGGER
 * @type {string}
 */
export const GET_ALL_DEFAULT = 'GET_ALL_DEFAULT'

/**
 * _getAllDefaultRequest
 * @private
 */
const _getAllDefaultRequest = () => ({ type: GET_ALL_DEFAULT, })

/**
 * _getAllDefaultResponse
 * @param users
 * @private
 */
const _getAllDefaultResponse = (users) => ({ type: GET_ALL_DEFAULT, users, })

/**
 * getAllDefault
 * Redux Action
 * Reference: http://redux.js.org/docs/basics/Actions.html
 * @returns {Function}
 */
export function getAllDefault() {
    return (dispatch, getState) => {
        dispatch(_getAllDefaultRequest())
        axios.get(`${BASE_PATH}/api/ff/users`)
            .then(
                function(res) {
                    const data = res.data.map(function(user) {
                        return Object.assign({}, {
                            id: user.identity.id,
                            username: user.identity.username,
                            lastname: user.identity.lastname,
                            firstname: user.identity.firstname,
                            profilePic: user.profilePic
                        })
                    })
                    dispatch(_getAllDefaultResponse(data))
                },
                function(err) {
                    console.log('error happens')
                })
    }
}

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



export const LOAD_BY_LOCATION = 'RELATIONSHIPS::LOAD_BY_LOCATION'


export const LOAD_BY_LOCATION_REQUEST = 'LOAD_BY_LOCATION_REQUEST'

const _loadByLocationRequest = () => { type: LOAD_BY_LOCATION_REQUEST }

export const LOAD_BY_LOCATION_RESPONSE = 'LOAD_BY_LOCATION_RESPONSE'

const _loadByLocationResponse = () => { type: LOAD_BY_LOCATION_RESPONSE }


export function loadByLocation(notIn) {
    return (dispatch, getState) => {
        dispatch(_loadByLocationRequest)
        // const suggestions = getState().RelatioShips.suggestions
    }
}

export function loadSuggestions(userId) {
    return (dispatch, getState) => {
        dispatch(_loadSuggestions(userId))
        // const suggestions = getState().RelatioShips.suggestions
    }
}

/**
* Function getMutual 
* get array of users ids 
* return that array as list users object
*/
export function getMutual(ids) {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            axios.get(`${BASE_PATH}/api/users/mutuals`, data)
            .then(
                (res) => {
                    const { users } = res.data
                    if(typeof users === 'array') {
                        resolve(users)
                    }
                },
                (err) => {
                    reject([])  // PUSH empty array
                }
            )
        })
    }
}
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
