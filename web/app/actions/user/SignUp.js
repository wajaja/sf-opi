import axios from 'axios';
import jwtDecode from 'jwt-decode';

if(typeof localStorage === 'undefined') {
	global.localStorage = {};
}

import setAuthorizationToken from '../../utils/set-authorization-token';
import { setCurrentUser } from './Auth';

export function userSignupRequest(userData) {
  	return dispatch => {
	    return axios.post('http://opinion/app_dev.php/api/signup', userData)
	    	.then(res => {
	    		const token = res.data.token;
			    localStorage.setItem && localStorage.setItem('jwtToken', token);
			    setAuthorizationToken(token);
			    dispatch(setCurrentUser(jwtDecode(token)));
	    	})
	    	.catch(err => {
	    		console.log(err);
	    	});
	}
}

export function isUserExists(identifier) {
  return dispatch => {
    return axios.get(`http://opinion/app_dev.php/api/users/${identifier}`);
  }
}