import React, { Component, Fragment } from 'react';
import Konva from 'konva';
import { Image as KonvaImage } from 'react-konva';
import PropTypes from 'prop-types';
// import { centerCrop } from '../utils/pixels';


function camelCase(str) {
    return str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}


// VERY IMPORTANT NOTES
// at first we will set image state to null
// and then we will set it to native image instanse
// only when image is loaded
class RichTextCard extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            x: props.x,
            y: props.y,
            image: null,
            scaleX: props.scaleX,
            scaleY: props.scaleY,
            rotation: props.rotation
        };

        this.imgX = 2;
        this.imgY = 0;
    }

    static defaultProps = {
        x: 10,
        y: 20,
        shapes: [],
        background: 'transparent'
    };

    static propTypes = {
        // node: PropTypes.object.isRequired,
        // background: PropTypes.string.isRequired,
        // editorState: PropTypes.object.isRequired,
        // size: PropTypes.object.isRequired,
        // x: PropTypes.number.isRequired,
        // y: PropTypes.number.isRequired,
        // shapes: PropTypes.array.isRequired
    };

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
        this.props.handleDragStart(e.target.x(), e.target.y(), 'RichTextCard')
    };

    handleDragMove = e => {
        this.props.handleDragMove(e.target.x(), e.target.y(), 'RichTextCard')
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

    onDblClick = (e) => {
        document.body.style.cursor = "default";
        this.props.editRichText(this.props.id, this.props.editorState)
    }
 
    onClick = (e) => {
        var mousePos = e.target.getStage().getPointerPosition();
        const client_rect = e.target.getClientRect({
            skipTransform: false // get client rect without think off transformations (position, rotation, scale, offset, etc)
            //,
        });
        const x = mousePos.x - client_rect.x;
        const y = mousePos.y - client_rect.y;

        console.log(client_rect, x, y)
    }
    // width={this.props.size.width}
    // height={this.props.size.width}
    render() {
        return (
            <KonvaImage 
                draggable
                x={this.state.x}
                y={this.state.y}
                scaleX={this.state.scaleX}
                scaleY={this.state.scaleY}
                rotation={this.state.rotation}
                onDragEnd={this.handleDragEnd}
                onDragMove={this.handleDragMove} 
                onDragStart={this.handleDragStart}
                onTransformEnd={this.handleTransformEnd}
                fill={this.props.background || 'transparent'}
                image={this.props.image}
                imageSrc={this.props.url}  //usefull for serialization
                stroke={this.props.stroke}
                strokeWidth={this.props.strokeWidth}
                name={this.props.name}
                width={this.props.width}
                height={this.props.height}

                onClick={(e) => this.onClick(e)} // onTape
                onDblclick={(e) => this.onDblClick(e)}
                onMouseEnter={() => {
                  document.body.style.cursor = "move";
                }}
                onMouseLeave={() => {
                  document.body.style.cursor = "default";
                }}
                 />
        )
    }
}

export default RichTextCard