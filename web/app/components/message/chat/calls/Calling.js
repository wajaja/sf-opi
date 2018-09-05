import React 				from 'react'
import { connect } 			from 'react-redux'
import createReactClass 	from 'create-react-class'
import { Link } 			from 'react-router-dom'
import Menu, { 
	SubMenu, 
	Item as MenuItem, 
	Divider 
} 							from 'rc-menu';
import { Scrollbars } 		from 'react-custom-scrollbars'
import { compose, pure } 	from 'recompose'

///////
///////
const Calling = createReactClass({

	selectThread(thread) {
		this.props.selectThread(thread);
	},

	componentDidMount() {

	},

	shouldComponentUpdate(nextProps, nextState) {
		return (this.props.list !== nextProps.list || 
			   this.props.fetch_list !== nextProps.fetch_list)
	},

	_renderVoiceCall() {

	},

	_renderVideoCall() {

	},

	render() {
		const self = this,
		{ list, fetch_list } 	= this.props,
		bodyClassnames = this.props.showChat ? 'show-chat oln-bd-ul-ct' : 'hide-chat oln-bd-ul-ct',
		listClassnames = this.props.showChat ? 'show-chat onl-usr-list' : 'hide-chat onl-usr-list'
		return (
			<div className={listClassnames}>
				<div className="onl-usr-list-a">
					<div className="oln-usr-hd" onClick={this.props.toggleOnlineList}>
						<div className="oln-usr-hd-r">
							<div className="oln-usr-hd-opt" 
								onClick={(e) => this.props.changeView('thread_list', e)}>
								<div className="txt">Back</div>
							</div>
							<div className="oln-usr-hd-opt" >
								<div className="thr-partic-prof">
									<img src={thread.otherParticipants[0].profile_pic.web_path} />
								</div>
								<div className="thr-partic-name">
									<span>
										thread.otherParticipants[0].firstname
									</span>
									<span>
										thread.otherParticipants[0].lastname
									</span>
								</div>
							</div>
						</div>
						{!!isActive && <div className="oln-sign-ico">active</div>}
						{!isActive && 
							<div className="oln-lst-time">
								{moment.utc(moment.unix(thread.otherParticipants[0].last_conn)).fromNow()}
							</div>
						}
					</div>
					<div className={bodyClassnames}>
						<div className="thr-ctnr">
				            <div className="thr-ctnr-a">
					            <form className="thread-form" method="post" action="">
						            <div className="nw-msg-ct">
						            	<div className="thr-select-bd">
						                    <div className="thr-select-bd-a loading">loading...</div>
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
})

export default compose(
	connect(state => ({
		showChat: state.Message.showOnlineList,
		list: state.Message.list,
		fetch_list: state.Message.fetch_list
	})),
	pure
)(Calling)