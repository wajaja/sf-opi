import React 			from 'react'
import createReactClass from 'create-react-class'
import { Link } 		from 'react-router-dom'
import { connect }  	from 'react-redux'


const IntroPrev = createReactClass({

	getInitialState() {
		return {

		}
	},

	render() {
		const { match, profile, user } = this.props,
		address = profile.address,
		about_me= profile.about_me
		
		return (
			<div className="in-detail-about-ctnr">
				<div className="in-detail-hd">
				    <div className="ico"></div>
				    <span className="">About</span>
				    {profile.id === user.id && 
				    	<Link to={`${match.url}?edit=info`} className="edit-about-info"> 
				    		<i className="fa fa-pencil-square-o" aria-hidden="true"></i>
				    	</Link>
				    }
				</div>
				<div className="in-detail-cont" id="details_about">
				    {!!address && !!about_me &&  
				    	<ul className="in-detail-ul">
							{address && address.country !== "" && <li className="in-detail-ul-chd">
								<span className="usr-abt-ky-txt">country</span>
								<span className="usr-abt-info-txt">{address.country}</span>
							</li>}
							{address && address.city !== "" && <li className="in-detail-ul-chd">
								<span className="usr-abt-ky-txt">city</span>
								<span className="usr-abt-info-txt">{address.city}</span>
							</li>}
							{about_me && about_me.school !== "" && <li className="in-detail-ul-chd">
								<span className="usr-abt-ky-txt">school</span>
								<span className="usr-abt-info-txt">{about_me.school}</span>
							</li>}
							{about_me && about_me.university !== "" && <li className="in-detail-ul-chd">
								<span className="usr-abt-ky-txt">university</span>
								<span className="usr-abt-info-txt">{about_me.university}</span>
							</li>}
						</ul>
					}
				</div>
				{!address && !about_me && 
					<div className="in-detail-cont">
					    <div className="in-detail-ul">
							no data
						</div>
					</div>
				}
			</div>
		)
	}
})

export default IntroPrev