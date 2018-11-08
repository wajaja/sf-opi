import { fromJS, Map, merge } from     'immutable'  
import { getPopularImages } from '../../routes/social/MeetYou/utils/unsplash';
import undoable, { distinctState, includeAction } from 'redux-undo'
import {
    MeetYou as MeetYouActions,
} from '../../actions/social'       

// const images = getPopularImages();

export const initialState = {
    availableImages: [],
    availableBackgrounds: [],
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
            cards: [ ],
            selectedCardId: null,
            activePage: 0
        }
    ]
};

function MeetYou(state = initialState, action) {
    let textAttrs;
    switch (action.type) {
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
        case 'LOAD_BACKGROUNDS_RESPONSE':
            return Object.assign({}, state, { availableBackgrounds: action.images });
        case 'SET_QUERY':
            return Object.assign({}, state, { query: action.query });

        case MeetYouActions.UPDATE_CARD: {
            let { card, pageId } = action,
            pages = fromJS(state).get('pages');

            let list = pages.get(pageId).get('cards')
                        .map(item => item.get('id') === card.id ? fromJS(card) : item);
            let _page = pages.get(pageId).set('cards', list);
            return Object.assign({}, state, {pages: pages.map((p, i) => i === pageId ?  _page : p).toJS() });
        }

        //
        case MeetYouActions.UPDATE_CARD_POS: {
            let { cardId, position, pageId } = action,
            pages = fromJS(state).get('pages');

            let list = pages.get(pageId).get('cards')
                        .map(item => item.get('id') === cardId ? item.merge(position) : item);
            let _page = pages.get(pageId).set('cards', list);
            return Object.assign({}, state, {pages: pages.map((p, i) => i === pageId ?  _page : p).toJS() });
        }

        case MeetYouActions.UPDATE_CARD_SIZE: {
            let { cardId, size, pageId } = action,
            pages = fromJS(state).get('pages');

            let list = pages.get(pageId).get('cards')
                        .map(item => item.get('id') === cardId ? item.merge(size) : item);
            let _page = pages.get(pageId).set('cards', list);
            return Object.assign({}, state, {pages: pages.map((p, i) => i === pageId ?  _page : p).toJS() });
        }

        case MeetYouActions.MOVE_ZINDEX: {
            let { card, pageId, val } = action,
            pages = fromJS(state).get('pages');

            let list = pages.get(pageId).get('cards')
                        .filter(item => item.get('id') !== card.id);
            if(val === 1)
                list.push(card); //moveTop
            else 
                list.insert(0, card)
                // fromJS(card).concat(); // moveBottom

            let _page = pages.get(pageId).set('cards', list);
            return Object.assign({}, state, {pages: pages.map((p, i) => i === pageId ?  _page : p).toJS() });
        }

        case MeetYouActions.ADD_CARD: {
            let { card, pageId } = action,
            pages = fromJS(state).get('pages');

            let list = fromJS(state).get('pages').get(pageId).get('cards').push(card)
            let _page = pages.get(pageId).set('cards', list);
            return Object.assign({}, state, {pages: pages.map((p, i) => i === pageId ?  _page : p).toJS() });
        }

        case MeetYouActions.REMOVE_CARD: {
            let { card, pageId } = action,
            list = fromJS(state).get('pages').get(pageId).get('cards')
                        .map(item => item.get('id') === card.id ? fromJS(card) : item);
            return Object.assign({}, state, {pages: list.toJS() });
        }

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