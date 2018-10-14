import React                from 'react';
import createReactClass     from 'create-react-class'
import PropTypes            from 'prop-types';
import {Link, IndexLink }   from 'react-router-dom';
import { connect }          from 'react-redux';

import TextFielGroup        from '../commons/TextFieldGroup';
import validateInput        from '../../../validations/user/login';
import { Auth }             from '../../../actions';
import { BASE_PATH }        from '../../../config/api'

const login = Auth.login;

import '../../../styles/user/security.scss'

const InlineLoginForm  = createReactClass( {

  getInitialState(props) {
    return {
      username : "",
      password : "",
      errors   : {},
      wrapper  : {
        password: '',
        username: ''
      },
      isLoading : false 
    }
  },

  onChange(e) {
    e.preventDefault();
    this.setState ({ 
      [e.target.name] : e.target.value 
    });
  },

  isValid() {
      const { errors, isValid } = validateInput(this.state);

      if (!isValid) {
        this.setState({ errors });
      }
      return isValid;
   },

    onSubmit(e) {
        if (!this.isValid()) {
            e.preventDefault();
          // this.setState({ errors: {}, isLoading: true });
          // this.props.login(this.state)
          //     .then(
          //         (res) => this.context.router.push('/'),
          //         (err) => this.setState({ errors: err, isLoading: false })
          //     )
          // ;
        }
    },

	render() {
        const {username, password, errors, isLoading } = this.state,
        { csrf_token, server_error, action, hasPreviousSession } = this.props.loginData
		return (
  			<form 
            action={`${BASE_PATH}/${action}`} 
            method="post" 
            className="nav-fS-in" 
            onSubmit={this.onSubmit}>
                {!!server_error && <div className="s-error">{server_error.messageDat}</div>}
                <input type="hidden" name="_csrfToken" value={csrf_token} />
                <div className="nav-sign-in-ip-d">
                    <TextFielGroup
                        field="username"
                        label=""
                        name="username"
                        wrapper={this.state.wrapper}
                        hasPreviousSession
                        wrapClassName=""
                        placeholder="email or username"
                        customClassName="nav-inp-control"
                        value={username}
                        error={errors.username}
                        onChange={this.onChange}
                    />
                </div>
                <div className="nav-sign-in-ip-d">
                    <span className="lgn-dv-initialize">
                        <a href="http://opinion.com/app_dev.php/resetting/request" className="psw-fgt">Forgot password ?</a>
                    </span>
                    <TextFielGroup
                        label=""
                        field="password"
                        name="password"
                        hasPreviousSession
                        wrapClassName=""
                        placeholder="password"
                        customClassName="nav-inp-control"
                        value={password}
                        wrapper={this.state.wrapper}
                        error={errors.password}
                        onChange={this.onChange}
                        type="password"
                    />
                </div>
                <button type="submit" className="btn btn-primary btn-sm sbmit-login" disabled={isLoading} >Login</button>
            </form>
		)
	}
})

const mapStateToProps = (state) => {
    return {
        isAuthenticated : state.Auth.isAuthenticated,
        loginData: state.Login
    }
}
// Here is the complete 'connect' signature:
// connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])
// and here is how you're supposed to use it:

//const wrappedComponentClass = connect(...)(ComponentClass)

export default connect(mapStateToProps, null)(InlineLoginForm);