import { REHYDRATE, PURGE } from 'redux-persist'
import {
    PostForm as PostFormActions,
} from '../../actions/social'

/**
 * initialState
 * @type {{loading: boolean}}
 */
export const initialState = {
    resseting: false,
    typeName: 'Basic',
    typeValue: 'post',
    currentEditor: '',
	editors: [],
	leftEditors: [],
    rightEditors: [],
    recipients: []
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
function PostForm(state = initialState, action) {

    switch (action.type) {

        

        case PostFormActions.UPDATE_EDITORS:
            return Object.assign({}, state, { editors: action.editors })
            
        case PostFormActions.UPDATE_LEFT_EDITORS:
            return Object.assign({}, state, { leftEditors: action.editors })

        case PostFormActions.UPDATE_RIGHT_EDITORS:
            return Object.assign({}, state, { rightEditors: action.editors })

        case PostFormActions.TOGGLE_EDITOR:
            return Object.assign({}, state, { currentEditor : action.editorName })

        case PostFormActions.UPDATE_RECIPIENTS:
            return Object.assign({}, state, { recipients : action.recipients })
            
        case PostFormActions.SET_TYPE:
            return Object.assign({}, state, {
                typeName: action.name,
                typeValue : action.value
            })
        case PostFormActions.START_RESET:
            return Object.assign({}, state, {
                resseting: true,
                recipients: [],
                rightEditors: [],
                leftEditors: [],
                editors: []
            })
        case PostFormActions.END_RESET:
            return Object.assign({}, state, {
                resseting: false,
            })
    }

    return state
}

export default PostForm
