import React            from 'react'
import createReactClass from 'create-react-class'
import { withRouter }   from 'react-router-dom'
import { connect }      from 'react-redux'
import Toggle           from 'react-toggle'
import { AdressForm }   from '../../../../components'
import { 
    HeadContainer, FormContainer 
}                       from '../components'

import '../../../../styles/lib/react-toggle/style.css'

const Notification = createReactClass({

    getInitialState() {

        const notification = this.props.notification
        return {
            emailNotification: notification ?  notification.email : false,
            submitting: false,
        }
    },

    componentWillReceiveProps(nextProps) {
        if(this.props.tag !== nextProps.tab) {
            console.log('data tab changed');
        }
    },

    handleEmailNotification(e) {
        e.preventDefault();
        const self = this;
        this.setState({ emailNotification: !self.state.emailNotification });
        const data = {
            notification: {
                email: !self.state.emailNotification
            }  
        };
        this.props.setNotifByEmail(data);
    },

    render() {
        const { notification, loadData  }  = this.props
        if(loadData) {
            return(
                <div className="op-load-dta-pg"></div>
            )
        }

        ///////
        return(
            <div className="sttg-center-cmp-ctnr">
                <div className="sttg-center-cmp-ctnr-a">
                    <div className="ntf-ctnr setting-tp-tag">
                        <div className="ntf-ctnr-lft">
                            <div className="ntf-ctnr-lft-a">
                                Notification
                            </div>
                        </div>
                        <div className="ntf-ctnr-rght">
                            <div className="ntf-ctnr-rght-a">
                                <div className="ntf-ctnr-opt">
                                    <div className="ntf-ky">receive notifications via email</div>
                                    <div className="ntf-val">
                                        <Toggle
                                            id='note-email-status'
                                            checked={this.state.emailNotification}
                                            onChange={this.handleEmailNotification} 
                                            />
                                        {notification && notification.email}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})

export default withRouter(connect(state => ({
    notification: state.User.setting.notification,
    loadData: state.User.setting.loadData,
}))(Notification))