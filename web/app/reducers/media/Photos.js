import Immutable, { List, Map, Set, fromJS } from 'immutable'
import { REHYDRATE, PURGE } from 'redux-persist'

import {
    Photos as PhotosActions,
} from '../../actions'

export const initialState = {
    photos: [],
}

/**
 * Photos
 * Redux Reducer for Photos action
 * Reference: http://redux.js.org/docs/basics/Reducers.html
 * @param state
 * @param action
 * @returns {*}
 * @constructor
 */
function Photos(state = initialState, action) {

    switch (action.type) {

        

        case PhotosActions.INJECT:
            if (action.posts) {
                const s = [...action.posts.map(r => ({...r, hidden: true}))]
                state.forEach(r => s.push(r))
                return s
            }
            return state

        case PhotosActions.LOAD_HIDDEN:
            return state.map(p => ({...p, hidden: false }))

        case PhotosActions.PUSH_PHOTO:
            const obj             = {};
            obj[action.photo.id]  = action.photo;
            const pPhotos         = List([obj]).concat(fromJS(state).get('photos'));
            return Object.assign({}, state, {photos: pPhotos.toJS()});

        case PhotosActions.PAGINATE:
            if (action.response) {
                const s = [...state]
                action.response.forEach(r => s.push(r))
                return s
            }
            return state

        case PhotosActions.UPDATE_PHOTO_ON_LIKE:
            var photos = fromJS(state).get('photos').map(item => { 
                if(item.get(action.photoId)){
                    var photo = item .get(action.photoId)
                                    .merge({
                                        "liked": action.liked, 
                                        "nbLikers": action.nbLikers
                                    });
                    return  fromJS({[action.photoId]: photo.toJS()})
                } else {
                    return item
                }
            });
            return Object.assign({}, state, { photos: photos.toJS() })

        case PhotosActions.LOAD:
            if (action.response) {
                return [
                    ...action.response,
                ]
            }
            return []

        case PhotosActions.RELOAD:
            return [...action.response]

        case PhotosActions.LIKE:
            if (action.response) {
                return state.map(item => {

                    if (item.object.id == action.postID) {
                        const newItem = {...item}
                        newItem.object.liked = true
                        return newItem
                    }

                    return item
                })
            }

        case PhotosActions.UNLIKE:
            if (action.response) {
                return state.map(item => {

                    if (item.object.id == action.postID) {
                        const newItem = {...item}
                        newItem.object.liked = false
                        return newItem
                    }

                    return item
                })
            }


    }

    return state
}

export default Photos
