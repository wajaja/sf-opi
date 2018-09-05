import React 				from 'react'
import { connect } 			from 'react-redux'
import createReactClass 	from 'create-react-class'
import { Link } 			from 'react-router-dom'
import Menu, { 
	SubMenu, 
	Item as MenuItem, 
	Divider 
} 							from 'rc-menu';
import { Scrollbars } 		from 'react-custom-scrollbars'
import { compose, pure } 	from 'recompose'
import ThreadPreview    	from './ThreadPreview'


export const ConfigMenu = createReactClass({

	getInitialState() {
		return{
			// page: 1,
		}
	},

	handleSelect(info) {
  		console.log(`selected ${info.key}`);
	},

	onOpenChange(value) {
	  	console.log('onOpenChange', value);
	},

	componentDidMount() {
		// if(this.props.list && !this.props.list.length) {
			
		// }
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

	selectThread(thread) {
		this.props.selectThread(thread);
	},

	shouldComponentUpdate(nextProps, nextState) {
		return (this.props.list !== nextProps.list || 
			   this.props.fetch_list !== nextProps.fetch_list)
	},

	renderEmptyResult() {
        if(this.props.fetch_list) {
            return (
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
	        )
        } else if(!this.props.list && !this.props.fetch_list) {
            return (
        		<div className="no-thrds-div-wrp">
	                <div className="no-thrds-txt"
	                	style={{
	                		fontSize: '12px',
						    padding: '130px 10px 0px',
						    letterSpacing: '.5px',
						    textAlign: 'center',
						    fontWeight: 600,
						    textTransform: 'capitalize',
						    color: '#93969e',
	                	}}>
	                    no messages
	                </div>
	            </div>
	        )
	    } else {
	    	return (<div></div>)
	    }
	},

	render() {
		const self = this,
		{ list, fetch_list } 	= this.props,
		bodyClassnames = this.props.showChat ? 'show-chat oln-bd-ul-ct' : 'hide-chat oln-bd-ul-ct',
		listClassnames = this.props.showChat ? 'show-chat onl-usr-list' : 'hide-chat onl-usr-list'
		return (
			<div className={listClassnames}>
				<div className="onl-usr-list-a">
					<div className="oln-usr-hd" onClick={this.props.toggleOnlineList}>
						<div className="oln-usr-hd-r">
							<div className="chat-ico"></div>
						</div>
						<div className="oln-usr-hd-opt-ctnr">
							<div className="oln-usr-hd-opt active" 
								onClick={(e) => this.props.changeView('thread_list', e)}>
								<div className="txt">Messages</div>
							</div>
							<div className="oln-usr-hd-opt"
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
						<div className="onl-usr-list-bd">
						    <div className="onl-usr-list-cont">
						    	{document && document.createElement && 
						    		<Scrollbars
							    		universal
					                	style={{ height: 295 }}>
								        {list && list.map && list.map(function(thread, i) {
								            return <ThreadPreview
								            			key={i}
								            			{...self.props}
								            			thread={thread}
								            			markIsRead={self.props.markIsRead}
								            			selectThread={self.props.selectThread}
								            			/>
								        })}
								        {this.renderEmptyResult()}
								    </Scrollbars>
								}
						    </div>
						</div>
					</div>
				</div>
			</div>
		)
	}
})

export default compose(
	connect(state => ({
		showChat: state.Message.showOnlineList,
		list: state.Message.list,
		fetch_list: state.Message.fetch_list
	})),
	pure
)(ThreadList)