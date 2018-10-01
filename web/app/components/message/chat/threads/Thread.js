import React 				from 'react'
import { connect } 			from 'react-redux'
import { Link } 			from 'react-router-dom'
import createReactClass 	from 'create-react-class'
import axios 				from 'axios'
import classnames  			from 'classnames'
import { Scrollbars } 		from 'react-custom-scrollbars'
import * as moment      	from 'moment'

moment.updateLocale('en', {
    relativeTime : {
        future: "in %s",
        past:   "%s",
        s:  "just now",
        m:  "1 min",
        mm: "%d min",
        h:  "1 hour",
        hh: "%d hours",
        d:  "a day",
        dd: "%d days",
        M:  "1 month",
        MM: "%d month",
        y:  "1 year",
        yy: "%d years"
    }
});
const uniqueString = require('unique-string')

import { 
    MessageBox,
    TimeAgo,
    MessageForm,
    InputType, 
    MessageRecipients
}                               from '../../../../components'

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
		const { thread, newThread, user } = this.props;
		const _thread = thread && thread.thread;
		return{
			errors: {},
			subject: '',
            Video: true,
            Audio: true,
			messages: [],
			option: false,
			uniqueString: document && document.createElement && uniqueString(),
			recipients: _thread  ? _thread.recipients : [], //array of usernames 
			participants: _thread ? _thread.participants : []
		}
	},

    btns : [
        { type: 'Video', icon: 'fa-video-camera' },
        { type: 'Audio', icon: 'fa-microphone' }
    ],


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

	/**
	* Turn on/off a media device
	* @param {String} deviceType - Type of the device eg: Video, Audio
	*/
	toggleMediaDevice(deviceType) {
		this.setState({
		  	[deviceType]: !this.state[deviceType]
		});
		this.props.mediaDevice.toggle(deviceType);
	},

	/**
    * Start the call with or without video
    * @param {Boolean} video
    */
  	callWithVideo(video) {
	    const { thread } = this.props,
	    config  	 = { audio: true },
		_thread 	 = thread && thread.thread,
	    friendID  	 = _thread.otherParticipants[0].id;
	    config.video = video;
	    return () => this.props.startCall(true, friendID, config);
  	},

	renderControlButtons() {
        const getClass = (icon, type) => classnames(`btn-action fa ${icon}`, {
          disable: !this.state[type]
        });

        return this.btns.map(btn => (
            <button
                key={`btn${btn.type}`}
                className={getClass(btn.icon, btn.type)}
                onClick={() => this.toggleMediaDevice(btn.type)}
            />
        ));
    },

    toggleOption(evt) {
    	this.setState({option: !this.state.option})
    },

	componentWillReceiveProps(nextProps) {
        if(this.props.threads !== nextProps.threads) {
        	this.setState({messages: nextProps.thread.messages});
        }

        if(this.props.thread && (this.props.thread !== nextProps.thread)) {
        	this.setState({messages: nextProps.thread.messages})
        }
	},

	shouldComponentUpdate(nextProps, nextState) {
		return (this.props.thread !== nextProps.thread ||
			this.props.newThread !== nextProps.newThread ||
			this.state.uniqueString !== nextState.uniqueString ||
			this.props.loading !== nextProps.loading ||
			this.state.messages !== nextState.messages);
	},

	render() {
		const 
		{ user, thread, newThread, } = this.props,
		{ uniqueString, messages  }  = this.state,
		_thread = thread && thread.thread,
		bodyClassnames = this.props.showChat ? 'show-chat oln-bd-ul-ct thr' : 'hide-chat oln-bd-ul-ct thr',
		listClassnames = this.props.showChat ? 'show-chat onl-usr-list thr' : 'hide-chat onl-usr-list thr'
		
		if(this.props.loading) {
			return(
				<div className={listClassnames}>
					<div className="onl-usr-list-a">
						<div className="oln-usr-hd" onClick={this.props.toggleOnlineList}>
							<div className="oln-usr-hd-r">
								<div className="oln-usr-hd-back" 
									onClick={(e) => this.props.changeView('thread_list', e)}>
									<div className="txt">Back</div>
								</div>
								{!!isActive && <div className="oln-sign-ico">active</div>}
							</div>
							<div className="oln-usr-hd-l">
								<div className="thr-usr-hd-opt">
									<div className="btns">
							            <button
							              	className="btn-action fa fa-video-camera"
							              	onClick={() => this.callWithVideo(true)}
							            	/>
							            <button
							              	className="btn-action fa fa-phone"
							              	onClick={() => this.callWithVideo(false)}
							            	/>
									</div>
									<button
				                        className="btn-action fa fa-ellipsis-v"
				                        onClick={() => this.toggleOption()}
				                        />
				                </div>
							</div>
						</div>
						<div className={bodyClassnames}>
							<div className="thr-ctnr">
					            <div className="thr-ctnr-a">
						            <form className="thread-form" method="post" action="">
							            <div className="nw-msg-ct">
							            	<div className="thr-select-bd">
							                    <div className="thr-idtf">
							                        <div className="msg-container">
							                        </div>
							                        <div 
							                        	style={{float: "left", clear:"both"}}
							                        	ref={(el) => this.messagesEnd = el}>
							                        </div>
							                    </div>
							                </div>
							                <div className="cht-nw-msg-bd">
								                <div className="cht-nw-msg-bd-a">
								                    <div className="cht-nw-msg-bd-b">
										                <MessageForm 
										                	{...this.props}	
										                	thread={thread}
										                	handleSubmit={this.handleSubmit}
										                	newThread={true}
										                	enterToSubmit={true}
										                	uniqueString={this.state.uniqueString}
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
				</div>
			)
		}

		const isActive = (_thread.otherParticipants[0].time_elapsed < 200);
		// ///////
		return(
			<div className={listClassnames}>
				<div className="onl-usr-list-a">
					<div className="oln-usr-hd" onClick={this.props.toggleOnlineList}>
						<div className="oln-usr-hd-r">
							<div className="oln-usr-hd-back" 
								onClick={(e) => this.props.changeView('thread_list', e)}>
								<div className="txt">Back</div>
							</div>
							<div className="oln-usr-hd-profil" >
								<div className="thr-partic-prof">
									<img src={_thread.otherParticipants[0].profile_pic.web_path} />
								</div>
								<div className="thr-partic-name">
									<span style={{marginRight: '5px'}}>
										{_thread.otherParticipants[0].firstname}
									</span>
									<span>
										{_thread.otherParticipants[0].lastname}
									</span>
								</div>
							</div>
							{!!isActive && <div className="oln-sign-ico">active</div>}
							{!isActive && 
								<div className="oln-lst-time">
									{moment.utc(moment.unix(_thread.otherParticipants[0].last_conn)).fromNow()}
								</div>
							}
						</div>
						<div className="oln-usr-hd-l">
							<div className="thr-usr-hd-opt">
								<div className="btns">
						            <button
						              	className="btn-action fa fa-video-camera"
						              	onClick={this.callWithVideo(true)}
						            	/>
						            <button
						              	className="btn-action fa fa-phone"
						              	onClick={this.callWithVideo(false)}
						            	/>
								</div>
								<button
			                        className="btn-action fa fa-ellipsis-v"
			                        onClick={() => this.toggleOption()}
			                        />
			                </div>
						</div>
					</div>
					<div className={bodyClassnames}>
						<div className="thr-ctnr">
				            <div className="thr-ctnr-a">
					            <form className="thread-form" method="post" action="">
						            <div className="nw-msg-ct">
						            	<div className="thr-select-bd">
						                    <div className="thr-idtf">
						                        <div className="msg-container">
						                        	{messages && messages.map((message, i) => {
									                    return ( <MessageBox
								                    				key={i}
								                       				{...this.props}
								                    				message={message}
								                    				sender={message.sender}
								                    				reSubmitMsg={this.reSubmitMsg}
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
						            </div>				
					                <div className="cht-nw-msg-bd">
						                <div className="cht-nw-msg-bd-a">
						                    <div className="cht-nw-msg-bd-b">
								                <MessageForm 
								                	{...this.props}	
								                	thread={_thread}
								                	handleSubmit={this.handleSubmit}
								                	newThread={false}
								                	enterToSubmit={true}
								                	uniqueString={this.state.uniqueString}
								                	/>
								     		</div>
					        			</div>
					    			</div>
						        </form>
						    </div>
					    </div>
					</div>
				</div>
			</div>
		)
	}
})

///////
const mapStateToProps = (state, {thread_id, threads}) => {
	return {
		showChat: state.Message.showOnlineList,
		thread: getSelectedThread(threads, thread_id),
		user: state.User.user
	}
}

export default connect(mapStateToProps)(Thread)