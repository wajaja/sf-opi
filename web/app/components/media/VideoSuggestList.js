import React 				from 'react'
import createReactClass  	from 'create-react-class'
import { Link } 			from 'react-router-dom'
import { connect } 			from 'react-redux'

import VideoThumb			from './VideoThumb'
import { 
    Photos as PhotosActions
}                           from '../../actions/media'

//////
/////
const VideoSuggestList  = createReactClass({

	getInitialState() {
		return {}
	},

	//////
	//////
	render() {
		const self 						= this,
		{ post: {id, author}, videos } 	= this.props,
		username 						= author.username;
		if(!videos.length) {
			return(<div></div>);
		}
		////
       return (
       		<div className="vdeo-sugg-list">
       			<div className="vdeo-sugg-list-a">
	                {videos.map(function(vid, i){
	                   return <VideoThumb 
	                   			key={i}
	                   			postId={id}
	                   			video={vid}
	                   			username={username} 
	                   			className="pst-jst-oe-img" 
	                   			pClassName="pst-img-lk"
	                   			{...self.props}
	                   			/>
	                })}
		        </div>
		    </div>
	    )
	}
})
/////
////
export default connect(state=>({
	modal: state.App.modalPhoto,
}))(VideoSuggestList);