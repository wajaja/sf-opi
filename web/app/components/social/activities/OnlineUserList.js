import React 					from 'react'
import createReactClass 		from 'create-react-class'
import OnlineUserBox 			from './OnlineUserBox'
import { connect } 				from 'react-redux'
import { bindActionCreators }   from 'redux'

import { 
	Users as UsersActions,
	Message as MessageActions
}								from '../../../actions'




const OnlineUserList 	= createReactClass({

	getInitialState() {
		return{
			opened: true,
		}
	},

	componentDidMount() {
        this.loadFromServer();
        this.timer = window.requestInterval(this.loadFromServer, 100000);
    },

    loadFromServer() {
    	this.props.dispatch(UsersActions.loadOnlines());
    },

    toggleOnlineList(e) {
    	this.props.toggleOnlineList();
    },

    componentWillUmount() {
    	window.clearRequestTimeout(this.timer);
    },

	render() {
		const { onlines } 	= this.props,
		bodyClassnames = this.props.showOnlineList ? 'show-chat oln-bd-ul-ct' : 'hide-chat oln-bd-ul-ct',
		listClassnames = this.props.showOnlineList ? 'show-chat onl-usr-list' : 'hide-chat onl-usr-list'
		return (
			<div className={listClassnames}>
				<div className="onl-usr-list-a">
					<div className="oln-usr-hd" onClick={this.toggleOnlineList}>
						<div className="oln-usr-hd-r">
							<div className="chat-ico"></div>
						</div>
						{!!onlines && <div className="oln-usr-nb">{ onlines.length}</div>}
					</div> 
	            	<div className={bodyClassnames}>
						{onlines.map && onlines.map((user, i) => 
							<OnlineUserBox 
								{...this.props}
								user={user} 
								key={i} 
								/>
				        )}
	                </div>
	            </div>
		    </div>
		)
	}
})

function mapDispatchToProps(dispatch) {
	return bindActionCreators(Object.assign({}, MessageActions), dispatch)
}

export default connect(state => ({
	onlines: state.Users.onlines,
	showOnlineList: state.Message.showOnlineList
}),
mapDispatchToProps)(OnlineUserList)