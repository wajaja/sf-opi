import React            from 'react'
import createReactClass from 'create-react-class'
import { connect }      from 'react-redux'
import { withRouter }   from 'react-router-dom'
import {
    PhoneForm 
}                       from '../../../../components'
import { 
    HeadContainer, FormContainer 
}                       from '../components'

const Contact = createReactClass({

    getInitialState() {
        return {
            submitting: false,
        }
    },

    componentWillReceiveProps(nextProps) {
        if(this.props.tag !== nextProps.tab) {
            console.log('data tab changed');
        }
    },

    onSubmitPhone(value) {
        const data = {
            contact: {
                phone: phone
            }  
        };
        this.props.submitPhone(data);
        // console.log('contact receive data from form ')
    },

    render() {
        const { user, contact, loadData }  = this.props
        if(loadData) {
            return(
                <div className="op-load-dta-pg"></div>
            )
        }

        return(
            <div className="sttg-center-cmp-ctnr">
                <div className="sttg-center-cmp-ctnr-a">
                    <div className="ctact-ctnr-tp setting-tp-tag">
                        <div className="ctact-ctnr-lft">
                            <div className="ctact-ctnr-lft-a">
                                contacts
                            </div>
                        </div>
                        <div className="ctact-ctnr-rght">
                            <div className="ctact-ctnr-rght-a">
                                
                                <div className="ctact-ctnr-opt">
                                    <div className="ctact-ky">phone</div>
                                    {typeof contact === 'object' && contact.phone &&
                                        <div className="ctact-val">
                                            {contact.phone ? `${contact.phone}`: `__`}
                                        </div>
                                    }
                                </div>
                                <div className="ctact-ctnr-opt">
                                    <div className="ctact-ky">other email</div>
                                    {typeof user.contact === 'object' && contact.second_email &&
                                        <div className="ctact-val">
                                            {contact.second_email ? `${contact.second_email}`: `__`}
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ctact-ctnr-bd setting-bd-tag">
                        <div className="ctact-ctnr">
                            <div className="ctact-ctnr-lft">
                                Contact Form
                            </div>
                            <div className="ctact-ctnr-rght">
                                <PhoneForm 
                                    {...this.props}
                                    submitting={this.state.submitting}
                                    handleSubmit={this.onSubmitPhone}
                                    handleAbord={this.onAbordPhone}
                                    />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})

export default withRouter(connect(state => ({
    contact: state.User.user.contact,
    loadData: state.User.setting.loadData
}))(Contact))