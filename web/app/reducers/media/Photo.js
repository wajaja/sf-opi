import Immutable, { List, Map, Set, fromJS } from 'immutable'
import { REHYDRATE, PURGE } from 'redux-persist'

import {
    Photo as PhotoActions,
    App as AppActions
} from '../../actions'

/**
 * initialState
 * @type {{id: string, caption: string, created_at: string, email: string, fb_uid: string, filename: string, first_name: string, hashtags: string, last_name: string, latitude: string, liked: string, location: string, longitude: string, modified_at: string, user_id: string, loading: boolean}}
 */
export const initialState = {
    photo: {},
    params: '',
    query: {},
    status: {},

    loading: false,

    showZoomImage: false,
    zoomRequest: false,
    zoomSrc: null,
    zoomId: null,
}

/**
 * Photo
 * Redux Reducer for Photo action
 * Reference: http://redux.js.org/docs/basics/Reducers.html
 * @param state
 * @param action
 * @returns {*}
 * @constructor
 */
function Photo(state = initialState, action) {

    switch (action.type) {

        
        case PhotoActions.CLOSE_ZOOM:
            return Object.assign({}, state, {
                showZoomImage: false,
                zoomSrc: null,
                zoomId: null,
            })

        case PhotoActions.ZOOM_PHOTO_REQUEST:
            return Object.assign({}, state, {
                showZoomImage: true,
                zoomRequest: true,
                zoomId: null,
            })

        case PhotoActions.ZOOM_PHOTO_RESPONSE:
            return Object.assign({}, state, {
                zoomRequest: false,
                zoomId: action.photo.id,
                zoomSrc: action.photo.webPath
            })

        case PhotoActions.MODAL_PHOTO:
            return Object.assign({}, state, {
                params: action.params,
                query: action.query,
                status: action.status,
                loading: action.loading,
            })
        case PhotoActions.UPDATE_PHOTO_ON_LIKE:
            var photo = fromJS(state).get('photo').merge({
                                        "liked": action.liked, 
                                        "nbLikers": action.nbLikers
                                    });
            return Object.assign({}, state, {
                        photo: photo.toJS(),
                    })

        case PhotoActions.LOAD_PHOTO_RESPONSE:
            if (action.photo) {
                return Object.assign({}, state, {
                    photo: action.photo,
                    // params: action.params,
                    // query: action.query,
                    // status: action.status,
                    loading: false,
                })
            }

        case PhotoActions.LOAD_PHOTO_REQUEST:
            return Object.assign({}, state, {
                photo: {},
                params: action.params,
                // query: action.query,
                // status: action.status,
                loading: true,
            })

        case PhotoActions.PHOTO_CLOSE_MODAL:
            return Object.assign({}, state, {
                photo: {},
                params: {},
                // query: action.query,
                // status: action.status,
                loading: false,
            })

        return Object.assign({}, state, { loading: true })
    }

    return state
}

export default Photo
