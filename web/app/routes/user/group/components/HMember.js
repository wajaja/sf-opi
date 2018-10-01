import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { Link }				from 'react-router-dom'
import _ 					from 'lodash'

const HMember = ({ members }) => {	
	return(
		<div className="HMember-ctnr">
	        <div className="HMember-ctnr-a">
	            {!!members && members.map && members.map(function(u, i) {
	            	const src = u.profile_pic ? u.profile_pic.web_path : u.profilePic
	            	return (
		                <div className="sml-dv-usr-ctnr" key={i}>
		                    <Link to={`/${u.username}`} className="sml-usr-lk">
		                        <img 
		                        	src={src} 
		                        	className="sml-usr-prof-pic" 
		                        	/>
		                    </Link>
		                </div>
	            	)
	            })}
	            {(!members || !members.length) && 
	                <div className="sml-dv-usr-ctnr">
	                    
	                </div>
	            }
	        </div>
	    </div>
	)
}

export default HMember