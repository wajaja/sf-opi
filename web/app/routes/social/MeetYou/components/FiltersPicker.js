import React, { Fragment } from 'react';
import createReactClass   from 'create-react-class'
import PropTypes from 'prop-types';
import InputRange from 'react-input-range';

export default createReactClass({
  propTypes: {
    filter: PropTypes.oneOf(['none', 'light_contrast', 'heavy_contrast', 'light_blur', 'heavy_blur']).isRequired,
    onFilterChange: PropTypes.func.isRequired
  },

    getInitialState() {
        const selectedCard = this.props.selectedCard;
        return{
            active: false,
            red: selectedCard.red,
            alpha: selectedCard.alpha,
            green: selectedCard.green,
            blue: selectedCard.blue,
            contrast: selectedCard.contrast
        }
    },

    updateFilter(val, color) {
        this.setState({
            [color] : val
        })
        this.props.updateCardRGBA(this.props.selectedCard, val, color);  
    },

    onClick() {
        this.setState({active: !this.state.active})
    },

  render() {
    const { active, red, alpha, blue, green, contrast } = this.state
    return (
      <Fragment>
        <div className={active ? `ico active` : `ico`} onClick={this.onClick}></div>
        {active && 
            <div className="FiltersPicker" ref="select">
                <div className="rg-ctnr">
                    <div>Red</div>
                    <InputRange
                        maxValue={255}
                        minValue={0}
                        value={red}
                        onChange={value => this.updateFilter(value, 'red')} /> 
                </div>
                <div className="rg-ctnr">
                    <div>Green</div>
                    <InputRange
                        maxValue={255}
                        minValue={0}
                        value={green}
                        onChange={value => this.updateFilter(value, 'green')} /> 
                </div>
                <div className="rg-ctnr">
                    <div>Blue</div>
                    <InputRange
                        maxValue={255}
                        minValue={0}
                        value={blue}
                        onChange={value => this.updateFilter(value, 'blue')} /> 
                </div>
                <div className="rg-ctnr">
                    <div>Alpha</div>
                    <InputRange
                        maxValue={255}
                        minValue={0}
                        value={alpha}
                        onChange={value => this.updateFilter(value, 'alpha')} /> 
                </div>
                <div className="rg-ctnr">
                    <div>Contrast</div>
                    <InputRange
                        maxValue={255}
                        minValue={0}
                        value={contrast}
                        onChange={value => this.updateFilter(value, 'contrast')} /> 
                </div>
            </div>
        }
      </Fragment>
    )
  }
});
