import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { Link } 			from 'react-router-dom'
import { connect } 			from 'react-redux'
import Menu, { 
	SubMenu, 
	Item as MenuItem, 
	Divider 
} 							from 'rc-menu';
import { Scrollbars } 		from 'react-custom-scrollbars'
import { compose, pure } 	from 'recompose'
import CallPreview    	from './CallPreview'


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
const CallStories = createReactClass({

	shouldComponentUpdate(nextProps, nextState) {
		return this.props.list !== nextProps.list
	},

	render() {
		const self = this,
		{ list } 			= this.props,
		bodyClassnames = this.props.showChat ? 'show-chat oln-bd-ul-ct' : 'hide-chat oln-bd-ul-ct',
		listClassnames = this.props.showChat ? 'show-chat onl-usr-list' : 'hide-chat onl-usr-list'
		return (
			<div className={listClassnames}>
				<div className="call-usr-list-a">
					<div className="oln-usr-hd" onClick={this.props.toggleOnlineList}>
						<div className="oln-usr-hd-r">
							<div className="chat-ico"></div>
						</div>
						<div className="oln-usr-hd-opt-ctnr">
							<div className="oln-usr-hd-opt" 
								onClick={(e) => this.props.changeView('thread_list', e)}>
								<div className="txt">Messages</div>
							</div>
							<div className="oln-usr-hd-opt"
								onClick={(e) => this.props.changeView('online_list', e)}>
								<div className="txt">Onlines</div>
							</div>
							<div className="oln-usr-hd-opt active"
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
					                	style={{ height: 296 }}>
								        {list && list.map && list.map(function(thread, i) {
								            return <CallPreview
								            			key={i}
								            			{...self.props}
								            			thread={thread}
								            			markIsRead={self.props.markIsRead}
								            			selectThread={self.props.selectThread}
								            			/>
								        })}
								        {!list && 
								            <div className="no-thrds-div-wrp">
								                <div className="no-thrds-txt"
								                	style={{
								                		fontSize: '12px',
													    padding: '130px 10px',
													    letterSpacing: '.5px',
													    textAlign: 'center',
													    fontWeight: 600,
													    textTransform: 'capitalize',
													    color: '#93969e',
								                	}}>
								                    no messages
								                </div>
								            </div>
								        }
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
		showChat: state.Message.showOnlineList
	})),
	pure
)(CallStories)