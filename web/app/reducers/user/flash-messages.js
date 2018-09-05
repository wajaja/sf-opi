import { REHYDRATE, PURGE } from 'redux-persist'
import { ADD_FLASH_MESSAGE, DELETE_FLASH_MESSAGE } from '../constants/types';
import shortid from 'shortid';
import findIndex from 'lodash/findIndex';

export default (state = [], action = {}) => {
  switch(action.type) {
    case 'persist/REHYDRATE': {
        // if (action.response) {
        //     return Object.assign({}, state, {
        //         following: true,
        //         follower_count: state.follower_count + 1,
        //     })
        // }

        // return state
        console.log('reducer payload', action.payload)
    }
    case ADD_FLASH_MESSAGE:
      return [
        ...state,
        {
          id: shortid.generate(),
          type: action.message.type,
          text: action.message.text
        }
      ];
    case DELETE_FLASH_MESSAGE:
      const index = findIndex(state, { id: action.id });
      if (index >= 0) {
        return [
          ...state.slice(0, index),
          ...state.slice(index + 1)
        ];
      }
      return state;

    default: return state;
  }
}
