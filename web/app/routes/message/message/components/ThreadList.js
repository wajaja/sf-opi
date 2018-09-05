import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { Link } 			from 'react-router-dom'
import Menu, { 
	SubMenu, 
	Item as MenuItem, 
	Divider 
} 							from 'rc-menu';
import { Scrollbars } 		from 'react-custom-scrollbars'
import { ThreadPreview }    from '../components'


export const ConfigMenu = createReactClass({

	getInitialState() {
		return{

		}
	},

	handleSelect(info) {
  		console.log(`selected ${info.key}`);
	},

	onOpenChange(value) {
	  	console.log('onOpenChange', value);
	},

	render() {
		const { match } = this.props
		return(
			<Menu 
				mode='horizontal'
			    openAnimation='slide-up'
			    triggerSubMenuAction='click'
				onSelect={this.handleSelect} 
				onOpenChange={this.onOpenChange}>
		  		<SubMenu title={<span className="ibx-tri-cfg"></span>} key="1">
				    <MenuItem key="1-1">
				    	<div className="ibx-msgs-tri ibx-msgs-div">
			            	<Link to={`/${match.url}?tri=archive`}>archive</Link>
			            </div>
				    </MenuItem>
				    <MenuItem key="1-2">
				    	<div className="ibx-msgs-tri ibx-msgs-div">
			            	<Link to={`/${match.url}?tri=unreaded`}>unreaded</Link>
			            </div>
				    </MenuItem>
				    <MenuItem key="1-3">
				    	<div className="ibx-msgs-tri ibx-msgs-div">
			            	<Link to={`/${match.url}?tri=delete`}>delete</Link>
			            </div>
				    </MenuItem>
				</SubMenu>
			</Menu>
		)
	}
});


///////
///////
const ThreadList = createReactClass({

	getInitialState() {
		return {

		}
	},

	selectThread(thread, e) {
		// e.preventDefault();
		const { dispatch } 		= this.props
		this.props.selectThread(thread);
		this.setState({
			selected_thread_id: thread.id
		})
	},

	markIsRead(thread) {
		const { dispatch } 		= this.props
		// e.preventDefault();
		this.props.markIsRead(thread);
		// this.setState({
		// 	selected_thread_id: selected_thread_id
		// })
	},

	createNewThreadMessage(e) {

	},

	makeVoiceCall(e) {
		e.preventDefault();
		//show a modal with users's list 
		//onClick element in that list; doCall users

		this.props.makeVoiceCall();
	},
 	
 	makeVideoCall(e) {
		e.preventDefault();
		//show a modal with users's list 
		//onClick element in that list; doCall users

		this.props.makeVideoCall();
	},

	shouldComponentUpdate(nextProps, nextState) {
		return (this.props.list !== nextProps.list || 
				this.props.fetch_list !== nextProps.fetch_list ||
				this.state.selected_thread_id !== nextState.selected_thread_id)
	},

	render() {
		const self = this,
		{ selected_thread_id, } = this.state,
		{ list, fetch_list } 			= this.props
		return(
			<div className="ibx-pg-msgs-bd" id="_ibx_pg_msgs_bd">
			    <div className="ibx-pg-msgs-mn" id="_ibx_pg_msgs_mn">
			    	<div className="ibx-msgs-key-dv-tp">
			    		<div className="ibx-msgs-key-nw-thr">
		                    <Link 
		                    	to="/messages/?thread=new" 
		                    	className="ibx-create-nw-thd"
		                    	onClick={this.createNewThreadMessage}>
		                    </Link>
			            </div>
			            <div className="ibx-msgs-key-nw-voice-call">
		                    <div 
		                    	className="vce-call-ic"
		                    	onClick={this.makeVoiceCall}>
		                    </div>
			            </div>
			            <div className="vde-call-ic">
		                    <div 
		                    	className="ibx-strt-nw-vde-call" 
		                    	onClick={this.makeVideoCall}>
		                    </div>
			            </div>
			        </div>

			        <div className="ibx-msgs-key-bd">
			        	<div className="ibx-msgs-key-cfg">
			        		<ConfigMenu 
			        			{...this.props}
			        			/>
			        	</div>
			            <div className="ibx-msgs-key-ct">
			                <input type="text" id="msg_key_sch" className="msg-key-sch" />
		                    <span className="key-sch-area">
		                        <i className="fa fa-search sch-msg-key" aria-hidden="true"></i>
		                    </span>
			            </div>
			        </div>
			        <div className="ibx-msgs-tri-ct">
			            
			        </div>
			    </div>
			    <div className="ibx-pg-msgs-cont">
			    	{document && document.createElement && 
			    		<Scrollbars
				    		universal
		                	style={{ height: 450 }}>
					        {list && list.map && list.map(function(thread, i) {
					            return <ThreadPreview
					            			key={i}
					            			{...self.props}
					            			thread={thread}
					            			selected_thread_id={selected_thread_id}
					            			markIsRead={self.markIsRead}
					            			selectThread={self.selectThread}
					            			/>
					        })}
					        {!list && !fetch_list && 
					            <div className="no-thrds-div-wrp">
					                <div className="no-thrds-txt"
					                	style={{
					                		fontSize: '19px',
										    padding: '130px 65px',
										    letterSpacing: '.5px',
										    textAlign: 'center',
										    textTransform: 'capitalize',
										    color: '#93969e',
					                	}}>
					                    no messages
					                </div>
					            </div>
					        }
					        {fetch_list &&
					            <div className="fetch-thrds-div-wrp">
					                <div className="fetch-txt"
					                	style={{
					                		fontSize: '11px',
										    padding: '30px 10px',
										    letterSpacing: '.5px',
										    textAlign: 'center',
										    fontWeight: 600,
										    textTransform: 'capitalize',
										    color: '#93969e',
					                	}}>
					                    loading...
					                </div>
					            </div>
					        }
					    </Scrollbars>
					}
			    </div>
			</div>
		)
	}
})
const mapStateToProps = (state, {location}) => {
	return {
		list: state.Message.list,
		fetch_list: state.Message.fetch_list,
	}
}

export default ThreadList