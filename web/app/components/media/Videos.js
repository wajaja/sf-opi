import React 				from 'react'
import createReactClass		from 'create-react-class'
import ReactDOM, 
		{ findDOMNode } 	from 'react-dom'
import { connect } 			from 'react-redux'
import Video 				from './Video'


const Videos  = createReactClass({

	manifest: '',

	width: 300,

	getInitialState() {
		return {
			videoHeight: '220px',
			manifest: 'manifest_mp4.mpd'
		}
	},

	componentWillMount() {
		const canPlayType = this.props.canPlayType
		for(var prop in canPlayType) {
			if(canPlayType[prop].h264 === true || canPlayType[prop].ogg === true){
				this.setState({manifest: 'manifest_mp4.mpd'})
				return
			} else {
				this.setState({manifest: 'manifest_webm.mpd'})
				return
			} 
		}
	},

	componentDidMount() {
		this.width      = findDOMNode(this).parentNode.offsetWidth;
		const height    = this.width * (9 / 16),
		canPlayType 	= this.props.canPlayType,
        videoHeight     = height + 'px';

		for(var prop in canPlayType) {
			if(canPlayType[prop].h264 === true || canPlayType[prop].ogg === true) {
				this.setState({manifest: 'manifest_mp4.mpd'})
				return
			} else {
				this.setState({manifest: 'manifest_webm.mpd'})
				return
			}
		}

        this.setState({
        	videoHeight: videoHeight
        })
	},

	componentWillReceiveProps(nextProps) {
		// for(var prop in canPlayType) {
		// 	if(canPlayType[prop].h264 === true || canPlayType[prop].ogg === true) {
		// 		this.setState({manifest: 'manifest_mp4.mpd'})
		// 		return
		// 	} else {
		// 		this.setState({manifest: 'manifest_webm.mpd'})
		// 		return
		// 	}
		// }
	},

	render() {
		const { videos, submittingPost } = this.props,
		{ videoHeight, manifest }  = this.state;
		return(
			<div className="vdeos-ctnr">
           		{videos.map((video, i) => {
           			return  (
           				<div key={i} className="vdeos-ctnr-a" style={{height: videoHeight}}>
	       					<Video 
			           			{...this.props}
			           			submittingPost={submittingPost}
			           			poster={`${video.source}/poster.jpg`}
			           			manifest={`${video.source}/${manifest}`}
			           			videoPreview={`${video.source}/preview.jpg`}
			           			/>
			           	</div>
			        )
           		})}
           </div>
		)
	}
})

/////////
export default connect(state =>({
	canPlayType: state.VideoUploader.canPlayType
}))(Videos)