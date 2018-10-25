import { getPopularImages } from '../../routes/social/MeetYou/utils/unsplash';
import undoable, { distinctState, includeAction } from 'redux-undo'

const images = getPopularImages();

export const initialState = {
    availableImages: [],
    query: "",
    drawing: null,
    filter: 'light_contrast',
    senders: [],
    receivers: [],
    textAttrs: {
        fontSize: 32,
        color: 'white',
        font: 'Georgia',
        bold: false,
        italic: false,
        lineHeight: 1.35
    },
    pages: [
        {
            size: 'square',
            editing: false,
            cards: [
                {
                  id: 1,
                  order: 0,
                  type: '', // image || edittex
                  textArr: [],
                  url: '',
                  content: '',
                  unique: '1-0' //1-0 page1-card0
                }
            ],
            selectedCardId: "1_1",
            activePage: 1
        }
    ]
};

function MeetYou(state = initialState, action) {
    let textAttrs;
    switch (action.type) {
        case 'SET_FONT':
            textAttrs = Object.assign({}, state.textAttrs, { font: action.font });
            return Object.assign({}, state, { textAttrs });
        case 'SET_FONT_SIZE':
            textAttrs = Object.assign({}, state.textAttrs, { fontSize: action.size });
            return Object.assign({}, state, { textAttrs });
        case 'SET_BOLD':
            textAttrs = Object.assign({}, state.textAttrs, { bold: action.bold });
            return Object.assign({}, state, { textAttrs });
        case 'SET_ITALIC':
            textAttrs = Object.assign({}, state.textAttrs, { italic: action.italic });
            return Object.assign({}, state, { textAttrs });
        case 'SET_COLOR':
            textAttrs = Object.assign({}, state.textAttrs, { color: action.color });
            return Object.assign({}, state, { textAttrs });
        case 'SET_FILTER':
            return Object.assign({}, state, { filter: action.filter });
        case 'SELECT_IMAGE':
            return Object.assign({}, state, { selectedImage: action.image });
        case 'SET_SIZE':
            return Object.assign({}, state, { size: action.size });
        case 'SET_TEXT':
            return Object.assign({}, state, { text: action.text });
        case 'SET_TEXT_RECT':
            return Object.assign({}, state, { textRect: action.rect });
        case 'SET_FOCUS':
            return Object.assign({}, state, { focused: action.part });
        case 'SET_EDITING':
            return Object.assign({}, state, { editing: true });
        case 'SET_NO_FOCUS':
            return Object.assign({}, state, { focused: false, editing: false });
        case 'SET_NO_EDITING':
            return Object.assign({}, state, { editing: false });
        case 'CACHE_DRAWING':
            return Object.assign({}, state, { drawing: action.drawing });
        case 'RECEIVE_IMAGES':
            return Object.assign({}, state, { availableImages: action.images });
        case 'SET_QUERY':
            return Object.assign({}, state, { query: action.query });
        default:
            return state;
    }
}

const undoableMeetYou = undoable(MeetYou, {
    filter: distinctState(),
    // filter: includeAction([SOME_ACTION, SOME_OTHER_ACTION]),
    limit: 10
})

export default undoableMeetYou