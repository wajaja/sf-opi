import axios            from 'axios'
import { BASE_PATH }    from '../../config/api'
import _                from 'lodash'

export const setFont = (font) => ({
  type: 'SET_FONT',
  font
});

export const setFontSize = (size) => ({
  type: 'SET_FONT_SIZE',
  size
});

export const setBold = (bold) => ({
  type: 'SET_BOLD',
  bold
});

export const setItalic = (italic) => ({
  type: 'SET_ITALIC',
  italic
});

export const setColor = (color) => ({
  type: 'SET_COLOR',
  color
});

export const setFilter = (filter) => ({
  type: 'SET_FILTER',
  filter
});

export const selectImage = (image) => ({
  type: 'SELECT_IMAGE',
  image
});

export const setSize = (size) => ({
  type: 'SET_SIZE',
  size
});

export const setText = (text) => ({
  type: 'SET_TEXT',
  text
});

export const setTextRect = (rect) => ({
  type: 'SET_TEXT_RECT',
  rect
});

export const setFocus = (part) => ({
  type: 'SET_FOCUS',
  part
});

export const setEditing = () => ({
  type: 'SET_EDITING'
});

export const setNoFocus = () => ({
  type: 'SET_NO_FOCUS'
});

export const setNoEditing = () => ({
  type: 'SET_NO_EDITING'
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

export const resetSearch = () => ({
  type: 'RESET_SEARCH'
});


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