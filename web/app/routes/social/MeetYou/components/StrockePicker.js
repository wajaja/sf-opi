import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { TwitterPicker } from 'react-color';
import onClickOutside from "react-onclickoutside";


const colors = ['#FF6900', '#FCB900', '#7BDCB5', 
  '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', 
  '#EB144C', '#F78DA7', '#9900EF'
]
// TODO: this could be a functional component
class StrockePicker extends Component {

  constructor(props) {
    super(props)

    this.state = {
      active: false
    }
  }
  static propTypes = {
    handleColorChange: PropTypes.func.isRequired,
  };
  static defaultProps = {
    color: 'transparent',
    handleColorChange: () => {},
  };

  handleUserChangingColor = (color, event) => {
      this.props.updateCardStroke(this.props.selectedCard, color.hex);
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
    const { color, selectedCard } = this.props;
    return (
        <div className="strocke-wrp">
          <button type="button" 
              disabled={!selectedCard} 
              className="strocke-card" 
              onClick={(e) => this.onClick(e)}>
              <div className="ico"></div>
          </button>
          {this.state.active && 
            <TwitterPicker
              disableAlpha={false}
              colors={colors}
              onChange={this.handleUserChangingColor}
              color={color}/>
          }
        </div>
    );
  }
}

export default onClickOutside(StrockePicker);
