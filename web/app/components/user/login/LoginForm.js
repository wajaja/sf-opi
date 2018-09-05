import React 				from 'react';
import createReactClass 	from 'create-react-class'
import PropTypes       		from 'prop-types';
import { connect } 			from 'react-redux';
import { Link } 			from 'react-router-dom';

import TextFielGroup 		from '../commons/TextFieldGroup';
import validateInput 		from '../../../validations/user/login';
import { Auth } 			from '../../../actions';

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
	    e.preventDefault();
	    if (this.isValid()) {
	      	this.setState({ errors: {}, isLoading: true });
	      	this.props.login(this.state).then(
	        	(res) => this.context.router.push('/'),
	        	(err) => this.setState({ errors: err.response.data.errors, isLoading: false })
	      );
	    }
	},

	render() {
		const {identifier, password, errors, isLoading } = this.state;
		return (
			<div className="frm-lgn-dv-ctnr">
                <div className="frm-msg-ttl">Login</div>
				<form className="frm-lgn-tag" onSubmit={this.onSubmit}>
					<div className="form-group">
		                <TextFielGroup
		                	field="identifier"
		                	label=""
		                	value={identifier}
		                	error={errors.identifier}
		                	onChange={this.onChange}
		                />
		            </div>
		            <div className="form-group">
		                <TextFielGroup
		                	field="password"
		                	label=""
		                	value={password}
		                	error={errors.password}
		                	onChange={this.onChange}
		                	type="password"
		                />
		            </div>
	               	<div className="frm-lgn-dv-ctnr-btm">
				        <div className="lgn-dv-sbm-btn-ctnr">
				            <button className="btn btn-default" disabled={isLoading} >Login</button>
				        </div>
				        <div className="lgn-dv-g-rgstr-ctnr">
				            <Link to="/app_dev.php/signup" className="go-regiter">Sign Up</Link>
				        </div>
				    </div>
	            </form>
	        </div>
		)
	}
})

LoginForm.propTypes = {
  login: PropTypes.func.isRequired
}

LoginForm.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(null, { login })(LoginForm);