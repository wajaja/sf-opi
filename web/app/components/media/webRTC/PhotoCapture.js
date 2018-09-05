import React            from 'react'

class PhotoCapture extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            image: null,
        }
    }

    componentDidMount() {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
        if (navigator.getUserMedia) {
            navigator.getUserMedia({video: true}, this.handleVideo, this.videoError);
        } else {
            alert('no media capturer');
        }
    }

    handleVideo (stream) {
        // Update the state, triggering the component to re-render with the correct stream
        this.setState({ videoSrc: window.URL.createObjectURL(stream) });
        this.videoElement.play();
    }

    videoError(error) {
        console.error("Video capture error: ", error.code);
    }

    takePhoto(evt) {
        // evt.preventDefault();
        const context = this._canvas.getContext("2d"),
        image         =  this._canvas.toDataURL("image/jpeg");
        context.drawImage(this.videoElement, 0, 0, 640, 480);
        this.setState({image: image});
        this.props.takePhoto(image);
    }

    render() {
        const video = (
            <video 
                id="video" 
                width="640" 
                height="480" 
                className="cameraFrame" 
                src={this.state.videoSrc} autoPlay="true"
                ref={(input) => { this.videoElement = input; }}>
            </video>
        );

        const canvas = (
            <canvas ref={(el) => this._canvas = el} id="canvas" width="640" height="480"></canvas>
        )
        return (
            <div className="ph-capt-ctnr">
                <div className="ph-capt-lft-ctnr">
                    {video}
                </div>
                <div className="ph-capt-lft-ctnr">
                    <button 
                        className="btnPhoto"
                        onClick={this.takePhoto}>
                        Take a photo</button>
                </div>
                <div className="ph-capt-rght-ctnr">
                    {canvas}
                </div>
            </div>
        );
    }
}

export default PhotoCapture