import React, { Component } from 'react';
import Konva from 'konva';
import { Stage, Layer, Group, Path, Text } from 'react-konva';


class Image extends Component {

    constructor(props) {
        super(props)
        this.state = {
            initialWidth: 260,
        }
    }

    handleSelect = (e) => {
        this.props.handleSelect(this.props.originalData)
    }

    render() {
        const { viewBox, x, y } = this.props,
        grSize = viewBox.split(' '),
        width  = grSize[2],
        scaleX = this.state.initialWidth / width;
        console.log(scaleX);

        return(
            <Group
                x={x}
                y={y}
                scaleX={scaleX}
                scaleY={scaleX}
                width={width}
                height={grSize[3]}
                onClick={this.handleSelect}
                > 
                {this.props.childs.map((child, i) => {
                    if(child.name === 'path') 
                        return <Path
                                key={i}
                                //opacity={0}
                                data={child.attrs.d}
                                fill={child.attrs.fill}
                                stroke={child.attrs.stroke}
                                strokeWidth={child.attrs.strokeWidth}
                                strokeScaleEnabled={false}
                                />
                    else if(child.name === 'g') {
                        child.childs && child.childs.map((ch, i) => {
                            if(ch.name === 'path') 
                                return <Path
                                        key={i}
                                        data={ch.attrs.d}
                                        fill={ch.attrs.fill}
                                        stroke={ch.attrs.stroke}
                                        strokeWidth={ch.attrs.strokeWidth}
                                        strokeScaleEnabled={false}
                                        />
                            else 
                                return <Text
                                        key={i}
                                        text=""/>
                        })
                    }
                    else{
                        return <Text
                                    key={i}
                                    text=""/>
                    }
                })}
            </Group>
        )
    }
}

///////
class PathPicker extends Component {

    render() {
        const initialWidth = 260;
        return (
          <Stage 
            width={300} height={900}>
            <Layer>
                {this.props.datas.map((data, i) => {
                    return(
                        <Image
                            key={i}
                            name=""
                            y={(i * 120) + 10}
                            viewBox={data.attrs.viewBox}
                            childs={data.childs}
                            height={initialWidth}
                            rotation={0}
                            draggable={false}
                            strokeWidth={1}
                            shadowBlur={1}
                            originalData={data}
                            handleSelect={this.props.handleSelect}
                          />
                    )                    
                })}
            </Layer>
          </Stage>
        )
    }
}

export default PathPicker