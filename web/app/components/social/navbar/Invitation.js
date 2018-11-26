import React                from 'react'
import createReactClass     from 'create-react-class'
import {
    Route, IndexRoute, 
    Link, IndexLink 
}                           from 'react-router-dom';
import { connect }          from 'react-redux';
import onClickOutside           from 'react-onclickoutside'
import { 
    Invitation as InvitationActions, 
}                           from '../../../actions'
import { bindActionCreators } from 'redux' 
import { InvitationBox as Box }     from '../../../components'

const clickOutsideConfig = {
    excludeScrollbar: true
};

const Invitation  = onClickOutside(
    createReactClass({

        //method from 'react-onclickoutside' module
        handleClickOutside(e) {
            this.props.toggleNavInvits(false)
        },

    	componentDidMount() {
            if(!this.props.invitations.length) {
                const page = 1;
                this.props.loadInvitations(page);
            }
    	},

    	render() {
            const { invitations } = this.props
    		return (
                 
                <div className="tabnav-box-ctnr">
    				<div id="invit_nv_arraw" className="invit-nv-arraw note-opn"></div>
                    <div className="invit-nv-ct note-opn" id="invit_nv_ct">
                    	<div className="tabnav-box-hd">
                        	<div className="invit-nv-ttl" id="invit-nv-ttl">Demands</div>
                        </div>
                        <div id="invit_nv_bd" className="invit-nv-bd">
                            <ul id="invit_nv_ul" className="invit-nv-ul">
                                {!!invitations && invitations.map((inv, i) => {
                                    return(
                                        <div key={i}  className="inv-nv-box">
                                            <Box
                                                user={this.props.user}
                                                invitation={inv} 
                                                dispatch={this.props.dispatch}
                                                onFriendConfirm={this.props.confirm}
                                                onDeleteInvitation={this.props.deleteInvitation}
                                                /> 
                                        </div>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
    		    </div>
    		)
    	}
    }), clickOutsideConfig
)

////////
function mapDispatchToProps(dispatch) {
    return bindActionCreators(InvitationActions, dispatch)
}

export default connect(state => ({
    user:   state.User.user,
    invitations: state.RelationShip.invitations,
    suggestions: state.RelationShip.suggestions
}), mapDispatchToProps)(Invitation);