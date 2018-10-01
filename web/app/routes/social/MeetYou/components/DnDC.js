import React, { Component } from 'react';
import Konva from 'konva';
import { Text } from 'react-konva';

class DnDC extends Component {
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
      text3x: e.target.x(),
      text3y: e.target.y()
    });
  };
  render() {

    const { children } = this.props;

    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { 
          x: this.state.text3x
          y: this.state.text3y
          draggable
          onDragEnd: this.handleThirdDragEnd
      }));


    return childrenWithProps
  }
}

export default DnDC;