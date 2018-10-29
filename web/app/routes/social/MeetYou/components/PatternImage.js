import React, { Component } from 'react';
import Konva from 'konva';
import { Rect } from 'react-konva';
import PropTypes from 'prop-types';

class PatternImage extends Component {
    constructor(props) {
      super(props);
      const image = new window.Image();
      image.onload = () => {
        this.setState({
          fillPatternImage: image
        });
      }
      image.src =  this.props.url///'http://i.imgur.com/A6H6xHF.png';
      this.state = {
        color: 'green',
        fillPatternImage: null
      };
    }

    static propsTypes = {
        zIndex: PropTypes.number.isRequired
    }

    render() {
        return (
            <Rect
                x={10} 
                y={10} 
                width={600} 
                height={500} //TODO: get original image size
                shadowBlur={10}
                zIndex={this.props.zIndex || -5}
                fillPatternImage={this.state.fillPatternImage}
            />
        );
    }
}

export default PatternImage