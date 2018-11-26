import { REHYDRATE, PURGE } from 'redux-persist'


import { Search as SearchActions } from '../../actions/social'


/**
 * initialState
 * @type {{active: null, recent: Array, hits: Array, term: string, total: number, results: Array}}
 */
export const initialState = {
    active: null,
    boxActive: false, //mounting results div
    hits: [],
    term: '',
    total: 0,
    recentHits: [],
    recentTerms: [],

    results: [],

    newsRefs: [],
}

/**
 * Search
 * Redux Reducer for Search action
 * Reference: http://redux.js.org/docs/basics/Reducers.html
 * @param state
 * @param action
 * @returns {*}
 * @constructor
 */
function Search(state = initialState, action) {

    switch (action.type) {

        
        
        case SearchActions.TRIGGER:
            if (action.response) {
                return Object.assign({}, state, { active: action.search })
            }
            return state

        case SearchActions.TOGGLLE_BOX:
            return Object.assign({}, state, { boxActive: action.val })

        case SearchActions.SEARCH:
            if (action.response) {
                const data = action.response.data
                return Object.assign({}, state, {
                    term: action.term,
                    total: data.length,
                    hits: data,
                })
            }
            return state

        case SearchActions.RECENT:
            if (action.response) {
                const data = action.response.data
                return Object.assign({}, state, {
                    recentHits: data.results,  //this mean, the recent result are an element list
                    recentTerms: data.terms,  //this mean, the recent result are an element list
                })
            }
            return state

        case SearchActions.RESULTS:
            if (action.response) {
                
                return Object.assign({}, state, {
                    results: [...action.response]
                })
            }
            
            return state

    }

    return state
}

export default Search
