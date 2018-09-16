import axios from 'axios';
import jwtDecode from 'jwt-decode';

import setAuthorizationToken from '../../utils/set-authorization-token';
import { BASE_PATH } from '../../config/api'

if(typeof localStorage === 'undefined') {
    global.localStorage = {};
}

// There are three possible states for our login
// process and we need actions for each of them
export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'

function requestLogin(creds) {
  return {
    type: LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    creds
  }
}

function receiveLogin(token) {
  return {
    type: LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    jwt_opinion: token
  }
}

function loginError(message) {
  return {
    type: LOGIN_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message
  }
}

/**
* login
* Perform login user for given data
* @return [function]
*/
export function login(creds) {
  return dispatch => {
    dispatch(requestLogin(creds))
    return axios.post(  BASE_PATH + '/api/login_check', creds)
          .then(
            res => {
              const token = res.data.token;
              localStorage.setItem && localStorage.setItem('jwt_opinion', token);
              setAuthorizationToken(token);
              dispatch(receiveLogin(token));
              dispatch(setCurrentUser(jwtDecode(token)));
            },
            err => {
              dispatch(loginError(err.data.message));
            }
          )
  }
}



// Three possible states for our logout process as well.
// Since we are using JWTs, we just need to remove the token
// from localStorage. These actions are more useful if we
// were calling the API to log the user out
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE'

function requestLogout() {
  return {
    type: LOGOUT_REQUEST,
    isFetching: true,
    isAuthenticated: true
  }
}

function receiveLogout() {
  return {
    type: LOGOUT_SUCCESS,
    isFetching: false,
    isAuthenticated: false
  }
}
/**
* logout
* Perform logout for given user
* @return [function]
*/
export function logout() {
  return dispatch => {
    localStorage.removeItem && localStorage.removeItem('jwtToken');
    setAuthorizationToken(false);
    dispatch(setCurrentUser({}));
  }
}


export const ADD_FLASH_MESSAGE = 'ADD_FLASH_MESSAGE'
export const DELETE_FLASH_MESSAGE = 'DELETE_FLASH_MESSAGE'


export const SET_CURRENT_USER = 'SET_CURRENT_USER'

/**
* setCurrentUser
* @param user
*/
export const setCurrentUser = (user) => ({ type: SET_CURRENT_USER, user, })

export const SET_FIRE_USER = 'AUTH::SET_FIRE_USER'

/**
* setCurrentUser
* @param user
*/
export const setFireUser = (fireUser) => ({ type: SET_FIRE_USER, fireUser, })

export const SET_TOKEN = 'SET_TOKEN'

/**
* setCurrentUser
* @param user
*/
export const setToken = (token) => ({ type: SET_TOKEN, token, })

/**
* login
* Perform login user for given data
* @return [function]
*/
export function sendTokenToServer(token) {
  return dispatch => {
    return axios.post(  BASE_PATH + '/api/firebase/auth', {token : token})
          .then(
            res => {
                //console.log(res)
            },
            err => {
                //console.log(err)
            }
          )
  }
}