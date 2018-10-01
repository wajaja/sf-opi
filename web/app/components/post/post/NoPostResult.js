import React 				from 'react'
import createReactClass 	from 'create-react-class'
import  { Link } 			from "react-router-dom"


const NoPostResult = ({ location }) => {
	return (
		<div className="pst-c new-pst appended">
            <div className="plc-hld pst-d">
				<div className="pst-e">
		            <div className="pst-f">
		                <div className="pst-sugg-wrp">
		                	<div className="pst-sugg-wrp-a">
		                		{location.pathname === '/' && 
		                			<Link to="/invitations" className="lk" />
		                		}
		                		{location.pathname !== '/' && 
		                			<div className="msg">No result</div>
		                		}
		                	</div>
		                </div>
		            </div>
	        	</div>
	        </div>
	    </div>
	)
}

export default NoPostResult