import React 				from 'react'
import { connect } 			from 'react-redux'
import createReactClass 	from 'create-react-class'
import axios 				from 'axios'
import { compose, pure } 	from 'recompose'
import * as moment 			from 'moment'
import { TimeAgo, }         from '../../../../components'

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

const Call = createReactClass({

	getInitialState() {
		return{
			datas: {},
			data: '',
		}
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
		//data from firebase
	},

	shouldComponentUpdate(nextProps, nextState) {
		return (this.props.showChat !== nextProps.showChat);
	},

	render() {
		const bodyClassnames = this.props.showChat ? 'show-chat oln-bd-ul-ct thr' : 'hide-chat oln-bd-ul-ct thr',
		listClassnames = this.props.showChat ? 'show-chat onl-usr-list thr' : 'hide-chat onl-usr-list thr'

		// ///////
		return(
			<div className={listClassnames}>
				<div className="onl-usr-list-a">
					<div className="oln-usr-hd" onClick={this.props.toggleOnlineList}>
						<div className="oln-usr-hd-r">
							<div className="chat-call">Call</div>
						</div>
					</div>
					<div className={bodyClassnames}>
						<div className="thr-ctnr">
				            <div className="thr-ctnr-a">
					            <form className="thread-form" method="post" action="">
						            <div className="nw-msg-ct">
						            	<div className="thr-select-bd">
						                    
						                </div>
						                <div className="cht-nw-msg-bd">
							                <div className="cht-nw-msg-bd-a">
							                    <div className="cht-nw-msg-bd-b">
									                end call
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
})

export default compose(
	connect(state => ({
		showChat: state.Message.showOnlineList
	})),
	pure
)(Call)