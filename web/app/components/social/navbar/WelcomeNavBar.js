import React 						from 'react'
import createReactClass 			from 'create-react-class'
import {
	Route, IndexRoute, 
	Link, IndexLink 
} 									from 'react-router-dom';
import { connect } 					from 'react-redux';

// import DefaultLoginForm from '../../../components/user/login/LoginForm';
import InlineLoginForm 				from '../../../components/user/login/InlineLoginForm'

/**
* import nedded styles for this navbar
*/
import '../../../styles/social/navbar.scss'

const WelcomeNavBar  = createReactClass({
	render() {
		const { login } = this.props;
		return (
			<nav  className="navbar navbar-inverse navbar-fixed-top wlc">
            	<div className="container">
            		<div className="navbar-header">
	                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
	                        <span className="icon-bar"></span>
	                        <span className="icon-bar"></span>
	                        <span className="icon-bar"></span>
	                    </button>
	                </div>
					<div className="nav-lft">
    					<div className="brand-ctnr">
		                	<Link to="/login" className="navbar-brand">Opinion</Link>
		            	</div>
    				</div>
		            <div className="nav-ctnr">
			            <div className="nav-sign-in-d">  
			            	<InlineLoginForm />
			            </div>
			        </div>
	            </div>
	        </nav>
		)
	}
})

////////
const mapStateToProps = (state => {
	return {
		navigation : state.Navigation
	}
})

export default connect(mapStateToProps /*, */)(WelcomeNavBar)