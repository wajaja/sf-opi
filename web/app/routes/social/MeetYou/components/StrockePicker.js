import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { TwitterPicker } from 'react-color';
import onClickOutside from "react-onclickoutside";
import Select         from 'react-select';

const colors = ['#FF6900', '#FCB900', '#7BDCB5', 
  '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', 
  '#EB144C', '#F78DA7', '#9900EF'
]

const customStyles = {
  control: base => ({
    ...base,
    width: 100,
    minWidth: 87,
    height: 28,
    minHeight: 30,
    fontSize: 12,
    borderRadius: 0,
    marginTop: 13,
    marginLeft: 6
  }),
  option: (styles, { data }) => {
    // Apply the same font to the option as well, which it intends to apply in the editor
    return { ...styles };
  },
};
// TODO: this could be a functional component
class StrockePicker extends Component {

  constructor(props) {
    super(props)

    this.state = {
        active: false,
        options: this.createSelectItems()
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

  createSelectItems = () => {
    let items = [];         
     for (let i = 1; i <= 8; i++) {             
          items.push(
            { value: i, label: i + 'px' }
          );   
          //here I will be creating my options dynamically based on
          //what props are currently passed to the parent component
     }
     return items;
  }

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
            <div className="option-ctnr">
                <TwitterPicker
                  colors={colors}
                  onChange={(col, evt) => this.props.updateCardStroke(selectedCard, col.hex, selectedCard.strokeWidth)}
                  color={selectedCard.stroke}/>
                <Select
                  styles={customStyles}
                  options={this.state.options}
                  placeholder={selectedCard.strokeWidth}
                  onChange={(selectedVal) => this.props.updateCardStroke(selectedCard, selectedCard.stroke, selectedVal.value)}
                  value={selectedCard.strokeWidth}
                  onFocus={this.handleFocus}
                  menuPlacement="bottom"
                  />
            </div>
          }
        </div>
    );
  }
}

export default onClickOutside(StrockePicker);
