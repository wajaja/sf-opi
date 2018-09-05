import { REHYDRATE, PURGE } from 'redux-persist'
import {
    App as AppActions,
} from '../../actions/social'

const sideComment = { loading: false,
                      side: 'side', 
                      allie_id: '1',
                    }   
/**
 * initialState
 * @type {{loading: boolean}}
 */
export const initialState = { 
    infos: [],
    loading: true,
    tabnav: false,
    confidPane: false,
    navOptions: false,
    editingPost: false,
    postFormFocus: false,
    editPostFormFocus: false,
    postTypePane: false,
    videoPane: false,
    sessionId: '',
    modalVideoConfirm: false,
    modalShare: false,
    modalShareRefer:'post',
    modalRate: false,
    modalPhoto: {},
    sideComment: {},
    modalOpinion: false,
    modalSetProfile: false,
    flashMessage: false,
}

/**
 * App
 * Redux Reducer for App action
 * Reference: http://redux.js.org/docs/basics/Reducers.html
 * @param state
 * @param action
 * @returns {*}
 * @constructor
 */
function App(state = initialState, action) {

    switch (action.type) {

        

        case AppActions.INIT_DONE:
            return Object.assign({}, state, { loading: false })

        case AppActions.TAB_NAV:
            return Object.assign({}, state, { tabnav: action.payload })

        case AppActions.FLASH_MESSAGE:
            return Object.assign({}, state, { flashMessage: action.payload })
            
        case AppActions.NAV_OPTIONS:
            return Object.assign({}, state, { navOptions: action.payload })

        case AppActions.POST_FORM_FOCUS: 
            return Object.assign({}, state, { postFormFocus: action.payload })

        case AppActions.EDIT_POST_FORM_FOCUS: 
            return Object.assign({}, state, { editPostFormFocus: action.payload })

        case AppActions.EDITING_POST: 
            return Object.assign({}, state, { editingPost: action.payload })

        case AppActions.CONFID_PANE: 
            return Object.assign({}, state, { confidPane: action.payload })

        case AppActions.POST_TYPE_PANE:
            return Object.assign({}, state, { postTypePane: action.payload })

        case AppActions.POST_VIDEO_PANE:
            return Object.assign({}, state, { videoPane: action.payload })

        case AppActions.SET_SESSION_ID:
            return Object.assign({}, state, { sessionId: action.sessionId })

        case AppActions.MODAL_VIDEO_CONFIRM:
            return Object.assign({}, state, { modalVideoConfirm: action.payload })

        case AppActions.MODAL_SHARE:
            return Object.assign({}, state, {
                modalShare: action.status, 
                modalShareRefer: action.refer 
            })

        case AppActions.MODAL_RATE:
            return Object.assign({}, state, {modalRate: action.payload })

        case AppActions.MODAL_OPINION:
            return Object.assign({}, state, {modalOpinion: action.payload })

        case AppActions.MODAL_SET_PROFILE:
            return Object.assign({}, state, {modalSetProfile: action.payload })

        case AppActions.LOAD_SIDE_REQUEST: {
            const sideComment = Object.assign({}, {
                                    loading: true,
                                    side: action.side, 
                                    allie_id: action.allie_id,
                                })
            return Object.assign({}, state, {sideComment: sideComment})
        }

        case AppActions.LOAD_SIDE_RESPONSE: {
            const sideComment = Object.assign({}, {
                                    loading: false,
                                    side: action.side, 
                                    allie_id: action.allie_id,
                                })
            return Object.assign({}, state, {sideComment: sideComment})
        }

        case AppActions.ADD_POST_INFO: {
                let infos,
                o               = {},
                info            = {};
                info['status']  = true;
                info['postId']  = action.postId;
                info['from']    = action.from;
                info['order']   = action.order;
                o[postId]       = info;          
                infos           = List([o]).concat(fromJS(state).get('infos'));
                return Object.assign({}, state, {infos: infos.toJS()});
        }

        case AppActions.REMOVE_POST_INFO: {
            let infos = state.infos.filter(item => 
                action.postId != ((typeof item[action.postId] != 'undefined') ? item[action.postId].id : '')
            );
            return Object.assign({}, state, { infos: infos });
        }

        case AppActions.RESET_POST_FORM: {
            return Object.assign({}, state, { 
                postFormFocus: false, 
                postTypePane: false 
            })
        }

        case AppActions.SHARE_SUCCESS: {
            return Object.assign({}, state, { 
                modalShare: false, 
                flashMessage: true 
            })
        }

    }
    return state
}

export default App
