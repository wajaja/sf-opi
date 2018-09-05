import { REHYDRATE, PURGE } from 'redux-persist'
import {
    Confidence as ConfidenceActions,
} from '../../actions/social'

/**
 * initialState
 * @type {{loading: boolean}}
 */
export const initialState = { 
	confindenceName: 'Open',
	confindenceValue: 'public'
}

/**
 * App
 * Redux Reducer for App action
 * Reference: http://redux.js.org/docs/basics/Reducers.html
 * @param state
 * @param action
 * @returns {*}
 * @constructor
 */
function Confidence(state = initialState, action) {

    switch (action.type) {

        
        
        case ConfidenceActions.SET:
            return Object.assign({}, state, {
                confindenceName: action.name,
                confindenceValue : action.value
            })
    }
    return state
}

export default Confidence
