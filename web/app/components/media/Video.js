import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'
import VideoPlayer 			from './VideoPlayer'


const Video  = createReactClass({

	getInitialState() {
		return { 
		}
	},

	render() {
		const { poster, manifest, videoPreview, submittingPost } = this.props;

		const videoJsOptions = {
		  	autoplay: false,
		  	controls: true,
		  	poster: poster,
		  	sources: [
		  		{ type: 'application/dash+xml', src: manifest },
		  		// { type: 'application/dash+xml', src: mpdSource + '_webm.mpd'}
		  	]
		}


		return(
			<VideoPlayer 
				options={videoJsOptions} 
				poster= {poster}
				manifest={manifest}
				videoPreview={videoPreview}
				submittingPost={submittingPost}
				/>
		)
	}
})

export default connect(state => ({
	App: state.App,
}))(Video)