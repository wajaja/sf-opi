import React, { Component } from 'react';
import Konva from 'konva';
import { Rect } from 'react-konva';

class FilterC extends React.Component {
  state = {
    color: 'green'
  };

  componentDidMount() {
    this.rect.cache();
  }
  
  // handleClick = () => {
  //   this.setState(
  //     // {
  //     //   color: Konva.Util.getRandomColor()
  //     // },
  //     () => {
  //       // IMPORTANT
  //       // recache on update
  //       this.rect.cache();
  //     }
  //   );
  // };

  render() {
    const { value, frame } = this.props;
    const canvasWidth = frame[2];
    const canvasHeight = frame[3];
    return (
      <Rect
        filters={[Konva.Filters.Noise]}
        noise={1}
        x={frame[0]}
        y={frame[1]}
        width={canvasWidth}
        height={canvasHeight}
        fillStyle = {`rgba(45, 45, 45, ${value})`}
        shadowBlur={10}
        ref={node => {
          this.rect = node;
        }}
        // onClick={this.handleClick}
      />
    );
  }
}

export default FilterC;