import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { Picture, VideoThumb } 			from '../../../../components/media'

export const RecentPhotos = createReactClass({

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
})

//////
export const MostLiked = createReactClass({

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
})

export const VideoList = createReactClass({
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
})


const PhotosLeft = createReactClass({

	getInitialState() {
		return {

		}
	},


	render() {
		return(
			<div className="show-usr-plus">
                <div className="show-usr-plus-a">
                    <div className="show-usr-plus-intro">
                        <RecentPhotos
                            {...this.props} 
                            profile={profile}
                            user={user}
                            />
                    </div>
                    <div id="show_usr_plus_pho" className="show-usr-plus-pho">
                        <MostLiked
                            {...this.props} 
                            user={user}
                            profile={profile}
                            photos={photos}
                            />
                    </div>
                    <div id="show_usr_plus_ff" className="show-usr-plus-ff">
                        <VideoList
                            {...this.props} 
                            user={user}
                            profile={profile}
                            />
                    </div>                                  
                </div>
            </div>
		)
	}
})

export default PhotosLeft