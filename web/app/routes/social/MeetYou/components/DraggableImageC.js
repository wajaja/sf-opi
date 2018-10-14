import React, { Component } from 'react';
import Konva from 'konva';
import { Image } from 'react-konva';
import { centerCrop } from '../utils/pixels';

// VERY IMPORTANT NOTES
// at first we will set image state to null
// and then we will set it to native image instanse
// only when image is loaded
class DraggableImageC extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            x: props.x,
            y: props.y,
            image: null
        }    
    }

    handleDragEnd = e => {
        // correctly save node position
        this.setState({
            // text3: Konva.Util.getRandomColor(),
            x: e.target.x(),
            y: e.target.y()
        });
    };

    componentDidMount() {
        const image = new window.Image();
        image.src = this.props.tObject.src;
        // image.alt = this.props.tObject.alt;
        image.onload = () => {
            // setState will redraw layer
            // because "image" property is changed

            this.setState({
                image: image
            }, 
            () => {
                if(this.props.order === 0) {
                    let nextY = this.props.y,
                    nextX = 0 + this.imageNode.getWidth();
                    this.props.updateNextPos((this.props.order + 1), {x: nextX, y: nextY});
                }
            });
        };
    }

    componentDidUpdate(oldProps, oldState) {
        if(this.props.x !== oldProps.x || this.props.y !== oldProps.y) {
            let nextY = this.props.y,
            nextX = 0 + this.imageNode.getWidth();
            this.props.updateNextPos((this.props.order + 1), {x: nextX, y: nextY});
        }
    }

    render() {
        let { frame, main, image } = this.props

        return (
            <Image 
                ref={node => {
                  this.imageNode = node;
                }}
                x={this.state.x}
                y={this.state.y}
                width={this.props.tObject.style.width}
                height={this.props.tObject.style.height}
                draggable
                onDragEnd={this.handleDragEnd}
                image={this.state.image} />
        )
    }
}

export default DraggableImageC;