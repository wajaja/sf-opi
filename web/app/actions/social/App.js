import axios                        from 'axios'
import { BASE_PATH }                from '../../config/api'

import { 
    User as UserActions,
    Users as UsersActions,
    Message as MessagesActions,
    Invitation as InvitationsActions,
}                                   from '../../actions'

/**
 * INIT
 * @type {string}
 */
export const INITIALIZE = 'APP::INITIALIZE'

/**
 * init
 * loads photos and activities
 * Redux Action
 * Reference: http://redux.js.org/docs/basics/Actions.html
 * @returns {Function}
 */
export function init() {
    return (dispatch, getState) => {
        Promise.all([
            dispatch(UserActions.getMe()),
            dispatch(InvitationsActions.showAlert()),
            dispatch(MessagesActions.showAlert()),    
            dispatch(UsersActions.loadOnline()),
            dispatch(UsersActions.loadDefault()),  //friend or followers in according to server logic
        ]).then(() => {
            dispatch(initDone())
        })
    }
}

/**
 * INIT_DONE
 * @type {string}
 */
export const INIT_DONE = 'APP::APP_INIT_DONE'

/**
 * initDone
 * @returns {{type: string}}
 */
export function initDone() {
    return {
        type: INIT_DONE
    }
}

export const TAB_NAV = 'APP::TAB_NAV'


export function tabnav(val) {
    return {
        type: TAB_NAV,
        payload: val
    }
}

export const FLASH_MESSAGE = 'APP::FLASH_MESSAGE'


export function flashMessage(val) {
    return {
        type: FLASH_MESSAGE,
        payload: val
    }
}

export const SHARE_SUCCESS = 'APP::SHARE_SUCCESS'


export function shareSuccess() {
    return {type: SHARE_SUCCESS}
}

export const NAV_OPTIONS = 'APP::NAV_OPTIONS'

export function navOptions(val) {
    return {
        type: NAV_OPTIONS,
        payload: val
    }
}


export const POST_FORM_FOCUS = 'APP::POST_FORM_FOCUS'

const _postFormFocus = (val) => ({type: POST_FORM_FOCUS, payload: val})

export function postFormFocus(val) {
    return (dispatch, getState) => {
        dispatch(_postFormFocus(val))
        if(val && getState().App.editPostFormFocus) dispatch(_editPostFormFocus(false));
    }
}

export const EDITING_POST = 'APP::EDITING_POST'

const _editingPost = (val) => ({type: EDITING_POST, payload: val})

export function editingPost(val) {
    return (dispatch, getState) => {
        dispatch(_editingPost(val))
    }
}


export const EDIT_POST_FORM_FOCUS = 'APP::EDIT_POST_FORM_FOCUS'

const _editPostFormFocus = (val) => ({type: EDIT_POST_FORM_FOCUS, payload: val})

export function editPostFormFocus(val) {
    return (dispatch, getState) => {
        dispatch(_editPostFormFocus(val))
        if(val && getState().App.postFormFocus) dispatch(_postFormFocus(false));
    }
}

export const CONFID_PANE = 'APP::CONFID_PANE'

export function confidPane(val) {
    return {
        type: CONFID_PANE,
        payload: val
    }
}


export const POST_TYPE_PANE = 'APP::POST_TYPE_PANE'

export function formTypePane(val) {
    return {
        type: POST_TYPE_PANE,
        payload: val
    }
}

export const POST_VIDEO_PANE = 'APP::POST_VIDEO_PANE'

export function formVideoPane(val) {
    return {
        type: POST_VIDEO_PANE,
        payload: val
    }
}

export const SET_SESSION_ID = 'APP::SET_SESSION_ID'

const _setSessionId = (sessionId) =>({type: SET_SESSION_ID, sessionId})

export function setSessionId(ssid) {
    return (dispatch, getState) => {
        dispatch(_setSessionId(ssid));
    }
}

export const MODAL_VIDEO_CONFIRM = 'APP::MODAL_VIDEO_CONFIRM'

export function modalVideoConfirm(val) {
    return {
        type: MODAL_VIDEO_CONFIRM,
        payload: val
    }
}

export const RESET_POST_FORM = 'APP::RESET_POST_FORM'

export function resetPostForm() {
    return {type: RESET_POST_FORM }
}

export const MODAL_SHARE = 'APP::MODAL_SHARE'

export function modalShare(status, refer) {
    return {
        type: MODAL_SHARE,
        status,
        refer,
    }
}

export const MODAL_RATE = 'APP::MODAL_RATE'

export function modalRate(status, refer) {
    return {
        type: MODAL_RATE,
        status,
        refer,
    }
}

export const MODAL_OPINION = 'APP::MODAL_OPINION'

export function modalOpinion(val) {
    return {
        type: MODAL_OPINION,
        payload: val
    }
}

export const MODAL_SET_PROFILE = 'APP::MODAL_SET_PROFILE'

export function modalSetProfile(val) {
    return {
        type: MODAL_SET_PROFILE,
        payload: val
    }
}

export const LOAD_SIDE_REQUEST = 'APP::LOAD_SIDE_REQUEST'

export function loadSideRequest(allie_id, side) {
    return {
        type: LOAD_SIDE_REQUEST,
        allie_id,
        side,
    }
}

export const LOAD_ALLIE_REQUEST = 'APP::LOAD_ALLIE_REQUEST'

export const _loadAllieRequest = () => ({type: LOAD_ALLIE_REQUEST, postId, order})

export const LOAD_ALLIE_RESPONSE = 'LOAD_ALLIE_RESPONSE'

export const _loadAllieResponse = () => ({type: LOAD_ALLIE_RESPONSE, postId, allie})


export const LOAD_SIDE_RESPONSE = 'APP::LOAD_SIDE_RESPONSE'

export function loadSideResponse(allie_id, side) {
    return {
        type: LOAD_SIDE_RESPONSE,
        allie_id,
        side,
    }
}

export const ADD_POST_INFO = 'APP::ADD_POST_INFO'

export function addInfo(postId, from) {
    return {
        type: ADD_POST_INFO,
        postId,
        from,
    }
}

export const REMOVE_POST_INFO = 'APP::REMOVE_POST_INFO'

export function removeInfo(postId) {
    return {
        type: ADD_POST_INFO,
        postId,
    }
}


// return new Promise((resolve, reject) => {
//     axios.get(`${BASE_PATH}/api/initialize`)
//         .then((res) => {
//             resolve(res)
//         }, function(err) { 
//             if(err.response) {
//                 console.log(err.response.data); 
//                 console.log(err.response.status);
//                 console.log(err.response.headers);              
//             } else if(err.request) {
//                 console.log(err.request);
//             } else {
//                 console.log(err.message);
//             }
//             console.log(err.config);
//             reject(error)
//     })       
// })