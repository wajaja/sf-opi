import React, { Component } from 'react';
import Konva from 'konva';
import { Image } from 'react-konva';
import { centerCrop } from '../utils/pixels';

// VERY IMPORTANT NOTES
// at first we will set image state to null
// and then we will set it to native image instanse
// only when image is loaded
class ImageC extends React.Component {
  state = {
    image: null
  };
  componentDidMount() {
    const image = new window.Image();
    image.src = 'http://konvajs.github.io/assets/yoda.jpg';
    image.onload = () => {
      // setState will redraw layer
      // because "image" property is changed
      this.setState({
        image: image
      });
    };
  }

  render() {
    let { frame, main, image } = this.props,
    canvasWidth = frame[2],
    canvasHeight = frame[3];

    const area = {width: image.naturalWidth, height: image.naturalHeight};
    const canvas = {width: canvasWidth, height: canvasHeight};

    const {xPad, yPad, zoneWidth, zoneHeight} = centerCrop(area, canvas);


    if(main) {
      return (
        <Image 
          sx={xPad}
          sy={yPad}
          swidth={zoneWidth}
          sheight={zoneHeight}
          x={frame[0]}
          y={frame[1]}
          width={canvasWidth}
          height={canvasHeight}
          image={this.state.image} />
      )
    }


    return (
      <Image 
        x={frame[0]}
        y={frame[1]}
        width={frame[2]}
        height={frame[3]}
        image={this.state.image} />
    )
  }
}

// // here is another way to update the image
// class VaderImage extends React.Component {
//   state = {
//     image: new window.Image()
//   };
//   componentDidMount() {
//     this.state.image.src = 'http://konvajs.github.io/assets/darth-vader.jpg';
//     this.state.image.onload = () => {
//       // calling set state here will do nothing
//       // because properties of Konva.Image are not changed
//       // so we need to update layer manually
//       this.imageNode.getLayer().batchDraw();
//     };
//   }

//   render() {
//     return (
//       <Image
//         image={this.state.image}
//         y={250}
//         ref={node => {
//           this.imageNode = node;
//         }}
//       />
//     );
//   }
// }

export default ImageC;