import Immutable, { List, Map, Set, fromJS } from 'immutable'
import { REHYDRATE, PURGE } from 'redux-persist'

import {
    Video as VideoActions,
} from '../../actions/'

export const initialState = {
    videos: [],
}

/**
 * Videos
 * Redux Reducer for Videos action
 * Reference: http://redux.js.org/docs/basics/Reducers.html
 * @param state
 * @param action
 * @returns {*}
 * @constructor
 */
function Videos(state = initialState, action) {

    switch (action.type) {

        case VideoActions.INJECT:
            if (action.posts) {
                const s = [...action.posts.map(r => ({...r, hidden: true}))]
                state.forEach(r => s.push(r))
                return s
            }
            return state

        case VideoActions.LOAD_HIDDEN:
            return state.map(p => ({...p, hidden: false }))

        case VideoActions.PUSH_VIDEO:
            const obj             = {};
            obj[action.video.id]  = action.video;           
            const pVideos         = List([obj]).concat(fromJS(state).get('videos'));
            return Object.assign({}, state, {videos: pVideos.toJS()});

        case VideoActions.PAGINATE:
            if (action.response) {
                const s = [...state]
                action.response.forEach(r => s.push(r))
                return s
            }
            return state

        case VideoActions.UPDATE_VIDEO_ON_LIKE:
            var videos = fromJS(state).get('videos').map(item => { 
                if(item.get(action.videoId)){
                    var video = item .get(action.videoId)
                                    .merge({
                                        "liked": action.liked, 
                                        "nbLikers": action.nbLikers
                                    });
                    return  fromJS({[action.videoId]: video.toJS()})
                } else {
                    return item
                }
            });
            return Object.assign({}, state, { videos: videos.toJS() })

        case VideoActions.LOAD:
            if (action.response) {
                return [
                    ...action.response,
                ]
            }
            return []

        case VideoActions.RELOAD:
            return [...action.response]

        case VideoActions.LIKE:
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

        case VideoActions.UNLIKE:
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

export default Videos
