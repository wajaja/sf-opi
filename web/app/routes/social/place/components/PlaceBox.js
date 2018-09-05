import React 			from 'react'
import createReactClass from 'create-react-class'


const PlaceBox 	= (props) => {
	const { place } = props,

	imageStyle = {
		height: '150px',
		width: '150px',

	}
	return(
		<div className="grp-list-el">
			<div className="grp-list-el-a">
	            <div className="grp-list-lft">
	            	<div className="grp-list-lft-tp">
		            	<div className="pic-dv-grp-list">
		            		<img 
		            			src={place.avatar.web_path}
		            			style={imageStyle}
		            			className="pic-grp-list" />
			            </div>
			        </div>
			        <div className="grp-list-lft-btm">
			        </div>
		        </div>

		        <div className="grp-list-rght">
	            	<div className="opt-dv-grp-list">
	            		<div className="grp-list-opt-nm">
	            			<div className="opt-txt">{place.name}</div>
			        	</div>
			        	<div className="grp-list-opt-obj">
	            			<div className="opt-txt">{place.goal}</div>
			        	</div>
			        	<div className="grp-list-opt-sttus">
	            			<div className="opt-txt">{place.status}</div>
			        	</div>
			        	<div className="grp-list-opt-owner">
	            			<div className="opt-txt">
	            				<div className="frst">{place.owner.firstname}</div>
	            				<div className="lst">{place.owner.lastname}</div>
	            			</div>
			        	</div>
			        	<div className="grp-list-opt-mbers">
	            			<div className="opt-txt">
	            				{place.members.map(function(u, i) {
	            					return(
	            						<div key={i}>
	            							<div className="frst">{u.firstname}</div>
	            							<div className="lst">{u.lastname}</div>
	            						</div>
	            					)
	            				})}
	            			</div>
			        	</div>
	            	</div>
	            </div>
	        </div>
        </div>
	)
}

export default PlaceBox