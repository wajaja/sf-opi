import React 				from 'react'
import createReactClass 	from 'create-react-class'
import Box 					from './Box'
import { connect } 			from 'react-redux'
import { pure, compose } 	from 'recompose'
import { Users as UsersActions } from '../../../../actions'

const List 	= createReactClass({

	componentDidMount() {
        this.loadFromServer();
        this.timer = window.requestInterval(this.loadFromServer, 100000);
    },

    loadFromServer() {
    	this.props.dispatch(UsersActions.loadOnlines());
    },

    componentWillUmount() {
    	window.clearRequestTimeout(this.timer);
    },

	render() {
		const { onlines } 	= this.props,
		bodyClassnames = this.props.showChat ? 'show-chat oln-bd-ul-ct' : 'hide-chat oln-bd-ul-ct',
		listClassnames = this.props.showChat ? 'show-chat onl-usr-list' : 'hide-chat onl-usr-list'
		return (
			<div className={listClassnames}>
				<div className="onl-usr-list-a">
					<div className="oln-usr-hd" onClick={this.props.toggleOnlineList}>
						<div className="oln-usr-hd-r">
							<div className="chat-ico"></div>
						</div>
						{!!onlines && <div className="oln-usr-nb">{onlines.length}</div>}
						<div className="oln-usr-hd-opt-ctnr">
							<div className="oln-usr-hd-opt" 
								onClick={(e) => this.props.changeView('thread_list', e)}>
								<div className="txt">Messages</div>
							</div>
							<div className="oln-usr-hd-opt active"
								onClick={(e) => this.props.changeView('online_list', e)}>
								<div className="txt">Onlines</div>
							</div>
							<div className="oln-usr-hd-opt"
								onClick={(e) => this.props.changeView('call_stories', e)}>
								<div className="txt">Calls</div>
							</div>
						</div>
					</div> 
	            	<div className={bodyClassnames}>
						{onlines.map && onlines.map((user, i) => 
							<Box 
								key={i} 
								user={user} 
								thread_id={user.thread_id}
								selectUser={this.props.selectUser}
								/>
				        )}
	                </div>
	            </div>
		    </div>
		)
	}
})

export default compose(
	connect(state => ({
		onlines: state.Users.onlines,
		showChat: state.Message.showOnlineList
	})),
	pure
)(List)