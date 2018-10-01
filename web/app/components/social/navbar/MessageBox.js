import React                    from 'react'
import createReactClass         from 'create-react-class'
import { Scrollbars }           from 'react-custom-scrollbars'
import {
    Route, IndexRoute, 
    Link, IndexLink 
}                               from 'react-router-dom';
import { connect }              from 'react-redux';
import onClickOutside           from 'react-onclickoutside'

const clickOutsideConfig = {
    excludeScrollbar: true
};
const MessageBox  = onClickOutside(
    createReactClass({

        toggleNavMessage(e) {
            e.preventDefault();
            this.props.toggleNavMessage();
        },
        
        //method from 'react-onclickoutside' module
        handleClickOutside(e) {
            this.props.toggleNavMessage(false)
        },
        // function getMessage(){
        //     var threads;
        //     $.ajax({
        //         type: 'get',
        //         url: 'http://localhost/app_dev.php/messages/navbar'+'/',
        //         beforeSend:function(){
        //             if(!jQuery('#msg_nv_ul').find('.loading-note').length){
        //                 jQuery('#msg_nv_ul').append('<span class="loading-note load-nv-ivt-act"></span>');
        //             }
        //         },
        //         contentType:false,
        //         processData: false,
        //         success: function (data) {
        //             //remove loading
        //             jQuery('#msg_nv_ul').find('.loading-note').remove();
        //             var conjonction = 'and';
        //             threads =  data.threads;
        //             threads.forEach(function(thread, index){
        //                 $('#msg_nv_ul').append(''+
        //                     '<div id='+thread.id+'_'+index+' class='+ (thread.isRead ? 'nv-thrd-li-read' : 'nv-thrd-li-unread') +' data-thread-id='+thread.id+'>'+
        //                         '<div class="nv-thrd-tp" data-thread-lk='+thread.id+'>'+
        //                             '<span class="nv-thrd-partic">'+
        //                                 '<b>'+thread.lastMessage.author+'</b>'+
        //                             '</span>'+
        //                             '<span data-createdBy='+thread.createdBy.username+' class="nv-thrd-timer op-timer" data-time-m='+thread.lastMessage.date.time.minute+'>'+thread.lastMessage.date.time.minute+'</span>'+
        //                             '</span>'+
        //                         '<div class="nv-thrd-bt" >'+
        //                             '<span class="nv-thrd-img-ct">'+
        //                                 (thread.lastMessage.images ? '<span class="nv-thrd-img-icn">image icon</span>' : '')+
        //                             '</span>'+
        //                             '<span class="nv-thrd-bd" data-thread-body='+thread.id+'>'+
        //                                 (thread.lastMessage.body.length >150 ?
        //                                  thread.lastMessage.body.substring(0, 150-3)+'...' :
        //                                  thread.lastMessage.body)+
        //                             '</span>'+
        //                         '</div>'+
        //                     '</div>'+
        //                 '');
        //             });
        //         },
        //         error: function(xhr, status, error){
        //             var err = eval("("+xhr.responseText+")");
        //             console.log(err.Message);
        //         }
        //     });
        // },
        componentDidMount () {
            //get Thread Message for user
            let unseenMessageElm = document.getElementsByClassName('unseenMessages')[0];
            if(this.props.unseenMessages) {
                unseenMessageElm.className = 'unseenMessages note-alert';
                unseenMessageElm.innerHTML = this.props.unseenMessages;
            } else {
                unseenMessageElm.className = 'unseenMessages';
                unseenMessageElm.innerHTML = '';
            }
        },

    	render() {
            const { list } = this.props
    		return (
                <div className="dv-tabnav-ct" id='tabnav_msg' >
                    <div className={this.props.navMessageBox ? 'currentTab' : ''}>
                        <span className="unseenMessages"></span>
                        <Link
                            to="/messages"
                            onClick={this.toggleNavMessage}
                            className={this.props.navMessageBox ? `active link-message` : `link-message`}>
                        </Link>

            			{this.props.navMessageBox && 
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
                                                </Scrollbars>
                                            }
                                        </ul>
                                    </div>
                		        </div>
                		    </div>
                        }
                    </div>
                </div>
    		)
    	}
    }), clickOutsideConfig
)

export default connect(state => ({
	messagesById: state.Message.messagesById,
	messageIds: state.Message.messageIds,
    list: state.Message.list,
}))(MessageBox);