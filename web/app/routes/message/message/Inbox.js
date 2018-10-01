import React 					from 'react'
import { connect }				from 'react-redux'
import createReactClass 		from 'create-react-class'
import { Link, withRouter }     from 'react-router-dom'
import { push } 				from 'react-router-redux';
import { bindActionCreators } 	from 'redux';
import { Helmet }           	from "react-helmet";
import { NewThread } 			from '../../../components'
import { 
	ThreadList,
	Thread, 
	Head,
	Left,
} 								from './components' 
import { 
	Message as MessagesActions,
}    						from '../../../actions'
import { getUrlParameterByName } from '../../../utils/funcs'
import '../../../styles/message/inbox.scss'


const Inbox = createReactClass({

	getInitialState() {
		return {
			loading_thread: false,
			calls_modal: true, 
			calls_modal_type: 'voice',
			thread_id: getUrlParameterByName('thread', this.props.location.search) || 'new'
		}
	},

	selectThread(thread, e) {
		this._selectThread(thread);
	},

	_selectThread(thread) {
		const { history } 		= this.props
		this.setState({thread_id: thread.id, loading_thread: true,})

		this.props.loadThread(thread.id)
		.then((data) => {
			if(data) {
				this.setState({loading_thread: false})
			} else {
				history.push(`/messages/?thread=new`)
			}
		})
	},

	getSelectedThreadForRecipient(thread){
		this._selectThread(thread);
	},

	markIsRead(thread) {
		const { dispatch } 		= this.props
		this.props.markIsRead(thread.id)  //saga middleware
	},

	markIsUnRead(thread) {
		const { dispatch } 		= this.props
		this.props.markIsUnRead(thread.id)  //saga middleware
	},

	getThread(props, thread_id, pushRoute) {
		const { threads, history, dispatch } = props,
		thread = threads[thread_id];
		if(thread) {
			this.setState({loading_thread: false,})
			//programatically change route
			if(pushRoute)
				history.push(`/messages/?thread=${thread_id}`)

		} else {
			this.setState({ loading_thread: true })
			this.props.loadThread(thread_id)
			.then((thread) => {
				if(thread && thread.id) {
					this.setState({loading_thread: false})
					if(pushRoute)
						history.push(`/messages/?thread=${thread_id}`)
				} else {
					history.push(`/messages/?thread=new`)
				}
			}, (err) => {
				history.push(`/messages/?thread=new`)
			})
		}
	},

	/**
	* When new thread was created then
	* push new route from route
	* make an update in all component
	*/
	threadCreated(thread) {
		const { history, dispatch } = this.props
		this.setState({thread_id: thread.id})
		history.push(`/messages/?thread=${thread.id}`)
		this.props.threadCreated(thread);
	},

	makeVoiceCall() {
		this.setState({calls_modal: true, calls_modal_type: 'voice'})
	},

	makeVideoCall() {
		this.setState({calls_modal: true, calls_modal_type: 'video'})
	},

	componentWillMount() {
		//else selected_thread 
	},

	componentDidMount() {
		const { thread_id } 	= this.state,
		{ threads, list, dispatch, location, history, user, } = this.props,
		last_id 	= user.last_thread_activity

		//24 means a valid mongoId length
		if(thread_id === 'new' ) {
			return
		} 
		else if(thread_id && thread_id.length === 24 ) {
			this.getThread(this.props, thread_id, false); //pushRoute = false
		} 
		else if(last_id && last_id.length === 24) {
			this.getThread(this.props, last_id, true); //pushRoute = true
		} 
		else if(list.length !== 0 && !thread_id && !last_id) {
			console.log('threads array are empty')
			//if threads array's empty then redirect to new
			if(thread_id !== 'new')
				history.push(`/messages/?thread=new`)
		}
		else if(list.length === 0 && !param_id && !last_id) {
			console.log('threads array are empty')
			//if threads array's empty then redirect to new
			if(thread_id !== 'new')
				history.push(`/messages/?thread=new`)
		}
	},

	componentDidUpdate(prevProps, prevState) {
		const thread_id = this.state.thread_id;
		if(thread_id !== prevState.thread_id) {
			if(!thread_id || thread_id === 'new' || thread_id.length !== 24) {
				this.props.history.push(`/messages/?thread=new`)
				return
			}
			this.setState({loading_thread: true})
			this.props.loadThread(thread_id)
			.then((data) => {
				if(data) {
					this.setState({loading_thread: false})
				} else {
					this.props.history.push(`/messages/?thread=new`)
				}
			})
			this.props.history.push(`/messages/?thread=${thread_id}`)
		}

	},

	componentWillReceiveProps(nextProps) {
		if(this.props.location.search !== nextProps.location.search) {
			const param_id 	= getUrlParameterByName('thread', location.search)
			//24 means a valid mongoId length
			if(param_id && param_id.length === 24 ) {
				this.setState({thread_id: param_id})
				this.getThread(nextProps, param_id, false); //pushRoute = false
			}
		}

		if(this.props.threads !== nextProps.threads) {
        	console.log('immutable .....')
        	// this.setState({messages: nextProps.thread.messages})
        }
		// if(this.props.thread_id !== nextProps.thread_id)

	},

	shouldComponentUpdate(nextProps, nextState) {
		return (this.props.threads !== nextProps.threads ||
				this.props.list !== nextProps.list  || 
				this.state.thread_id !== nextState.thread_id ||
				this.props.location !== nextProps.location ||
				this.state.loading_thread !== nextState.loading_thread)
	},

	render() {
		const { threads, dispatch, user, location, thread } = this.props,
		{ loading_thread, thread_id } = this.state,
		newThread = thread_id.length === 24 ? false : true

		return(
			<div className="hm-container inbox" ref={c => this._pageElm = c}>
				<Helmet>
                    <title>Messages</title>
                </Helmet>
                <div id="hm_main_blk" className="hm-main-blk">
                    <div className="hm-main-blk-ctnr"> 
                    	<div id="hm_lft_dv" className="hm-lft-dv">
                            <div className="hm-frst-blk">
                                <div className="hm-frst-blk-a" >
                                    <Left 
                                        {...this.props}
                                        user={user}
                                        selectThread={this.selectThread}
					            		markIsRead={this.markIsRead}
					            		markIsUnRead={this.markIsUnRead}
					            		makeVoiceCall={this.makeVoiceCall}
					            		makeVideoCall={this.makeVideoCall}
                                        />                                
                                </div>
                            </div>
                    	</div>
                        <div className="ibx-pg-bd" id="_ibx_pg_bd">
                        	<div className="ibx-pg">
	                        	{loading_thread && 
									<div className="ibx-pg-b">
										<div className="loading-thread">loading thread....</div>
									</div>
								}
						        {!loading_thread &&  
						        	<Thread 
					            		{...this.props}
					            		enterToSubmit={false}
					            		newThread={!!newThread}
					            		loading={loading_thread}
					            		thread_id={thread_id}
					            		thread={thread}
					            		threadCreated={this.threadCreated}
					            		getSelectedThreadForRecipient={this.getSelectedThreadForRecipient}
					            		/>
			 					}
		 					</div>
	    				</div>
	        		</div>
            	</div>
            </div>
		)
	}
})

const mapStateToProps = (state, {location}) => {
	return {
		threads: state.Message.threads,
		list: state.Message.list,
	}
}
/////
function mapDispatchToProps(dispatch) {
    return  bindActionCreators(Object.assign({}, MessagesActions), dispatch)
}

/////
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Inbox))