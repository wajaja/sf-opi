import * as axios from 'axios'
import { BASE_PATH } from '../../config/api'

/**
 * SEARCH
 * @type {string}
 */
export const SEARCH = 'SEARCH_SEARCH'

/**
 * _searchRequest
 * @param term
 * @private
 */
const _searchRequest = (term) => ({ type: SEARCH, term, })

/**
 * _searchResponse
 * @param term
 * @param response
 * @private
 */
const _searchResponse = (term, response) => ({ type: SEARCH, term, response, })

/**
 * search
 * Make a search request to algolia based on term (string) and type
 * Redux Action
 * Reference: http://redux.js.org/docs/basics/Actions.html
 * @param term {string} search term
 * @param type {string} type of search ('all', 'hashtags', 'location')
 * @returns {Function}
 */
export function search(term, params) {

    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            dispatch(_searchRequest());
            axios.get( `${BASE_PATH}/api/searches?${params}`)
            .then(res => {
                console.log(res)
                dispatch(_searchResponse(term, res))   //dispatch recent terms in search
                resolve(res)
            })
        })
    }    
}

/**
 * TRIGGER
 * @type {string}
 */
export const TRIGGER = 'SEARCH_TRIGGER'

/**
 * _triggerRequest
 * @param search
 * @private
 */
const _triggerRequest = (search) => ({ type: TRIGGER, search, })

/**
 * _triggerResponse
 * @param search
 * @param response
 * @private
 */
const _triggerResponse = (search, response) => ({ type: TRIGGER, search, response, })

/**
 * trigger
 * Triggers search, and posts search data to API
 * Redux Action
 * Reference: http://redux.js.org/docs/basics/Actions.html
 * @param search
 * @returns {Function}
 */
export function trigger(word) {
    return (dispatch, getState) => {
        dispatch(_triggerRequest(search))
      /**
       * data
       * @type {{user_id: *, search: *}}
       */
        const data = {
            user_id: getState().User.id,
            search: word,
        }
        axios.post( BASE_PATH + '/api/searches', data)
        .then(res => {
            console.log(res);
            dispatch(_triggerResponse(word, res.data))
        })
    }
}

/**
 * RECENT
 * @type {string}
 */
export const RECENT = 'SEARCH_RECENT'

/**
 * _recentRequest
 * @private
 */
const _recentRequest = () => ({ type: RECENT, })

/**
 * _recentResponse
 * @param response
 * @private
 */
const _recentResponse = (response) => ({ type: RECENT, response, })

/**
 * recent
 * Gets recent searches from API for a given user
 * Redux Action
 * Reference: http://redux.js.org/docs/basics/Actions.html
 * @returns {Function}
 */
export function recent() {
    return (dispatch, getState) => {
        dispatch(_recentRequest());
        axios.get( BASE_PATH + '/api/searches/recent')
        .then(res => {
            dispatch(_recentResponse(res))   //dispatch recent terms in search
            // dispatch(_triggerRequest(res.data[res.data.length - 1]))    //dispatch triggerRequest by last recent search term
        })
    }
}

/**
 * RESULTS
 * @type {string}
 */
export const RESULTS = 'SEARCH_RESULTS'

/**
 * _searchResultsRequest
 * @private
 */
const _searchResultsRequest = () => ({ type: RESULTS, })

/**
 * _searchResultsResponse
 * @param response
 * @private
 */
const _searchResultsResponse = (response) => ({ type: RESULTS, response, })

/**
 * results
 * Gets uploads from API based on Algolia Search response
 * Redux Action
 * Reference: http://redux.js.org/docs/basics/Actions.html
 * @param type {string}
 * @param query {string}
 * @returns {Function}
 */
export function results(type, query) {
    return dispatch => {
        dispatch(_searchResultsRequest())
        axios.get( BASE_PATH + '/api/uploads?type=${type}&query=${encodeURIComponent(query)}')
        .then(res => {
            dispatch(_searchResultsResponse(res.data))
        })
    }
}
