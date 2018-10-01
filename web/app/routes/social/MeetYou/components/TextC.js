import React, { PureComponent } from 'react';
import Konva from 'konva';
import { Text } from 'react-konva';

class TextC extends PureComponent {

  state = {
    text1: 'black',
    text2: 'black',
    text3: 'black',
    text3x: 10,
    text3y: 60
  };

  handleDragEnd = e => {
    // correctly save node position
    this.setState({
      text3: Konva.Util.getRandomColor(),
      text3x: e.target.x(),
      text3y: e.target.y()
    });
  };

  render() {
    return (
        <Text 
          text="Some text on canvas" 
          fontSize={15} 
          fill={this.state.text3}
          x={this.state.text3x}
          y={this.state.text3y}
          draggable
          onDragEnd={this.handleDragEnd}
          />
    );
  }
}

export default TextC