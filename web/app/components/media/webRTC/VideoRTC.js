import React 		from 'react'

class VideoRTC extends React.PureComponent {

	render() {
    	return (
    		<div>
	      		<video src={this.props.stream} autoPlay="true" muted={this.props.muted}/>
	    	</div>
	    )
    }
}

export default VideoRTC