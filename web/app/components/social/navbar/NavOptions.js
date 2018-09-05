import React 					from 'react'
import createReactClass 		from 'create-react-class'
import ReactDOM 				from 'react-dom'
import { connect } 				from 'react-redux'
import { Link } 				from 'react-router-dom'
import { 
	App as AppActions 
} 								from '../../../actions/social'
import PropTypes 				from 'prop-types'
import onClickOutside 			from 'react-onclickoutside'

const Options  = createReactClass({

	render() {

		const { user } = this.props
		return (
			<div className="nav-options-ctnr">
				<div className="configArraw"></div>
	            <ul className="" id="navSettingContainer">
	                <li className="configLi">
	                	<Link to="/settings">parameters</Link>
	                </li>
	                <li className="configLi">
	                	<Link to="/pub">publicities</Link>
	                </li>
	                <li className="configLi">
	                	<Link to={`/${user.username}`}>Profile</Link>
	                </li>
	                <li className="configLi">
	                	<Link 
	                		to="/"
	                		onClick={this.handleLogout}
	                		>Logout
	                	</Link>
	                </li>
	                <li className="chg-pwd">
	                	<Link 
	                		to="/change-pasword"
	                		onClick={this.handlePassChange}
	                		>
	                		change password
	                	</Link>
	                </li>
	                <li className="configLi">
	                	<Link to="/dashboard">Plus</Link>
	                </li>
	            </ul>
	        </div>
		)
	}
})

/////
/////

const clickOutsideConfig = {
  	excludeScrollbar: true
};
const NavOptions  = onClickOutside(
	createReactClass( {

		getInitialState() {
			return { active : false }
		},

		toggleNavParams (e) {
			this.props.toggleNavParams()
		},

		componentWillMount () {
	        
	    },

	    componentDidMount() {
	    	document.addEventListener('click', this.handleClick, false);
	    },

	    componentWillUnmount () {
	        document.removeEventListener('click', this.handleClick, false);
	    },

	    //method from 'react-onclickoutside' module
		handleClickOutside(e) {
		    this.props.toggleNavParams(false)
		},

		render() {
			return (
				<div className="dropdown config-in-nav">
	                <div 
	                	className="dropdown link-parameters" 
	                	onClick={this.toggleNavParams}>
	                </div>
	                {this.props.navParamsBox && <Options {...this.props} />}
	            </div>
			)
		}
	}), clickOutsideConfig
)

const mapStateToProps = (state) => {
	return {
		navOptions : state.App.navOptions
	}
}
export default connect(mapStateToProps)(NavOptions)