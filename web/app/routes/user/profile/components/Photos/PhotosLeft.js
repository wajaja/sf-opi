import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { Picture, VideoThumb } 			from '../../../../../components/media'

const RecentPhotos = createReactClass({

	render() {
		const self = this,
		{ photos, profile, user, match } = this.props
		return(
			<div id="show_usr_plus_pics_ctnr" className="show-usr-plus-pic-ctnr">
			    <div className="pics-hdr">
			    	<div className="pics-hdr-lft">
				        <span className="">Recent</span>
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
				        {photos && photos.map(function(photo, i) {
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

//////
const MostLiked = createReactClass({

	render() {
		const self = this,
		{ profile, user, match } = this.props
		return(
			<div id="show_usr_plus_pics_ctnr" className="show-usr-plus-pic-ctnr">
			    <div className="pics-hdr">
			    	<div className="pics-hdr-lft">
				        <span className="">Best Photos</span>
				    </div>
			    </div>
			    <div id="usr-sml-pics-ctnr" className="usr-sml-pics-ctnr">
			        <div className="usr-sml-pics-ctnr-a">
				        {this.props.photos && this.props.photos.map(function(photo, i) {
				        	return(
			                    <div className="sml-pic-ctnr" key={i}>
			                        <div className="sml-pic-ctnr-a">
			                        	<Picture 
				                   			{...self.props}
				                   			tag="all_pics"
				                   			image={photo}
				                   			username={profile.username} 
				                   			className="sml-pic-img" 
				                   			pClassName="sml-pic-lk"
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

const VideoList = createReactClass({
	render() {
		const self = this,
		{ match } = this.props
		return(
			<div className="show-usr-plus-vid-ctnr">
			    <div id="usr-sml-vids-ctnr" className="usr-sml-vids-ctnr">
			        <div className="usr-sml-vids-ctnr-a">
				        {!!this.props.videos && this.props.videos.map(function(v, i) {
				        	return(
			                    <div className="sml-vid-ctnr" key={i}>
			                        <div className="sml-vid-ctnr-a">
			                        	
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

/**
*
*/
const PhotosLeft = createReactClass({

	getInitialState() {
		return {

		}
	},


	render() {
		const { user, } = this.props 
		return(
			<div className="show-usr-plus">
                <div className="show-usr-plus-a">
                    <div className="show-usr-plus-intro">
                        <RecentPhotos
                            {...this.props} 
                            photos={this.props.recentPhotos}
                            user={user}
                            />
                    </div>
                    <div id="show_usr_plus_pho" className="show-usr-plus-pho">
                        <MostLiked
                            {...this.props} 
                            user={user}
                            photos={this.props.mostLiked}
                            />
                    </div>
                    <div id="show_usr_plus_ff" className="show-usr-plus-ff">
                        <VideoList
                            {...this.props} 
                            user={user}
                            videos={this.props.videoList}
                            />
                    </div>                                  
                </div>
            </div>
		)
	}
})

export default PhotosLeft