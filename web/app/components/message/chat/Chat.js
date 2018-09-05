import React 					from 'react'
import { connect }				from 'react-redux'
import createReactClass 		from 'create-react-class'
import { Link, }     			from 'react-router-dom'
import { push } 				from 'react-router-redux';
import { bindActionCreators } 	from 'redux';
import { Helmet }           	from "react-helmet";

import {  } 			from '../../../components'
import { 
	Message as MessagesActions,
}    						from '../../../actions'

import MyLoadable    from '../../../components/MyLoadable'
const NewThread = MyLoadable({loader: () => import('../NewThread')}),
OnlineUserList 	= MyLoadable({loader: () => import('./onlines/List')}),
Call 			= MyLoadable({loader: () => import('./calls/Call')}),
Thread 			= MyLoadable({loader: () => import('./threads/Thread')}),
ThreadList 		= MyLoadable({loader: () => import('./threads/ThreadList')}),
CallStories 	= MyLoadable({loader: () => import('./calls/CallStories')})


import '../../../styles/message/chat.scss'
const Chat = createReactClass({

	getInitialState() {
		return {
			active_view: 'online_list',
			loading_thread: false,
			calls_modal: true, 
			calls_modal_type: 'voice',
			thread_id: null,
			selected_user: null,
			newThread: false,
			recipients: '',
		}
	},

	changeView(view, e) {
		e.stopPropagation();
		// if(this.threadList)
		if(view === 'thread_list' && !this.props.list) {
			//fetch first thread's list (page 1)
			this.props.listMessage(1).then(
				(data) => { console.log('ok finished...')},
				(err) => { console.log('err')}
			);
		}
		this.setState({active_view: view});
	},

	selectUser(user) {
		const thread_id = user.thread_id
		if(thread_id) {
			this.selectThreadId(thread_id);
			return;
		}

		this.setState({
			newThread: true, 
			selected_user: user,
			recipients: user.username
		});
	},

	selectThread(thread) {
		this._selectThreadId(thread.id);
	},

	selectThreadId(threadId) {
		this._selectThreadId(threadId);
	},

	_selectThreadId(threadId) {
		//TODO perform saga findInStore
		this.setState({
			thread_id: threadId, 
			active_view: 'thread',
			loading_thread: true,
			newThread: false
		})

		this.props.loadThread(threadId)
		.then((data) => {
			if(data) {
				this.setState({loading_thread: false})
			} else {
				console.log('no data');
			}
		})
	},

	getSelectedThreadForRecipient(thread){
		this._selectThreadId(thread.id);
	},

	/**
	* When new thread was created then
	* push new route from route
	* make an update in all component
	*/
	threadCreated(thread) {
		this.setState({
			thread_id: thread.id,
			newThread: false,
		})
	},

	markIsRead(thread) {
		const { dispatch } 		= this.props
		this.props.markIsRead(thread.id)  //saga middleware
	},

	markIsUnRead(thread) {
		const { dispatch } 		= this.props
		this.props.markIsUnRead(thread.id)  //saga middleware
	},

	getThread(props, thread_id, pushRoute) {
		const { threads, history, dispatch } = props,
		thread = threads[thread_id];
		if(thread) {
			this.setState({loading_thread: false,})
			//programatically change route
		} else {
			this.setState({ loading_thread: true })
			this.props.loadThread(thread_id)
			.then((thread) => {
				if(thread && thread.id) {
					this.setState({loading_thread: false})
				} else {
					console.log('erronr on thread')
				}
			}, (err) => {
				console.log('err', err)
			})
		}
	},

	makeVoiceCall() {
		this.setState({calls_modal: true, calls_modal_type: 'voice'})
	},

	makeVideoCall() {
		this.setState({calls_modal: true, calls_modal_type: 'video'})
	},

	componentWillMount() {
		//else selected_thread 
	},

	componentDidMount() {
		
	},

	componentDidUpdate(prevProps, prevState) {
		const thread_id = this.state.thread_id;
		if(thread_id !== prevState.thread_id) {

			// this.props.loadThread(thread_id)
			// .then((data) => {
			// 	if(data) {
			// 		this.setState({loading_thread: false})
			// 	} else {
			// 		this.props.history.push(`/messages/?thread=new`)
			// 	}
			// })
			// this.props.history.push(`/messages/?thread=${thread_id}`)
		}

	},

	componentWillReceiveProps(nextProps) {
		if(this.props.threads !== nextProps.threads) {
        	console.log('immutable .....')
        	// this.setState({messages: nextProps.thread.messages})
        }
		// if(this.props.thread_id !== nextProps.thread_id)
	},

	shouldComponentUpdate(nextProps, nextState) {
		return (this.state.active_view !== nextState.active_view ||
				this.state.loading_thread !== nextState.loading_thread ||
				this.state.newThread !== nextState.newThread)
	},

	render() {
		const { thread } 	= this.props,
		{ loading_thread, thread_id, active_view, fetch_list } = this.state,
		bodyClassnames = this.props.showOnlineList ? 'show-chat oln-bd-ul-ct' : 'hide-chat oln-bd-ul-ct',
		listClassnames = this.props.showOnlineList ? 'show-chat onl-usr-list' : 'hide-chat onl-usr-list'

		if(active_view === 'online_list') {
			return <OnlineUserList
						{...this.props}
						changeView={this.changeView}
						selectUser={this.selectUser}
						/>
		}

		else if(active_view === 'thread_list') {
			return <ThreadList
						{...this.props}
						ref={(el) => { this.threadList = el}}
						selectThread={this.selectThread}
						changeView={this.changeView}
						/>
		}

		else if(active_view === 'thread') {
			return <Thread 
	            		{...this.props}
	            		thread={thread}
	            		thread_id={thread_id}
	            		enterToSubmit={false}
	            		loading={loading_thread}
	            		peerCon={this.props.peerCon}
	            		startCall={this.props.startCall}
	            		threadCreated={this.threadCreated}
	            		recipients={this.state.recipients}
	            		selectedUser={this.state.selected_user}
	            		newThread={this.state.newThread}
	            		changeView={this.changeView}
	            		getSelectedThreadForRecipient={this.getSelectedThreadForRecipient}
	            		/>
		}

		else if(active_view === 'call_stories') {
			return <CallStories
						{...this.props}
						changeView={this.changeView}
						selectThread={this.selectThread}
						/>
		} else if(active_view === 'call') {
			return <Call 
						{...this.props}
	            		thread_id={thread_id}
	            		thread={thread}
	            		changeView={this.changeView}
	            		getSelectedThreadForRecipient={this.getSelectedThreadForRecipient}
						/>
		} else {
			return <div/>			
		}
	}
})

const mapStateToProps = (state, {location}) => {
	return {
		threads: state.Message.threads,
		list: state.Message.list,
	}
}

/////
function mapDispatchToProps(dispatch) {
    return  bindActionCreators(Object.assign({}, MessagesActions), dispatch)
}

/////
export default connect(mapStateToProps, mapDispatchToProps)(Chat)