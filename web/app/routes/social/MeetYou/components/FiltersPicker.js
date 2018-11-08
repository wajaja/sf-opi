import React, { Fragment } from 'react';
import createReactClass   from 'create-react-class'
import PropTypes from 'prop-types';

export default createReactClass({
  propTypes: {
    filter: PropTypes.oneOf(['none', 'light_contrast', 'heavy_contrast', 'light_blur', 'heavy_blur']).isRequired,
    onFilterChange: PropTypes.func.isRequired
  },

  getInitialState() {
    return{
      active: false
    }
  },

  updateFilter(val, color) {
        const val = this.refs.select.value;
        this.props.updateCardRGBA(this.props.selectedCard, val, color);
  },

  onClick() {
    this.setState({active: !this.state.active})
  },

  render() {
    const { active } = this.state
    return (
      <Fragment>
        <div className={active ? `ico active` : `ico`} onClick={this.onClick}></div>
        {active && 
            <div className="FiltersPicker" ref="select">
                <div className="rg-ctnr">
                    <div>Red</div>
                    <input 
                        type="range" min="0" 
                        max="256" step="1" value="150" 
                        onChange={(val) => this.updateFilter(val, 'red')}> 
                </div>
                <div className="rg-ctnr">
                    <div>Green</div>
                    <input 
                        type="range" min="0" 
                        max="256" step="1" value="150" 
                        onChange={(val) => this.updateFilter(val, 'green')}> 
                </div>
                <div className="rg-ctnr">
                    <div>Blue</div>
                    <input 
                        type="range" min="0" 
                        max="256" step="1" value="150" 
                        onChange={(val) => this.updateFilter(val, 'blue')}> 
                </div>
                <div className="rg-ctnr">
                    <div>Alpha</div>
                    <input 
                        type="range" min="0" 
                        max="256" step="1" value="150" 
                        onChange={(val) => this.updateFilter(val, 'alpha')}> 
                </div>
            </div>
        }
      </Fragment>
    )
  }
});
