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
		let { group, user } = this.props,
		commons = [], 
		others = [],
		all = []

		//commons friend
		commons = _.map(group.members, function(f, i) {
			return _.find(user.my_friends, (u) => { return u.id === f.id; });
		});

		if(commons.length < 9)
			others = group.members;

		all = _.uniqBy(_.concat(commons, others), 'id'); //get every object uniq in array
		this.setState({
			members: _.slice(all, 0, 8)    //select 9 users to display
		})
	},

	componentDidMount() {

	},

	componentWillReceiveProps(nextProps) {

	},
	
	render() {
		const { photos, group, user, match } = this.props,
		{ members }						= this.state
		if(members.length) {
			return(
				<div id="show-usr-plus-ff-ctnr" className="show-usr-plus-ff-ctnr">
			        <div id="usr-plus-flw-ctnr" className="usr-plus-flwr-ctnr">
			            {members.map(function(u, i) {
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
				            }
			            })}
			        </div>
			    </div>
			)
		}
		return(
			<div id="show-usr-plus-ff-ctnr" className="show-usr-plus-ff-ctnr">
		        <div id="usr-plus-flw-ctnr" className="usr-plus-flwr-ctnr">
		            No members
		        </div>
		    </div>
			)
	}
})

export default RelationShipPrev