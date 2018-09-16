import {
    Stream as StreamActions,
} from '../../actions'


/**
 * initialState
 * @type {{active: null, recent: Array, hits: Array, term: string, total: number, results: Array}}
 */
export const initialState = {
    lastStreamId: null,
}

function Stream(state = initialState, action) {
    switch (action.type) {
        case StreamActions.EVENT:
            return state + 1

        case StreamActions.CLEAR:
            return 0

        case StreamActions.LAST_TIMELINE_ID:
        	return Object.assign({}, state, {lastStreamId: action.id,})
    }

    return state
}

export default Stream