import axios from 'axios'
import { BASE_PATH } from '../../config/api'
import { App as AppActions } from '../social'

// export const START_RESET = 'START_RESET'
// const _startReset = () => ({type: START_RESET})

// export const END_RESET = 'END_RESET'
// const _endReset = () => ({type: END_RESET})


// export function reset() {
// 	return (dispatch, getState) => {
// 		dispatch(_startReset())
// 		setTimeout(function() {
// 			dispatch(_endReset())
// 		}, 300)
// 		dispatch(_updateEditors([]))
// 	}
// }