import React, { Fragment }	from 'react'
import { connect } 			from 'react-redux'
import createReactClass 	from 'create-react-class'
import { BuildContent,
	TimeAgo,
}                       from '../../../../components'  


const CallPreview 	= createReactClass({
	shouldComponentUpdate(nextProps, nextState) {
		return (this.props.thread !== nextProps.thread)
	},

	render() {
		const self = this,
		{ thread, user }  = this.props;
		return(
			<div 
        		className='thr-elem' 
        		onClick={self.selectThread}
        		>
                <div className="thr-b-part rd">
                    <div className="thr-lst-msg-hd">
                    	<div className="call-lst-msg-l">
	                    	{thread.otherParticipants.map(function(user, i) {
	                            return (
	                            	<Fragment>
		                            	{i === 0 && 
			                            	<div key={i} className="call-lst-msg-sdr" >
				                                <img 
				                                	src={user.profile_pic.web_path} 
				                                	style={{width:'34px', height:'34px'}} 
				                                	/>
				                            </div>
				                        }
			                        </Fragment>
		                        )
	                    	})}
	                    </div>
	                    <div className="call-lst-msg-r">
	                    	{thread.otherParticipants.map(function(user, i) {
	                            return (
	                            	<Fragment>
		                            	{i === 0 && 
		                            		<div key={i} className="call-lst-msg-sdr" >
				                                <div className="thr-lst-msg-nm">
					                                <span>{user.firstname}</span>
					                                <span>{user.lastname}</span>
				                                </div>
				                            </div>
				                        }
				                        {i === 1 && 
				                        	<div key={i} className="sdr-plus">
				                        		+{thread.otherParticipants.length - 1}
				                        	</div>
				                        }
				                    </Fragment>
		                        )
	                    	})}
	                    	{thread.last_appellant && (thread.last_appellant.id === user.id) && 
	                    		<div className="thr-lst-msg-dte" >
	                                <div className="dlt-thr-fr-lst">
	                                    from me
	                                </div>
	                            </div>
	                        }
	                        {thread.last_appellant && (thread.last_appellant.id !== user.id) && 
	                    		<div className="thr-lst-msg-dte" >
	                                <div className="dlt-thr-fr-lst">
	                                    to me
	                                </div>
	                            </div>
	                        }
                            <div className="op-dte dte-msg">
                            	<TimeAgo
                            		format={true}
                            		timestamp={thread.lastMessage.createdAt}
                            		/>
                            </div>
                        </div>
                    </div>
                    <div className="chat-abs-r">
	                    <div 
	                    	className="vce-call-ic"
	                    	onClick={this.makeVoiceCall}>
	                    </div>
	                    <div 
	                    	className="vde-call-ic" 
	                    	onClick={this.makeVideoCall}>
	                    </div>
                    </div>                        
                </div>
        	</div>
		)
	}
})

////////

function mapStateToProps(state) {
	return { 
		user: state.User.user,
	}
}

export default connect(mapStateToProps)(CallPreview)