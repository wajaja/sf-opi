import { REHYDRATE, PURGE } from 'redux-persist'
import {
    Groups as GroupsActions,
} from '../../actions/user'

/**
 * initialState
 * @type {{id: string, fb_uid: string, first_name: string, last_name: string, email: string, follower: boolean, following: boolean, follower_count: number, following_count: number, created_at: string, modified_at: string}}
 */
export const initialState = {
    groups: {},
    list: [],
    suggestion: {},
    currentGroup: {},
    loading: true,
}

/**
 * Profile
 * Redux Reducer for Profile action
 * Reference: http://redux.js.org/docs/basics/Reducers.html
 * @param state
 * @param action
 * @returns {*}
 * @constructor
 */
function Groups(state = initialState, action) {

    switch (action.type) {

        case GroupsActions.CREATE_RESPONSE: {
            const group = action.group,
            groups = state.groups || {};
            groups[group.id]['group'] = group;
            groups[group.id]['photos'] = action.photos;
            groups[group.id]['newsRefs'] = action.newsRefs;

            return Object.assign({}, state, {groups: groups})
        }

        case GroupsActions.EDIT_RESPONSE: {
            const group = action.group,
            groups = state.groups || {};
            groups[group.id]['group'] = group;
            groups[group.id]['photos'] = action.photos;
            groups[group.id]['newsRefs'] = action.newsRefs;

            return Object.assign({}, state, {groups: groups})
        }

        case GroupsActions.LOAD_GROUP_RESPONSE: {
            const group = action.group,
            groups = state.groups || {};
            groups[group.id]['group'] = group;
            groups[group.id]['photos'] = action.photos;
            groups[group.id]['newsRefs'] = action.newsRefs;

            return Object.assign({}, state, {groups: groups})
        }

        case GroupsActions.LOAD_LIST_RESPONSE: {
            const list = action.groups
            return Object.assign({}, state, {list: state.list.push(list) })
        }

        case GroupsActions.LOAD_SUGGESTION_RESPONSE: {
            const list = action.groups
            return Object.assign({}, state, {suggestion: state.suggestion.push(list) })
        }

        case GroupsActions.ADD_MEMBER:
            if (action.response) {
                // return Object.assign({}, state, {
                //     following: true,
                //     follower_count: state,
                // })
            }

            return state

        case GroupsActions.REMOVE_MEMBER:
            if (typeof action.response != 'undefined') {
                // return Object.assign({}, state, {
                //     following: false,
                //     follower_count: state.follower_count - 1,
                // })
            }

    }

    return state

}

export default Groups
