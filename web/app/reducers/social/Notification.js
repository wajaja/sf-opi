import Immutable, { List, Map, Set, fromJS } from 'immutable'
import { REHYDRATE, PURGE } from 'redux-persist'

import {
    Notification as NotificationsActions,
} from '../../actions/social'



export const initialState = {
	nbAlerts: 0,
	unreads: 0,
    loading: false,
	notifications: [],
    notificationIds: [],
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
function Notification(state = initialState, action) {

    switch (action.type) {

        
        
        case NotificationsActions.SHOW_ALERT_RESPONSE:
            if (action.response) {
                return Object.assign({}, state, { nbAlerts: action.nbAlerts })
            }
            return state
        case NotificationsActions.HIDE_ALERT_REQUEST: 
            return Object.assign({}, state, {
                nbAlerts: 0
            })

        case NotificationsActions.HIDE_ALERT_RESPONSE: 
            return Object.assign({}, state, {
                nbAlerts: 0,
                notificationIds: action.data.ids,
                notificationsById: action.data.notifications
            })
        case NotificationsActions.LOAD_REQ: 
            return Object.assign({}, state, { loading: true });

        case NotificationsActions.LOAD_RESPONSE: 
            let data = action.data,
            _newData = fromJS(state).get('notifications').concat(data);
            return Object.assign({}, state, {
                notifications: _newData.toJS(),
                loading: false 
            });

        case NotificationsActions.DIARY_PUSH_INFO: {
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
        case NotificationsActions.DIARY_PUSH_DETAIL: {
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

export default Notification