import React, { Component } from 'react';
import Konva from 'konva';
import { Image } from 'react-konva';
import { centerCrop } from '../utils/pixels';

// VERY IMPORTANT NOTES
// at first we will set image state to null
// and then we will set it to native image instanse
// only when image is loaded
class ImageC extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            x: props.x,
            y: props.y,
            width: 200,
            height: 160,
            image: null,
            scaleY: 1,
            scaleX: 1,
        };
    }

    componentDidMount() {
        const image = new window.Image();
        image.src = this.props.url;
        image.onload = () => {
            const scale = 160 / image.naturalHeight
            // setState will redraw layer
            // because "image" property is changed
            this.setState({
                // scaleX: scaleY,
                // scaleY: scaleY, //initiale scale value
                image: image,
                width: scale * image.naturalWidth,
                height: scale * image.naturalHeight,
            });
        };
    }

    handleDragEnd = e => {
        // correctly save node position
        this.setState({
            // text3: Konva.Util.getRandomColor(),
            x: e.target.x(),
            y: e.target.y()
        });

        this.props.updateCardPos(
            this.props.id, 
            {
                x: e.target.x(),
                y: e.target.y()
            }
        )
    };

    handleTransformEnd = e => {
        // correctly save node position
        const changes = {
            size : {
                width: e.target.width(),
                height: e.target.height()
            },
            rotation: e.target.rotation(),
            scaleX: e.target.scaleX(),
            scaleY: e.target.scaleY()
        }
        this.setState({
            // text3: Konva.Util.getRandomColor(),
            ...changes
        });

        this.props.updateCardSize(
            this.props.id, 
            changes
        )
    }

    render() {
      return <Image 
              draggable
              x={this.state.x}
              y={this.state.y}
              onDragEnd={this.handleDragEnd}
              onTransformEnd={this.handleTransformEnd}
              width={this.state.width}
              height={this.state.height}
              image={this.state.image} 
              name={this.props.name}

              scaleX={this.state.scaleX}
              scaleY={this.state.scaleY}
              />
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