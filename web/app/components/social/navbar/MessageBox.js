import React                    from 'react'
import createReactClass         from 'create-react-class'
import { Scrollbars }           from 'react-custom-scrollbars'
import {
    Route, IndexRoute, 
    Link, IndexLink 
}                               from 'react-router-dom';
import { connect }              from 'react-redux';
import onClickOutside           from 'react-onclickoutside'
import { bindActionCreators }   from 'redux'
import { 
    Message as MessageActions
 }                              from '../../../actions'
import ThreadPreview            from './ThreadPreview'

const clickOutsideConfig = {
    excludeScrollbar: true
};
const MessageBox  = onClickOutside(
    createReactClass({
        
        //method from 'react-onclickoutside' module
        handleClickOutside(e) {
            this.props.toggleNavMessage(false)
        },
        
        componentDidMount() {
            this.props.loadMessages(1)
            // .then(
            //     (data) => { console.log('ok finished...')},
            //     (err) => { console.log('err')}
            // );
        },

    	render() {
            const { list } = this.props
    		return (
                <div className="tabnav-box-ctnr">
    				<div id="msg_nv_arraw" className="msg-nv-arraw"></div>
    		        <div className="msg-nv-ct" id="msg_nv_ct">
    		        	<div className="tabnav-box-hd">
    		            	<div id="msg_nv_ttl" className="msg-nv-ttl">Messages</div>
    		            </div>
    		            <div id="msg_nv_bd" className="msg-nv-bd">
                            <ul id="msg_nv_ul" className="msg-nv-ul">
                                {document && document.createElement && 
                                    <Scrollbars
                                        universal
                                        style={{ height: 350 }}>
                                        {list && list.map && list.map(function(thread, i) {
                                            return <ThreadPreview
                                                        key={i}
                                                        {...self.props}
                                                        thread={thread}
                                                        selected_thread_id={null}
                                                        markIsRead={self.markIsRead}
                                                        selectThread={self.selectThread}
                                                        />
                                        })}
                                    </Scrollbars>

                                }
                            </ul>
                        </div>
                        {!list || !list.length && 
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
    		        </div>
    		    </div>
    		)
    	}
    }), clickOutsideConfig
)

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Object.assign({}, MessageActions), dispatch)
}

export default connect(state => ({
	messagesById: state.Message.messagesById,
	messageIds: state.Message.messageIds,
    list: state.Message.list,
}), mapDispatchToProps)(MessageBox);