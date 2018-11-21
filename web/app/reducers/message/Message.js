import { Message as MessageActions } from '../../actions/message'
import { REHYDRATE, PURGE } from 'redux-persist'
import { List, fromJS } from 		'immutable'

export const initialState = {
	list: [],
	nbAlerts: 0,
	unreads: 0,
	threads: {},
	messageIds: [],
	fetch_list: false,
	showOnlineList: true,
}

function Message(state=initialState, action) {
		switch(action.type) {

			case MessageActions.CREATE_THREAD_RESPONSE: {
				const ImState = fromJS(state),
				threads 	  = state.threads,
				thread 		  = action.thread,
				list		  = List([thread]).concat(ImState.get('list'));

				threads[thread.id] = {};
				threads[thread.id]['thread'] = thread
				threads[thread.id]['messages'] = action.messages
				return ImState.set('threads', threads)
							  .set('list', list.toJS())
							  .toJS();
			}

			case MessageActions.LIST_MESSAGES_RESPONSE: {
				console.log('LIST_MESSAGES_RESPONSE LIST_MESSAGES_RESPONSE')
				const ImState = fromJS(state),
				data 	  = action.data;
				return ImState.set('fetch_list', false)
							  .set('list', data)
							  .toJS();
			}

			case MessageActions.LIST_MESSAGES_REQUEST: {
				return fromJS(state).set('fetch_list', true).toJS();
			}

			case MessageActions.INBOX_MESSAGES_RESPONSE: {
				const ImState = fromJS(state),
				data 	  = action.data;
				console.log(data)
				return ImState.set('threads', data.threads)
							  .set('messages', data.messages)
							  .set('loading',  data.loading)
							  // .set('fetch_list', false)
							  .set('threadsIds', data.threadsIds)
							  .set('list', data.list)
							  .toJS();
			}

			case MessageActions.TOGGLE_ONLINE_LIST: {
				return Object.assign({}, state, {
					showOnlineList: !state.showOnlineList,
				})
			}

			case MessageActions.LOAD_THREAD_RESPONSE: {
				const ImState = fromJS(state),
				threads 	  = state.threads || {},
				thread 		  = action.thread;
				// list		  = List([thread]).concat(ImState.get('list'));

				threads[thread.id] = {};
				threads[thread.id]['thread'] = thread
				threads[thread.id]['messages'] = action.messages
				return ImState.set('threads', threads)
							  .toJS();
			}

			case MessageActions.PUSH_THREAD: {
				const ImState = fromJS(state),
				threads 	  = state.threads,
				thread 		  = action.thread;

				threads[thread.id] = {};
				threads[thread.id]['thread'] = thread
				threads[thread.id]['messages'] = []
				return ImState.set('threads', threads).toJS();
			}

			case MessageActions.LOAD_MESSAGES_RESPONSE: {
				const ImState = fromJS(state),
				threads 	  = state.threads,
				threadId 	  = action.threadId;
				messages      = state.threads[threadId] && state.threads[threadId]['messages'];

				threads[threadId]['messages'].concat(action.messages) //concat instead push
				return ImState.set('threads', threads).toJS();
			}

			case MessageActions.CREATE_MESSAGE_RESPONSE: {
				const ImState = fromJS(state),
				threads 	  = state.threads,
				threadId 	  = action.threadId,
				messages 	  = state.threads[threadId]['messages'];

				let newArr = messages.slice();
				//array.splice(start, deleteCount, item1, item2, ...) add message to the end
				newArr.splice(newArr.length, 0, action.message)

				threads[threadId]['messages'] = newArr;
				return ImState.set('threads', threads).toJS();
			}

			case MessageActions.LOAD_THREADS_RESPONSE: {
				list		  = List([action.threads]).concat(ImState.get('list'));
				return fromJS(state).set('list', list).toJS();
			}

			case MessageActions.LOAD_MORE_THREADS_RESPONSE: {
				const threads	= List(fromJS(action.threads))
									.concat(fromJS(state)
									.get('threads'));
				return Object.assign({}, state, { threads: threads.toJS() })
			}

			case MessageActions.UPDATE_THREAD_RESPONSE:{
				const list = fromJS(state)
							.get('threads')
							.map(q => q.get(action.threadId) ? 
							 			fromJS({[action.threadId]: action.thread}) : q);
				return Object.assign({}, state, { threads: list.toJS() });
			}

			case MessageActions.DELETE_THREAD_REQUEST:{
				const list = state.threads
							.filter(q => action.threadId != ((typeof q[action.threadId] != 'undefined') ?
							 			q[action.threadId].id : ''));
						return Object.assign({}, state, { threads: list });
			}
        
			case MessageActions.SHOW_ALERT_RESPONSE: 
			    return Object.assign({}, state, {nbAlerts: action.nbAlerts})

			case MessageActions.HIDE_ALERT_REQUEST: 
				return Object.assign({}, state, {
					nbAlerts: 0
				})

			case MessageActions.HIDE_ALERT_RESPONSE: 
				return Object.assign({}, state, {
					nbAlerts: 0,
					messageIds: action.messageIds,
					messagesById: action.messagesById
				})

			case 'MESSAGE::PUBLISH_THREAD_MESSAGE': {
				console.log('websocket working... => MESSAGE::PUBLISH_THREAD_MESSAGE')
			}

			case 'MESSAGE::PUBLISH_MESSAGE': {
				console.log('websocket working.. => MESSAGE::PUBLISH_MESSAGE')
			}

			default:
			    return state;
		}
		return state;
}

export default Message;