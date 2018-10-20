import React, { PureComponent, Fragment } from 'react';
import Rheostat from 'rheostat';
import PropTypes from 'prop-types';
import onClickOutside from "react-onclickoutside";


class Transparence extends PureComponent {
  static propTypes = {
    currentTransparency: PropTypes.number.isRequired,
    updateCurrentTransparancy: PropTypes.func.isRequired,
  };

  constructor(...args) {
    super(...args);

    this.state = {
      active: false
    }
  }

  updateCurrentTransparancy = sliderState => {
    const { updateCurrentTransparancy } = this.props;

    const transp = sliderState.values[0];
    updateCurrentTransparancy(transp);
  };

  onClick = (e) => {
    e.preventDefault();

    this.setState({active: !this.state.active})
  }

  handleClickOutside = evt => {
    // ..handling code goes here...
    if(this.state.active)
      this.setState({active: false})
  };

  render() {
    const { currentTransparency } = this.props;

    	return (
	      	<Fragment>
		      	<div className="ico" onClick={this.onClick}></div>
		      	{this.state.active && 
              <Fragment>
                  <Rheostat 
          					onValuesUpdated={this.updateCurrentTransparancy}
          					values={[currentTransparency]}
          					min={0}
          		    	/>
                <div className="txt">
                  {currentTransparency}
                </div>
              </Fragment>
            }
	      	</Fragment>
    	);
  	}
}

export default onClickOutside(Transparence);