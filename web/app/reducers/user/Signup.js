import { Signup as SignupAction } from '../../actions/user'

/**
 * initialState
 * @type {{id: string, fb_uid: string, first_name: string, last_name: string, email: string, follower: boolean, following: boolean, follower_count: number, following_count: number, created_at: string, modified_at: string}}
 */
export const initialState = {
    form: {},
    trans: {},
    server_error: {}
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
function Signup(state = initialState, action) {

    switch (action.type) {

        case SignupAction.PW_FORGOTED: {
            const login = action.login

            return Object.assign({}, state, {login: login})
        }

    }

    return state

}

export default Signup
