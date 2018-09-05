import { REHYDRATE, PURGE } from 'redux-persist'
import Immutable, { List, Map, Set, fromJS } from 'immutable'

import {
    Users as UsersActions,
} from '../../actions/user'

/**
 * initialState
 * @type {{id: string, fb_uid: string, first_name: string, last_name: string, email: string, follower: boolean, following: boolean, follower_count: number, following_count: number, created_at: string, modified_at: string}}
 */
export const initialState = {
    defaults: [],   //see serializer schema from server
    onlines: [],
    infos: [],
    profiles: [],
}

/**
 * FriendsFollowers
 * Redux Reducer for FriendsFollowers action
 * Reference: http://redux.js.org/docs/basics/Reducers.html
 * @param state
 * @param action
 * @returns {*}
 * @constructor
 */
function Users(state = initialState, action) {

    switch (action.type) {

        case 'persist/REHYDRATE': {
            // if (action.response) {
            //     return Object.assign({}, state, {
            //         following: true,
            //         follower_count: state.follower_count + 1,
            //     })
            // }

            // return state
        }

        case UsersActions.LOAD_DEFAULT_RESPONSE:
            if (action.users) {
                return Object.assign({}, state, {
                    defaults: action.users,
                })
            }
            return state

        case UsersActions.LOAD_ONLINE_RESPONSE: {
            return Object.assign({}, state, {
                    onlines: action.users,
            })
        }

        case UsersActions.LOAD_INFOS_RESPONSE:
            if (action.users) {
                return Object.assign({}, state, {
                    infos: action.users,
                })
            }
            return state

        case UsersActions.ADD_INFO_RESPONSE:
            if (action.user) {

                const list  = fromJS(state).get('infos'),
                infos  = List([action.user]).concat(list);
                return Object.assign({}, state, {
                    infos: infos.toJS()
                })
            }
            return state

        // case UsersActions.LOAD_PROFILE_RESPONSE: {
        //     let lists  = action.suggestions.map((s) => {
        //                 return {
        //                     profilePic  : s.profilePic,
        //                     id          : s.identity._id['$id'],
        //                     email       : s.identity.email,
        //                     username    : s.identity.username,
        //                     firstname   : s.identity.firstname,
        //                     lastname    : s.identity.lastname,
        //                 }
        //         }),
        //     users       = List(lists).concat(fromJS(state).get('suggestions'));
        //     return fromJS(state).set('suggestions', users).toJS();
        // }

        return state

    }

    return state

}

export default Users
