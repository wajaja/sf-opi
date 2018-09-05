import React                from 'react'
import createReactClass     from 'create-react-class'
import {
    Route, IndexRoute, 
    Link, IndexLink 
}                           from 'react-router-dom';
import { connect }          from 'react-redux';
import onClickOutside           from 'react-onclickoutside'

const clickOutsideConfig = {
    excludeScrollbar: true
};

const InvitationBox  = onClickOutside(
    createReactClass({

        toggleNavInvits(e){
            e.preventDefault()
            this.props.toggleNavInvits();
        },

        //method from 'react-onclickoutside' module
        handleClickOutside(e) {
            this.props.toggleNavInvits(false)
        },

    	componentDidMount() {
    		//get invitations
            // function getInvitations(){
            //     var invitations;
            //     $.ajax({
            //         type: 'get',
            //         url: 'http://localhost/app_dev.php/invitations'+'/',
            //         beforeSend:function(data){
            //             if(!jQuery('#invit_nv_ul').find('.loading-note').length){
            //                 jQuery('#invit_nv_ul').append('<span class="loading-note load-nv-ivt-act"></span>');
            //             }
            //         },
            //         contentType:false,
            //         processData: false,
            //         success: function (data) {
            //             //remove loading
            //             jQuery('#invit_nv_ul').find('.loading-note').remove();
            //             invitations =  data.invitations;
            //             invitations.forEach(function(invitation){
            //                 $('#invit_nv_ul').append(''+
            //                     '<div data-invit-id='+invitation.id+' data-username='+invitation.sender.username+' data-firtname='+invitation.sender.firstname+' data-lastname='+invitation.sender.lastname+' class="invit-dv">'+
            //                         '<div class="invit-l-i">'+
            //                             '<a data-invit-id='+invitation.id+' data-username='+invitation.sender.username+' class="invit-sdr-lk-pic" href='+invitation.sender.username+'>'+
            //                                 '<img src='+invitation.sender.profilepic+' class="invit-sdr-pic" />'+
            //                             '</a>'+
            //                             '<a  data-invit-id='+invitation.id+' data-username='+invitation.sender.username+' class="invit-sdr-lk-nm" href='+invitation.sender.username+'>'+
            //                                 '<span class="">'+invitation.sender.firstname+'</span> <span class="">'+invitation.sender.lastname+'</span>'+
            //                             '</a>'+
            //                         '</div>'+
            //                         '<div data-chld-act='+invitation.id+' class="invit-r-c">'+
            //                             '<div class="invit-r-c-ct">'+
            //                                 '<span class="invit-cfm-sp">'+
            //                                     '<button  data-trgt-invit='+invitation.id+' data-trgt='+invitation.sender.id+' class="invit-btn-cfm-fri">Confirme</button>'+
            //                                     '<button data-trgt-invit='+invitation.id+' data-trgt='+invitation.sender.id+' class="invit-btn-cfm-flw">Follow</button>'+
            //                                 '</span>'+
            //                                 '<a  href="#" data-trgt-invit='+invitation.id+' data-invit-dlt='+invitation.id+' data-trgt='+invitation.sender.id+' class="invit-lk-msk-iv">Delete</a>'+
            //                             '</div>'+
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
            // };

            if(this.props.unseenInvitations) {
                    var unseenInvitationElm = document.getElementsByClassName('unseenInvitations')[0];
                    unseenInvitationElm.className = 'unseenInvitations note-alert';
                    unseenInvitationElm.innerHTML = this.props.unseenInvitations;
                } else {
                    var unseenInvitationElm = document.getElementsByClassName('unseenInvitations')[0];
                    unseenInvitationElm.className = 'unseenInvitations';
                    unseenInvitationElm.innerHTML = '';
                }
    	},

    	render() {
    		return (
                <div className="dv-tabnav-ct" id='tabnav_invit' >
                    <div className={this.props.navInvitsBox ? 'currentTab' : ''}>
                        <span className="unseenInvitations"></span>
                        <Link 
                            to="/invitations"
                            onClick={this.toggleNavInvits}
                            className={this.props.navInvitsBox ? `active invit-nv-lk` : `invit-nv-lk`}>
                        </Link>
            			{this.props.navInvitsBox && 
                            <div className="tabnav-box-ctnr">
                				<div id="invit_nv_arraw" className="invit-nv-arraw note-opn"></div>
                                <div className="invit-nv-ct note-opn" id="invit_nv_ct">
                                	<div className="tabnav-box-hd">
                                    	<div className="invit-nv-ttl" id="invit-nv-ttl">Demands</div>
                                    </div>
                                    <div id="invit_nv_bd" className="invit-nv-bd"><ul id="invit_nv_ul" className="invit-nv-ul"></ul></div>
                                </div>
                		    </div>
                        }
                    </div>
                </div>
    		)
    	}
    }), clickOutsideConfig
)

export default InvitationBox;