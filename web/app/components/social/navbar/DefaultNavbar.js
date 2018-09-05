import React 					from 'react';
import createReactClass 		from 'create-react-class'
import {
	Route, IndexRoute, 
	Link, IndexLink 
} 								from 'react-router-dom';
import { connect } 				from 'react-redux';
import PropTypes 				from 'prop-types'

// import DefaultLoginForm from '../../../components/user/login/LoginForm';
import InlineLoginForm from '../../../components/user/login/InlineLoginForm'
import '../../../styles/social/navbar.scss'

const DefaultNavBar  = createReactClass( {
	render() {
		const { login } = this.props;

		return (
			<nav  className="navbar navbar-inverse navbar-fixed-top">
            	<div className="container">
            		<div className="navbar-header">
	                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
	                        <span className="icon-bar"></span>
	                        <span className="icon-bar"></span>
	                        <span className="icon-bar"></span>
	                    </button>
	                </div>
					<h1>
		                <Link to="/login" className="navbar-brand">Opinion</Link>
		            </h1>
		            <div className="nav-sign-in-d">  
		            	<InlineLoginForm />
		            </div>
	            </div>
	        </nav>
		)
	}
})

const mapStateToProps = (state => {
	return {
		navigation : state.Navigation
	}
})

export default connect(mapStateToProps /*, */)(DefaultNavBar)