import React, { Component } from 'react';
import Konva from 'konva';
import { Stage, Layer, Shape, 
    Circle, Rect, Ellipse, Star,
    RegularPolygon, Ring } from 'react-konva';


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
        else if(val === 'ring')
            c = { cName: "Ring", numPoints: 6, innerRadius: 10, outerRadius: 13, fill: "#ffffff", stroke: "black", strokeWidth:1, shadowBlur:1 }
        else if(val === 'regularpolygon')
            c = { cName: "RegularPolygon", sides: 6, radius: 21, outerRadius: 21, fill: "#ffffff", stroke: "black", strokeWidth:1, shadowBlur:1 }
        else
            return;
        
        console.log('Shape cliked');
        this.props.handleSelect(c);
    }

    render() {
        return (
          <Stage 
            width={320} height={300}>
            <Layer>
                <Rect
                    x={30}
                    y={30}
                    width={40}
                    height={40}
                    fill="#ffffff"
                    stroke="black"
                    strokeWidth={1}
                    shadowBlur={1}
                    onClick={this.handleSelect.bind(this, 'rect')}
                  />
                  <Ring
                    x={120}
                    y={50}
                    width={50}
                    height={50}
                    innerRadius={10}
                    outerRadius={23}
                    strokeWidth={4}
                    fill="#ffffff"
                    stroke="black"
                    strokeWidth={1}
                    shadowBlur={1}
                    onClick={this.handleSelect.bind(this, 'ring')}
                  />
                  <Circle
                    x={190}
                    y={50}
                    radius={50}
                    width={45}
                    height={45}
                    stroke="black"
                    strokeWidth={1}
                    fill="#ffffff"
                    onClick={this.handleSelect.bind(this, 'circle')}
                  />
                  <Ellipse
                    x={53}
                    y={120}
                    width={30}
                    radius={{
                      x: 26,
                      y: 20
                    }}
                    stroke="black"
                    strokeWidth={1}
                    fill="#ffffff"
                    onClick={this.handleSelect.bind(this, 'ellipse')}
                  />
                  <Star
                    x={123}
                    y={120}
                    numPoints={6}
                    innerRadius={13}
                    outerRadius={21}
                    fill="#ffffff"
                    stroke="black"
                    strokeWidth={1}
                    shadowBlur={1} 
                     onClick={this.handleSelect.bind(this, 'start')}/>
                  <RegularPolygon
                    x={190}
                    y={120}
                    sides={6}
                    radius={23}
                    outerRadius={21}
                    fill="#ffffff"
                    stroke="black"
                    strokeWidth={1}
                    shadowBlur={1} 
                    onClick={this.handleSelect.bind(this, 'regularpolygon')}/>
            </Layer>
          </Stage>
        );
      }
}

export default ShapePicker