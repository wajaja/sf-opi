import React, { Component } from 'react';
import Konva from 'konva';
import { Group, Path, Text } from 'react-konva';


class VectorImage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            x: props.x,
            y: props.y,
            initialWidth: 260,
            width: props.width,
            height: props.height
        }
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
        const { viewBox, name } = this.props,
        grSize = viewBox.split(' '),
        width  = grSize[2],
        scaleX = this.state.initialWidth / width;

        return(
            <Group
                x={this.state.x}
                y={this.state.y}
                draggable
                scaleX={scaleX}
                scaleY={scaleX}
                width={width}
                height={grSize[3]}
                name={name}
                // onClick={this.handleSelect}
                onDragEnd={this.handleDragEnd}
                onTransformEnd={this.handleTransformEnd}
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

export default VectorImage