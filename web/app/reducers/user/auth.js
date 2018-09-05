import { REHYDRATE, PURGE } from 'redux-persist'
import * as types from '../../constants/user/types'
import isEmpty from 'lodash/isEmpty'
import jwtDecode from 'jwt-decode';

import { 
    LOGIN_REQUEST, 
    LOGIN_SUCCESS, 
    LOGIN_FAILURE, 
    LOGOUT_SUCCESS, 
    SET_CURRENT_USER, 
    setCurrentUser,
    SET_TOKEN,
    SET_FIRE_USER
}                   from '../../actions/user/Auth'


if(typeof localStorage === 'undefined') {
    global.localStorage = {};
}

export const initialState = {
    token: '',
    data: {},           //object with email and password
    isFetching: false,
    fireUser: null,
    isAuthenticated: localStorage.getItem && localStorage.getItem('_tk_key') ? true : false,
    user: localStorage.getItem && localStorage.getItem('_tk_key') ? 
        setCurrentUser(jwtDecode(localStorage.getItem && localStorage.getItem('_tk_key'))) : {}
}

export default (state = initialState, action) => {
    switch (action.type) {

        
        
        case LOGIN_REQUEST:
            return Object.assign({}, state, {
                isFetching: true,
                isAuthenticated: false,
                user: action.creds
            })
        case LOGIN_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                isAuthenticated: true,
                errorMessage: '',
                user: action.user
            })
        case LOGIN_FAILURE:
            return Object.assign({}, state, {
                isFetching: false,
                isAuthenticated: false,
                errorMessage: action.message
            })
        case LOGOUT_SUCCESS:
            return Object.assign({}, state, {
                isFetching: true,
                isAuthenticated: false
            })
        case SET_CURRENT_USER:
            return {
                isFetching: false,
                isAuthenticated: true,
                errorMessage: '',
                user: action.user
            };
        case SET_FIRE_USER:
            return Object.assign({}, state, {
                fireUser: action.fireUser,
            })
        case SET_TOKEN:
            return Object.assign({}, state, {
                token: action.token,
            })
        default: 
            return state;
    }
}