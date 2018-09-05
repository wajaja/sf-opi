import React 			from 'react'
import createReactClass from 'create-react-class'
import { Link } 		from 'react-router-dom'
import { TimeAgo, }     from '../../../../components'


const Participant = createReactClass({
	getInitialState() {
		return {

		}
	},

	render() {
		const { user, participant, dispatch } = this.props
		return(
    		<div className="thr-participant">
    			<div className="thr-partic-label">
    				<Link to={`/${participant.username}`} className="thr-frt-part">
    					<img src={participant.profile_pic.web_path} className="thr-partic-pic" />
    				</Link>
    			</div>
    			<div className="thr-partic-label">
    				<div className="thr-partic-name">
    				</div>
    				<div 
    					className="thr-partic-opt-pls"
    					style={{
    						display: 'none',
    					}}
    					>
		            	<div className="thr-vce-call-btn"></div>
		                <div className="thr-vde-call-btn"></div>
    				</div>
    			</div>
    		</div>
		)
	}
})

/////
const Head = createReactClass({
	getInitialState() {
		return {
			option: false
		}
	},

	getDefaultProps() {
		return {
			participants: [],
		}
	},

	threadOption(e) {
		const self = this
		this.setState({option: !self.state.option})
	},


	render() {
		const { participants, dispatch, user, thread } = this.props


		if(thread && thread.thread && thread.thread.id) {

			const { otherParticipants } = thread.thread
			return(
				<div className="ibx-pg-nd-a">
	                <div className="ibx-pg-nw-dv">
	                	<div className="ibx-pg-hd-l">
		                	{otherParticipants.map((u, i) => {
				                return <Participant 
				                			key={i} 
				      						dispatch={dispatch}
				                			user={user} 
				                			participant={u}
				                			/>
		                	})}
			            </div>
		                {typeof thread === 'object' && 
		                	<div className="ibx-pg-hd-r">
			                    <div className="thr-crted-dte">
			                    	<span>Created at </span>
					            	<TimeAgo
					            		timestamp={thread.thread.createdAt}
					            		/>
					            </div>
			                    <div 
			                    	className="thr-config"
			                    	onClick={this.threadOption}
			                    	>
			                    </div> 
			                </div>
			            }
	                </div>
	            </div>
			)
		}

		return(
			<div className="ibx-pg-nd-a">
                <div className="ibx-pg-nw-dv"
                	style={{
                		position: 'relative'
                	}}>
                	<div 
                		className="ibx-pg-hd-r"
                		style={{
                			fontSize: '14px',
                			fontWeight: '600',
                			position: 'absolute',
                			top: '45px',
						    left: '20px',
						    textTransform: 'capitalize',
						    color: '#727784',
                		}}>
	                	new conversation
		            </div>
                </div>
            </div>
		)
	}
})


export default Head