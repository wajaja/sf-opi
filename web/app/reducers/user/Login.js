import { Login as LoginAction } from '../../actions/user'

/**
 * initialState
 * @type {{id: string, fb_uid: string, first_name: string, last_name: string, email: string, follower: boolean, following: boolean, follower_count: number, following_count: number, created_at: string, modified_at: string}}
 */
export const initialState = {
    trans: {},
    error: {} ,
    csrf_token: '',
    last_username: ''
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
function Login(state = initialState, action) {

    switch (action.type) {

        case LoginAction.PW_FORGOTED: {
            const login = action.login

            return Object.assign({}, state, {login: login})
        }

    }

    return state

}

export default Login
