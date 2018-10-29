import React, { Component } from 'react';
import Konva from 'konva';
import { Stage, Layer, Shape, Circle, Rect, Ellipse, Star } from 'react-konva';


class ShapePicker extends Component {

    handleSelect = (val) => {
        this.props.handleSelect && this.props.handleSelect(val);
    }

    render() {
        return (
          <Stage 
            width={320} height={300}>
            <Layer>
              <Rect
                x={30}
                y={30}
                width={80}
                height={80}
                fill="#ffffff"
                stroke="black"
                strokeWidth={1}
                shadowBlur={1}
                onClick={this.handleSelect.bind(this, 'rect')}
              />
              <Circle 
                x={230} 
                y={80} 
                radius={50} 
                width={80}
                height={80}
                stroke="black"
                strokeWidth={1}
                fill="#ffffff" 
                onClick={this.handleSelect.bind(this, 'circle')}
                />
              <Ellipse
                x={95}
                y={230}
                width={90}
                radius={{
                      x: 50,
                      y: 40
                }}
                stroke="black"
                strokeWidth={1}
                fill="#ffffff"
                onClick={this.handleSelect.bind(this, 'ellipse')}
              />
              <Star
                x={240}
                y={220}
                numPoints={6}
                innerRadius={23}
                outerRadius={40}
                fill="#ffffff"
                stroke="black"
                strokeWidth={1}
                shadowBlur={1}
                onClick={this.handleSelect.bind(this, 'star')}
              />
            </Layer>
          </Stage>
        );
      }
}

export default ShapePicker