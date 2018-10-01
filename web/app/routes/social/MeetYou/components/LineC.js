import React, { Component } from 'react';
import Konva from 'konva';
import { Line } from 'react-konva';

class LineC extends Component {
  render() {
    return (
      <Line
        x={20}
        y={200}
        points={[0, 0, 100, 0, 100, 100]}
        tension={0.5}
        closed
        stroke="black"
        fillLinearGradientStartPoint={{ x: -50, y: -50 }}
        fillLinearGradientEndPoint={{ x: 50, y: 50 }}
        fillLinearGradientColorStops={[0, 'red', 1, 'yellow']}
      />
    );
  }
}

export default LineC