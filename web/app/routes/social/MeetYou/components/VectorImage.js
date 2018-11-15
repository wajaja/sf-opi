import React, { Component } from 'react';
import Konva from 'konva';
import { Group, Path, Text } from 'react-konva';


class VectorImage extends Component {

    constructor(props) {
        super(props)

        const initialWidth = 260,
        grSize = props.viewBox.split(' '),
        width  = grSize[2],
        scaleX = initialWidth / width;

        this.state = {
            x: props.x,
            y: props.y,
            scaleX: scaleX,
            scaleY: scaleX,
            rotation: props.rotation,
            width: grSize[2],
            height: grSize[3]
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

        this.props.handleDragEnd()
    };

    handleDragStart = e => {
        this.props.handleDragStart(e.target.x(), e.target.y(), 'VectorImage')
    };

    handleDragMove = e => {
        this.props.handleDragMove(e.target.x(), e.target.y(), 'VectorImage')
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
        const { viewBox, name } = this.props

        return(
            <Group
                x={this.state.x}
                y={this.state.y}
                draggable
                scaleX={this.state.scaleX}
                scaleY={this.state.scaleX}
                rotation={this.state.rotation}
                width={this.state.width}
                height={this.state.height}
                stroke={this.props.stroke}
                strokeWidth={this.props.strokeWidth}
                name={name}
                // onClick={this.handleSelect}
                onDragEnd={this.handleDragEnd}
                onDragMove={this.handleDragMove} 
                onDragStart={this.handleDragStart}
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