import { REHYDRATE, PURGE } from 'redux-persist'
import {
    PostForm as PostFormActions,
} from '../../actions/social'

/**
 * initialState
 * @type {{loading: boolean}}
 */
export const initialState = { 
	
}

/**
 * PostFormType
 * @constructor
 */
function PostFormType(state = initialState, action) {

    switch (action.type) {

        
        
        case PostFormActions.SET_TYPE:
            return Object.assign({}, state, {
                typeName: action.name,
                typeValue : action.value
            })
        case PostFormActions.TOGGLE_EDITOR:
            return Object.assign({}, state, {
                currentEditor : action.editorName
            })
    }
    return state
}
