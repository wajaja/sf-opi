import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { Link } 			from 'react-router-dom'

import { Picture } 			from '../../../../components/media'

const PhotosPrev = createReactClass({
	getInitialState() {
		return {

		}
	},
	
	render() {

		const self = this,
		{ photos, profile, user, match } = this.props
		return(
			<div id="show_usr_plus_pics_ctnr" className="show-usr-plus-pic-ctnr">
			    <div className="pics-hdr">
			    	<div className="pics-hdr-lft">
				        <Link 
				        	to={`${match.url}?tag=photos`} 
				        	className="pics-hdr-lk"
				        	>
				            <div className="ico" aria-hidden="true"></div>
				            <span className="">Photos</span>
				        </Link>
				    </div>
			        <div className="pics-hdr-rght">
	                    {user.id === profile.id &&
	                        <button className="btn-create-gal" onClick={this.createGallery}>
	                        	New Gallery
	                        </button>
	                    }         
		            </div>
			    </div>
			    <div id="usr-sml-pics-ctnr" className="usr-sml-pics-ctnr">
			        <div className="usr-sml-pics-ctnr-a">
				        {photos.map(function(photo, i) {
				        	return(
			                    <div className="sml-pic-ctnr" key={i}>
			                        <div className="sml-pic-ctnr-a">
			                        	<Picture 
				                   			tag="all_pics"
				                   			image={photo}
				                   			username={profile.username} 
				                   			className="sml-pic-img" 
				                   			pClassName="sml-pic-lk"
				                   			{...self.props}
				                   			/>
			                        </div>
					            </div>
				        	)
				        })}
				    </div>
			    </div>
			</div>
		)
	}
})

export default PhotosPrev