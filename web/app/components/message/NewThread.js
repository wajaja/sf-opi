import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'

import { 
	MessageForm,
 	InputType,
 	MessageBox,
} 							from '../../components'
import MessageRecipients 	from './MessageRecipients'


const NewThread 	= createReactClass({
	getInitialState() {
		return{
			subject: '',
			thread: null,
			errors: {},
			recipients: [],
			enterToSubmit: false,
		}
	},

	onChange(e) {
		this.setState({[e.target.name]: e.target.value })
	},

	updateRecipients(recipients) {
		this.setState({
			recipients: recipients
		})
	},

	cancelNewMessage() {
		this.props.cancelNewMessage();
	},

	changeSubmitMode() {
		const self = this
		this.setState({
			enterToSubmit: !self.state.enterToSubmit
		})
	},

	render() {
		const { thread, errors, subject } = this.state;
		return(
			<div className="ibx-pg-nw-form" id="ibx_pg_nw_form">
			    <div className="ibx-pg-nw-tp" id="_ibx_pg_nw_tp">
			        <div className="ibx-thr-select-out">
			        	{this.props.cancelNewMessageButton && 
        					<button 
	                            onClick={this.cancelNewMessage}
	                            style={{outline: 'none'}}
	                            className="btn btn-default cfmd-ign thread">Ignore
	                        </button>
	                    }
			        </div>
			    </div>
			    <div className="ibx-pg-nw-bd-a">
			        <div className="nw-thr-recip-dv">
			            <form className="thread-form" method="post" action="" >
				            <div className="ibx-pg-nw-bd" id="_ibx_pg_nw_bd">
				                 <div className="nw-thr-recip-a" id="_nw_thr_recip_a">
				                    <div className="nw-thr-recip-b" id="_nw_thr_recip_b" data-users="">
				                        <MessageRecipients 
				                        	defaultRecipients={this.props.defaultRecipients}
				                        	updateRecipients={this.updateRecipients}
						                	isLoading={this.state.isLoading} 
						                	{...this.props} />
				                    </div>
				                </div>
				                <div className="ibx-thr-select-bd" >
				                    <div className="thr-idtf" id="_thr_idtf" >
				                        <div className="msg-container" id="_msg_container">
				                        	{thread && thread.messages.map(function(message, i) {
							                    return 
							                    	<MessageBox
						                       			{...this.props}
						                    			key={i}
						                    			message={message}
						                    			sender={message.sender}
						                    			/>

								            })}
				                        </div>
				                    </div>
				                </div>
				            </div>
				            <div className="ibx-pg-nw-msg-ct">
				                <div className="nw-thr-ttl-b is-cls">
				                	<InputType
				                		error={errors.subject}
		                                onChange={this.onChange}
		                                value={subject}
				                    	name="subject"
				                    	customClassName="nw-msg-subj" 
				                    	placeHolder="Title"
				                		/>
				                </div>
				                <MessageForm 
				                	enterToSubmit={false}
				                	changeSubmitMode={this.changeSubmitMode}
				                	{...this.props}	
				                	/>
				            </div>
				        </form>
			        </div>
			    </div>
			</div>
		)
	}
})

export default connect(state => ({

}))(NewThread)