import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { Link } 			from 'react-router-dom'
import { Picture } 			from '../../../../../components/media'

const PhotosCenter = createReactClass({

	getInitialState() {
		return {

		}
	},

	componentDidMount() {
		this.props.loadPhotos(this.props.profile.username).then(photos => {
			console.log(photos);
		})
	},

	render() {
		const { photos,  } = this.props
		return(
			<div className="photos-ctnr">
				<div className="photos-ctnr-a">
					{photos && photos.map(function(photo, i) {
			        	return(
		                    <div className="sml-pic-ctnr" key={i}>
		                        <div className="sml-pic-ctnr-a">
		                        	<Picture 
			                   			tag="all_pics"
			                   			image={photo}
			                   			username={this.props.profile.username} 
			                   			className="sml-pic-img" 
			                   			pClassName="sml-pic-lk"
			                   			{...self.props}
			                   			/>
		                        </div>
				            </div>
			        	)
			        })}
			        {!photos && 
	                    <div className="sml-pic-ctnr">
	                        <div className="sml-pic-ctnr-a">
	                        	No Pictures
	                        </div>
			            </div>
			        }
				</div>
			</div>
		)
	}
})

export default PhotosCenter