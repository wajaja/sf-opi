import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { Link } 			from 'react-router-dom'

import { 
	TimeAgo, BuildContent
} 							from '../../components/'
import Photos 				from './Photos'


const MessageBox = createReactClass({

	getInitialState() {
		return {
			
		}
	},

	reSubmitMsg() {
    	const { data } = this.props.message
    	this.props.reSubmitMsg(data)
    },

    shouldComponentUpdate(nextProps, nextState) {
    	return this.props.message !== nextProps.message;
    },

	render() {
		const { sender, message, user } = this.props;

		if(user.id === sender.id) {
			return(
				<div className="msg-dv-th-ctr self-msg">
					<div className="msg-dv-th self-msg">
		                <div className="thr-msg-rght">
		                    <div className="sp-msg-bdy ">
		                        <div  className="sp-msg-bdy-rght">
		                        	<div className="bdy-txt">
			                        	<BuildContent
				                    		content={ message.body }
				                    		/>
				                    </div>
		                            {!!message.images &&
		                            	<div className="bdy-imgs">
			                            	<Photos
			                            		{...this.props} 
			                            		images={message.images}
			                            		/>
			                            </div>
			                        }
			                        {!!message.videos &&
		                            	<div className="bdy-imgs">
			                            	<Videos 
			                            		{...this.props} 
			                            		/>
			                            </div>
			                        }
		                            {!!message.documents &&
		                            	<div className="bdy-docs">
			                            	<Documents 
			                            		{...this.props} 
			                            		/>
			                            </div>
			                        }
		                        </div>	
		                        {message.id && 
		                        	<div className="sp-msg-bdy-btn">
			                            <span className="msg-date">
			                            	<TimeAgo
			                            		timestamp={message.createdAt}
			                            		/>
			                            </span>
			                            <span className="msg-stat">
			                            	livre
			                            </span>
			                        </div>
			                    }
		                    </div>
		                    {!message.id &&
		                    	<div className="re-sbm-sp">
		                    		{message.failed && 
		                    			<div 
		                    				onClick={this.reSubmitMsg} 
		                    				className="re-sbm-lk">
		                    				retry 
		                    			</div>
		                    		}
		                    	</div>
		                    }
		                    {!message.id &&
		                    	<div className="re-sbm-sp">
		                    		{message.retrying && 
		                    			<div className="re-sbm-lk">retrying...</div>
		                    		}
		                    	</div>
		                    }
		                </div>
	            	</div>
	            </div>
            )
        }
        else { 
            return (
	            <div className="msg-dv-th-ctr">
	            	<div className="msg-dv-th part-msg">
		                <div className="thr-msg-rght">
		                    <div className="sp-msg-sdr">
		                    	<Link to={`${sender.username}`} className="a-msg-sdr">
		                        	<span className="frt">{sender.firstname}</span>
		                        	<span className="lst">{sender.lastname}</span>
		                        </Link>
		                    </div>
		                    <div className="sp-msg-bdy">
		                        <div  className="sp-msg-bdy-lft">
		                        	<div className="bdy-txt">
			                        	<BuildContent
				                    		content={ message.body }
				                    		/>
				                    </div>
		                            {!!message.images &&
		                            	<div className="bdy-imgs">
			                            	<Photos 
			                            		{...this.props} 
			                            		images={message.images}
			                            		/>
			                            </div>
			                        }
			                        {!!message.videos &&
		                            	<div className="bdy-imgs">
			                            	<Videos 
			                            		{...this.props} 
			                            		/>
			                            </div>
			                        }
		                            {!!message.documents &&
		                            	<div className="bdy-docs">
			                            	<Documents 
			                            		{...this.props} 
			                            		/>
			                            </div>
			                        }
		                        </div>
		                    	{message.id && 
		                    		<div className="sp-msg-bdy-btn">
			                            <span className="msg-date">
			                            	<TimeAgo
			                            		timestamp={message.createdAt}
			                            		/>
			                            </span>
			                            <span className="msg-stat">
			                            	livre
			                            </span>
			                        </div>
			                    }
		                    </div>
		                </div>
		            </div>
		    	</div>
			)
	    }
	}
})

export default MessageBox