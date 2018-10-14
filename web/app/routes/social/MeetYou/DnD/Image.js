import React    			from 'react';
import createReactClass 		from 'create-react-class'
import { DragSource, DropTarget } from 'react-dnd';
import { findDOMNode } 		from 'react-dom';
import flow 				from 'lodash/flow';
 
const Image  = createReactClass({
 	getInitialState() {
 		return {
 			hover: false
 		}
 	},

	render() {
		const { image, url } = this.props
		return (
			<div className="card-outer">
			    <div className="card-inner">
			      <img src={url} width="80" height="45" draggable="false" />
			    </div>
			</div>
		)
	}
})


export default Image;