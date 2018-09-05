import React 			from 'react'
import createReactClass from 'create-react-class'
import { Link } 		from 'react-router-dom'
import { connect }  	from 'react-redux'


import { Picture } 		from '../../../../components'

const IntroPrev = createReactClass({

	getInitialState() {
		return {

		}
	},

	render() {
		const { match, group, user } = this.props
		
		return (
			<div className="grp-intro-about-ctnr">
				<div className="grp-intro-hd">
				    <div className="avatar">
				    	<Picture 
                   			{...this.props}
                   			tag="profile_pics"
                   			image={group.avatar}
                   			username={username} 
                   			className="grp-top-avatar-dv" 
                   			pClassName="grp-top-avatar-img"
                   			/>
				    </div>
				    <div className="group-name">{group.name}</div>
				    {group.owner.id === user.id && 
				    	<Link to={`${match.url}?edit=info`} className="edit-about-info"> 
				    		<i className="fa fa-pencil-square-o" aria-hidden="true"></i>
				    	</Link>
				    }
				</div>

				<div className="grp-intro-cont">
				    <ul className="grp-intro-ul">
						<li className="grp-intro-ul-chd">
							<div className="abt-ky-txt">Goal</div>
							<div className="abt-info-txt">{group.goal}</div>
						</li>
						<li className="grp-intro-ul-chd">
							<div className="usr-abt-ky-txt">Owner</div>
							<div className="grp-intro-cont">
								<span className="frst">{group.owner.firstname}</span>
								<span className="lst">{group.owner.lastname}</span>
							</div>
						</li>
					</ul>
				</div>
			</div>
		)
	}
})

export default IntroPrev