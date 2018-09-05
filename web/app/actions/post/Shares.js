import axios 				from 'axios'
import * as Authors 		from './Authors'
import { BASE_PATH } 		from '../../config/api'
import { App as AppActions } from '../social'


export const HANDLE_SHARE_REQUEST = 'HANDLE_SHARE_REQUEST'

export const _handleShareRequest = (postId) => ({type: HANDLE_SHARE_REQUEST, postId})

export const HANDLE_SHARE_RESPONSE = 'HANDLE_SHARE_RESPONSE'

export const _handleShareResponse = (sharedPost) => ({type: HANDLE_SHARE_RESPONSE, sharedPost})

export function handleShare(postId, refer) {
	return (dispatch, getState) => {
		dispatch(_handleShareRequest(postId))
		if(refer === 'photo') {
			axios.get(`${BASE_PATH}/api/photos/show/${postId}`)
			 .then(function (res) {
			 	console.log(res.data.photo);
				dispatch(_handleShareResponse(res.data.photo));
			}, function(err) { 
				if(err.response) {
					console.log(err.response.data);	
					console.log(err.response.status);
					console.log(err.response.headers);				
				} else if(err.request) {
					console.log(err.request);
				} else {
					console.log(err.message);
				}
				console.log(err.config);
			})

		} else {
			axios.get(`${BASE_PATH}/api/posts/show/${postId}`)
			 	.then(function (res) {
				dispatch(_handleShareResponse(res.data.post))
			}, function(err) { 
				console.log('err :', err);
			})
		}
		
	}
}



export const CREATE_SHARE_REQUEST = 'CREATE_SHARE_REQUEST'

export const _createShareRequest = (data) => ({type: CREATE_SHARE_REQUEST})

export const CREATE_SHARE_RESPONSE = 'CREATE_SHARE_RESPONSE'

export const _createShareResponse = (share) => ({type: CREATE_SHARE_RESPONSE, share})

export function createShare(data, postId, refer) {
	return (dispatch, getState) => {
		dispatch(_createShareRequest(postId))
		axios.post(`${BASE_PATH}/api/shares/create/`, data, { 
    			params : {
					postId: postId,
					refer: refer
				}})
			 .then(function (res) {
				dispatch(_createShareResponse(res.data.share))
				dispatch(AppActions.shareSuccess()) //add flash message
			}, function(err) { 
				if(err.response) {
					console.log(err.response.data);	
					console.log(err.response.status);
					console.log(err.response.headers);				
				} else if(err.request) {
					console.log(err.request);
				} else {
					console.log(err.message);
				}
				console.log(err.config);
			})
	}
}


export const CANCEL_SHARE = 'CANCEL_SHARE'

export function cancelShare() {
	return {
		type: CANCEL_SHARE
	}
}


// export const STORE_NAME_REQUESTED = 'STORE_NAME_REQUESTED';
// export const STORE_NAME_SUCCEEDED = 'STORE_NAME_SUCCEEDED';
// export const STORE_NAME_FAILED = 'STORE_NAME_FAILED';
// export const STORE_PHONE_REQUESTED = 'STORE_PHONE_REQUESTED';
// export const STORE_PHONE_SUCCEEDED = 'STORE_PHONE_SUCCEEDED';
// export const STORE_PHONE_FAILED = 'STORE_PHONE_FAILED';
// export const CALL_DOUBLE_CHECK_REQUESTED = 'CALL_DOUBLE_CHECK_REQUESTED';
// export const CALL_DOUBLE_CHECK_SUCCEEDED = 'CALL_DOUBLE_CHECK_SUCCEEDED';
// export const CALL_DOUBLE_CHECK_FAILED = 'CALL_DOUBLE_CHECK_FAILED';


// export const ROUTE_CHANGED = 'ROUTE_CHANGED';

// export const routeChanged = (location) => ({type: ROUTE_CHANGED, location: location})

// export function gotoNext() {
//   return (dispatch, getState) => {
//     const { currIndex } = getState();
//     dispatch(_gotoIndex(currIndex + 1));
//   };
// }

// export function _gotoIndex(index) {
//   return async (dispatch, getState) => {
//     const { modalList } = getState();
//     const nextRoute = modalList[index];
//     const shouldShowFn = SHOULD_SHOW_MAP[nextRoute];
//     const shouldShow = await shouldShowFn(dispatch, getState);

//     if (shouldShow) {
//       hashHistory.push(nextRoute);
//     } else {
//       dispatch(_gotoIndex(index + 1));
//     }
//   }
// }

// function alwaysShow() {
//   return true;
// }

// async function shouldShowDoubleCheck(dispatch, getState) {
//   const { formData } = getState();

//   dispatch(_callDoubleCheckRequested());
//   try {
//     await request('/api/check', formData);
//     dispatch(_callDoubleCheckSucceeded());
//     return false;
//   } catch (error) {
//     dispatch(_callDoubleCheckFailed(error));
//     return true;
//   }
// }

// export function gotoDone() {
//   return () => {
//     hashHistory.push('/done');
//   }
// }

// export function storeName(name, onSuccess) {
//   return async dispatch => {
//     dispatch(_storeNameRequested());
//     try {
//       await request('/api/name', name);
//       dispatch(_storeNameSucceeded(name));
//       onSuccess();
//     } catch(error) {
//       dispatch(_storeNameFailed(error));
//     }
//   }
// }

// export function storePhone(phone, onSuccess) {
//   return async dispatch => {
//     dispatch(_storePhoneRequested());
//     try {
//       await request('/api/phone', phone);
//       dispatch(_storePhoneSucceeded(phone));
//       onSuccess();
//     } catch(error) {
//       dispatch(_storePhoneFailed(error));
//     }
//   }
// }

// export const _storeNameSucceeded = (name) => ({type: STORE_NAME_SUCCEEDED, name: name })

// export const _storeNameFailed = (errorMsg) => ({type: STORE_NAME_FAILED, errorMsg: errorMsg })

// export const _storePhoneRequested = () => ({type: STORE_PHONE_REQUESTED, apiName: 'phone' })

// export const _storePhoneSucceeded = (phone) => ({type: STORE_PHONE_SUCCEEDED, phone: phone })
