import _ from 'lodash'

import { App, VideoUploader } from '../social'

export const SET_TYPE = 'SET_TYPE'

export function setType(name, value) {
    return {
        type: SET_TYPE,
        name,
        value,
    }
}

export const TOGGLE_EDITOR = 'TOGGLE_EDITOR'

export function toggleEditor(editorName) {
	return {
		type: TOGGLE_EDITOR,
		editorName,
	}
}

export const UPDATE_EDITORS = 'UPDATE_EDITORS'

/**
* _updateEditors
* @param editors
* @private
*/
const _updateEditors = (editors) => ({type: UPDATE_EDITORS, editors})

export function addEditor(editor) {
	return (dispatch, getState) => {
		let target = [],
		editors = getState().PostForm.editors;
		if(!_.isEmpty(editors)) {
			editors.forEach(function(item, i) {
				target.push(item);
			})
			//remove the duplicated element
			target = editors.filter(function(item, i) {
				return item.username != editor.username
			})
		}
		target.push(editor);

		dispatch(_updateEditors(target))
	}
}

export function removeEditor(editor) {
	return (dispatch, getState) => {
		let target = [],
		editors = getState().PostForm.editors;
		target = editors.filter(function(item, i) {
			return item.username != editor.username
		})
		dispatch(_updateEditors(target))
	}
}

export const UPDATE_LEFT_EDITORS = 'UPDATE_LEFT_EDITORS'

/**
* _updateLeftEditors
* @param editors
* @private
*/
const _updateLeftEditors = (editors) => ({type: UPDATE_LEFT_EDITORS, editors})

export function addLeftEditor(editor) {
	return (dispatch, getState) => {
		let target = [],
		editors = getState().PostForm.leftEditors;
		if(!_.isEmpty(editors)) {
			editors.forEach(function(item, i) {
				target.push(item);
			})
			//remove the duplicated element
			target = editors.filter(function(item, i) {
				return item.username != editor.username
			})
		}
		target.push(editor);
		dispatch(_updateLeftEditors(target))
	}
}

export function removeLeftEditor(editor) {
	return (dispatch, getState) => {
		let target = [],
		editors = getState().PostForm.leftEditors;
		target = editors.filter(function(item, i) {
			return item.username != editor.username
		})
		dispatch(_updateLeftEditors(target))
	}
}

export const UPDATE_RIGHT_EDITORS = 'UPDATE_RIGHT_EDITORS'

/**
* _updateLeftEditors
* @param editors
* @private
*/
const _updateRightEditors = (editors) => ({type: UPDATE_RIGHT_EDITORS, editors})

export function addRightEditor(editor) {
	return (dispatch, getState) => {
		let target = [],
		editors = getState().PostForm.rightEditors;
		if(!_.isEmpty(editors)) {
			editors.forEach(function(item, i) {
				target.push(item);
			})
			//remove the duplicated element
			target = editors.filter(function(item, i) {
				return item.username != editor.username
			})
		}
		target.push(editor);
		dispatch(_updateRightEditors(target))
	}
}

export function removeRightEditor(editor) {
	return (dispatch, getState) => {
		let target = [],
		editors = getState().PostForm.rightEditors;
		target = editors.filter(function(item, i) {
			return item.username != editor.username
		})
		dispatch(_updateRightEditors(target))
	}
}

export const UPDATE_RECIPIENTS = 'UPDATE_RECIPIENTS'

/**
* updateRecipients
* @param editors
* @private
*/
export function updateRecipients(recipients) {
	return {
		type: UPDATE_RECIPIENTS,
		recipients
	}
}

export const START_RESET = 'START_RESET'
const _startReset = () => ({type: START_RESET})

export const END_RESET = 'END_RESET'
const _endReset = () => ({type: END_RESET})


export function reset() {
	return (dispatch, getState) => {
		dispatch(_startReset())
		dispatch(App.resetPostForm())
		dispatch(VideoUploader.reset())
		dispatch(_endReset())
	}
}