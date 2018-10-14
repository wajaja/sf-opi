import React, { Component } from 'react';
import Konva from 'konva';
import { Text } from 'react-konva';

//TODO:: Replace Component by PureComponent
class TextC extends Component {

    constructor(props) {
        super(props);

        this.state = {
            x: props.x,
            y: props.y,
            fill: props.fill,
            fontSize: props.fontSize
        }    
    }

    handleDragEnd = e => {
        // correctly save node position
        this.setState({
            // text3: Konva.Util.getRandomColor(),
            x: e.target.x(),
            y: e.target.y(),
        });
    };

    componentDidMount() {
        if(this.props.order === 0) {
            let nextY = this.props.y,
            nextX = 0 + this.textNode.getWidth();
            this.props.updateNextPos((this.props.order + 1), {x: nextX, y: nextY});
        }
    }

    componentDidUpdate(oldProps, oldState) {
        if(this.props.x !== oldProps.x || this.props.y !== oldProps.y) {
            let nextY = this.props.y,
            nextX = oldProps.x + this.textNode.getWidth();
            this.props.updateNextPos((this.props.order + 1), {x: nextX, y: nextY});
        }
    }

  render() {
    return (
        <Text 
            ref={node => {
              this.textNode = node;
            }}
            text={this.props.tObject.text} 

            fontSize={this.state.fontSize} 
            fill={this.state.fill}
            x={this.state.x}
            y={this.state.y}
            draggable
            onDragEnd={this.handleDragEnd}
            />
    );
  }
}

export default TextC