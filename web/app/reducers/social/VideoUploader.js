import { REHYDRATE, PURGE } from 'redux-persist'
import {
    VideoUploader as VideoUploaderActions,
} from '../../actions/social'

/**
 * initialState
 * @type {{loading: boolean}}
 */
export const initialState = { 
    videoName: '',
	selectedFile: null,
	progress: false,
    success: false,
    videoExtn: '',
    canPlayType: {},
}

/**
 * PostFormType
 * @constructor
 */
function VideoUploader(state = initialState, action) {

    switch (action.type) {

        
        
        case VideoUploaderActions.SET_STATE:
            return Object.assign({}, state, {
                success: action.success,
                progress: action.progress
            })
            
        case VideoUploaderActions.SELECTED_FILE:
            return Object.assign({}, state, { selectedFile : action.selectedFile })

        case VideoUploaderActions.SET_VIDEO_NAME:
            return Object.assign({}, state, {videoName: action.videoName})

        case VideoUploaderActions.SET_VIDEO_EXTENSION:
            return Object.assign({}, state, { videoExtn: action.extension })

        case VideoUploaderActions.SET_CAN_PLAYTYPE:
            return Object.assign({}, state, { canPlayType: action.canPlayType })

        case VideoUploaderActions.RESET:
            return Object.assign({}, state, { 
                selectedFile: {},
                videoName: '',
                videoExtn: '' 
            })
    }
    return state
}



export default VideoUploader
