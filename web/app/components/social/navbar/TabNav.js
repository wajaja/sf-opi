import React                    from 'react'
import createReactClass         from 'create-react-class'
import ReactDOM                 from 'react-dom'
import { connect }              from 'react-redux'
import { Link }                 from 'react-router-dom'
import * as axios               from 'axios'
import { BASE_PATH }            from '../../../config/api'
import PropTypes                from 'prop-types'

import MessageBox               from './MessageBox'
import NotificationBox          from './NotificationBox'
import Invitation               from './Invitation'

import { 
    App as AppActions,
    Notification as NotificationActions,
    Message as MessageActions,
    Invitation as InvitationActions 
 }                              from '../../../actions'

import '../../../styles/social/tab-nav.scss'


//////
//////
const _Tabs  = createReactClass({
    getInitialState() {
        return {
            unread: false,
            active: false,
            currentTab: ''
        }
    },

    handleClick(tab) {
        this.props.changeTab(tab);
    },

    toggleNavMessage(e) {
        e.preventDefault();
        this.props.toggleNavMessage();
    },

    toggleNavInvits(e){
        e.preventDefault()
        this.props.toggleNavInvits();
    },

    toggleNavNotifs(e) {
        e.preventDefault();
        this.props.toggleNavNotifs()
    },

    componentDidUpdate(oldProps) {
        // if(this.props.currentTab != oldProps.currentTab) {
        //     this.setState({currentTab: this.props.currentTab})
        // }
        // if(this.props.active != oldProps.active) {
        //     this.setState({active: this.props.active})
        // }
        // if(this.props.unseenMessages != oldProps.unseenMessages) {

        // }
    },

    render(){
        return (
            <div className="tabs-ctnr">
                <div className="tabs-ctnr-a">  

                    <div className="dv-tabnav-ct" id='tabnav_msg' >
                        <div className={this.props.navMessageBox ? 'currentTab' : ''}>
                            <span className="unseenMessages"></span>
                            <Link
                                to="/messages"
                                onClick={this.toggleNavMessage}
                                className={this.props.navMessageBox ? `active link-message` : `link-message`}>
                            </Link>         
                            {this.props.navMessageBox && 
                                <MessageBox 
                                    {...this.props}
                                    toggleNavMessage={this.props.toggleNavMessage}
                                    />
                            }
                        </div>
                    </div>
                
                    <div className="dv-tabnav-ct" id='tabnav_invit' >
                        <div className={this.props.navInvitsBox ? 'currentTab' : ''}>
                            <span className="unseenInvitations"></span>
                            <Link 
                                to="/invitations/"
                                onClick={this.toggleNavInvits}
                                className={this.props.navInvitsBox ? `active invit-nv-lk` : `invit-nv-lk`}>
                            </Link>
                            {this.props.navInvitsBox &&
                                <Invitation 
                                    {...this.props}
                                    toggleNavInvits={this.props.toggleNavInvits}
                                    />
                            }
                        </div>
                    </div>

                    <div className="dv-tabnav-ct" id='tabnav_nt' >
                        <div className={this.props.navNotifsBox ? 'currentTab' : ''}>
                            <span className="unseenNotifications"></span>
                            <Link
                                to="/notifications/"
                                onClick={this.toggleNavNotifs}
                                className={this.props.navNotifsBox ? `active nt-nv-a-lk` : `nt-nv-a-lk`}>
                            </Link>
                            {this.props.navNotifsBox &&
                                <NotificationBox 
                                    {...this.props}
                                    toggleNavNotifs={this.props.toggleNavNotifs}
                                    />
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
})

const Tabs = connect(state => ({
    active: state.App.tabnav,
    unseenMessages: state.Message.nbAlerts,
    unseenInvitations: state.Invitation.nbAlerts,
    unseenNotifications: state.Notification.nbAlerts
}))(_Tabs)

//////
/////////
const TabNav  = createReactClass({

    getInitialState() {
        return {
            currentTab: '',       //to null
            active : false
        }
    },

    //change tab Onclick and dispatch tabnav state
    changeTab(tab) {
        const { dispatch } = this.props;
        dispatch(AppActions.tabnav(true));       //set to true App.tabnav redux's state

        this.setState({ 
            currentTab: tab.name,
            active : this.context.store.getState().App.tabnav
        });

        if(tab.name === "Notifications") {
            dispatch(NotificationActions.seeingNotifications());
        }
        if(tab.name === "Invitations") {
            dispatch(InvitationActions.seeingInvitations());
        }

        if(tab.name === "Messages") {
            dispatch(MessageActions.seeingMessages());
        }     
    },

    //handleClick func Perform "outside tabnav click event"
    handleClick (e) {
        const { dispatch } = this.props;        
        if(ReactDOM.findDOMNode(this).contains(e.target)) {
        } else {
            dispatch(AppActions.tabnav(false))
            this.setState({active : this.props.tabnav});
        }
        // let component = ReactDOM.findDOMNode(this.refs.tabnav);
    },

    componentWillMount () {
        
    },

    componentWillUnmount () {
        document.removeEventListener('click', this.handleClick, false);
    },

    componentDidMount() {
        const { dispatch } = this.props;
        document.addEventListener('click', this.handleClick, false);
    },

    componentDidUpdate(oldProps) {
        if (this.props.stream != oldProps.stream) {
            this.setState({ unread: this.props.stream !== 0, })
        }
    },

    unseenInvitationsDone(data) {
        console.log('all data done')
    },

    render(){
        return(
            <div ref='tabnav' className="tab-nav-container">
                <Tabs
                    {...this.props}
                    unseenMessages={this.state.unseenMessages}
                    unseenInvitations={this.state.unseenInvitations}
                    unseenNotifications={this.state.unseenNotifications}
                    toggleNavNotifs={this.props.toggleNavNotifs}
                    toggleNavInvits={this.props.toggleNavInvits}
                    toggleNavMessage={this.props.toggleNavMessage}
                />     
            </div>
        );
    }
})

const mapStateToProps = (state => {
	return {
		stream : state.Stream,
        tabnav : state.App.tabnav
	}
})

export default connect(mapStateToProps)(TabNav)