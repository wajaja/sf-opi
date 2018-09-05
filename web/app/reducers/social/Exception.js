import { REHYDRATE, PURGE } from 'redux-persist'
import {
    Exception as ExceptionActions,
} from '../../actions/social'

/**
 * initialState
 * @type {{loading: boolean}}
 */
export const initialState = { 
	status: false,
	message: ''
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
function Exception(state = initialState, action) {

    switch (action.type) {
        case ExceptionActions.THROW_NEW_EXCEPTION:
            return Object.assign({}, state, {
                status: action.status,
                message : action.message
            })
    }
    return state
}

export default Exception
