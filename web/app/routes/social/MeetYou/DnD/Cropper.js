import React                from 'react';
import { findDOMNode }      from 'react-dom'
import createReactClass     from 'create-react-class'
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
            maxHeight: 400,
            pixelCrop:{},
        }
    },

    onCropMove(evt) {
        console.log('onCropMove', evt)
        this.props.setCropperRef(this.cropper)
    },

    onCropEnd(evt) {
        console.log('Crop move complete:', evt);
        // this.setState({ 
        //     pixelCrop : pixelCrop,
        //     crop: crop
        // });
        this.props.setCropperRef(this.cropper)
    },

    render() {
        const { dataUrl, viewport, data,
            cropBoxData, aspectRatio, style,
            minContainerHeight, minContainerWidth } = this.props
        // crop={this._crop.bind(this)}
        return (
            <div className="crop-ctnr" style={{display: 'inline-block%'}}>
                <div className="crop-ctnr-a">
                    <ReactCropper
                        ref={(el) => this.cropper = el}
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
                </div>
            </div>
        );
    }
})

export default Cropper