import React 				from 'react';
import createReactClass 	from 'create-react-class'
import PropTypes       		from 'prop-types';
import { connect } 			from 'react-redux';
import { Link } 			from 'react-router-dom';

import TextFielGroup 		from '../commons/TextFieldGroup';
import validateInput 		from '../../../validations/user/login';
import { Auth } 			from '../../../actions';
import { BASE_PATH }     	from '../../../config/api'

import '../../../styles/user/security.scss'

const login = Auth.login;

const LoginForm  = createReactClass({

	getInitialState() {
		return {
			identifier : "",
			password   : "",
			errors	   : {},
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
	    if (!this.isValid()) {
	    	e.preventDefault();
	      	this.setState({ errors: {}, isLoading: true });
	      	this.props.login(this.state).then(
	        	(res) => this.context.router.push('/'),
	        	(err) => this.setState({ errors: err.response.data.errors, isLoading: false })
	      );
	    }
	},

	render() {
		const {identifier, password, errors, isLoading } = this.state,
		{ hasPreviousSession, action, server_error } = this.props.loginData
		return (
			<div className="frm-lgn-dv-ctnr">
				{!!server_error && <div className="s-error">{server_error.messageDatq}</div>}
                <div className="frm-msg-ttl">Login</div>
				<form action={`${BASE_PATH}/${action}`} method="post" className="frm-lgn-tag" onSubmit={this.onSubmit}>
					<div className="form-group">
		                <TextFielGroup
		                	field="username"
		                	name="username"
		                	label=""
		                	hasPreviousSession
                        	wrapClassName=""
		                	value={identifier}
		                	error={errors.identifier}
		                	onChange={this.onChange}
		                />
		            </div>
		            <div className="form-group">
		                <TextFielGroup
		                	field="password"
		                	label=""
		                	name="password"
		                	hasPreviousSession
                        	wrapClassName=""
		                	value={password}
		                	error={errors.password}
		                	onChange={this.onChange}
		                	type="password"
		                />
		            </div>
	               	<div className="frm-lgn-dv-ctnr-btm">
	               		<div className="lgn-dv-initialize">
				            <a href="http://opinion.com/app_dev.php/resetting/request" className="psw-fgt">Forgot password ?</a>
				        </div>
				        <div className="lgn-dv-sbm-btn-ctnr">
				            <button className="btn btn-primary" disabled={isLoading} >Login</button>
				        </div>
				    </div>
	            </form>
		        <div className="lgn-dv-g-rgstr-ctnr">
		        	<button className="btn go-regiter-btn" disabled={isLoading} >
		            	<a href="http://opinion.com/app_dev.php/signup" className="go-regiter">Sign Up</a>
		            </button>
		        </div>
	        </div>
		)
	}
})

const mapStateToProps = (state) => {
    return {
        isAuthenticated : state.Auth.isAuthenticated,
        loginData: state.Login
    }
}

export default connect(mapStateToProps, null)(LoginForm);