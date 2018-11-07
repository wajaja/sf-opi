import React, { Component } from 'react';
import Konva from 'konva';
import { Rect } from 'react-konva';
import PropTypes from 'prop-types';

class PatternImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            x: props.x,
            y: props.y,
            width: props.width,
            height: props.width,
            scaleY: 1,
            scaleX: 1,
            color: 'green',
            fillPatternImage: null
        };
    }

    static propsTypes = {
        zIndex: PropTypes.number.isRequired
    }

    componentDidMount() {
        const image = new window.Image();
        image.src = this.props.url;
        image.onload = () => {
            const scale = this.props.height / image.naturalHeight
            // setState will redraw layer
            // because "image" property is changed
            this.setState({
                // scaleX: scaleY,
                // scaleY: scaleY, //initiale scale value
                fillPatternImage: image,
                width: image.naturalWidth,
                height: image.naturalHeight,
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

    dragBoundFunc = (pos) => {
        let stageWidth = this.node.getStage().getWidth();
        let stageHeigth = this.node.getStage().getHeight()
        let y = pos.y < 0 ? 0 : pos.y;
        let x = pos.x < 0 ? 0 : pos.x;

        if(x + this.state.width > stageWidth)
            x = stageWidth - this.state.width;

        if(y + this.state.height > stageHeigth)
            y =  stageHeigth - this.state.height

        return {
            y: y,
            x: x
        };
    }

    render() {
        return (
            <Rect
                draggable
                x={this.state.x}
                y={this.state.y}
                onDragEnd={this.handleDragEnd}
                onTransformEnd={this.handleTransformEnd}
                width={this.state.width}
                height={this.state.height}
                image={this.state.image} 
                name={this.props.name}
                ref={el => this.node = el}

                shadowBlur={1}
                zIndex={this.props.zIndex || -5}
                fillPatternImage={this.state.fillPatternImage}

                dragBoundFunc={this.dragBoundFunc}
            />
        );
    }
}

export default PatternImage