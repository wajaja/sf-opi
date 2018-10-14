import React             from 'react'
import createReactClass  from 'create-react-class'
import PropTypes         from 'prop-types'
import map               from 'lodash/map'
import classnames        from 'classnames'
import { connect }       from 'react-redux'
const zxcvbn        = require('zxcvbn')

import {
    TextFieldGroup, 
    SelectedFieldGroup 
}                        from '../../../components';
import validateInput     from '../../../validations/user/signup';
import { BASE_PATH }     from '../../../config/api'

import '../../../styles/user/register.scss'

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


const SignupForm  = createReactClass( {
    getInitialState() {
        return {
            birthday : {},
            begin : {
                day : 1,
                month : 1,
                year : 1900
            },
            end : {
                day : 31,
                month : 12,
                year : 2017
            },
            year : 1900,
            month: 1,
            day  : 1,     
            wrapper: {
                "registration[email]": '',
                "registration[gender]": '',
                "registration[lastname]": '',
                "registration[firstname]": '',
                "registration[plainPassword][first]": '',
                "registration[plainPassword][second]": ''
            },
            errors: {
                "registration[firstname]": true
            },
            isLoading: false,
            invalid: false,
            "registration[email]": '',
            "registration[gender]": '',
            "registration[lastname]": '',
            "registration[firstname]": '',
            "registration[plainPassword][first]": '',
            "registration[plainPassword][second]": '',
        }
    },

    onTextChange(e) {
        //Set daysOfMonth by selected month
        let val = e.target.value,
        name    = e.target.name,
        { errors, wrapper }  = this.state,
        { trans }= this.props.signupData;
        this.setState({[e.target.name]: val});

        console.log(name);

        if(name == 'registration[plainPassword][first]') {
            let result  = zxcvbn(val);
            
            // Update the text indicator
            if(val !== "") {
                initial_strength = password_strength[result.score];
                wrapper[name] = trans[(name + '_' + initial_strength)] || initial_strength;
            } else {
                wrapper[name] = '';
            }


            if(initial_strength = 'Worst' || initial_strength === 'Bad')
                errors['registration[plainPassword][first]'] = true;
            else
                delete errors['registration[plainPassword][first]'];
        }
    },

    onBlur(e) {
        let name = e.target.name,
        type     = e.target.type,
        value    = e.target.value,
        {errors, wrapper }   = this.state,
        { trans }= this.props.signupData;

        if(!value.length) {
            wrapper[name] = trans[(name + '_blank')];
            errors[name] = true;

        } else if(value.length < 3) {
            wrapper[name] = trans[(name + '_short')];
            errors[name] = true;

        } else if(value.length > 40) {
            wrapper[name] = trans[(name + '_long')];
            errors[name] = true;

        } else {
            if(name === 'registration[email]') {
                if(regex.email.test(value)) {
                    wrapper[name] = "";
                    delete errors[name];
                    //check email 
                    axios.get(`http://opinion.com/app_dev.php/api/check_email?email=${value}`)
                        .then(function(res){
                            var status = res.data.status;
                            console.log(typeof status, status)
                            if(status) {
                                wrapper[name] = trans[(name + '_already_used')];
                                console.log(data);
                                errors[name] = true;
                            }
                    });
                } else {
                    wrapper[name] = 'email invalid';
                    errors[name] = true;
                } 

            } 
            else if(name === 'registration[plainPassword][first]'){
                let result  = zxcvbn(val);
                initial_strength = password_strength[result.score];

                if(initial_strength === 'Worst') {
                    wrapper[name] = trans[(name + '_Worst')] || 'Worst';
                }
                else if(initial_strength === 'Bad') {
                    wrapper[name] = trans[(name + '_bad')] || 'bad';
                }
                else {
                    wrapper[name] = '';
                    delete errors[name];
                }

                if(this.state['registration[plainPassword][second]'] !== "") {
                    let second   = this.state['registration[plainPassword][second]'];

                    if(value !== second) {
                        wrapper['registration[plainPassword][second]'] = trans.password_mismatch;
                        errors['registration[plainPassword][second]'] = true;
                    } else {
                        wrapper['registration[plainPassword][second]'] = '';
                        delete errors['registration[plainPassword][second]'];
                    }
                }
            } 
            else if(name === 'registration[plainPassword][second]'){
                wrapper['registration[plainPassword][second]'] = '';
                let first   = this.state['registration[plainPassword][second]']

                if(first !== value) {
                    console.log(first, value);
                    wrapper['registration[plainPassword][second]'] = trans.password_mismatch;
                    errors['registration[plainPassword][second]'] = true;
                } else {
                    wrapper['registration[plainPassword][second]'] = '';
                    delete errors['registration[plainPassword][second]'];
                }
            } 
            else {
                if(regex.name.test(value)) {
                    wrapper[name] = "";
                    delete errors[name];
                } else {
                    wrapper[name] = 'invalid';
                    errors[name] = true;
                }
            }
        }
        this.setState({
            errors: errors,
            wrapper: wrapper
        });
    },

    handleGenderChange(e) {
        this.setState({
            "registration[gender]" : e.target.value
        })
    },

    handleSelectedChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    },

    isValid() {
        const { errors, isValid } = validateInput(this.state);

        if (!isValid) {
            this.setState({ errors });
        }

        return isValid;
    },

    checkUserExists(e) {
        const field = e.target.name;
        const val = e.target.value;
        if (val !== '') {
            this.props.isUserExists(val).then(res => {
                let errors = this.state.errors;
                let invalid;
                if (res.data.user) {
                    errors[field] = 'There is user with such ' + field;
                    invalid = true;
                } else {
                    errors[field] = '';
                    invalid = false;
                }
                this.setState({ errors, invalid });
            });
        }
    },

    onSubmit(e) {
        //console.log(this.state);
        if(Object.keys(this.state.errors).length) {
            e.preventDefault();
            //JSON stringify
            this.setState(this.state)
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

    render() {
        const { errors } = this.state,
        { form, signupData } = this.props,
        { csrf_token, server_error, action, flashBag, hasPreviousSession } = this.props.signupData
        return (
            <section className="h-sign-sect">
                <div className="sign-ttl">Sign Up</div>
                <form 
                    name="registration"
                    action={`${BASE_PATH}/${action}`} 
                    method="post" onSubmit={this.onSubmit} 
                    className="signup-form">
                    <TextFieldGroup
                        label=""
                        errors={errors}
                        onChange={this.onTextChange}
                        onBlur={this.onBlur}
                        value={this.state['registration[firstname]']}
                        wrapClassName="fld-wrp firstname"
                        name="registration[firstname]"
                        field="firstname"
                        hasPreviousSession
                        placeholder="Firstname"
                        wrapper={this.state.wrapper}
                        customClassName="form-registration-firstname in-sign-up"/>
                    <TextFieldGroup
                        label=""
                        errors={errors}
                        hasPreviousSession
                        onChange={this.onTextChange}
                        onBlur={this.onBlur}
                        wrapClassName="fld-wrp lastname"
                        value={this.state['registration[lastname]']}
                        name="registration[lastname]"
                        field="lastname"
                        placeholder="Lastname"
                        wrapper={this.state.wrapper}
                        customClassName="form-registration-lastname in-sign-up" />
                    <TextFieldGroup
                        label= ""
                        errors={errors}
                        hasPreviousSession
                        wrapClassName="fld-wrp email"
                        onChange= {this.onTextChange}
                        onBlur={this.onBlur}
                        value={this.state["registration[email]"]}
                        field="email"
                        name="registration[email]"
                        wrapper={this.state.wrapper}
                        placeholder="Email"
                        customClassName="form-registration-email in-sign-up"/>
                    <TextFieldGroup
                        label= ""
                        errors={errors}
                        hasPreviousSession
                        wrapClassName="fld-wrp pwd-first"
                        onChange= {this.onTextChange}
                        onBlur={this.onBlur}
                        wrapper={this.state.wrapper}
                        field="first"
                        value={this.state['registration[plainPassword][first]']}
                        name="registration[plainPassword][first]"
                        placeholder="Email"
                        customClassName = "password in-sign-up"
                        type="password"/>
                    <TextFieldGroup
                        label= ""
                        errors={errors}
                        hasPreviousSession
                        wrapClassName="fld-wrp pwd-second"
                        onChange= {this.onTextChange}
                        onBlur={this.onBlur}
                        wrapper={this.state.wrapper}
                        value= {this.state['registration[plainPassword][second]']}
                        name="registration[plainPassword][second]"
                        field="second"
                        placeholder="repeat password"
                        customClassName="password in-sign-up"
                        type="password"/>
                    <div className="fld-wrp gender">
                        <div id="registration_gender" className="form-registration-gender">
                            <input 
                                type="radio"
                                value="Male"
                                id="registration_gender_0"
                                name="registration[gender]"
                                checked={this.state["registration[gender]"] === 'Male'}
                                onChange={this.handleGenderChange} />
                            <label htmlFor="registration_gender_0">Male</label>
                            <input 
                                type="radio"
                                value="Female"
                                id="registration_gender_1"
                                onBlur={this.onBlur}
                                name="registration[gender]"
                                checked={this.state["registration[gender]"] === 'Female'}
                                onChange = {this.handleGenderChange}/>
                            <label htmlFor="registration_gender_1">Female</label>
                        </div>
                    </div>
                    <div className="in-sign-up-btm">
                        <button disabled={this.state.isLoading || this.state.invalid} className="form-registration-submit">
                            Sign up
                        </button>
                    </div>
                </form>
            </section>
        );
    }
})

const mapStateToProps = (state) => {
    return {
        isAuthenticated : state.Auth.isAuthenticated,
        signupData: state.Signup
    }
}

export default connect(mapStateToProps, null)(SignupForm);


// <SelectedFieldGroup
//   error={errors.month}
//   onChange={this.handleSelectedChange}
//   value= {this.state.month}
//   name="month"
//   hasPreviousSession
//   begin= {this.state.begin.month} 
//   end= {this.state.end.month}
//   customClassName="month in-sign-up"
// />            
// <SelectedFieldGroup
//   error={errors.day}
//   onChange={this.handleSelectedChange}
//   value={this.state.day}
//   name="day"
//   hasPreviousSession
//   begin={this.state.begin.day}
//   end={this.state.end.day}
//   customClassName="day in-sign-up"
// />            
// <SelectedFieldGroup
//   error     = {errors.year}
//   onChange  = {this.handleSelectedChange}
//   value     = {this.state.year}
//   onBlur  = {this.onBlur}
//   field     ="year"
//   begin     = {this.state.begin.year}
//   end       = {this.state.end.year}
//   customClassName ="year in-sign-up"
// />