import React, { Fragment } from 'react';
import createReactClass   from 'create-react-class'
import PropTypes from 'prop-types';

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

    updateFilter(e, color) {
        let val = parseInt(e.target.value)
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
                    <input 
                        type="range" min="0" 
                        max="256" step="1" value={red}
                        onChange={(e) => this.updateFilter(e, 'red')} /> 
                </div>
                <div className="rg-ctnr">
                    <div>Green</div>
                    <input 
                        type="range" min="0" 
                        max="256" step="1" value={green} 
                        onChange={(e) => this.updateFilter(e, 'green')} /> 
                </div>
                <div className="rg-ctnr">
                    <div>Blue</div>
                    <input 
                        type="range" min="0" 
                        max="256" step="1" value={blue}
                        onChange={(e) => this.updateFilter(e, 'blue')} /> 
                </div>
                <div className="rg-ctnr">
                    <div>Alpha</div>
                    <input 
                        type="range" min="0" 
                        max="256" step="1" value={alpha}
                        onChange={(e) => this.updateFilter(e, 'alpha')} /> 
                </div>
                <div className="rg-ctnr">
                    <div>Contrast</div>
                    <input 
                        type="range" min="0" 
                        max="256" step="1" value={contrast}
                        onChange={(e) => this.updateFilter(e, 'contrast')} /> 
                </div>
            </div>
        }
      </Fragment>
    )
  }
});
