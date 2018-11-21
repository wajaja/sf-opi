import { REHYDRATE, PURGE } from 'redux-persist'
import Immutable, { List, Map, Set, fromJS } from 'immutable'

import {
    RelationShip as RelationShipActions,
    Invitation as InvitationsActions,
} from '../../actions/user'

/**
 * initialState
 * @type {{id: string, fb_uid: string, first_name: string, last_name: string, email: string, follower: boolean, following: boolean, follower_count: number, following_count: number, created_at: string, modified_at: string}}
 */
export const initialState = {
    friendIds: [],   //see serializer schema from server
    followerIds: [],
    fetch_invit: false,
    blockedIds: [],
    invitations: [],
    suggestions: [],
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
function RelationShip(state = initialState, action) {

    switch (action.type) {

        // case 'persist/REHYDRATE': {
        //     console.log('RelationShip');
        //     var incoming = action.payload.RelationShip; // Carts is the name of the reducer
        //     if (incoming) {
        //         console.log('incoming')
        //         return {...state, ...incoming};
        //     }
        //     return state;
        // }

        case RelationShipActions.GET_FRIENDS_IDS: {
            if (action.users) {
                return Object.assign({}, state, {
                    all_defaults: action.users,
                })
            }
            return state
        }

        case RelationShipActions.GET_BLOCKEDS_IDS: {
            let lists   =   action.suggestions,
            users       = List(lists).concat(fromJS(state).get('suggestions'));
            return fromJS(state).set('suggestions', users).toJS();
        }

        case RelationShipActions.GET_FOLLOWERS_IDS: {
            let lists   =   action.suggestions,
            users       = List(lists).concat(fromJS(state).get('suggestions'));
            return fromJS(state).set('suggestions', users).toJS();
        }

        case RelationShipActions.LOAD_SUGGESTIONS_RESPONSE: {
            let lists   =   action.suggestions,
            users       = List(lists).concat(fromJS(state).get('suggestions'));
            return fromJS(state).set('suggestions', users).toJS();
        }

        case InvitationsActions.LOAD_REQ: 
            return Object.assign({}, state, {fetch_invit: true });
        
        case InvitationsActions.LOAD_RESPONSE: 
            let data = action.data,
            _newData = fromJS(state).get('invitations').concat(data);
            return Object.assign({}, state, {
                invitations: _newData.toJS(),
                fetch_invit: false 
            });

        return state

    }

    return state

}

export default RelationShip
