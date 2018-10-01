import React 				from 'react'
import createReactClass 	from 'create-react-class'
import ThreadList 			from './ThreadList'
import { connect } 			from 'react-redux'


const Left = createReactClass({
	getInitialState() {
		return {

		}
	},

	selectThread(thread) {
		this.props.selectThread(thread);
	},

	markIsRead(thread) {
		this.props.markIsRead(thread);
	},

	markIsUnRead(thread) {
		this.props.markIsUnRead(thread);
	},

	render() {
		const { makeVoiceCall, makeVideoCall } = this.props
		return(
			<div className="ibx-pg-msgs" id="_ibx_pg_msgs">
            	<ThreadList 
            		{...this.props} 
            		markIsRead={this.markIsRead}
            		makeVoiceCall={makeVoiceCall}
            		makeVideoCall={makeVideoCall}
            		selectThread={this.selectThread}
            		markIsUnRead={this.markIsUnRead}
            		/>
                <div className="ibx-pg-msgs-bd" id="_ibx_pg_msgs_db">
                    <div className="ibx-pg-msg" id="_ibx_pg_msg"></div>
                </div>
                <div className="ibx-pg-msgs-sh" id="_ibx_pg_msgs_sh"></div>
            </div>
		)
	}
})

const mapStateToProps = (state, {location}) => {
	return {
		list: state.Message.list,
	}
}
export default connect(mapStateToProps)(Left)