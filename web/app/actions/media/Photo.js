import * as axios from 'axios'

/**
 * LOAD
 * @type {string}
 */
export const LOAD_PHOTO = 'LOAD_PHOTO'

export const ZOOM_PHOTO = 'ZOOM_PHOTO'


export const LOAD_PHOTO_REQUEST = 'LOAD_PHOTO_REQUEST'
/**
 * _loadRequest
 * @private
 */
export function loadRequest(params) { 
    return {
        type: LOAD_PHOTO_REQUEST,
        params,
    }
}

export const ZOOM_PHOTO_REQUEST = 'ZOOM_PHOTO_REQUEST'
/**
 * _loadRequest
 * @private
 */
export function zoomRequest(params) { 
    return {
        type: ZOOM_PHOTO_REQUEST,
        params,
    }
}

export const PHOTO_CLOSE_MODAL = 'PHOTO_CLOSE_MODAL'

/**
 * _loadRequest
 * @private
 */
export function closeModal() { 
    return {
        type: PHOTO_CLOSE_MODAL,
    }
}

export const CLOSE_ZOOM = 'CLOSE_ZOOM'

/**
 * _loadRequest
 * @private
 */
export function closeZomm() { 
    return {
        type: CLOSE_ZOOM,
    }
}

export const LOAD_PHOTO_RESPONSE = 'LOAD_PHOTO_RESPONSE'

/**
 * _loadResponse
 * @param response
 * @private
 */
export function loadResponse(photo) { 
    return {
        type: LOAD_PHOTO_RESPONSE, 
        photo, 
    }
}

export const ZOOM_PHOTO_RESPONSE = 'ZOOM_PHOTO_RESPONSE'

/**
 * _loadResponse
 * @param response
 * @private
 */
export function zoomResponse(photo) { 
    return {
        type: ZOOM_PHOTO_RESPONSE, 
        photo, 
    }
}

export const MODAL_PHOTO = 'MODAL_PHOTO'

export function modalPhoto(params, query, status, loading) {
    return {
        type: MODAL_PHOTO,
        params,
        query,
        status,
        loading,
    }
}

export const UPDATE_PHOTO_ON_LIKE = 'UPDATE_PHOTO_ON_LIKE'

const _updateOnLike = (photoId, nbLikers, liked) =>({type: UPDATE_PHOTO_ON_LIKE, photoId, nbLikers, liked})

export function updateOnLike(photoId, data) {
    return (dispatch, getState) => {
        dispatch(_updateOnLike(photoId, data.nbLikers, data.liked))
    }
}

/**
 * load
 * Gets single photo upload from API based on upload id
 * Redux Action
 * Reference: http://redux.js.org/docs/basics/Actions.html
 * @param id upload id
 * @returns {Function}
 */
export function load(imageId, postId) { 
    return {
        type: LOAD_PHOTO,
        imageId,
        postId,
    }
}


/**
 * load
 * Gets single photo upload from API based on upload id
 * Redux Action
 * Reference: http://redux.js.org/docs/basics/Actions.html
 * @param id upload id
 * @returns {Function}
 */
export function zoom(imageId) { 
    return {
        type: ZOOM_PHOTO,
        imageId,
    }
}
// export function load(id, postId) {
//     return dispatch => {
//         return new Promise((resolve) => {
//             dispatch(_loadRequest())
//             axios.get(`${BASE_PATH}/api/photos/show/${id}?post_id=${postId}`)
//             .then(
//                  function (res) {
//                  const photo = res.data.photo;
//                  dispatch(PhotosActions.pushPhoto(photo));
//                  dispatch(AuthorsActions.pushAuthor(photo.author))
//                     dispatch(_loadResponse(photo))
//                     dispatch(CommentsActions.load(photo.id, 'photo'))
//                     // dispatch(LikesActions.load(photo.id))
//              },  function(err) { 
//                      if(err.response) {
//                      console.log(err.response.data); 
//                          console.log(err.response.status);
//                          console.log(err.response.headers);              
//                      } else if(err.request) {
//                          console.log(err.request);
//                      } else {
//                          console.log(err.message);
//                      }
//                  console.log(err.config);
//             });
                
//         })
//     }
// }
