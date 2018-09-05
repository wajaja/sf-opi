import React                        from 'react'
import createReactClass             from 'create-react-class'
import {
    Route, IndexRoute, 
    Link, IndexLink 
}                                   from 'react-router-dom';
import { connect }                  from 'react-redux';

import TabNav                       from './TabNav'
import NavOptions                   from './NavOptions'
import { Search }                   from '../search'

/**
* import nedded styles for this navbar
*/
import '../../../styles/social/navbar.scss'


const NavBar  = createReactClass( {

	imagePath : "/images/favicon.ico",

    shouldComponentUpdate(nextProps) {
        return this.props.postFormFocus !== nextProps.postFormFocus;
    },

	render() {
		const { user } = this.props,
        modals = this.props.postFormFocus; // ||

		return (
			<nav  className={modals ? `navbar navbar-inverse navbar-fixed-top modal-open` : `navbar navbar-inverse navbar-fixed-top`}>
            	<div className="container">
            		<div className="navbar-header">
	                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
	                        <span className="icon-bar"></span>
	                        <span className="icon-bar"></span>
	                        <span className="icon-bar"></span>
	                    </button>
	                </div>
		            <div className="collapse navbar-collapse">
                        <div className="global-content">
                            <div className="global-brand">
                            	<Link to="/" className="op-gl-lk" id="op_gl_lk">
                            		<span className="op-gl-lk-ctnr"></span>
                            	</Link>
                            </div>                            
                            <div className="div-form-nav" id="div-form-nav">

                                <Search 
                                    user={this.props.user}
                                    history={this.props.history}
                                    auth_data={this.props.auth_data}
                                    dispatch={this.props.dispatch}
                                    access_token={this.props.access_token}
                                    getImageFromCache={this.props.getImageFromCache}
                                    timelineId={this.props.user.id}
                                    location={this.props.location}
                                    />

                                <div className="result-in-nav" id="result-in-nav"></div>

                            </div>
                            <div className="global-nav-right">
                                <div className="global-nav-right-in">
                                    <div className="home-in-nav">
                                        <Link to="/" className="gb-nv-ho" id="gb_nv_ho"> 
                                            <span className="h-ico"></span>
                                        </Link>
                                    </div>

                                    <TabNav 
                                        {...this.props} 
                                        toggleNavNotifs={this.props.toggleNavNotifs}
                                        toggleNavInvits={this.props.toggleNavInvits}
                                        toggleNavMessage={this.props.toggleNavMessage}
                                        />

                                </div>
                            </div>
                            <div className="rgth-in-nav">
                                <div className="profile-in-nav">
                                    <div  className="profile-div-in-nav usr-index-info" id="usr_index_info" data-usr-id={user.id}>
                                        <Link className="prf-dv-nv-lk usr-mdia-info"  to={`/${user.username}`} data-usr-pic={user.profilPic}>
                                            <img id="profilePic-in-nav" src={user.profile_pic.web_path} className="profilePic-in-nav" />
                                        </Link>
                                    </div>
                                </div> 

                                <NavOptions 
                                    {...this.props}
                                    toggleNavParams={this.props.toggleNavParams}
                                    />

                            </div>
                        </div>
                    </div>
	            </div>
	        </nav>
		)
	}
})

const mapStateToProps = (state => {
	return {
        postFormFocus: state.App.postFormFocus
	}
})

export default connect(mapStateToProps /*, */)(NavBar)