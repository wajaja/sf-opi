import { takeEvery, takeLatest } 		from 'redux-saga/effects'
import { call, put, fork, select, all } from 'redux-saga/effects'
import Immutable, 
	{ List, Map, Set, fromJS } 			from 'immutable'
import * as axios 						from 'axios'
import { BASE_PATH } 					from '../config/api'
import _  								from 'lodash'

const getNotifsInfos = state => state.Diary.notifsInfos

const getNotifs = state => state.Diary.notifs

const pad = val => ("0" + val).slice(-2)

/**
 * load
 * Gets single photo upload from API based on upload id
 * Redux Action
 * Reference: http://redux.js.org/docs/basics/Actions.html
 * @param id upload id
 * @returns {Function}
 */
 function* loadMonth(forUserId, year, month) {
    try {
    	yield put({type: 'DIARY::LOAD_MONTH_REQUEST', year, month})
       	const res 					= yield call(axios.get, `${BASE_PATH}/api/diary/${forUserId}/${year}/${month}`),
        { diaries, notifs, posts } 	= res.data;
        yield put({type: 'DIARY::LOAD_MONTH_RESPONSE', diaries, notifs, posts})
    } catch(e) {
    	console.log(e)
    }
}


function* findMonthInStore(forUserId, year, month) {
	const match 	= year + '-' + ("0" + month).slice(-2),
	notifsInfos 	= yield select(getNotifsInfos),
	lookup = _.keyBy(notifsInfos, (r) => r.id + r.type ),
    id = _.filter(notifsInfos, function(n) {
        if((n.userId === forUserId) && _.startsWith(n.date, match)) {
			return n.id
		}
    })[0]

    if(id) 
    	return true
    else 
    	return false
}

function* callLoadMonth({forUserId, year, month}) {
	var exist = yield call(findMonthInStore, forUserId, year, month)
	if(!exist) {
		const date = year + '-' + ("0" + month).slice(-2) + '-null'
		yield put({type: 'DIARY::LOAD_MONTH_REQUEST', forUserId, date}) // usefull for populate date request in store
		yield call(loadMonth, forUserId, year, month)
	} else {
		console.log('month exist in store');
		//yield put({type: 'LOAD_PHOTO_RESPONSE', photo})
	}
}




/**
 * load
 * Gets single photo upload from API based on upload id
 * Redux Action
 * Reference: http://redux.js.org/docs/basics/Actions.html
 * @param id upload id
 * @returns {Function}
 */
 function* loadDay(forUserId, year, month, day) {
    try {
    	yield put({type: 'DIARY::LOAD_DAY_REQUEST', forUserId, year, month, day})
       	const res 					= yield call(axios.get, `${BASE_PATH}/api/diary/${forUserId}/${year}/${month}/${day}`),
        { diaries, notifs, posts } 	= res.data;
        yield put({type: 'DIARY::LOAD_DAY_RESPONSE', forUserId, diaries, notifs, posts})
    } catch(e) {
    	console.log(e)
    }
}


function* findDayInStore(forUserId, year, month, day) {
	const match = year + '-' + pad(month) + '-' + pad(day),
	notifs 		= yield select(getNotifs),
	lookup 		= _.keyBy(notifs, (r) => r.id + r.type ),
    id = _.filter(notifs, function(n) {
        if((n.userId === forUserId) && _.startsWith(n.date, match)) {
			return n.id
		}
    })[0]

    if(id) 
    	return true
    else 
    	return false
}

function* callLoadDay({forUserId, year, month, day}) {
	var exist = yield call(findDayInStore, forUserId, year, month, day)
	if(!exist) {
		const date = year + '-' + pad(month) + '-' + pad(day)
		yield put({type: 'DIARY::LOAD_MONTH_REQUEST', forUserId, date}) // usefull for populate date request in store
		yield call(loadDay, forUserId, year, month, day)
	} else {
		console.log('month exist in store');
		//yield put({type: 'LOAD_PHOTO_RESPONSE', photo})
	}
}

/*
Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
Allows concurrent fetches of user.
*/
export default function* diarySaga() {
	//allow multiple instance to be started currently
	yield takeEvery("DIARY::LOAD_MONTH", callLoadMonth);
	yield takeEvery("DIARY::LOAD_DAY", callLoadDay); 
}