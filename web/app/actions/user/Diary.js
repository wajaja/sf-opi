import * as axios from 'axios'
import { BASE_PATH } from '../../config/api'

/**
* DIARY::LOAD_MONTH
* @type {string}
*/
export const DIARY_LOAD_MONTH = "DIARY::LOAD_MONTH"

/**
* SEEING_DIARY_REQUEST
* @type {string}
*/
export const DIARY_LOAD_MONTH_REQUEST = "DIARY::LOAD_MONTH_REQUEST"

/**
* LOAD_DIARY_INFO_RESPONSE
* @type {string}
*/
export const DIARY_LOAD_MONTH_RESPONSE = "DIARY::LOAD_MONTH_RESPONSE"

/**
* DIARY::LOAD_DAY
* @type {string}
*/
export const DIARY_LOAD_DAY = "DIARY::LOAD_DAY"

/**
* SEEING_DIARY_REQUEST
* @type {string}
*/
export const DIARY_LOAD_DAY_REQUEST = "DIARY::LOAD_DAY_REQUEST"

/**
* LOAD_DIARY_INFO_RESPONSE
* @type {string}
*/
export const DIARY_LOAD_DAY_RESPONSE = "DIARY::LOAD_DAY_RESPONSE"

/**
* _unseensResponse
* @param nbUnseens
* @private
*/
const _loadInfoResponse = (diaries, notifs) => ({type: LOAD_DIARY_INFO_RESPONSE, year, month, diaries, notifs})

/**
* unseensRespone
* @param nbUnseens
* @public
*/
export function loadMonth(forUserId, year, month) {
	return {
        type: DIARY_LOAD_MONTH,
        forUserId,
        year,
        month,
    }
}

/**
* unseensRespone
* @param nbUnseens
* @public
*/
export function loadDay(forUserId, year, month, day) {
	return {
        type: DIARY_LOAD_DAY,
        forUserId,
        year,
        month,
        day,
    }
}


/**
* _seeingRequest
* @private
*/
const _loadInfoRequest = () => ({type: LOAD_DIARY_INFO_REQUEST, })

/**
* SEEING_DIARY_RESPONSE
* @type {string}
*/
export const SEEING_DIARY_RESPONSE = "SEEING_DIARY_RESPONSE"

/**
* _seeingResponse
* @private
*/
const _seeingResponse = (data) => ({type: SEEING_DIARY_RESPONSE, data, })

/**
* seeingDiaries
* @public
*/
export function seeingDiaries() {
	return dispatch => {
		dispatch(_seeingRequest())
		axios.get(`${BASE_PATH}/api/notifications/notifications/seeing`)
		.then(res => {
			dispatch(_seeingResponse(res.data))
		})
	}
}