import React 			from 'react'
import createReactClass from 'create-react-class'
import { connect } 		from 'react-redux'

import '../../../../styles/user/mini-profile-holder.scss'

const MiniProfileHolder = createReactClass({

	getInitialState() {
		return {
			option: false,
			setCover: false,
			setProfile: false,
		}
	},

	shouldComponentUpdate(nextProps, nextState) {
		return (this.props.user !== nextProps.user || 
				this.state.option !== nextState.option)
	},

	render() {
		const { user, invitation, relationShip, message } = this.props;
		return(
			<div className="min-prof-a" >
				<div className="min-prof-pic-a" >
                    <div className="min-prof-pic-b" >
                        <div className="min-conver-ctnr" >
                            <div className="hm-edt-cov-pic" onClick={this.setCoverPic}>
                            	<i className="fa fa-pencil" aria-hidden="true"></i>
                            </div>
                        </div>
                        <div className="mn-pic-ctnr"> 
                            <div className="min-pic-container" >
	                            <div className="hm-edt-prof-pic" onClick={this.setProfilePic}>
	                            	<i className="fa fa-pencil" aria-hidden="true"></i>
	                            </div>
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
		                <Link to="/hashtag/" className="hm-g-hashtag">
		                    <i className="fa fa-user" aria-hidden="true"></i>
		                    <span className="min-prof-not-child" >#hashtag</span>
		                </Link>
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
}))(MiniProfileHolder)