import { REHYDRATE, PURGE } from 'redux-persist'
import Immutable, { List, Map, Set, fromJS } from 'immutable'
import {
    Profiles as ProfilesActions,
} from '../../actions'

/**
 * initialState
 * @type {{id: string, fb_uid: string, first_name: string, last_name: string, email: string, follower: boolean, following: boolean, follower_count: number, following_count: number, created_at: string, modified_at: string}}
 */
export const initialState = {
    users: {},
    currentUser: {},
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
function Profiles(state = initialState, action) {

    switch (action.type) {

        

        case ProfilesActions.LOAD_PROFILE_RESPONSE: {
                const user = {};
                user[action.username] = {};
                user[action.username]['user'] = action.user;
                user[action.username]['photos'] = action.photos;
                user[action.username]['newsRefs'] = action.newsRefs;
                return Object.assign({}, state, {
                    users: user
                })
            return initialState
        }

        /*
        *Issue due to mutability
        */
        // case ProfilesActions.LOAD_PROFILE_RESPONSE: {
        //         state.users[action.username] = {};
        //         state.users[action.username]['user'] = action.user;
        //         state.users[action.username]['photos'] = action.photos;
        //         state.users[action.username]['newsRefs'] = action.newsRefs;
        //         return Object.assign({}, state, {
        //             users: state.users
        //         })
        //     return initialState
        // }

        case ProfilesActions.LOAD_PHOTOS_RESPONSE: {
                let username = action.username,
                user = state.users;
                if(!user[username]['photos']) {
                    user[username]['photos'] = action.photos
                } else {
                    const _last = List(user[username]['photos']),
                    _new = List(action.infos);
                    _last.concat(_new)
                    user[username]['photos'] = _last.toJS();
                }
                
                return Object.assign({}, state, {
                    users: user
                })
        }

        case ProfilesActions.LOAD_INFOS_RESPONSE: {
                let username = action.username,
                user = state.users;
                if(!user[username]['about']) {
                    user[username]['about'] = action.infos
                } else {
                    const _last = Map(user[username]['about']),
                    _new = Map(action.infos);
                    _last.merge(_new)
                    user[username]['about'] = _last.toJS();
                }
                
                return Object.assign({}, state, {
                    users: user
                })
        }

        case ProfilesActions.LOAD_FRIENDS_RESPONSE: {
                let username = action.username,
                user = state.users;
                if(!user[username]['friends']) {
                    user[username]['friends'] = action.friends
                } else {
                    const _last = List(user[username]['friends']),
                    _new = List(action.friends);
                    _last.concat(_new)
                    user[username]['friends'] = _last.toJS();
                }
                
                return Object.assign({}, state, {
                    users: user
                })
        }

        case ProfilesActions.LOAD_FOLLOWERS_RESPONSE: {
                let username = action.username;
                if(typeof state.users[username] === 'object') {
                    if(!state.users[username]['followers']) {
                        state.users[username]['followers'] = action.followers;
                        // photos = state.users[username][photos].push(action.photos) // []
                    } else {
                        const _last = List(state.users[username]['followers']),
                        _new = List(action.followers);
                        _last.push(_new)
                    }
                }
                state.users[username]['followers'] =_last.toJS()
                
                return Object.assign({}, state, {
                    users: state.users
                })
        }

        case ProfilesActions.LOAD_TIMELINE_RESPONSE: {
                let username = action.username;
                if(typeof state.users[username] === 'object') {
                    if(!state.users[username]['newsRefs']) {
                        state.users[username]['newsRefs'] = action.newsRefs;
                        // photos = state.users[username][photos].push(action.photos) // []
                    } else {
                        const _last = List(state.users[username]['newsRefs']),
                        _new = List(action.newsRefs);
                        _last.push(_new)
                    }
                }
                state.users[username]['newsRefs'] =_last.toJS()
                
                return Object.assign({}, state, {
                    users: state.users
                })
        }

        case ProfilesActions.LOAD:
            if (action.response) {
                return Object.assign({}, state, {
                    id: action.response.id,
                    firstname: action.response.first_name,
                    lastname: action.response.last_name,
                    email_md5: action.response.email_md5,
                    follower: action.response.follower,
                    following: action.response.following,
                    follower_count: action.response.follower_count,
                    following_count: action.response.following_count,
                    created_at: action.response.created_at,
                    modified_at: action.response.modified_at,
                })
            }

            return initialState

        case ProfilesActions.FOLLOW:
            if (action.response) {
                return Object.assign({}, state, {
                    following: true,
                    follower_count: state.follower_count + 1,
                })
            }

            return state

        case ProfilesActions.UNFOLLOW:
            if (typeof action.response != 'undefined') {
                return Object.assign({}, state, {
                    following: false,
                    follower_count: state.follower_count - 1,
                })
            }

    }

    return state

}

export default Profiles
