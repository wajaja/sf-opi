import React, { Component } from 'react';
import Konva from 'konva';
import { Shape, Circle, Rect, Ellipse, Star }   from 'react-konva'


//https://stackoverflow.com/questions/29875869/react-jsx-dynamic-component-name
const components = {
    star: Star,
    rect: Rect,
    circle: Circle,
    ellipse: Ellipse
};

class CustomShape extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            x: props.x,
            y: props.y,
            width: props.width,
            height: props.height,
            scaleY: 1,
            scaleX: 1,
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
            width: e.target.width(),
            height: e.target.height(),
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
    	// Correct! JSX type can be a capitalized variable.
    	const SpecificShape = components[props.cName];

      	return <SpecificShape 
	      			draggable 
	      			{...props} 
	                x={this.state.x}
	                y={this.state.y}
	      			onDragEnd={this.handleDragEnd} 
	      			onTransformEnd={this.handleTransformEnd}
		            scaleX={this.state.scaleX}
		            scaleY={this.state.scaleY}
		            width={this.state.width}
	                height={this.state.height}
	      			/>
      }
}


export default CustomShape;
