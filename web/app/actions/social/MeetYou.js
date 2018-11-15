import axios            from 'axios'
import { BASE_PATH }    from '../../config/api'
import _                from 'lodash'

export const setFilter = (filter) => ({
  type: 'SET_FILTER',
  filter
});

// export const selectImage = (image) => ({
//   type: 'SELECT_IMAGE',
//   image,
  
// });



export const setTextRect = (rect) => ({
  type: 'SET_TEXT_RECT',
  rect
});

export const cacheDrawing = (drawing) => ({
  type: 'CACHE_DRAWING',
  drawing
});

export const setQuery = (query) => ({
  type: 'SET_QUERY',
  query
});

export const searchImages = (query) => ({
  type: 'SEARCH_IMAGES',
  query
});

//LOAD initialImage 
export const resetSearch = () => ({
      type: 'RESET_SEARCH'
});


export const loadBackgrounds = () => ({
    type: 'LOAD_BACKGROUNDS'
})

export const UPDATE_CARD = 'MEETYOU::UPDATE_CARDS'

export function updateCard(card, pageId) {
    return { type: UPDATE_CARD, card, pageId} 
}

export const UPDATE_CARD_POS = 'MEETYOU::UPDATE_CARD_POS'

export function updateCardPos(cardId, pageId, position) {
    return { type: UPDATE_CARD_POS, cardId, pageId, position} 
}

export const UPDATE_CARD_SIZE = 'MEETYOU::UPDATE_CARD_SIZE'

export function updateCardSize(cardId, pageId, size) {
    return { type: UPDATE_CARD_SIZE, cardId, pageId, size} 
}

export const UPDATE_CARD_STROKE = 'MEETYOU::UPDATE_CARD_STROKE'
//Applyed on vectorImage
export function updateCardStroke(card, pageId, stroke, strokeWidth) {
    return { type: UPDATE_CARD_STROKE, card, stroke, strokeWidth, pageId} 
}

export const UPDATE_CARD_RGBA = 'MEETYOU::UPDATE_CARD_RGBA'
export function updateCardRGBA(card, pageId, val, color) {
    return { type: UPDATE_CARD_RGBA, card, val, color, pageId} 
}

export const SET_VECTOR_IMAGE_COLOR = 'MEETYOU::SET_VECTOR_IMAGE_COLOR'
export function setVectorImageColor(card, pageId, childOrder, color){
    return { type: SET_VECTOR_IMAGE_COLOR, card, pageId, childOrder, color} 
}

export const MOVE_ZINDEX = 'MEETYOU::MOVE_ZINDEX'

export function onMoveZindex(card, pageId, val) {
    return { type: MOVE_ZINDEX, card, pageId, val} 
}

export const ADD_CARD = 'MEETYOU::ADD_CARD'

export function addCard(card, pageId) {
    return { type: ADD_CARD, card, pageId} 
}

export const REMOVE_CARD = 'MEETYOU::REMOVE_CARD'

export function removeCard(card, pageId) {
    return { type: REMOVE_CARD, card, pageId} 
}

export const UPDATE_SENDERS = 'MEETYOU::UPDATE_SENDERS'

export const UPDATE_RECEIVERS = 'MEETYOU::UPDATE_RECEIVERS'

/**
* _updateSenders
* @param senders
* @private
*/
const _updateSenders = (senders) => ({type: UPDATE_SENDERS, senders})

export function addSender(sender) {
  return (dispatch, getState) => {
    let target = [],
    senders = getState().MeetYou.present.senders;
    if(!_.isEmpty(senders)) {
      senders.forEach(function(item, i) {
        target.push(item);
      })
      //remove the duplicated element
      target = senders.filter(function(item, i) {
        return item.username != sender.username
      })
    }
    target.push(sender);

    dispatch(_updateSenders(target))
  }
}

export function removeSender(sender) {
  return (dispatch, getState) => {
    let target = [],
    senders = getState().PostForm.senders;
    target = senders.filter(function(item, i) {
      return item.username != sender.username
    })
    dispatch(_updateSenders(target))
  }
}


export function addReceiver(receiver) {
  return (dispatch, getState) => {
    let target = [],
    receivers = getState().MeetYou.present.receiver;
    if(!_.isEmpty(senders)) {
      receivers.forEach(function(item, i) {
        target.push(item);
      })
      //remove the duplicated element
      target = receivers.filter(function(item, i) {
        return item.username != receiver.username
      })
    }
    target.push(receiver);

    dispatch(_updateSenders(target))
  }
}

export function removeReceiver(receiver) {
  return (dispatch, getState) => {
    let target = [],
    receivers = getState().PostForm.receivers;
    target = receivers.filter(function(item, i) {
      return item.username != receiver.username
    })
    dispatch(_updateSenders(target))
  }
}

export const GET_MEETYOU_IMAGES_REQ  = 'MEETYOU::GET_MEETYOU_IMAGES_REQ'

export const _getMeetYouImagesReq = () => ({type: GET_MEETYOU_IMAGES_REQ})

export const GET_MEETYOU_IMAGES_RES  = 'MEETYOU::GET_MEETYOU_IMAGES_RES'

export const _getMeetYouImagesRes = (images) => ({type:  GET_MEETYOU_IMAGES_RES, images})

export function getMeetYouImages() {
    return (dispatch, getState) => {
        const user_id = getState().User && getState().User.user && getState().User.user.id
        return new Promise(function (resolve, reject) {
            dispatch(_getMeetYouImagesReq());
            axios.get(`${BASE_PATH}/api/meetyou/?tag=photos&user_id=${user_id}`)  
            .then(function (res) {
                resolve(res.data)  
                dispatch(_getMeetYouImagesRes(filename, res.data))              
            }, function(err) {
                reject(err)
            })
        })
    }
}