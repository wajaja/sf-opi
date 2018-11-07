import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { PhotoshopPicker } from 'react-color';
import onClickOutside from "react-onclickoutside";

// TODO: this could be a functional component
class ColorPicker extends Component {

  constructor(props) {
    super(props)

    this.state = {
      active: false
    }
  }
  static propTypes = {
    handleColorChange: PropTypes.func.isRequired,
    setEditorBackground: PropTypes.func.isRequired,
    setCurrentColor: PropTypes.func.isRequired,
  };
  static defaultProps = {
    color: '#000000',
    handleColorChange: () => {},
  };

  handleUserChangingColor = (color, event) => {
    const { handleColorChange, setCurrentColor, } = this.props;

    handleColorChange(color);

      // setEditorBackground(color.hex);
      //setCurrentColor(color.hex);
  };

  handleClickOutside = evt => {
    // ..handling code goes here...
    console.log('handleClickOutside');
    if(this.state.active)
      this.setState({active: false})
  };

  onClick = (evt) => {
    evt.preventDefault();
    this.setState({active: !this.state.active})
  }
  
  render() {
    const { color } = this.props;
    const { active } = this.state;
    return (
        <Fragment>
          <div className={active ? `ico active` : `ico`} onClick={this.onClick}></div>
          {active && 
            <PhotoshopPicker
              disableAlpha={false}
              onChange={this.handleUserChangingColor}
              color={color}/>
          }
        </Fragment>
    );
  }
}

export default onClickOutside(ColorPicker);
