import React, { Component, Fragment } 	from 'react'
import onClickOutside from "react-onclickoutside";

class CropButton extends Component {

	constructor(props) {
		super(props)

		this.state = {
			active: false
		}
	}

	handleClickOutside = evt => {
	    // ..handling code goes here...
	    if(this.state.active)
	      this.setState({active: false})
	};

	onClick = evt => {
		this.setState({active: !this.state.active})
	};

	render() {
		const { selectedCard, selectedCardId } = this.props,
		{ active } = this.state;
		return(
			<Fragment>
				<div className="ico" onClick={this.onClick}></div>
				{active && <div className="crop-btn-ctnr">
	                    <div className="crop-btn-ctnr-a">
	                        <button onClick={() => this.props.rotateLeft()} 
	                            className="btn btn-default rotate-btn">
	                            <i className="fa fa-undo" aria-hidden="true"></i>
	                        </button> 
	                        <button onClick={() => this.props.saveCroppedImage()} 
	                            className="btn btn-primary crop-result">crop
	                        </button>
	                        <button  onClick={() => this.props.rotateRight()} 
	                            className="btn btn-default rotate-btn">
	                            <i className="fa fa-repeat" aria-hidden="true"></i>
	                        </button> 
	                    </div>
	                </div>
	            }
			</Fragment>
		)
	}
}

export default onClickOutside(CropButton)