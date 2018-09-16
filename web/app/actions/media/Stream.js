import * as axios from 'axios'
import { BASE_PATH } from '../../config/api'
import { 
    Authors as AuthorsActions, 
    Post as PostActions, 
    Comments as CommentsActions 
} from '../post'
import {
    Photos as PhotosActions,
} from '../media'

export const CLEAR = 'STREAM_CLEAR'
export function clear() {
    return {
        type: CLEAR,
    }
}

export function timeline(data) {
    return dispatch => {

        Promise.all(data.news.map(p => {

            const id = p.object.split(':')[1]

            return (
                axios.get(`${config.api.baseUrl}/upload?id=${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`
                    },
                })
            )

        })).then(results => {
            dispatch(PhotosActions.inject(results.map(r => r.data)))
        })
    }
}

export function aggregated(data) {
    return dispatch => {

        Promise.all(data.news.map(p => {

            const id = p.object.split(':')[1]

            return (
                axios.get(`${config.api.baseUrl}/upload?id=${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`
                    },
                })
            )

        })).then(results => {
            dispatch(PhotosActions.inject(results.map(r => r.data)))
        })
    }
}

export function feed(data) {
    return dispatch => {

        Promise.all(data.news.map(p => {

            const id = p.object.split(':')[1]

            return (
                axios.get(`${config.api.baseUrl}/upload?id=${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`
                    },
                })
            )

        })).then(results => {
            dispatch(PhotosActions.inject(results.map(r => r.data)))
        })
    }
}

export const LAST_TIMELINE_ID = 'STREAM::LAST_TIMELINE_ID'

const _newEvent = data => ({ type: LAST_TIMELINE_ID, count: data.new.length,})
export function setLastTimelineId(id) {
    return dispatch => {
        dispatch(_newEvent(data))
        // dispatch(IncomingActivityActions.load())
    }
}
