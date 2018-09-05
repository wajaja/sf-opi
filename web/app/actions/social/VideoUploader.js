export const SET_STATE = 'VUPLOADER::SET_STATE'

const _setState = (progress, success) => ({type: SET_STATE, progress, success, })

export function setState(progress, success) {
	return (dispatch, getState) => {
		dispatch(_setState(progress, success));
	}
}

export const SELECTED_FILE = 'VUPLOADER::SELECTED_FILE'

export function selectedFile(selectedFile) {
    return {
        type: SELECTED_FILE,
        selectedFile,
    }
}

export const SET_VIDEO_NAME = 'VUPLOADER::SET_VIDEO_NAME'

export function setVideoName(videoName) {
    return {
        type: SET_VIDEO_NAME,
        videoName,
    }
}

export const SET_VIDEO_EXTENSION = 'VUPLOADER::SET_VIDEO_EXTENSION'

export function setVideoExtension(extension) {
    return {
        type: SET_VIDEO_EXTENSION,
        extension,
    }
}

export const SET_CAN_PLAYTYPE = 'VUPLOADER::SET_CAN_PLAYTYPE'

export function setCanPlayType(canPlayType) {
    return {
        type: SET_CAN_PLAYTYPE,
        canPlayType,
    }
}

export const RESET = 'VUPLOADER::RESET'

export function reset() {
    return { type: RESET }
}