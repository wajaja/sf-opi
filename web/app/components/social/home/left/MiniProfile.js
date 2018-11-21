import React 			from 'react'
import createReactClass from 'create-react-class'
import { Link }	 		from 'react-router-dom'
import { connect } 		from 'react-redux'
import onClickOutside 		from 'react-onclickoutside'

import '../../../../styles/user/mini-profile.scss'

const clickOutsideConfig = {
  	excludeScrollbar: true
};

const MoreOption = onClickOutside(
	createReactClass({
		// getInitialState() {
		// 	return {
		// 		active: false
		// 	}
		// },

		//method from 'react-onclickoutside' module
		handleClickOutside(e) {
		    // ..handling code goes here... 
		    this.props.closeOption(e)
		},

		render() {
			return (
				<div className="min-prof-not-b" >
					<div className="min-prof-not-b-a" >
						<div className="min-prof-not-b-a" >
							<div 
			                	className="min-prof-mor-opt"
			                	onClick={this.props.toggleOption}>
			                    <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
			                </div>
			            </div>
						{this.props.active && 
							<div className="min-mor-opt-ctnr" >
								<div className="min-mor-opt-ctnr-a" >
									<div 
										className="clse-opt" 
										onClick={(e) => this.props.closeOption(e)}>
										x
									</div>
									<Link to="/groups/list" className="hm-g-group">
					                    <i className="fa fa-users" aria-hidden="true"></i>
					                    <span className="min-prof-not-child" >Groups</span>
					                </Link>
									<Link to="/status/" className="hm-edit-stt-lk">
					                    <i className="fa fa-quote-left" aria-hidden="true"></i>
					                    <span className="min-prof-not-child" >Status</span>
					                </Link>
					                <Link to="/notifications/" className="hm-g-notifs">
					                    <i className="fa fa-bell" aria-hidden="true"></i>
					                    <span className="min-prof-not-child" >Notifications</span>
					                </Link>
					                <Link to="/questions/" className="hm-opn-question">
					                    <i className="fa fa-question-circle" aria-hidden="true"></i>
					                    <span className="min-prof-not-child" >Questions</span>
					                </Link>
					                <Link to="/favoris/" className="hm-opn-favoris">
					                    <i className="fa fa-star" aria-hidden="true"></i>
					                    <span className="min-prof-not-child" >Favoris</span>
					                </Link>							
					                <Link to="/invitations/" className="hm-g-invits">
					                    <i className="fa fa-user-plus" aria-hidden="true"></i>
					                    <span className="min-prof-not-child" >Invitations</span>
					                </Link>
					                <Link to="/friends/" className="hm-opn-frd">
					                    <i className="fa fa-user" aria-hidden="true"></i>
					                    <span className="min-prof-not-child" >Friends</span>
					                </Link>
					                <Link to="/followers/" className="hm-opn-flw">
					                    <i className="fa fa-user" aria-hidden="true"></i>
					                    <span className="min-prof-not-child" >Followers</span>
					                </Link>
					                <Link to="/pops/" className="hm-g-pop-usr">
					                    <i className="fa fa-user" aria-hidden="true"></i>
					                    <span className="min-prof-not-child" >Popularities</span>
					                </Link>
					                <Link to="/hashtag/" className="hm-g-hashtag">
					                    <i className="fa fa-user" aria-hidden="true"></i>
					                    <span className="min-prof-not-child" >#hashtag</span>
					                </Link>
								</div>
							</div>
						}
					</div>
				</div>
			)
		}
	}), clickOutsideConfig
)

const MiniProfile = createReactClass({

	getInitialState() {
		return {
			option: false,
			setCover: false,
			setProfile: false,
		}
	},

	setCoverPic() {
		this.setState({
			setCover : true
		})
	},

	setProfilePic() {
		this.setState({
			setProfile: true
		})
	},

	toggleOption(e) {
		const self = this
		this.setState({
			option: !self.state.option
		})
	},

	closeOption(e) {
		this.setState({option: false })
	},

	shouldComponentUpdate(nextProps, nextState) {
		return (this.props.user !== nextProps.user || 
				this.state.option !== nextState.option)
	},

	render() {
		const { user, invitation, relationShip, message, serverSide } = this.props;

		if(serverSide) {
			return(
				<div className="min-prof-a" >
					<div className="min-prof-pic-a" >
	                    <div className="min-prof-pic-b" >
	                        <div className="min-conver-ctnr" >
	                            <div className="min-conver"></div>
	                        </div>
	                        <div className="mn-pic-ctnr"> 
	                            <div className="min-pic-container" >        
	                                <div className="min-pic-img"></div>
	                            </div>
		                        <div className="min-nm-lk"></div>
	                        </div>	                        
	                        <div className="hm-prof-conf">
	                            <i className="fa fa-cog" aria-hidden="true"></i>
	                            <span className="hm-prof-conf-txt">Parameters</span>
	                        </div>
	                    </div>
					</div>
					<div className="min-prof-not" >
			            <div className="min-prof-not-a" >
			                <div className="hm-g-inbox">
			                    <span className="min-prof-not-child" ></span>
			                </div>
			                <div className="hm-g-inbox">
			                    <span className="min-prof-not-child" ></span>
			                </div>
			            </div>
					</div>
				</div>
			)
		}

		return(
			<div className="min-prof-a" >
				<div className="min-prof-b" >
					<div className="min-prof-pic-a" >
	                    <div className="min-prof-pic-b" >
	                        <div className="min-conver-ctnr" >
	                            <div className="hm-edt-cov-pic" onClick={this.setCoverPic}>
	                            	<i className="fa fa-pencil" aria-hidden="true"></i>
	                            </div>
	                            <img src={user.cover_pic.web_path} className="min-conver" />
	                        </div>
	                        <div className="mn-pic-ctnr"> 
	                            <div className="min-pic-container" >
		                            <div className="hm-edt-prof-pic" onClick={this.setProfilePic}>
		                            	<i className="fa fa-pencil" aria-hidden="true"></i>
		                            </div>                    
	                                <img src={user.profile_pic.web_path} className="min-pic-img" />
	                            </div>
		                        <Link to={`/${user.username}`} className="min-nm-lk">
		                            <span className="min-prof-name" >{user.firstname}</span>                    
		                        </Link>
	                        </div>	                        
	                        <div className="hm-prof-conf">
	                            <i className="fa fa-cog" aria-hidden="true"></i>
	                            <span className="hm-prof-conf-txt">Parameters</span>
	                        </div>
	                    </div>
					</div>

					<div className="min-prof-not" >
			            <div className="min-prof-not-a" >
			                <Link to="/messages/" className="hm-g-inbox">
			                    <i className="fa fa-envelope" aria-hidden="true"></i>
			                    <span className="min-prof-not-child" >Inbox</span>
			                </Link>
			                <MoreOption 
			                	toggleOption={this.toggleOption}
			                	closeOption={this.closeOption}
			                	active={this.state.option}
			                	/>
			            </div>
					</div>
				</div>
			</div>
		)
	}
})

//////
export default connect(state => ({
	user: state.User.user,
	message: state.Message, 
	invitation: state.Invitation,
	relationShip: state.RelationShip,
}))(MiniProfile)