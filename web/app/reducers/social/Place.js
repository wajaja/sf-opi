import { REHYDRATE, PURGE } from 'redux-persist'
import {
    Places as PlacesActions,
} from '../../actions'

/**
 * initialState
 * @type {{id: string, fb_uid: string, first_name: string, last_name: string, email: string, follower: boolean, following: boolean, follower_count: number, following_count: number, created_at: string, modified_at: string}}
 */
export const initialState = {
    places: {},
    list: [],
    suggestion: {},
    currentPlace: {},
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
function Places(state = initialState, action) {

    switch (action.type) {

        case PlacesActions.CREATE_RESPONSE: {
            const place = action.place,
            places = state.places || {};
            places[place.id]['place'] = place;
            places[place.id]['photos'] = action.photos;
            places[place.id]['newsRefs'] = action.newsRefs;

            return Object.assign({}, state, {places: places})
        }

        case PlacesActions.EDIT_RESPONSE: {
            const place = action.place,
            places = state.places || {};
            places[place.id]['place'] = place;
            places[place.id]['photos'] = action.photos;
            places[place.id]['newsRefs'] = action.newsRefs;

            return Object.assign({}, state, {places: places})
        }

        case PlacesActions.LOAD_PLACE_RESPONSE: {
            const place = action.place,
            places = state.places || {};
            places[place.id]['place'] = place;
            places[place.id]['photos'] = action.photos;
            places[place.id]['newsRefs'] = action.newsRefs;

            return Object.assign({}, state, {places: places})
        }

        case PlacesActions.LOAD_LIST_RESPONSE: {
            const list = action.places
            return Object.assign({}, state, {list: state.list.push(list) })
        }

        case PlacesActions.LOAD_SUGGESTION_RESPONSE: {
            const list = action.places
            return Object.assign({}, state, {suggestion: state.suggestion.push(list) })
        }

        case PlacesActions.ADD_MEMBER:
            if (action.response) {
                // return Object.assign({}, state, {
                //     following: true,
                //     follower_count: state,
                // })
            }

            return state

        case PlacesActions.REMOVE_MEMBER:
            if (typeof action.response != 'undefined') {
                // return Object.assign({}, state, {
                //     following: false,
                //     follower_count: state.follower_count - 1,
                // })
            }

    }

    return state

}

export default Places
