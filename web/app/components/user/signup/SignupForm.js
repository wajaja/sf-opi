import React                    from 'react'
import createReactClass         from 'create-react-class'
import PropTypes                from 'prop-types'
import map                      from 'lodash/map'
import classnames               from 'classnames'

import {
    TextFieldGroup, 
    SelectedFieldGroup 
}                               from '../../../components';
import validateInput            from '../../../validations/user/signup';

const SignupForm  = createReactClass( {
    getInitialState() {
        return {
            email: '',
            password: '',
            firstname: '',
            lastname : '',
            gender : '',
            birthday : {},
            passwordConfirmation: '',
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
            errors: {},
            isLoading: false,
            invalid: false
        }
    },

    onTextChange(e) {
        //Set daysOfMonth by selected month
        this.setState({ [e.target.name]: e.target.value });
    },

    handleGenderChange(e) {
        this.setState({
            gender : e.target.value
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
        e.preventDefault();
        //console.log(this.state);
        if (this.isValid()) {
            this.setState({ errors: {}, isLoading: true });
            this.props.userSignupRequest(this.state).then(
                (data) => {
              // this.props.addFlashMessage({
              //   type: 'success',
              //   text: 'You signed up successfully. Welcome!'
              // });
            }, (err) => this.setState({ errors: err.response.data, isLoading: false })
            );
        }
    },

    render() {
        const { errors } = this.state;
        return (
          <section className="h-sign-sect">
            <span className="sign-ttl">Sign Up</span>
            <form onSubmit={this.onSubmit} className="signup-form">
              <TextFieldGroup
                error={errors.firstname}
                label=""
                onChange={this.onTextChange}
                value={this.state.firstname}
                field= "firstname"
                placeholder="Firstname"
                customClassName="form-registration-firstname in-sign-up"
              />
              <TextFieldGroup
                error={errors.lastname}
                label=""
                onChange={this.onTextChange}
                value={this.state.lastname}
                field="lastname"
                placeholder="Lastname"
                customClassName="form-registration-lastname in-sign-up"
              />
              <TextFieldGroup
                error={errors.email}
                label= ""
                onChange= {this.onTextChange}
                value= {this.state.email}
                field="email"
                placeholder="Email"
                customClassName="form-registration-email in-sign-up"
              />

              <TextFieldGroup
                error={errors.password}
                label= ""
                onChange= {this.onTextChange}
                value= {this.state.password}
                field="password"
                placeholder="Email"
                customClassName = "password in-sign-up"
                type="password"
              />
              <TextFieldGroup
                error={errors.passwordConfirmation}
                label= ""
                onChange= {this.onTextChange}
                value= {this.state.passwordConfirmation}
                field="passwordConfirmation"
                placeholder="repeat password"
                customClassName="password in-sign-up"
                type="password"
              />

              <div className={classnames("form-group", { 'has-error': errors.timezone })}>
                <label className="control-label">Birthday</label>
                <SelectedFieldGroup
                  error={errors.month}
                  onChange={this.handleSelectedChange}
                  value= {this.state.month}
                  field="month"
                  begin= {this.state.begin.month} 
                  end= {this.state.end.month}
                  customClassName="month in-sign-up"
                />            
                <SelectedFieldGroup
                  error={errors.day}
                  onChange={this.handleSelectedChange}
                  value={this.state.day}
                  field="day"
                  begin={this.state.begin.day}
                  end={this.state.end.day}
                  customClassName="day in-sign-up"
                />            
                <SelectedFieldGroup
                  error           = {errors.year}
                  onChange        = {this.handleSelectedChange}
                  value           = {this.state.year}
                  field           ="year"
                  begin           = {this.state.begin.year}
                  end             = {this.state.end.year}
                  customClassName ="year in-sign-up"
                />
              </div>
              <div className="form-registration-gender">
                <label>
                  <input 
                    type="radio"
                    value="m"
                    checked={this.state.gender === 'm'}
                    onChange = {this.handleGenderChange}
                  />
                  Male
                </label>
                <label>
                  <input 
                    type="radio"
                    value="f"
                    checked={this.state.gender === 'f'}
                    onChange = {this.handleGenderChange}
                  />
                  Female
                </label>
              </div>
              <div className="form-group">
                <button disabled={this.state.isLoading || this.state.invalid} className="form-registration-submit">
                  Sign up
                </button>
              </div>
            </form>
          </section>
        );
    }
})

SignupForm.propTypes = {
  userSignupRequest: PropTypes.func.isRequired,
  // addFlashMessage: PropTypes.func.isRequired,
  isUserExists: PropTypes.func.isRequired
}

SignupForm.contextTypes = {
  router: PropTypes.object.isRequired
}

export default SignupForm;
