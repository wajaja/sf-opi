import React, { Component } from 'react';
import Konva from 'konva';
import { Stage, Layer, Shape, Circle, Rect, Ellipse, Star } from 'react-konva';


class ShapePicker extends Component {

    handleSelect = (val) => {
        let c = {}  
        if(val === 'rect')
            c = { cName: "Rect", width: 70, height: 70, fill: "#ffffff", stroke: "black", strokeWidth:1, shadowBlur:1 }
        else if(val === 'circle')
            c = { cName: "Circle", radius: 70, width: 70, height: 70, fill: "#ffffff", stroke: "black", strokeWidth:1, shadowBlur:1 }
        else if(val === 'ellipse')
            c = { cName: "Ellipse", radius: {x: 50, y: 65}, width: 70, fill: "#ffffff", stroke: "black", strokeWidth:1, shadowBlur:1 }
        else if(val === 'star')
            c = { cName: "Star", numPoints: 6, innerRadius: 18, outerRadius: 25, fill: "#ffffff", stroke: "black", strokeWidth:1, shadowBlur:1 }

        this.props.handleSelect && this.props.handleSelect(c);
    }

    render() {
        return (
          <Stage 
            width={320} height={300}>
            <Layer>
              <Rect
                x={30}
                y={30}
                width={50}
                height={50}
                fill="#ffffff"
                stroke="black"
                strokeWidth={1}
                shadowBlur={1}
                onClick={this.handleSelect.bind(this, 'rect')}
              />
              <Circle 
                x={160} 
                y={40} 
                radius={50} 
                width={50}
                height={50}
                stroke="black"
                strokeWidth={1}
                fill="#ffffff" 
                onClick={this.handleSelect.bind(this, 'circle')}
                />
              <Ellipse
                x={55}
                y={160}
                width={50}
                radius={{
                      x: 40,
                      y: 30
                }}
                stroke="black"
                strokeWidth={1}
                fill="#ffffff"
                onClick={this.handleSelect.bind(this, 'ellipse')}
              />
              <Star
                x={180}
                y={150}
                numPoints={6}
                innerRadius={18}
                outerRadius={25}
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