import React                from 'react';
import createReactClass     from 'create-react-class'
import PropTypes            from 'prop-types';
import {Link, IndexLink }   from 'react-router-dom';
import { connect }          from 'react-redux';

import TextFielGroup        from '../commons/TextFieldGroup';
import validateInput        from '../../../validations/user/login';
import { Auth }             from '../../../actions';

const login = Auth.login;

import '../../../styles/user/security.scss'

const InlineLoginForm  = createReactClass( {

  getInitialState(props) {
    return {
      username : "",
      password   : "",
      errors     : {},
      isLoading  : false 
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
      e.preventDefault();
      if (this.isValid()) {
          this.setState({ errors: {}, isLoading: true });
          this.props.login(this.state)
              .then(
                  (res) => this.context.router.push('/'),
                  (err) => this.setState({ errors: err, isLoading: false })
              )
          ;
      }
  },

	render() {
    const {username, password, errors, isLoading } = this.state;
		return (
  			<form className="nav-fS-in" onSubmit={this.onSubmit}>
            <div className="nav-sign-in-ip-d">
                <TextFielGroup
                    field="username"
                    label=""
                    placeholder="email or username"
                    customClassName="nav-inp-control"
                    value={username}
                    error={errors.username}
                    onChange={this.onChange}
                />
            </div>
            <div className="nav-sign-in-ip-d">
                <TextFielGroup
                    field="password"
                    label=""
                    placeholder="password"
                    customClassName="nav-inp-control"
                    value={password}
                    error={errors.password}
                    onChange={this.onChange}
                    type="password"
                />
                <label htmlFor="remember_me" className="nav-sign-in-r">
                    <input type="checkbox" value="on" />
                </label>
            </div>
            <button className="sbmit-login" disabled={isLoading} >Login</button>
        </form>
		)
	}
})

InlineLoginForm.propTypes = {
  login: PropTypes.func.isRequired
}

InlineLoginForm.contextTypes = {
  router: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated : state.Auth.isAuthenticated
  }
}
// Here is the complete 'connect' signature:
// connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])
// and here is how you're supposed to use it:

//const wrappedComponentClass = connect(...)(ComponentClass)

export default connect(mapStateToProps, { login })(InlineLoginForm);