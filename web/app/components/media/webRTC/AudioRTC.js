import React 		from 'react'

class AudioRTC extends React.PureComponent {

	componentWillReceiveProps(nextProps) {
		if(this.props.stream !== nextProps.stream) {
			this._audio.src = window.URL.createObjectURL(this.props.stream);
		}
	}

	render() {
    	return (
    		<div className="aud-rtc-ctnr">
	      		<audio ref={(el) => this._audio = el}  controls autoplay></audio>
	    	</div>
	    )
    }
}

export default AudioRTC