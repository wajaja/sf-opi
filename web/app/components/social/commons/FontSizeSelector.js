import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import onClickOutside from "react-onclickoutside";

class FontSizeSelector extends PureComponent {
  static propTypes = {
    hasEditorFocus: PropTypes.bool.isRequired,
    currentFontSize: PropTypes.number.isRequired,
    addFontSize: PropTypes.func.isRequired,
    setCurrentFontSize: PropTypes.func.isRequired,
  };

  static defaultProps = {
    hasEditorFocus: false,
  };

  constructor(...args) {
    super(...args);

    ///this.strPixieFontSize = `${this.props.currentFontSize}px`;

    this.state = {
      active: false,
      options: this.createSelectItems()  // between 10 and 100

    }
  }

  createSelectItems() {
    let items = [];         
     for (let i = 10; i <= 100; i++) {             
          items.push(
            { value: i, label: i + 'px' }
          );   
          //here I will be creating my options dynamically based on
          //what props are currently passed to the parent component
     }
     return items;
  }

  /////////////
  updateFontSize = selectedValue => {
    const { setCurrentFontSize, addFontSize } = this.props;

    console.log(selectedValue);

    // const fontSize = sliderState.values[0];
    // setCurrentFontSize(fontSize);
    // this.strPixieFontSize = `${fontSize}px`;
    // addFontSize(this.strPixieFontSize);
  };

  componentWillReceiveProps(nextProps) {
    ///this.strPixieFontSize = `${nextProps.currentFontSize}px`;
  }

  handleClickOutside = evt => {
    // ..handling code goes here...
    if(this.state.active)
      this.setState({active: false})
  };

  onClick = (evt) => {
    evt.preventDefault();
    this.setState({active: !this.state.active})
  }

  render() {
    const { hasEditorFocus, currentFontSize } = this.props;
    const { active } = this.state;

    return (
      <Fragment>
          <div className={active ? `ico active` : `ico`} onClick={this.onClick}></div>
          {active && <Select
              styles={customStyles}
              options={this.state.options}
              placeholder={`Apply Font`}
              onChange={this.updateFontSize}
              value={currentFontSize}
              onFocus={this.handleFocus}
              />
          }
      </Fragment>
    );
  }
}

export default onClickOutside(FontSizeSelector);
