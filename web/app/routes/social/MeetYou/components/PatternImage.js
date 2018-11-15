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
            scaleY: props.scaleY,
            scaleX: props.scaleX,
            rotation: props.rotation,
            color: 'green',
            fillPatternImage: null
        };
    }

    static propsTypes = {
        zIndex: PropTypes.number.isRequired
    }

    componentDidMount() {
        const image = new window.Image();
        image.crossOrigin = "Anonymous"; //https://stackoverflow.com/questions/22097747/how-to-fix-getimagedata-error-the-canvas-has-been-tainted-by-cross-origin-data
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

        this.props.handleDragEnd()
    };

    handleDragStart = e => {
        this.props.handleDragStart(e.target.x(), e.target.y(), 'PatternImage')
    };

    handleDragMove = e => {
        this.props.handleDragMove(e.target.x(), e.target.y(), 'PatternImage')
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

    componentDidUpdate(oldProps, oldState) {
        if(this.props !== this.props) {
            this.node.cache() //see https://konvajs.github.io/docs/react/Filters.html
        }
    }

    render() {
        return (
            <Rect
                draggable
                x={this.state.x}
                y={this.state.y}

                red={this.props.red}
                green={this.props.green}
                blue={this.props.blue}
                alpha={this.props.alpha}
                contrast={this.props.contrast}
                stroke={this.props.stroke}
                strokeWidth={this.props.strokeWidth}
                ref={node => this.node = node}
                filters={[Konva.Filters.RGBA, Konva.Filters.Contrast]}

                scaleY={this.state.scaleY}
                scaleX={this.state.scaleX}
                rotation={this.state.rotation}
                onDragEnd={this.handleDragEnd}
                onDragMove={this.handleDragMove} 
                onDragStart={this.handleDragStart}
                onTransformEnd={this.handleTransformEnd}
                width={this.state.width}
                height={this.state.height}
                image={this.state.image} 
                imageSrc={this.props.url}  //usefull for serialization
                name={this.props.name}

                shadowBlur={1}
                zIndex={this.props.zIndex || -5}
                fillPatternImage={this.state.fillPatternImage}

                dragBoundFunc={this.dragBoundFunc}
            />
        );
    }
}

export default PatternImage