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
            scaleY: props.scaleY,
            scaleX: props.scaleX,
            rotation: props.rotation
        };
    }

    componentDidMount() {
        const image = new window.Image();
        image.crossOrigin = "Anonymous";
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
            }, () => {
                this.node.cache();
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

    componentDidUpdate(oldProps, oldState) {
        if(this.props !== this.props) {
            this.node.cache() //see https://konvajs.github.io/docs/react/Filters.html
        }
    }

    render() {
      return <Image 
              draggable
              x={this.state.x}
              y={this.state.y}

              red={this.props.red}
              green={this.props.green}
              blue={this.props.blue}
              alpha={this.props.alpha}
              contrast={this.props.contrast}
              ref={node => this.node = node}
              filters={[Konva.Filters.RGBA, Konva.Filters.Contrast]}

              onDragEnd={this.handleDragEnd}
              onTransformEnd={this.handleTransformEnd}
              width={this.state.width}
              height={this.state.height}
              image={this.state.image} 
              name={this.props.name}

              scaleX={this.state.scaleX}
              scaleY={this.state.scaleY}
              rotation={this.state.rotation}
              />
      }
}
////////
export default ImageC;