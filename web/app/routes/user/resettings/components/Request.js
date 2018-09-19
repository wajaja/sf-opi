import React 				from 'react'
import { findDOMNode } 		from 'react-dom'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'
import { Helmet }           from "react-helmet";
import  axios               from 'axios';       
import { Link, withRouter } from 'react-router-dom'
import { BASE_PATH }        from '../../../../config/api'
import { TextFieldGroup, } from '../../../../components';

const regex  = {
    email: /^[a-z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/,
    name: /^[a-zA-Z]+$/
}


const Request  = createReactClass( {

	getInitialState() {
		return {
            submitting: false,
            errors: {},
		}
	},

    onTextChange(e) {
        //Set daysOfMonth by selected month
        let val = e.target.value,
        name = e.target.name;
        this.setState({name: val });
    },

    onBlur(e) {
        let name = e.target.name,
        type     = e.target.type,
        value    = e.target.value,
        errors   = this.state.errors,
        { trans }= this.props.resettingData;

        if(regex.email.test(value)) {
            errors['wrapper'][name] = "";
            delete errors['email'];
            //check email 
            axios.get(`http://opinion.com/app_dev.php/api/check_email?email=${value}`)
                .then(function(res){
                    var status = res.data.status;
                    console.log(typeof status, status)
                    if(status) {
                        errors['wrapper'][name] = trans[(name + '_already_used')];
                        console.log(data);
                        errors['email'] = true;
                    }
            });
        } else {
            // r.email.wrapper.text(r.email.message.invalid);
            errors['email'] = true;
        }
    },

    onSubmit(e) {
        //console.log(this.state);
        e.preventDefault();
        if(Object.keys(this.state.errors).length) {
            //JSON stringify
            alert(errors);
            return;
        }
        this.setState({submitting: true})

        const { dispatch, history, action } = this.props,
        resetting = {
            resetting: {
                email: this.state.email
            }
        }
        axios.post( BASE_PATH + '/' + action, resetting).then(
            res => {
                const data = res.data;
                if(data.success) {
                    this.setState({submitting: false})
                    // dispatch(UserActions.setUser(data.user));
                    // dispatch(TranslatorActions.setAuth(true));
                    // dispatch(TranslatorActions.setToken(data.token));
                    history.push('/resetting/reset');
                } else {
                    // throw new SubmissionError(data.message);
                    console.log("errrrrr")
                }
                // dispatch(setCurrentUser(jwtDecode(token)));
            },
            err => {
                // throw new SubmissionError(err)
                console.log(err)
        })
    },

	render() {
		const { submitting, errors } = this.state,
        { resettingData, user } = this.props,
		{ action, trans, invalid_username} = resettingData

		return (
			<div className="hm-container resetting">
                <div id="sttg_main_blk" className="sttg-main-blk">
                    <div className="sect-frm-ctnr reset-req">
                        <form 
                            method="post" 
                            name="resetting"
                            action={`${BASE_PATH}/${action}`} 
                            className="op_user_resetting_request">
                            <div className="wrp-req-tp">
                                {!!invalid_username && <p>{trans.invalid_username}</p> }
                                <label for="username">{trans.username}</label>
                                <TextFieldGroup
                                    label= ""
                                    errors={errors}
                                    hasPreviousSession
                                    wrapClassName="fld-wrp email"
                                    onChange= {this.onTextChange}
                                    onBlur={this.onBlur}
                                    value={this.state.email}
                                    field="email"
                                    name="resetting[email]"
                                    placeholder="Email"
                                    customClassName="in-reset-pwd"/>
                            </div>
                            <div className="wrp-req-btm">
                                <div className="lft">
                                    <a href="http://opinion.com/app_dev.php/login" className="psw-fgt">Go to login page</a>
                                </div>
                                <div className="rght">
                                    <button type="submit" className="btn btn-primary" disabled={submitting} >{trans.submit}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
		)
	}
})

//////
export default  withRouter(connect(state =>({
	user: state.User.user,
    resettingData: state.Resetting
}), null)(Request))