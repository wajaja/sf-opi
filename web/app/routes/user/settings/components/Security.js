import React            from 'react'
import createReactClass from 'create-react-class'
import { withRouter }   from 'react-router-dom'
import { connect }      from 'react-redux'
const  zxcvbn = require('zxcvbn');
import {
    PasswordResetForm
}                       from '../../../../components'


///////////
//////////
const Security = createReactClass({

    getInitialState() {
        return {
            newMsg: '', 
            currentMsg: '',
            confirmMsg: '',
            initial_strength: 'Worst',
        }
    },

    componentWillReceiveProps(nextProps) {
        if(this.props.passwordResetForm) {
            const thisVal = this.props.passwordResetForm.values,
            nextVal       = nextProps.passwordResetForm.values;

            if(thisVal && (thisVal.new_password !== nextVal.new_password) && nextVal.new_password) {
                this.setState({
                    newMsg: zxcvbn(nextVal.new_password).score
                })
            }

            if(thisVal && (thisVal.new_password_confirmation !== nextVal.new_password_confirmation)) {
                if(thisVal.new_password !== nextVal.new_password_confirmation)
                    this.setState({ confirmMsg: 'mismatch'})
                else
                    this.setState({ confirmMsg: ''})
            }

            if(thisVal && (thisVal.current_password !== nextVal.current_password)) {
                
            }
        }

        //handle server side errors
        if(nextProps.security && nextProps.security.errors && this.props.errors !== nextProps.errors) {
            this.setState({
                newMsg: nextProps.errors.new_password.toString(), 
                currentMsg: nextProps.errors.current_password.toString(),
                confirmMsg: nextProps.errors.new_password_confirmation.toString(),
            })
        }
    },

    onSubmitPassword(e) {
        e.preventDefault();
        console.log('passwordResetForm submitted')
        const { passwordResetForm } = this.props,
        values  = passwordResetForm.values,
        { newMsg, currentMsg, confirmMsg, initial_strength } = this.state;

        if(typeof values === 'object' && !values.current_password)
            return;
        if(newMsg === 1 || confirmMsg === "mismatch") 
            return;

        const data = {
            current_password: values.current_password,
            plainPassword: {
                first: values.new_password,
                second: values.new_password_confirmation
            }
        }

        this.props.submitPassword(data);
    },

    render() {
        const { user, loadData }  = this.props,
        { newMsg, currentMsg, confirmMsg } = this.state;

        if(loadData) {
            return(
                <div className="op-load-dta-pg"></div>
            )
        }
        /////
        return(
            <div className="sttg-center-cmp-ctnr">
                <div className="sttg-center-cmp-ctnr-a">
                    <div style={{display: 'none'}} className="secur-ctnr-tp setting-bd-tag">
                        <div className="secur-ctnr-lft">
                            <div className="secur-ctnr-lft-a">
                                
                            </div>
                        </div>
                        <div className="secur-ctnr-rght">
                            <div className="secur-ctnr-rght-a">
                                <div className="secur-ctnr-opt">
                                    <div className="secur-ky"></div>
                                    <div className="secur-val">
                                        
                                    </div>
                                </div>
                                <div className="secur-ctnr-opt">
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="secur-ctnr-bd setting-bd-tag">
                        <div className="secur-ctnr">
                            <div className="secur-ctnr-lft">
                            </div>
                            <div className="secur-ctnr-rght">
                                <PasswordResetForm 
                                    {...this.props}
                                    newMsg={newMsg}
                                    currentMsg={currentMsg}
                                    confirmMsg={confirmMsg}
                                    onSubmit={this.onSubmitPassword}
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
    loadData: state.User.setting.loadData,
    security: state.User.setting.security,
    passwordResetForm: state.form.PasswordResetForm,
}))(Security))