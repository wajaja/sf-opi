import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { Link }				from 'react-router-dom'
import _ 					from 'lodash'

import { Picture } 			from '../../../../components/media'

const RelationShipPrev = createReactClass({
	getInitialState() {
		return {
			friends: []
		}
	},

	componentWillMount() {
		let { profile, user } = this.props,
		commons = [], 
		others = [],
		all = []

		//commons friend
		commons = _.map(profile.my_friends, function(f, i) {
			return _.find(user.my_friends, (u) => { return u.id === f.id; });
		});

		if(commons.length < 9)
			others = profile.my_friends;

		all = _.uniqBy(_.concat(commons, others), 'id'); //get every object uniq in array
		console.log(all)
		this.setState({
			friends: _.slice(all, 0, 8)    //select 9 users to display
		})
	},

	componentDidMount() {

	},

	componentWillReceiveProps(nextProps) {

	},
	
	render() {
		const { photos, profile, user, match } = this.props,
		{ friends }						= this.state
		if(friends.length) {
			return(
				<div id="show-usr-plus-ff-ctnr" className="show-usr-plus-ff-ctnr">
			        <div className="ff-hdr">
			        	<div className="usr-plus-fr-tg">
			            	<Link to={`${match.url}?tag=relationship&option=friends`} className="selected">Friends</Link>
			            </div>
			            <div className="usr-plus-flwr-tg">
			            	<Link to={`${match.url}?tag=relationship&option=followers`}>Followers</Link>
			            </div>
			            <div className="usr-plus-flg-tg">
			            	<Link to={`${match.url}?tag=relationship&option=followeds`}>Followeds</Link>
			        	</div>
			        </div>
			        <div id="usr-plus-flw-ctnr" className="usr-plus-flwr-ctnr">
			            {friends.map(function(u, i) {
			            	console.log(u)
			            	if(u && u.username) {
				            	return (
					                <div className="sml-dv-usr-ctnr" key={i}>
					                    <Link to={`/${u.username}`} className="sml-usr-lk">
					                        {typeof u.profile_pic !== 'undefined' && 
						                        <img 
						                        	src={u.profile_pic.web_path} 
						                        	className="sml-usr-prof-pic" 
						                        	/>
						                    }
					                    	<div className="sml-dv-usr-ctnr-btm">
					                    		<div className="sml-dv-usr-ctnr-btm-name">
					                    			<span className="fsrt-name">{u.firstname}</span>
					                    			<span className="lst-name">{u.lastname}</span>
								            	</div>
								        	</div>
					                    </Link>
					                </div>
				            	)
				            } else {
				            	return(<span key={i}></span>)
				            }
			            })}
			        </div>
			    </div>
			)
		}

		////////
		if(profile.my_followers.length) {
			const followers = _.slice(profile.my_followers, 0, 8)
			return(
				<div id="show-usr-plus-ff-ctnr" className="show-usr-plus-ff-ctnr">
			        <div className="ff-hdr">
			        	<div className="usr-plus-fr-tg">
			            	<Link to={`${match.url}?tag=relationship&option=friends`}>Friends</Link>
			            </div>
			            <div className="usr-plus-flwr-tg">
			            	<Link to={`${match.url}?tag=relationship&option=followers`} className="selected">Followers</Link>
			            </div>
			            <div className="usr-plus-flg-tg">
			            	<Link to={`${match.url}?tag=relationship&option=followeds`}>Followeds</Link>
			        	</div>
			        </div>
			        <div id="usr-plus-flw-ctnr" className="usr-plus-flwr-ctnr">
			            {followers.map(function(u, i) {
			            	return (
				                <div className="sml-dv-usr-ctnr" key={i}>
				                    <Link to={`/${u.username}`} className="sml-usr-lk">
				                        {typeof u.profile_pic !== 'undefined' && 
					                        <img 
					                        	src={u.profile_pic.web_path} 
					                        	className="sml-usr-prof-pic" 
					                        	/>
					                    }
				                    	<div className="sml-dv-usr-ctnr-btm">
				                    		<div className="sml-dv-usr-ctnr-btm-name">
				                    			<span className="fsrt-name">{u.firstname}</span>
				                    			<span className="lst-name">{u.lastname}</span>
							            	</div>
							        	</div>
				                    </Link>
				                </div>
			            	)
			            })}
			        </div>
			    </div>
			)
		}

		////////
		if(profile.my_followeds.length) {
			const followeds = _.slice(profile.my_followeds, 0, 8)
			return(
				<div id="show-usr-plus-ff-ctnr" className="show-usr-plus-ff-ctnr">
			        <div className="ff-hdr">
			        	<div className="usr-plus-fr-tg">
			            	<Link to={`${match.url}?tag=relationship&option=friends`}>Friends</Link>
			            </div>
			            <div className="usr-plus-flwr-tg">
			            	<Link to={`${match.url}?tag=relationship&option=followers`}>Followers</Link>
			            </div>
			            <div className="usr-plus-flg-tg">
			            	<Link to={`${match.url}?tag=relationship&option=followeds`} className="selected">Followeds</Link>
			        	</div>
			        </div>
			        <div id="usr-plus-flw-ctnr" className="usr-plus-flwr-ctnr">
			            {followeds.map(function(u, i) {
			            	return (
				                <div className="sml-dv-usr-ctnr" key={i}>
				                    <Link to={`/${u.username}`} className="sml-usr-lk">
				                        {typeof u.profile_pic !== 'undefined' && 
					                        <img 
					                        	src={u.profile_pic.web_path} 
					                        	className="sml-usr-prof-pic" 
					                        	/>
					                    }
				                    	<div className="sml-dv-usr-ctnr-btm">
				                    		<div className="sml-dv-usr-ctnr-btm-name">
				                    			<span className="fsrt-name">{u.firstname}</span>
				                    			<span className="lst-name">{u.lastname}</span>
							            	</div>
							        	</div>
				                    </Link>
				                </div>
			            	)
			            })}
			        </div>
			    </div>
			)
		}
		return(
			<div id="show-usr-plus-ff-ctnr" className="show-usr-plus-ff-ctnr">
		        <div className="ff-hdr">
		        	<div className="usr-plus-fr-tg">
		            	<Link to={`${match.url}?tag=relationship&option=friends`}>Friends</Link>
		            </div>
		            <div className="usr-plus-flwr-tg">
		            	<Link to={`${match.url}?tag=relationship&option=followers`}>Followers</Link>
		            </div>
		            <div className="usr-plus-flg-tg">
		            	<Link to={`${match.url}?tag=relationship&option=followeds`}>Followeds</Link>
		        	</div>
		        </div>
		        <div id="usr-plus-flw-ctnr" className="usr-plus-flwr-ctnr">
		            
		        </div>
		    </div>
			)
	}
})

export default RelationShipPrev