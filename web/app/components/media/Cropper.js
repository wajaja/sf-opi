import React                from 'react';
import { findDOMNode }      from 'react-dom'
import createReactClass     from 'create-react-class'
import './../../styles/media/image-crop-styles.scss'

const ReactCropper   = require('react-cropper').default;

const Cropper  = createReactClass({

    getInitialState() {
        // const { viewport } = this.props,
        // x       = (image.width / 2) - viewport.x,
        // y       = (image.height / 2) - viewport.y,
        // width   = (viewport.width * 100) / image.width,
        // height  = (viewport.height * 100) / image.height;
        return {
           crop:{
              x: 20,
              y: 10,
              width: 40,
              height: 40
            },
            maxHeight: 80,
            pixelCrop:{},
        }
    },

    onCropMove(evt) {
        console.log(evt)
    },

    rotateLeft() {
        this.refs.cropper.rotate(-90)
    },

    rotateRight() {
        this.refs.cropper.rotate(90)
    },

    async processImage() {
        const name = Math.random().toString(36).substr(2, 9);
        const croppedImg = await this.getCroppedImg(name);
        this.props.getResult(croppedImg);
    },

    onCropEnd(evt) {
        console.log('Crop move complete:', evt);
        // this.setState({ 
        //     pixelCrop : pixelCrop,
        //     crop: crop
        // });
    },

    /**
     * @param {File} image - Image File Object
     * @param {Object} pixelCrop - pixelCrop Object provided by react-image-crop
     * @param {String} fileName - Name of the returned file in Promise
     */
    getCroppedImg(fileName) {
        let canvas = this.refs.cropper.getCroppedCanvas();

        // As Base64 string
        return canvas.toDataURL('image/jpeg');

        // As a blob
        // return new Promise((resolve, reject) {
        //     canvas.toBlob(file => {
        //         file.name = fileName;
        //         resolve(file);
        //     }, 'image/jpeg');
        // });
    },

    componentWillMount() {
        
    },

    componentDidMount() {
        // findDOMNode(this).getElementsByTagName('img')[0].style.maxHeight = '450px';
        // this.image = findDOMNode(this).getElementsByTagName('img')[0];
    },

    componentDidUpdate(oldProps, oldState) {
        
    },

    render() {
        const { dataUrl, viewport, data,
            cropBoxData, aspectRatio, style,
            minContainerHeight, minContainerWidth } = this.props
        // crop={this._crop.bind(this)}
        return (
            <div className="crop-ctnr" style={{width: '100%', height: '100%'}}>
                <div className="crop-ctnr-a">
                    <ReactCropper
                        ref='cropper'
                        src={dataUrl}
                        data={data}
                        style={style}
                        cropBoxData={cropBoxData}
                        viewMode={1}
                        aspectRatio={aspectRatio}
                        minContainerWidth={minContainerWidth}
                        minContainerHeight={minContainerHeight}
                        cropmove={(evt) => this.onCropMove}
                        cropend={(evt) => this.onCropEnd}
                        guides={false}
                        />

                    <div className="crop-btn-ctnr">
                        <div className="crop-btn-ctnr-a">
                            <button onClick={this.rotateLeft} 
                                className="btn btn-default rotate-btn">
                                <i className="fa fa-undo" aria-hidden="true"></i>
                            </button> 
                            <button onClick={this.processImage} 
                                className="btn btn-primary crop-result">crop
                            </button>
                            <button  onClick={this.rotateRight} 
                                className="btn btn-default rotate-btn">
                                <i className="fa fa-repeat" aria-hidden="true"></i>
                            </button> 
                        </div>
                    </div>
                </div>
            </div>
        );
    }
})

export default Cropper