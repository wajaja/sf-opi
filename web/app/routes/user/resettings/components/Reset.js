import React 				from 'react'
import { findDOMNode } 		from 'react-dom'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'
import { Helmet }           from "react-helmet";
import { Link, withRouter } from 'react-router-dom'
import { BASE_PATH }        from '../../../../config/api'
const zxcvbn                = require('zxcvbn')

import { TextFieldGroup }  from  '../../../../components';

const regex  = {
    email: /^[a-z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/,
    name: /^[a-zA-Z]+$/
},
password_strength = {
    0: "Worst",
    1: "Bad",
    2: "Weak",
    3: "Good",
    4: "Strong"
};
var initial_strength = 'Worst';


const Reset  = createReactClass( {

	getInitialState() {
		return {
			errors: {}
		}
	},

    onTextChange(e) {
        //Set daysOfMonth by selected month
        let val = e.target.value,
        name = e.target.name;
        this.setState({name: val });

        if(name == 'resetting[plainPassword][first]') {
            let result  = zxcvbn(val);
            
            // Update the text indicator
            if(val !== "") {
                initial_strength = password_strength[result.score];
                errors.wrapper[name] = trans[(name + '_' + initial_strength)] || initial_strength;
            } else {
                errors.wrapper[name] = '';
            }


            if(initial_strength = 'Worst' || initial_strength === 'Bad')
                errors['plainPassword_first'] = true;
            else
                delete errors['plainPassword_first'];
        }
    },

    onBlur(e) {
        let name = e.target.name,
        type     = e.target.type,
        value    = e.target.value,
        errors   = this.state.errors,
        { trans }= this.props.resetData;


        if(name === 'resetting[plainPassword][first]'){
            let result  = zxcvbn(value);
            initial_strength = password_strength[result.score];

            if(initial_strength === 'Worst') {
                errors['wrapper'][name] = trans[(name + '_Worst')] || 'Worst';
            }
            else if(initial_strength === 'Bad') {
                errors['wrapper'][name] = trans[(name + '_bad')] || 'bad';
            }
            else {
                errors['wrapper'][name] = '';
                delete errors['plainPassword_first'];
            }

            if(this.state['resetting[plainPassword][second]'] !== "") {
                let second   = this.state['resetting[plainPassword][second]'];

                if(value !== second) {
                    errors.wrapper['resetting[plainPassword][second]'] = trans.password_mismatch;
                    errors['resetting[plainPassword][second]'] = true;
                } else {
                    errors.wrapper['resetting[plainPassword][second]'] = '';
                    delete errors['resetting[plainPassword][second]'];
                }
            }
        } 

        else if(name === 'resetting[plainPassword][second]'){
            errors.wrapper['resetting[plainPassword][second]'] = '';
            let first   = this.state['resetting[plainPassword][second]']

            if(first !== value) {
                console.log(first, value);
                errors.wrapper['resetting[plainPassword][second]'] = trans.password_mismatch;
                errors['resetting[plainPassword][second]'] = true;
            } else {
                errors.wrapper['resetting[plainPassword][second]'] = '';
                delete errors['resetting[plainPassword][second]'];
            }
        }
    },
    
    onSubmit(e) {
        //console.log(this.state);
        if(Object.keys(this.state.errors).length) {
            e.preventDefault();
            //JSON stringify
            alert(errors);
        }
        // if (!this.isValid()) {
        //     e.preventDefault();
        //     this.setState({ errors: {}, isLoading: true });
        //     this.props.userSignupRequest(this.state).then(
        //         (data) => {
        //       // this.props.addFlashMessage({
        //       //   type: 'success',
        //       //   text: 'You signed up successfully. Welcome!'
        //       // });
        //     }, (err) => this.setState({ errors: err.response.data, isLoading: false })
        //     );
        // }
    },

    // shouldComponentUpdate(nextProps) {
    //     return this.props.location !== nextProps.location
    // },

	render() {
		const { screenWidth, } = this.state,
		{ dispatch, user, resettingData } = this.props,
        { server_error, action, trans, flashBag, hasPreviousSession } = resettingData
		return (
			<div className="hm-container setting">
                <div className="sttg-main-blk">
                    <div className="sect-frm-ctnr reset-req">
                        <form 
                            method="post" 
                            action={`${BASE_PATH}/api/resetting/reset/${token}`} 
                            className="op_user_resetting_reset">
                            <div className="wrp-ct">
                                <TextFieldGroup
                                    label={trans.new_password}
                                    errors={errors}
                                    hasPreviousSession
                                    wrapClassName="fld-wrp pwd-first"
                                    onChange= {this.onTextChange}
                                    onBlur={this.onBlur}
                                    field="first"
                                    value={this.state['resetting[plainPassword][first]']}
                                    name="resetting[plainPassword][first]"
                                    placeholder="Email"
                                    customClassName = "password in-reset"
                                    type="password"/>
                                <TextFieldGroup
                                    label={trans.new_password_confirmation}
                                    errors={errors}
                                    hasPreviousSession
                                    wrapClassName="fld-wrp pwd-second"
                                    onChange= {this.onTextChange}
                                    onBlur={this.onBlur}
                                    value= {this.state['resetting[plainPassword][second]']}
                                    name="resetting[plainPassword][second]"
                                    field="second"
                                    placeholder="repeat password"
                                    customClassName="password in-reset"
                                    type="password"/>
                            </div>
                            <div>
                                <input type="submit" value={trans.reset_submit} />
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
}), null)(Reset))