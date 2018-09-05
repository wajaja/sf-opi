import React 				from 'react'
import createReactClass 	from 'create-react-class'
import { connect } 			from 'react-redux'
import { Link } 			from 'react-router-dom'

import { 
	Video as VideoActions,
    App as AppActions
}                           from '../../actions'

const VideoThumb  = createReactClass({

	getInitialState() {
		return {
			route: '',
			loading: false,
		}
	},

	getVideo (vid, e) {
		e.preventDefault();
		const { dispatch, tag, location : {pathname}, vid: { id } } = this.props,
		loading 	= true,
		params 		= { id: id },
		query 		= { tag: tag },
		status 		= {	modal: true, returnTo: pathname }

		//tag will be ["cover_pics", "profile_pics"]
		dispatch(VideoActions.load(id, tag)) 		
		// dispatch(VideoActions.modalVideo(params, query, status, loading))
	},

	componentWillReceiveProps (nextProps) {
		const { video: {id} } = this.props;

		if(nextProps.video.loading && (nextProps.video.params.id === id) && !this.state.loading) {
			console.log('params.id loading')
			this.setState({loading: true}) // before browser push state
		}

		if((this.props.video.video.id === id) && !nextProps.video.loading) {
			const { router, params, tag, video:{ id } } = this.props;
			console.log(params.id)
			if(params.id !== id) {
				router.push(`/videos/${id}?ref=`)
				// this.setState({loading: true}) // before browser push state
			}
		}
	},

	render() {
		const { loading } = this.state,
		{ tag, video, className, username, pClassName, match } 	= this.props,
		source = video.source + '/poster.jpg'
		return(
			<Link 
				to={{
					pathname: `/videos/${video.id}`, 
					search:`?tag=${tag}`, 
					state: {modal: true} }} 
				className={pClassName} 
				onClick={this.getImage.bind(this, video)}>
	           <div className="vid-thumb-dv">
	           		{loading && <span className="loader-bar"></span>}
	           		{video.source && <img src={source} className={className} />}
	           		<div className="vid-thumb-nme">{video.name}</div>
	           	</div>
	        </Link>
		)
	}
})

/////
export default connect(state => ({
	video: state.Video,
	videos: state.Videos.videos,
}))(VideoThumb)