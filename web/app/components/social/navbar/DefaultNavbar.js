import React 			from 'react';
import createReactClass from 'create-react-class'
import { Link } 		from 'react-router-dom';
import { connect } 		from 'react-redux';

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
					<div className="nav-lft">
    					<div className="brand-ctnr">
		                	<Link to="/login" className="navbar-brand">Opinion</Link>
		            	</div>
    				</div>
		            <div className="nav-ctnr">
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