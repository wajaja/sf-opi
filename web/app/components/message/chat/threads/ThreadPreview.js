import React 				from 'react'
import { connect } 			from 'react-redux'
import createReactClass 	from 'create-react-class'
import { BuildContent,
	TimeAgo,
}                       from '../../../../components'  


const ThreadPreview 	= createReactClass({

	getInitialState() {
		return {
			mouseover: false
		}
	},

	onMouseOver() {
		this.setState({mouseover: true})
	},

	onMouseOut() {
		this.setState({mouseover: false })
	},

	markIsRead(thread) {
		const { dispatch } 		= this.props
		console.log(' mark is selected thread object is', thread)
		// e.preventDefault();
		this.props.markIsRead(thread.id)  //saga middleware
	},

	selectThread(e) {
		// e.preventDefault();
		//dispatch(MessageActions.selectThread(thread.id))  //saga middleware
		this.props.selectThread(this.props.thread);
	},

	deleteThread() {
		const { thread } = this.props

		//call dialog confirn
	},

	confirmDelete() {
		const { thread, dispatch } = this.props
		this.props.deleteThread(thread.id);
	},

	shouldComponentUpdate(nextProps, nextState) {
		return (this.props.thread !== nextProps.thread ||
			this.state.mouseover !== nextState.mouseover)
	},

	render() {
		const self = this,
		{ thread, user }  = this.props;
		return(
			<div 
        		onMouseOver={self.onMouseOver}
        		onMouseOut={self.onMouseOut}
        		className={thread.id === this.props.selected_thread_id ? `thr-elem active` : `thr-elem`} 
        		onClick={self.selectThread}
        		>
            	{user.id === 
            		thread.lastMessage.sender.id && 
                    <div className="thr-b-part rd">
                        <span className="thr-lst-msg-hd">
                        	{thread.otherParticipants.map(function(user, i) {
	                            return (
	                            	<div key={i} className="thr-lst-msg-sdr" >
		                                <span className="thr-lst-msg-nm">
			                                <span>{user.firstname}</span>
			                                <span>{user.lastname}</span>
		                                </span>
		                            </div>
		                        )
                        	})}
                            {this.state.mouseover && <div className="thr-lst-msg-dte" >
	                                <span className="op-dte dte-msg">
	                                	<TimeAgo
	                                		timestamp={thread.lastMessage.createdAt}
	                                		/>
	                                </span>
	                                <div className="dlt-thr-fr-lst">
	                                    <i className="fa fa-times" aria-hidden="true"></i>
	                                </div>
	                            </div>
	                        }
                        </span>
                        <div className="thr-lst-msg-btm">
                            <div className="thr-lst-msg-bdy" >
                            	{!!thread.lastMessage.docs && !!thread.lastMessage.docs.length &&
						            <div className="thr-lst-msg-pdf"></div>
						        }
                            	{!!thread.lastMessage.images && !!thread.lastMessage.images.length &&
						            <div className="thr-lst-msg-img"></div>
						        }
                            	<BuildContent
                            		content={thread.lastMessage.body}
                            		/>
                            </div>
                            <span className="thr-lst-msg-opt">
                                {this.state.mouseover && <div onClick={self.markIsRead.bind(self, thread)} className="mrk-is-rd">
	                                	<i className="fa fa-square read-mark" aria-hidden="true"></i>
	                                </div>
	                            }
                            </span>
                        </div>
                    </div>
                }
            	{user.id !== thread.lastMessage.sender.id && 
    		 		thread.lastMessage.sender.is_read && 
                    <div className="thr-b-part rd">
                        <span className="thr-lst-msg-hd">
                            {thread.otherParticipants.map(function(user, i) {
	                            return (
	                            	<div key={i} className="thr-lst-msg-sdr" >
		                                <span className="thr-lst-msg-nm">
			                                <span>{user.firstname}</span>
			                                <span>{user.lastname}</span>
		                                </span>
		                            </div>
		                        )
                        	})}
                            {this.state.mouseover && <div className="thr-lst-msg-dte" >
                            		<span className="op-dte dte-msg">
	                                	<TimeAgo
	                                		timestamp={thread.lastMessage.createdAt}
	                                		/>
	                                </span>
	                                <div className="dlt-thr-fr-lst" onClick={this.deleteThread}>
	                                    <i className="fa fa-times" aria-hidden="true"></i>
	                                </div>
	                            </div>
	                        }
                        </span>
                        <span className="thr-lst-msg-btm">
                            <div className="thr-lst-msg-bdy" >
                            	<BuildContent
                            		content={thread.lastMessage.body}
                            		/>
                            </div>
                            <span className="thr-lst-msg-opt">
                                {this.state.mouseover && <div onClick={self.markIsRead.bind(self, thread)} className="mrk-is-rd">
	                                    <i className="fa fa-square-o read-mark" aria-hidden="true"></i>
	                                </div>
	                            }
                            </span>
                        </span>
                    </div>
            	}
            	{user.id !== thread.lastMessage.sender.id && 
    		 	 !thread.lastMessage.sender.is_read && 
                    <div className="thr-b-part unrd">
                        <span className="thr-lst-msg-hd">
                            <div className="thr-lst-msg-sdr" >
                                <span className="thr-lst-msg-nm">
	                                <span>{thread.lastMessage.sender.firstname}</span>
	                                <span>{thread.lastMessage.sender.lastname}</span>
                                </span>
                            </div>
                            {this.state.mouseover && <div className="thr-lst-msg-dte" >
	                                <span className="op-dte dte-msg">
	                                	<TimeAgo
	                                		timestamp={thread.lastMessage.createdAt}
	                                		/>
	                                </span>
	                                <div className="dlt-thr-fr-lst">
	                                    <i className="fa fa-times" aria-hidden="true"></i>
	                                </div>
	                            </div>
	                        }
                        </span>
                        <span className="thr-lst-msg-btm">
                            <div className="thr-lst-msg-bdy" >
                            	<BuildContent
                            		content={thread.lastMessage.body}
                            		/>
                            </div>
                            <span className="thr-lst-msg-opt">
                                {this.state.mouseover && <div onClick={self.markIsRead.bind(self, thread)} className="mrk-is-rd">
	                                    <i className="fa fa-square read-mark" aria-hidden="true"></i>
	                                </div>
	                            }
                            </span>
                        </span>
                    </div>
                }
        	</div>
		)
	}
})

export default connect(state => ({
	user: state.User.user
}))(ThreadPreview)