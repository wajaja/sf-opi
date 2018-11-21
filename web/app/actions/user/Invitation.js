import * as axios from 'axios'
import { BASE_PATH } from '../../config/api'


/**
* SEEING_INVITATION_REQUEST
* @type {string}
*/
export const SHOW_ALERT_REQUEST = "INVITATION::SHOW_ALERT_REQUEST"

/**
* _seeingRequest
* @private
*/
const _showAlertRequest = () => ({type: SHOW_ALERT_REQUEST, })

/**
* SEEING_INVITATION_RESPONSE
* @type {string}
*/
export const SHOW_ALERT_RESPONSE = "INVITATION::SHOW_ALERT_RESPONSE"

/**
* _seeingResponse
* @private
*/
const _showAlertResponse = (data) => ({type: SHOW_ALERT_RESPONSE, data, })

export function showAlert(nbAlerts) {
	return (dispatch, getState) => {

		axios.get(`${BASE_PATH}/api/invitations/alert/show`)
		.then(
			(res) => {
				dispatch(_showAlertResponse(res.data))
			},
			(err) => {
				console.log('error in invitations code')
			}
		)
	}
}


/**
* SEEING_INVITATION_REQUEST
* @type {string}
*/
export const HIDE_ALERT_REQUEST = "INVITATION::HIDE_ALERT_REQUEST"

/**
* _seeingRequest
* @private
*/
const _hideAlertRequest = () => ({type: HIDE_ALERT_REQUEST, })

/**
* SEEING_INVITATION_RESPONSE
* @type {string}
*/
export const HIDE_ALERT_RESPONSE = "INVITATION::HIDE_ALERT_RESPONSE"

/**
* _seeingResponse
* @private
*/
const _hideAlertResponse = (data) => ({type: HIDE_ALERT_RESPONSE, data, })

/**
* seeingMessages
* @public
*/
export function hideAlert() {
	return dispatch => {
		dispatch(_hideAlertRequest())
		axios.get(`${BASE_PATH}/api/invitations/alert/hide`)
		.then(res => {
			dispatch(_hideAlertResponse(res.data))
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


export const CONFIRM  = 'INVITATION::CONFIRM'

export const CONFIRM_RESPONSE  = 'INVITATION::CONFIRM_RESPONSE'

export const _confirm = (userID, targetID) => ({type: CONFIRM_RESPONSE, userID, targetID, })

export function confirm(userID, targetID) {
    return (dispatch, getState) => {
        return new Promise(function (resolve, reject) {
            axios.post( `${BASE_PATH}/api/invitations/confirm/?userId=${userID}&targetId=${targetID}`)
            .then((res) => {
                    dispatch(_confirm(userID, targetID))
                    resolve(res.data.status)
                },(err) => {
                    if(err.response) {
                        self.props.dispatch(
                            ExceptionActions.throwNewEception(true, err.response.data.message)
                        )            
                    }
                }
            )
        })
    }
}

export const DELETE   = 'INVITATION::DELETE'

export const DELETE_RESPONSE   = 'INVITATION::DELETE_RESPONSE'

export const _delete = (userID, targetID) => ({ type: DELETE_RESPONSE, userID, targetID, })

export function deleteInvitation(userID, targetID) {
    return (dispatch, getState) => {
        return new Promise(function (resolve, reject) {
            axios.post( `${BASE_PATH}/api/invitations/delete/?userId=${userID}&targetId=${targetID}`)
            .then((res) => {
                    dispatch(_delete(userID, targetID))
                    resolve(res.data.status)
                },(err) => {
                    if(err.response) {
                        self.props.dispatch(
                            ExceptionActions.throwNewEception(true, err.response.data.message)
                        )            
                    }
                }
            )
        })
    }
}


export const FOLLOW  = 'INVITATION::FOLLOW'

export const FOLLOW_RESPONSE  = 'INVITATION::FOLLOW_RESPONSE'

export const _follow = (userID, targetID) => ({type: FOLLOW_RESPONSE, userID, targetID,})

export function follow(userID, targetID) {
    return (dispatch, getState) => {
        return new Promise(function (resolve, reject) {
            axios.post( `${BASE_PATH}/api/invitations/follow/?userId=${userID}&targetId=${targetID}`)
            .then((res) => {
                    dispatch(_follow(userID, targetID))
                    resolve(res.data.status)
                },(err) => {
                    if(err.response) {
                        self.props.dispatch(
                            ExceptionActions.throwNewEception(true, err.response.data.message)
                        )            
                    }
                }
            )
        })
    }
}

export const UNFOLLOW   = 'INVITATION::UNFOLLOW'

export const UNFOLLOW_RESPONSE   = 'INVITATION::UNFOLLOW_RESPONSE'

export const _unFollow = (userID, targetID) => ({ type: UNFOLLOW_RESPONSE, userID, targetID, })

export function unFollow(userID, targetID) {
    return (dispatch, getState) => {
        return new Promise(function (resolve, reject) {
            axios.post( `${BASE_PATH}/api/invitations/unfollow/?userId=${userID}&targetId=${targetID}`)
            .then((res) => {
                    dispatch(_unFollow(userID, targetID))
                    resolve(res.data.status)
                },(err) => {
                    if(err.response) {
                        self.props.dispatch(
                            ExceptionActions.throwNewEception(true, err.response.data.message)
                        )            
                    }
                }
            )
        })
    }
}

export const REQUEST  = 'INVITATION::REQUEST'

export const REQUEST_RESPONSE  = 'INVITATION::REQUEST_RESPONSE'

export const _request = (userID, targetID) => ({ type: REQUEST_RESPONSE, userID, targetID,})

export function requestFriend(userID, targetID) {
    return (dispatch, getState) => {
        return new Promise(function (resolve, reject) {
            axios.post( `${BASE_PATH}/api/invitations/friend/?userId=${userID}&targetId=${targetID}`)
            .then((res) => {
                    dispatch(_request(userID, targetID))
                    resolve(res.data.status)
                },(err) => {
                    if(err.response) {
                        self.props.dispatch(
                            ExceptionActions.throwNewEception(true, err.response.data.message)
                        )            
                    }
                }
            )
        })
    }
}

export const ABORD  = 'INVITATION::ABORD'

export const ABORD_RESPONSE  = 'INVITATION::ABORD_RESPONSE'

export const _abord = (userID, targetID) => ({ type: ABORD_RESPONSE, userID, targetID,})

export function abordRequest(userID, targetID) {
    return (dispatch, getState) => {
        return new Promise(function (resolve, reject) {
            axios.post( `${BASE_PATH}/api/invitations/abord/?userId=${userID}&targetId=${targetID}`)
            .then((res) => {
                    dispatch(_request(userID, targetID))
                    resolve(res.data.status)
                },(err) => {
                    if(err.response) {
                        self.props.dispatch(
                            ExceptionActions.throwNewEception(true, err.response.data.message)
                        )            
                    }
                }
            )
        })
    }
}

export const LOAD_REQ = 'INVITATION::LOAD_REQ'
export const _loadReq = (data) => ({type: LOAD_REQ})

export const LOAD_RESPONSE = 'INVITATION::LOAD_RESPONSE'
export const _loadResponse = (data) => ({type: LOAD_RESPONSE, data})

export function loadInvitations(page) {
    return (dispatch, getState) => {
        dispatch(_loadReq())
        axios.get(`${BASE_PATH}/api/invitations/load`, { 
                params : {
                    page: page
                }})
             .then(function (res) {
                console.log('loadNotifications', res.data)
                dispatch(_loadResponse(res.data))
            }, function(err) { 
                console.log('err :', err);
            })
    }
}