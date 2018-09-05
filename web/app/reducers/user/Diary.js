import { REHYDRATE, PURGE } from 'redux-persist'
import Immutable, 
    { List, Map, Set, fromJS } from 'immutable'
import _                        from 'lodash'                                    

var moment = require('moment');

import {
    Diary as DiaryActions,
} from '../../actions/user'



export const initialState = {
	byYears: [],
    readyForDate: {},
    notifsInfos: [],
    diariesInfos: [],
    postsInfos: [],
    diaries: [],
    notifs: [],
    posts: [],
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
function Diary(state = initialState, action) {

    switch (action.type) {

        
        
        case DiaryActions.DIARY_LOAD_MONTH_REQUEST: {
            const o         = {}
            o['id']         = 'null'
            o['userId']     = action.forUserId
            o['date']       = action.date

            const valids = state.notifsInfos.filter((e) => {
                return e.userId !== undefined && 
                       e.userId === action.forUserId
            })
            return Object.assign({}, state, { 
                notifsInfos: [o].concat(valids) 
            });
        }
        case DiaryActions.DIARY_LOAD_DAY_REQUEST: {
            //create an empty object
            const o         = {}
            o['id']         = 'null'
            o['userId']     = action.forUserId
            o['date']       = action.date

            const valids = state.notifs.filter((e) => {
                return e.userId !== undefined && 
                       e.userId === action.forUserId
            })
            return Object.assign({}, state, { 
                notifs: [o].concat(valids) 
            });
        }


        case DiaryActions.DIARY_LOAD_MONTH_RESPONSE: {
            const zoneDiff  = moment.utc().diff(moment()), //get timezone_diff
            postsInfos  = fromJS(state).get('postsInfos'),
            notifsInfos = fromJS(state).get('notifsInfos'),
            diariesInfos= fromJS(state).get('diariesInfos'),

            notifs      = action.notifs.map((n, i) => {
                return _.reduce(n, function(obj, value, key) {
                    //set date key to 'YYYY-MM-DD' format in new object
                    if(key === 'date')
                        obj[key] = moment.unix((value + (zoneDiff))).format("YYYY-MM-DD");
                    else
                        obj[key] = value;

                    return obj
                }, {})
            }),

            gNotifs     = fromJS(notifs).concat(notifsInfos),

            diaries     = action.diaries.map((n, i) => {
                return _.reduce(n, function(obj, value, key) {
                    //set date key to 'YYYY-MM-DD' format in new object
                    if(key === 'date')
                        obj[key] = moment.unix((value + (zoneDiff))).format("YYYY-MM-DD");
                    else
                        obj[key] = value;

                    return obj
                }, {})
            }),
            gDiaries    = fromJS(diaries).concat(diariesInfos),
            
            posts       = action.posts.map((n, i) => {
                return _.reduce(n, function(obj, value, key) {
                    //set date key to 'YYYY-MM-DD' format in new object
                    if(key === 'date')
                        obj[key] = moment.unix((value + (zoneDiff))).format("YYYY-MM-DD");
                    else
                        obj[key] = value;

                    return obj
                }, {})
            }),
            gPosts      = fromJS(posts).concat(postsInfos)

            return Object.assign({}, state, {
                postsInfos: gPosts.toJS(),
                notifsInfos: gNotifs.toJS(),
                diariesInfos: gDiaries.toJS()
            });
        }


        case DiaryActions.DIARY_LOAD_DAY_RESPONSE: {
            const zoneDiff  = moment.utc().diff(moment()), //get timezone_diff
            posts  = fromJS(state).get('posts'),
            notifs = fromJS(state).get('notifs'),
            diaries= fromJS(state).get('diaries'),

            _notifs      = action.notifs.map((n, i) => {
                return _.reduce(n, function(obj, value, key) {
                    obj['userId'] = action.forUserId;
                    //set date key to 'YYYY-MM-DD' format in new object
                    if(key === 'date') {
                        obj['timeAgo'] = value;
                        obj[key] = moment.unix((value + (zoneDiff))).format("YYYY-MM-DD");
                    } else {
                        obj[key] = value;
                    }

                    return obj
                }, {})
            }),

            gNotifs     = fromJS(_notifs).concat(notifs),

            _diaries     = action.diaries.map((n, i) => {
                return _.reduce(n, function(obj, value, key) {
                    //set date key to 'YYYY-MM-DD' format in new object
                    if(key === 'date')
                        obj[key] = moment.unix((value + (zoneDiff))).format("YYYY-MM-DD");
                    else
                        obj[key] = value;

                    return obj
                }, {})
            }),
            gDiaries    = fromJS(_diaries).concat(diaries),
            
            _posts       = action.posts.map((n, i) => {
                return _.reduce(n, function(obj, value, key) {
                    //set date key to 'YYYY-MM-DD' format in new object
                    if(key === 'date')
                        obj[key] = moment.unix((value + (zoneDiff))).format("YYYY-MM-DD");
                    else
                        obj[key] = value;

                    return obj
                }, {})
            }),
            gPosts      = fromJS(_posts).concat(posts)
            return Object.assign({}, state, {
                posts: gPosts.toJS(),
                notifs: gNotifs.toJS(),
                diaries: gDiaries.toJS()
            });
        }



        case DiaryActions.SEEING_DIARY_RESPONSE: 
            return Object.assign({}, state, {
                unseens: 0,
                notificationIds: action.data.ids,
                notificationsById: action.data.notifications
            })



        case DiaryActions.DIARY_PUSH_INFO: {
            const year = action.info.year,
            keyYear    = fromJS(state).get('diaryByYear').get(year);
            var diaryByYear = {};
            if(keyYear.toJS() !== undefined || !keyYear.toJS()) {
                console.log('year key doesn\'t exist in notifications state')
                diaryByYear = fromJS(state).get('diaryByYear').set(year, action.info.data)
            } else {
                diaryByYear = List([action.info.data]).concat(keyYear);
            }
            return Object.assign({}, state, {diaryByYear: diaryByYear.toJS()});
        }
        
        case DiaryActions.DIARY_PUSH_DETAIL: {
            const year = action.info.year,
            keyYear    = fromJS(state).get('diaryByYear').get(year);
            var diaryByYear = {};
            if(keyYear.toJS() !== undefined || !keyYear.toJS()) {
                console.log('year key doesn\'t exist in notifications state')
                diaryByYear = fromJS(state).get('diaryByYear').set(year, action.info.data)
            } else {
                diaryByYear = List([action.info.data]).concat(keyYear);
            }
            return Object.assign({}, state, {diaryByYear: diaryByYear.toJS()});
        }
    }

    return state
}

export default Diary