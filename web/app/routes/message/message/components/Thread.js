import React 				from 'react'
import { connect } 			from 'react-redux'
import { Link } 			from 'react-router-dom'
import createReactClass 	from 'create-react-class'
import axios 				from 'axios'


import * as moment 	from 'moment'
const uniqueString = require('unique-string')

import { 
    MessageBox,
    TimeAgo,
    MessageForm,
    InputType, 
    MessageRecipients
}                               from '../../../../components'

import Head 				from './Head'

function getSelectedThread(threads, thread_id) {
	if(thread_id === 'new') {
		return null;
	}
	const thread = typeof threads === 'object' ? threads[thread_id] : null;
	if(thread)
		return thread
	else
		return null
}

const Thread = createReactClass({

	getInitialState() {
		const { thread, newThread, user, enterToSubmit } = this.props;
		const _thread = thread && thread.thread;
		return{
			errors: {},
			subject: '',
			messages: [],
			uniqueString: document && document.createElement && uniqueString(),
			//get latest user's configuration for submitting messages or default
			enterToSubmit: (user.config && user.config.enter_to_submit_message) || enterToSubmit,
			canAddRecipient: newThread,
			recipients: _thread  ? _thread.recipients : [], //array of usernames 
			participants: _thread ? _thread.participants : []
		}
	},

	updateRecipients(recipients) {

		//check if selected user has room in list
		recipient = recipients.split(',')[0];
		let { list } = this.props,
		_thread = list.filter((t, i) => {
			let _p = t.otherParticipants.filter((p, i) => {
				return p.username === recipient //filter the participant has username === recipient
			})[0]

			if(_p && _p.id)
				return true;
		})[0];

		if(_thread && _thread.id) {
			this.props.getSelectedThreadForRecipient(_thread);
			return;
		}
		
		this.setState({
			recipients: recipients,
			recipients_error: false
		})  //array of usernames
	},

	onChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		})
	},

    //delete appended Comment by its unique identifier
    onMsgSuccess(unique, newThread) {
    	if(!!newThread)
    		return
        this.setState({messages: this.props.thread.messages})
        // this.scrollToBottom();
    },

    //mark appended Comment fails by its unique identifier
    onMsgFail(unique) {
        let msgs = this.state.messages.map((m, i) => {
                if(m.unique === unique) {
                    m.failed = true;
                    m.retrying = false;
                }
                return m
        })

        this.setState({messages: msgs}) 
        // this.scrollToBottom();
    },

    reSubmitMsg(data) {
    	const { unique } = data,
    	{ newThread, thread } = this.props;
        if(newThread) {
			this.props.createThread(data, uniqueString).then(thread => {
				this.threadCreated(thread)
	            this.onMsgSuccess(unique, thread)
	        }, (err) => {
	            this.onMsgFail(unique)
	        })
		} else {
			// Firebase data can be sets here
			//append new message to list
			this.props.createMessage(thread.thread.id, data).then(msg => {
	            this.onMsgSuccess(unique)
	        }, (err) => {
	            this.onMsgFail(unique)
	        })

			// const event = {};
			// this.socketSession.publish(`message/send/channel/${threadId}`, event, exclude, eligible)
		}

        let msgs = this.state.messages.map((m, i) => {
            if(m.unique === data.unique) {
                m.retrying = true;
                m.failed = false;
            }
            return m
        })

        this.setState({ messages: msgs })
    },

	handleSubmit(form) {
        const { unique, completedFiles, body } = form,
		{ newThread, thread, } = this.props,
		data = {
			subject: this.state.subject,
			recipients: this.state.recipients,
			unique, completedFiles, body
		},

        //build message to append
        m = {
            id: null,
            metadata : [{}],
            unique: unique,
            body: body,
            images: completedFiles,
            createdAt: moment.utc().valueOf(),
            sender: {
                id: this.props.user.id,
                username: this.props.user.username,
                lastname: this.props.user.lastname,
                firstname: this.props.user.firstname,
                profile_pic: this.props.user.profile_pic.web_path
            },

            failed: false,
            retrying: false,
            data 
        }

		return new Promise((resolve, reject) => {
			if(newThread) {
				console.log(newThread)
				if(!recipients || !recipients.length) {
					this.setState({recipients_error: true})
					reject();
					return;
				}

				//append new message to list
				const joined = this.state.messages;
		        this.setState({messages: joined.concat(m)})
				this.props.createThread(data, this.state.uniqueString).then(thread => {
					this.threadCreated(thread)
		            this.onMsgSuccess(unique, thread)
		        }, (err) => {
		            this.onMsgFail(unique)
		        })
				resolve();
			} else {
				// Firebase data can be sets here
				
				//append new message to list
				const joined = this.state.messages;
		        this.setState({
		            messages: joined.concat(m) //
		        })
				this.props.createMessage(thread.thread.id, data).then(msg => {
					console.log('createMessage successFiles')
		            this.onMsgSuccess(unique)
		        }, (err) => {
		        	console.log('createMessage failed')
		            this.onMsgFail(unique)
		        })
				// const event = {};
				// this.socketSession.publish(`message/send/channel/${threadId}`, event, exclude, eligible)
				resolve();
			}
		})
	},

	threadCreated(thread) {
		this.props.threadCreated(thread);
	},

	changeSubmitMode() {
		const self = this
		this.setState({
			enterToSubmit: !self.state.enterToSubmit
		})
	},

	componentDidMount() {
		this.setState({uniqueString: uniqueString()})

		const thread = this.props.thread
		if(thread && thread.id) {
			this.subscribeToWebsocket(thread)
			this.setState({messages: thread.messages})
		}

		//scroll to bottom
		this.scrollToBottom()
	},

	scrollToBottom() {
		this.messagesEnd.scrollIntoView({behavior: "smooth"})
	},

	componentDidUpdate(prevProps) {
		if(this.props.thread !== prevProps.thread) {
        	console.log('immutable .....', this.props.thread)
        	// this.setState({messages: prevProps.thread.messages})
        }

        this.scrollToBottom()
	},

	subscribeToWebsocket(thread) {
		const webSocket 	= WS.connect("ws://127.0.0.1:8080"),
		{ dispatch } = this.props;


		webSocket.on("socket/connect", (session) => {
		    this.socketSession = session;

		    this.socketSession.subscribe(`message/send/channel/${thread.id}`, (uri, payload) => {
		    	if(payload.data) {
			        const message = JSON.parse(payload.data).data,
			        threadId = thread.id
			        console.log(message)
			        dispatch({type: 'MESSAGE::PUBLISH_MESSAGE', message, threadId})
		    	}
		    });
		})

		webSocket.on("socket/disconnect", function(error){
			console.log("Disconnected for " + error.reason + " with code " + error.code);
		})
	},

	componentWillReceiveProps(nextProps) {
		if(this.props.newThread !== nextProps.newThread && nextProps.newThread) {
			this.setState({canAddRecipient: true})
		}

		if(this.props.newThread !== nextProps.newThread && !nextProps.newThread) {
			this.setState({canAddRecipient: false})
		}
		// if(this.props.newThread !== nextProps.newThread && !nextProps.newThread) {
		// 	this.setState({canAddRecipient: false})
		// // }
		// if((nextProps.thread !== this.props.thread) &&
  //       	nextProps.thread.thread && nextProps.thread.thread.id ) {
  //   		this.setState({canAddRecipient: false})
  //   		this.subscribeToWebsocket(nextProps.thread)
  //       }

        if(this.props.threads !== nextProps.threads) {
        	// this.setState({messages: nextProps.thread.messages})
        }

        if(this.props.thread && (this.props.thread.messages !== nextProps.thread.messages)) {
        	this.setState({messages: nextProps.thread.messages})
        }
	},

	shouldComponentUpdate(nextProps, nextState) {
		return this.props.thread !== nextProps.thread ||
			this.props.newThread !== nextProps.newThread ||
			this.state.uniqueString !== nextState.uniqueString ||
			this.state.messages !== nextState.messages || 
			this.state.enterToSubmit !== nextState.enterToSubmit;
	},

	render() {
		const 
		{ user, thread, newThread, } = this.props,
		{ enterToSubmit, uniqueString, messages  }  = this.state,
		_thread = thread && thread.thread;

		// ///////
		return(
			<div className="ibx-pg-b">
				<div className="ibx-pg-hd" id="_ibx_pg_hd">
					<Head 
						{...this.props}
						participants={this.state.participants}
						/>
				</div>
				<div className="ibx-pg-nw" id="_ibx_pg_nw">
					<div className="ibx-pg-nw-form" id="ibx_pg_nw_form">
			            <div className="ibx-pg-nw-bd-a">
				            <form className="thread-form" method="post" action="" >
					            <div className="ibx-pg-nw-bd" id="_ibx_pg_nw_bd">
					                <div className="nw-thr-recip-a" id="_nw_thr_recip_a">
					                    {this.state.canAddRecipient &&
					                    	<div className="nw-thr-recip-b" id="_nw_thr_recip_b" data-users="">
					                        	<MessageRecipients 
								                	{...this.props}
								                	recipients_error={this.state.recipients_error}
						                        	defaultRecipients={this.state.participants}
						                        	updateRecipients={this.updateRecipients}
								                	isLoading={this.state.isLoading} 
								                	 />
					                    	</div>
							            }
					                </div>
					            </div>

					            <div className="ibx-pg-nw-msg-ct">
					            	<div className="ibx-thr-select-bd" >
					                    <div className="thr-idtf" id="_thr_idtf" >
					                        <div className="msg-container" id="_msg_container">
					                        	{messages && messages.map((message, i) => {
								                    return ( <MessageBox
							                       				{...this.props}
							                    				key={i}
							                    				message={message}
							                    				reSubmitMsg={this.reSubmitMsg}
							                    				sender={message.sender}
							                    			/>
							                    	)
									            })}
					                        </div>
					                        <div 
					                        	style={{float: "left", clear:"both"}}
					                        	ref={(el) => this.messagesEnd = el}>
					                        </div>
					                    </div>
					                </div>
					                <div className="nw-thr-ttl-b is-cls">
					                	<InputType
					                		error={this.state.errors.subject}
			                                onChange={this.onChange}
			                                value={this.state.subject}
					                    	name="subject"
					                    	customClassName="nw-msg-subj" 
					                    	placeHolder="Title"
					                		/>
					                </div>
					                <div className="ibx-pg-nw-msg-bd" id="_ibx_pg_nw_msg_bd">
						                <div className="nw-thr-bd-a">
						                    <div className="nw-thr-bd-b">
								                <MessageForm 
								                	{...this.props}	
								                	thread={_thread}
								                	handleSubmit={this.handleSubmit}
								                	newThread={newThread}
								                	enterToSubmit={enterToSubmit}
								                	uniqueString={uniqueString}
								                	changeSubmitMode={this.changeSubmitMode}
								                	/>
								            </div>
					        			</div>
					    			</div>
					            </div>
					        </form>
					    </div>
				    </div>
				</div>
			</div>
		)
	}
})

const mapStateToProps = (state, {thread_id, threads}) => {
	return {
		thread: getSelectedThread(threads, thread_id),
		user: state.User.user
	}
}

export default connect(mapStateToProps)(Thread)